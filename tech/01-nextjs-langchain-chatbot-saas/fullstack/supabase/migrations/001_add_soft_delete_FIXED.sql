-- ============================================
-- MIGRATION 001: ADD SOFT DELETE TO ALL TABLES
-- ============================================
-- Purpose: Enable soft delete for all main tables
-- Author: AI Assistant
-- Date: 2025-01-05
-- ============================================

-- ============================================
-- 1. WORKSPACES
-- ============================================
ALTER TABLE workspaces
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_workspaces_deleted_at ON workspaces(deleted_at);

COMMENT ON COLUMN workspaces.deleted_at IS 'Timestamp when workspace was soft deleted';
COMMENT ON COLUMN workspaces.deleted_by IS 'User who deleted the workspace';

-- ============================================
-- 2. CHATBOTS
-- ============================================
ALTER TABLE chatbots
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_chatbots_deleted_at ON chatbots(deleted_at);
CREATE INDEX IF NOT EXISTS idx_chatbots_workspace_deleted ON chatbots(workspace_id, deleted_at);

COMMENT ON COLUMN chatbots.deleted_at IS 'Timestamp when chatbot was soft deleted';
COMMENT ON COLUMN chatbots.deleted_by IS 'User who deleted the chatbot';

-- ============================================
-- 3. DOCUMENTS
-- ============================================
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_documents_deleted_at ON documents(deleted_at);
CREATE INDEX IF NOT EXISTS idx_documents_chatbot_deleted ON documents(chatbot_id, deleted_at);

COMMENT ON COLUMN documents.deleted_at IS 'Timestamp when document was soft deleted';
COMMENT ON COLUMN documents.deleted_by IS 'User who deleted the document';

-- ============================================
-- 4. CONVERSATIONS
-- ============================================
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_conversations_deleted_at ON conversations(deleted_at);
CREATE INDEX IF NOT EXISTS idx_conversations_chatbot_deleted ON conversations(chatbot_id, deleted_at);

COMMENT ON COLUMN conversations.deleted_at IS 'Timestamp when conversation was soft deleted';
COMMENT ON COLUMN conversations.deleted_by IS 'User who deleted the conversation';

-- ============================================
-- 5. API_KEYS
-- ============================================
ALTER TABLE api_keys
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_api_keys_deleted_at ON api_keys(deleted_at);
CREATE INDEX IF NOT EXISTS idx_api_keys_workspace_deleted ON api_keys(workspace_id, deleted_at);

COMMENT ON COLUMN api_keys.deleted_at IS 'Timestamp when API key was soft deleted';
COMMENT ON COLUMN api_keys.deleted_by IS 'User who deleted the API key';

-- ============================================
-- 6. MESSAGES (Optional - usually keep all)
-- ============================================
-- Messages are typically kept for conversation history
-- But we add soft delete for compliance (GDPR)
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_messages_deleted_at ON messages(deleted_at);

COMMENT ON COLUMN messages.deleted_at IS 'Timestamp when message was soft deleted';
COMMENT ON COLUMN messages.deleted_by IS 'User who deleted the message (for GDPR)';

-- ============================================
-- 7. CREATE RESTORE FUNCTIONS
-- ============================================

-- Function to restore a soft-deleted workspace
CREATE OR REPLACE FUNCTION restore_workspace(p_workspace_id UUID, p_restored_by UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE workspaces
  SET deleted_at = NULL, 
      deleted_by = NULL, 
      updated_at = NOW()
  WHERE id = p_workspace_id;

  -- Also restore related chatbots
  UPDATE chatbots
  SET deleted_at = NULL, 
      deleted_by = NULL, 
      updated_at = NOW()
  WHERE workspace_id = p_workspace_id;
END;
$$ LANGUAGE plpgsql;

-- Function to restore a chatbot
CREATE OR REPLACE FUNCTION restore_chatbot(p_chatbot_id UUID, p_restored_by UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE chatbots
  SET deleted_at = NULL, 
      deleted_by = NULL, 
      updated_at = NOW()
  WHERE id = p_chatbot_id;

  -- Also restore related documents and conversations
  UPDATE documents
  SET deleted_at = NULL, 
      deleted_by = NULL, 
      updated_at = NOW()
  WHERE chatbot_id = p_chatbot_id;

  UPDATE conversations
  SET deleted_at = NULL, 
      deleted_by = NULL, 
      updated_at = NOW()
  WHERE chatbot_id = p_chatbot_id;
END;
$$ LANGUAGE plpgsql;

-- Function to restore a document
CREATE OR REPLACE FUNCTION restore_document(p_document_id UUID, p_restored_by UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE documents
  SET deleted_at = NULL, 
      deleted_by = NULL, 
      updated_at = NOW()
  WHERE id = p_document_id;
END;
$$ LANGUAGE plpgsql;

-- Function to restore a conversation
CREATE OR REPLACE FUNCTION restore_conversation(p_conversation_id UUID, p_restored_by UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE conversations
  SET deleted_at = NULL, 
      deleted_by = NULL, 
      updated_at = NOW()
  WHERE id = p_conversation_id;

  -- Also restore related messages
  UPDATE messages
  SET deleted_at = NULL, 
      deleted_by = NULL
  WHERE conversation_id = p_conversation_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. CREATE PERMANENT DELETE FUNCTIONS (SUPER ADMIN ONLY)
-- ============================================

-- Function to permanently delete old soft-deleted records
CREATE OR REPLACE FUNCTION permanent_delete_old_records(days_old INTEGER DEFAULT 90)
RETURNS TABLE(table_name TEXT, deleted_count BIGINT) AS $$
DECLARE
  v_workspace_count BIGINT;
  v_chatbot_count BIGINT;
  v_document_count BIGINT;
  v_conversation_count BIGINT;
  v_message_count BIGINT;
  v_api_key_count BIGINT;
BEGIN
  -- Delete workspaces older than X days
  DELETE FROM workspaces
  WHERE deleted_at < NOW() - INTERVAL '1 day' * days_old
  AND deleted_at IS NOT NULL;
  GET DIAGNOSTICS v_workspace_count = ROW_COUNT;
  
  table_name := 'workspaces';
  deleted_count := v_workspace_count;
  RETURN NEXT;

  -- Delete chatbots
  DELETE FROM chatbots
  WHERE deleted_at < NOW() - INTERVAL '1 day' * days_old
  AND deleted_at IS NOT NULL;
  GET DIAGNOSTICS v_chatbot_count = ROW_COUNT;
  
  table_name := 'chatbots';
  deleted_count := v_chatbot_count;
  RETURN NEXT;

  -- Delete documents
  DELETE FROM documents
  WHERE deleted_at < NOW() - INTERVAL '1 day' * days_old
  AND deleted_at IS NOT NULL;
  GET DIAGNOSTICS v_document_count = ROW_COUNT;
  
  table_name := 'documents';
  deleted_count := v_document_count;
  RETURN NEXT;

  -- Delete conversations
  DELETE FROM conversations
  WHERE deleted_at < NOW() - INTERVAL '1 day' * days_old
  AND deleted_at IS NOT NULL;
  GET DIAGNOSTICS v_conversation_count = ROW_COUNT;
  
  table_name := 'conversations';
  deleted_count := v_conversation_count;
  RETURN NEXT;

  -- Delete messages
  DELETE FROM messages
  WHERE deleted_at < NOW() - INTERVAL '1 day' * days_old
  AND deleted_at IS NOT NULL;
  GET DIAGNOSTICS v_message_count = ROW_COUNT;
  
  table_name := 'messages';
  deleted_count := v_message_count;
  RETURN NEXT;

  -- Delete API keys
  DELETE FROM api_keys
  WHERE deleted_at < NOW() - INTERVAL '1 day' * days_old
  AND deleted_at IS NOT NULL;
  GET DIAGNOSTICS v_api_key_count = ROW_COUNT;
  
  table_name := 'api_keys';
  deleted_count := v_api_key_count;
  RETURN NEXT;

  RETURN;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 9. CREATE VIEWS FOR ACTIVE RECORDS
-- ============================================

-- View for active workspaces only
CREATE OR REPLACE VIEW active_workspaces AS
SELECT * FROM workspaces WHERE deleted_at IS NULL;

-- View for active chatbots only
CREATE OR REPLACE VIEW active_chatbots AS
SELECT * FROM chatbots WHERE deleted_at IS NULL;

-- View for active documents only
CREATE OR REPLACE VIEW active_documents AS
SELECT * FROM documents WHERE deleted_at IS NULL;

-- View for active conversations only
CREATE OR REPLACE VIEW active_conversations AS
SELECT * FROM conversations WHERE deleted_at IS NULL;

-- View for active messages only
CREATE OR REPLACE VIEW active_messages AS
SELECT * FROM messages WHERE deleted_at IS NULL;

-- View for active API keys only
CREATE OR REPLACE VIEW active_api_keys AS
SELECT * FROM api_keys WHERE deleted_at IS NULL;

-- ============================================
-- 10. CREATE HELPER FUNCTION TO CHECK DELETED STATUS
-- ============================================

CREATE OR REPLACE FUNCTION is_deleted(table_name TEXT, record_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_deleted BOOLEAN;
BEGIN
  EXECUTE format('SELECT deleted_at IS NOT NULL FROM %I WHERE id = $1', table_name)
  INTO is_deleted
  USING record_id;
  
  RETURN COALESCE(is_deleted, FALSE);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- To verify the migration:
-- SELECT
--   table_name,
--   column_name,
--   data_type
-- FROM information_schema.columns
-- WHERE column_name IN ('deleted_at', 'deleted_by')
-- ORDER BY table_name, column_name;

-- To test restore function:
-- SELECT restore_chatbot('your-chatbot-id-here', 'your-user-id-here');

-- To test permanent delete (after 90 days):
-- SELECT * FROM permanent_delete_old_records(90);
