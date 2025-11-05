-- ============================================
-- MIGRATION 001: ADD SOFT DELETE TO ALL TABLES
-- ============================================
-- Purpose: Enable soft delete for all main tables
-- Author: AI Assistant
-- Date: 2025-01-05

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
CREATE OR REPLACE FUNCTION restore_workspace(workspace_id UUID, restored_by UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE workspaces
  SET deleted_at = NULL, deleted_by = NULL, updated_at = NOW()
  WHERE id = workspace_id;
  
  -- Also restore related chatbots
  UPDATE chatbots
  SET deleted_at = NULL, deleted_by = NULL, updated_at = NOW()
  WHERE workspace_id = workspace_id;
END;
$$ LANGUAGE plpgsql;

-- Function to restore a chatbot
CREATE OR REPLACE FUNCTION restore_chatbot(chatbot_id UUID, restored_by UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE chatbots
  SET deleted_at = NULL, deleted_by = NULL, updated_at = NOW()
  WHERE id = chatbot_id;
  
  -- Also restore related documents and conversations
  UPDATE documents
  SET deleted_at = NULL, deleted_by = NULL, updated_at = NOW()
  WHERE chatbot_id = chatbot_id;
  
  UPDATE conversations
  SET deleted_at = NULL, deleted_by = NULL, updated_at = NOW()
  WHERE chatbot_id = chatbot_id;
END;
$$ LANGUAGE plpgsql;

-- Function to restore a document
CREATE OR REPLACE FUNCTION restore_document(document_id UUID, restored_by UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE documents
  SET deleted_at = NULL, deleted_by = NULL, updated_at = NOW()
  WHERE id = document_id;
END;
$$ LANGUAGE plpgsql;

-- Function to restore a conversation
CREATE OR REPLACE FUNCTION restore_conversation(conversation_id UUID, restored_by UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE conversations
  SET deleted_at = NULL, deleted_by = NULL, updated_at = NOW()
  WHERE id = conversation_id;
  
  -- Also restore related messages
  UPDATE messages
  SET deleted_at = NULL, deleted_by = NULL
  WHERE conversation_id = conversation_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. CREATE PERMANENT DELETE FUNCTIONS (SUPER ADMIN ONLY)
-- ============================================

-- Function to permanently delete old soft-deleted records
CREATE OR REPLACE FUNCTION permanent_delete_old_records(days_old INTEGER DEFAULT 90)
RETURNS TABLE(table_name TEXT, deleted_count BIGINT) AS $$
BEGIN
  -- Delete workspaces older than X days
  DELETE FROM workspaces
  WHERE deleted_at < NOW() - INTERVAL '1 day' * days_old
  RETURNING 'workspaces', COUNT(*);
  
  -- Delete chatbots
  DELETE FROM chatbots
  WHERE deleted_at < NOW() - INTERVAL '1 day' * days_old
  RETURNING 'chatbots', COUNT(*);
  
  -- Delete documents
  DELETE FROM documents
  WHERE deleted_at < NOW() - INTERVAL '1 day' * days_old
  RETURNING 'documents', COUNT(*);
  
  -- Delete conversations
  DELETE FROM conversations
  WHERE deleted_at < NOW() - INTERVAL '1 day' * days_old
  RETURNING 'conversations', COUNT(*);
  
  -- Delete messages
  DELETE FROM messages
  WHERE deleted_at < NOW() - INTERVAL '1 day' * days_old
  RETURNING 'messages', COUNT(*);
  
  -- Delete API keys
  DELETE FROM api_keys
  WHERE deleted_at < NOW() - INTERVAL '1 day' * days_old
  RETURNING 'api_keys', COUNT(*);
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
-- 10. UPDATE RLS POLICIES (if using RLS)
-- ============================================

-- NOTE: If you're using Row Level Security (RLS),
-- you need to update policies to exclude deleted records.
-- Example:

-- DROP POLICY IF EXISTS "Users can view their chatbots" ON chatbots;
-- CREATE POLICY "Users can view their active chatbots" ON chatbots
--   FOR SELECT
--   USING (
--     workspace_id IN (
--       SELECT id FROM workspaces WHERE user_id = auth.uid()
--     )
--     AND deleted_at IS NULL
--   );

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- To verify:
-- SELECT 
--   table_name,
--   column_name,
--   data_type
-- FROM information_schema.columns
-- WHERE column_name IN ('deleted_at', 'deleted_by')
-- ORDER BY table_name, column_name;
