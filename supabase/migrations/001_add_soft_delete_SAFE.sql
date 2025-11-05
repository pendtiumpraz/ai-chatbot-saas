-- ============================================
-- MIGRATION 001: ADD SOFT DELETE TO ALL TABLES (SAFE VERSION)
-- ============================================
-- Purpose: Enable soft delete for all main tables
-- This version checks if tables exist before modifying them
-- Author: AI Assistant
-- Date: 2025-01-05
-- ============================================

-- ============================================
-- 1. WORKSPACES
-- ============================================
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'workspaces') THEN
    ALTER TABLE workspaces
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

    CREATE INDEX IF NOT EXISTS idx_workspaces_deleted_at ON workspaces(deleted_at);

    COMMENT ON COLUMN workspaces.deleted_at IS 'Timestamp when workspace was soft deleted';
    COMMENT ON COLUMN workspaces.deleted_by IS 'User who deleted the workspace';
    
    RAISE NOTICE 'Added soft delete to workspaces table';
  ELSE
    RAISE NOTICE 'Skipping workspaces - table does not exist';
  END IF;
END $$;

-- ============================================
-- 2. CHATBOTS
-- ============================================
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'chatbots') THEN
    ALTER TABLE chatbots
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

    CREATE INDEX IF NOT EXISTS idx_chatbots_deleted_at ON chatbots(deleted_at);
    CREATE INDEX IF NOT EXISTS idx_chatbots_workspace_deleted ON chatbots(workspace_id, deleted_at);

    COMMENT ON COLUMN chatbots.deleted_at IS 'Timestamp when chatbot was soft deleted';
    COMMENT ON COLUMN chatbots.deleted_by IS 'User who deleted the chatbot';
    
    RAISE NOTICE 'Added soft delete to chatbots table';
  ELSE
    RAISE NOTICE 'Skipping chatbots - table does not exist';
  END IF;
END $$;

-- ============================================
-- 3. DOCUMENTS
-- ============================================
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'documents') THEN
    ALTER TABLE documents
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

    CREATE INDEX IF NOT EXISTS idx_documents_deleted_at ON documents(deleted_at);
    CREATE INDEX IF NOT EXISTS idx_documents_chatbot_deleted ON documents(chatbot_id, deleted_at);

    COMMENT ON COLUMN documents.deleted_at IS 'Timestamp when document was soft deleted';
    COMMENT ON COLUMN documents.deleted_by IS 'User who deleted the document';
    
    RAISE NOTICE 'Added soft delete to documents table';
  ELSE
    RAISE NOTICE 'Skipping documents - table does not exist';
  END IF;
END $$;

-- ============================================
-- 4. CONVERSATIONS
-- ============================================
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'conversations') THEN
    ALTER TABLE conversations
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

    CREATE INDEX IF NOT EXISTS idx_conversations_deleted_at ON conversations(deleted_at);
    CREATE INDEX IF NOT EXISTS idx_conversations_chatbot_deleted ON conversations(chatbot_id, deleted_at);

    COMMENT ON COLUMN conversations.deleted_at IS 'Timestamp when conversation was soft deleted';
    COMMENT ON COLUMN conversations.deleted_by IS 'User who deleted the conversation';
    
    RAISE NOTICE 'Added soft delete to conversations table';
  ELSE
    RAISE NOTICE 'Skipping conversations - table does not exist';
  END IF;
END $$;

-- ============================================
-- 5. API_KEYS
-- ============================================
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'api_keys') THEN
    ALTER TABLE api_keys
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

    CREATE INDEX IF NOT EXISTS idx_api_keys_deleted_at ON api_keys(deleted_at);
    CREATE INDEX IF NOT EXISTS idx_api_keys_workspace_deleted ON api_keys(workspace_id, deleted_at);

    COMMENT ON COLUMN api_keys.deleted_at IS 'Timestamp when API key was soft deleted';
    COMMENT ON COLUMN api_keys.deleted_by IS 'User who deleted the API key';
    
    RAISE NOTICE 'Added soft delete to api_keys table';
  ELSE
    RAISE NOTICE 'Skipping api_keys - table does not exist';
  END IF;
END $$;

-- ============================================
-- 6. MESSAGES (OPTIONAL - if table exists)
-- ============================================
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'messages') THEN
    ALTER TABLE messages
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

    CREATE INDEX IF NOT EXISTS idx_messages_deleted_at ON messages(deleted_at);

    COMMENT ON COLUMN messages.deleted_at IS 'Timestamp when message was soft deleted';
    COMMENT ON COLUMN messages.deleted_by IS 'User who deleted the message (for GDPR)';
    
    RAISE NOTICE 'Added soft delete to messages table';
  ELSE
    RAISE NOTICE 'Skipping messages - table does not exist';
  END IF;
END $$;

-- ============================================
-- 7. CREDIT_ACCOUNTS (if exists)
-- ============================================
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'credit_accounts') THEN
    ALTER TABLE credit_accounts
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

    CREATE INDEX IF NOT EXISTS idx_credit_accounts_deleted_at ON credit_accounts(deleted_at);

    COMMENT ON COLUMN credit_accounts.deleted_at IS 'Timestamp when credit account was soft deleted';
    COMMENT ON COLUMN credit_accounts.deleted_by IS 'User who deleted the credit account';
    
    RAISE NOTICE 'Added soft delete to credit_accounts table';
  ELSE
    RAISE NOTICE 'Skipping credit_accounts - table does not exist';
  END IF;
END $$;

-- ============================================
-- 8. CREDIT_TRANSACTIONS (if exists)
-- ============================================
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'credit_transactions') THEN
    ALTER TABLE credit_transactions
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

    CREATE INDEX IF NOT EXISTS idx_credit_transactions_deleted_at ON credit_transactions(deleted_at);

    COMMENT ON COLUMN credit_transactions.deleted_at IS 'Timestamp when credit transaction was soft deleted';
    COMMENT ON COLUMN credit_transactions.deleted_by IS 'User who deleted the credit transaction';
    
    RAISE NOTICE 'Added soft delete to credit_transactions table';
  ELSE
    RAISE NOTICE 'Skipping credit_transactions - table does not exist';
  END IF;
END $$;

-- ============================================
-- 9. CREATE RESTORE FUNCTIONS
-- ============================================

-- Function to restore a soft-deleted workspace
CREATE OR REPLACE FUNCTION restore_workspace(p_workspace_id UUID, p_restored_by UUID)
RETURNS VOID AS $$
BEGIN
  -- Check if workspaces table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'workspaces') THEN
    UPDATE workspaces
    SET deleted_at = NULL, 
        deleted_by = NULL, 
        updated_at = NOW()
    WHERE id = p_workspace_id;
  END IF;

  -- Also restore related chatbots if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'chatbots') THEN
    UPDATE chatbots
    SET deleted_at = NULL, 
        deleted_by = NULL, 
        updated_at = NOW()
    WHERE workspace_id = p_workspace_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to restore a chatbot
CREATE OR REPLACE FUNCTION restore_chatbot(p_chatbot_id UUID, p_restored_by UUID)
RETURNS VOID AS $$
BEGIN
  -- Restore chatbot
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'chatbots') THEN
    UPDATE chatbots
    SET deleted_at = NULL, 
        deleted_by = NULL, 
        updated_at = NOW()
    WHERE id = p_chatbot_id;
  END IF;

  -- Also restore related documents if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'documents') THEN
    UPDATE documents
    SET deleted_at = NULL, 
        deleted_by = NULL, 
        updated_at = NOW()
    WHERE chatbot_id = p_chatbot_id;
  END IF;

  -- Also restore related conversations if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'conversations') THEN
    UPDATE conversations
    SET deleted_at = NULL, 
        deleted_by = NULL, 
        updated_at = NOW()
    WHERE chatbot_id = p_chatbot_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to restore a document
CREATE OR REPLACE FUNCTION restore_document(p_document_id UUID, p_restored_by UUID)
RETURNS VOID AS $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'documents') THEN
    UPDATE documents
    SET deleted_at = NULL, 
        deleted_by = NULL, 
        updated_at = NOW()
    WHERE id = p_document_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to restore a conversation
CREATE OR REPLACE FUNCTION restore_conversation(p_conversation_id UUID, p_restored_by UUID)
RETURNS VOID AS $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'conversations') THEN
    UPDATE conversations
    SET deleted_at = NULL, 
        deleted_by = NULL, 
        updated_at = NOW()
    WHERE id = p_conversation_id;
  END IF;

  -- Also restore related messages if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'messages') THEN
    UPDATE messages
    SET deleted_at = NULL, 
        deleted_by = NULL
    WHERE conversation_id = p_conversation_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 10. CREATE PERMANENT DELETE FUNCTIONS (SUPER ADMIN ONLY)
-- ============================================

-- Function to permanently delete old soft-deleted records
CREATE OR REPLACE FUNCTION permanent_delete_old_records(days_old INTEGER DEFAULT 90)
RETURNS TABLE(table_name TEXT, deleted_count BIGINT) AS $$
DECLARE
  v_count BIGINT;
BEGIN
  -- Delete workspaces older than X days
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'workspaces') THEN
    DELETE FROM workspaces
    WHERE deleted_at < NOW() - INTERVAL '1 day' * days_old
    AND deleted_at IS NOT NULL;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    
    table_name := 'workspaces';
    deleted_count := v_count;
    RETURN NEXT;
  END IF;

  -- Delete chatbots
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'chatbots') THEN
    DELETE FROM chatbots
    WHERE deleted_at < NOW() - INTERVAL '1 day' * days_old
    AND deleted_at IS NOT NULL;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    
    table_name := 'chatbots';
    deleted_count := v_count;
    RETURN NEXT;
  END IF;

  -- Delete documents
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'documents') THEN
    DELETE FROM documents
    WHERE deleted_at < NOW() - INTERVAL '1 day' * days_old
    AND deleted_at IS NOT NULL;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    
    table_name := 'documents';
    deleted_count := v_count;
    RETURN NEXT;
  END IF;

  -- Delete conversations
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'conversations') THEN
    DELETE FROM conversations
    WHERE deleted_at < NOW() - INTERVAL '1 day' * days_old
    AND deleted_at IS NOT NULL;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    
    table_name := 'conversations';
    deleted_count := v_count;
    RETURN NEXT;
  END IF;

  -- Delete messages (if table exists)
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'messages') THEN
    DELETE FROM messages
    WHERE deleted_at < NOW() - INTERVAL '1 day' * days_old
    AND deleted_at IS NOT NULL;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    
    table_name := 'messages';
    deleted_count := v_count;
    RETURN NEXT;
  END IF;

  -- Delete API keys
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'api_keys') THEN
    DELETE FROM api_keys
    WHERE deleted_at < NOW() - INTERVAL '1 day' * days_old
    AND deleted_at IS NOT NULL;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    
    table_name := 'api_keys';
    deleted_count := v_count;
    RETURN NEXT;
  END IF;

  RETURN;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 11. CREATE VIEWS FOR ACTIVE RECORDS (SAFE)
-- ============================================

-- View for active workspaces only
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'workspaces') THEN
    EXECUTE 'CREATE OR REPLACE VIEW active_workspaces AS SELECT * FROM workspaces WHERE deleted_at IS NULL';
    RAISE NOTICE 'Created view: active_workspaces';
  END IF;
END $$;

-- View for active chatbots only
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'chatbots') THEN
    EXECUTE 'CREATE OR REPLACE VIEW active_chatbots AS SELECT * FROM chatbots WHERE deleted_at IS NULL';
    RAISE NOTICE 'Created view: active_chatbots';
  END IF;
END $$;

-- View for active documents only
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'documents') THEN
    EXECUTE 'CREATE OR REPLACE VIEW active_documents AS SELECT * FROM documents WHERE deleted_at IS NULL';
    RAISE NOTICE 'Created view: active_documents';
  END IF;
END $$;

-- View for active conversations only
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'conversations') THEN
    EXECUTE 'CREATE OR REPLACE VIEW active_conversations AS SELECT * FROM conversations WHERE deleted_at IS NULL';
    RAISE NOTICE 'Created view: active_conversations';
  END IF;
END $$;

-- View for active messages only (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'messages') THEN
    EXECUTE 'CREATE OR REPLACE VIEW active_messages AS SELECT * FROM messages WHERE deleted_at IS NULL';
    RAISE NOTICE 'Created view: active_messages';
  END IF;
END $$;

-- View for active API keys only
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'api_keys') THEN
    EXECUTE 'CREATE OR REPLACE VIEW active_api_keys AS SELECT * FROM api_keys WHERE deleted_at IS NULL';
    RAISE NOTICE 'Created view: active_api_keys';
  END IF;
END $$;

-- ============================================
-- 12. CREATE HELPER FUNCTION TO CHECK DELETED STATUS
-- ============================================

CREATE OR REPLACE FUNCTION is_deleted(p_table_name TEXT, p_record_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_deleted BOOLEAN;
BEGIN
  -- Check if table exists
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = p_table_name
  ) THEN
    RAISE EXCEPTION 'Table % does not exist', p_table_name;
  END IF;
  
  -- Check if table has deleted_at column
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = p_table_name 
    AND column_name = 'deleted_at'
  ) THEN
    RETURN FALSE; -- Table doesn't have soft delete
  END IF;
  
  -- Check if record is deleted
  EXECUTE format('SELECT deleted_at IS NOT NULL FROM %I WHERE id = $1', p_table_name)
  INTO v_is_deleted
  USING p_record_id;
  
  RETURN COALESCE(v_is_deleted, FALSE);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Show summary of what was done
DO $$
DECLARE
  v_table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_table_count
  FROM information_schema.columns
  WHERE column_name = 'deleted_at'
    AND table_schema = 'public';
    
  RAISE NOTICE '========================================';
  RAISE NOTICE 'MIGRATION COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Soft delete added to % tables', v_table_count;
  RAISE NOTICE 'Run VERIFY_SOFT_DELETE.sql to confirm';
  RAISE NOTICE '========================================';
END $$;
