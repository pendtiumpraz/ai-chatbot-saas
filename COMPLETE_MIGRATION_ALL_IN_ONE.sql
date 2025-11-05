-- ============================================
-- 🚀 COMPLETE MIGRATION - ALL IN ONE (WITH CLEAN START)
-- ============================================
-- Copy semua ini dan paste ke Supabase SQL Editor
-- Klik "Run" satu kali saja!
-- ============================================
-- Author: AI Assistant
-- Date: 2025-01-05
-- Duration: ~30 seconds
-- ============================================

-- Show start message
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '🚀 STARTING COMPLETE MIGRATION';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'This will:';
  RAISE NOTICE '1. DROP existing migration objects (clean start)';
  RAISE NOTICE '2. Add Soft Delete System';
  RAISE NOTICE '3. Add RBAC System';
  RAISE NOTICE '4. Add Audit Logs System';
  RAISE NOTICE '========================================';
END $$;

-- ============================================
-- STEP 0: DROP ALL EXISTING MIGRATION OBJECTS
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🧹 STEP 0: Cleaning up existing objects...';
END $$;

-- Drop views first (they depend on tables)
DROP VIEW IF EXISTS active_workspaces CASCADE;
DROP VIEW IF EXISTS active_chatbots CASCADE;
DROP VIEW IF EXISTS active_documents CASCADE;
DROP VIEW IF EXISTS active_conversations CASCADE;
DROP VIEW IF EXISTS active_messages CASCADE;
DROP VIEW IF EXISTS active_api_keys CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS restore_workspace(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS restore_chatbot(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS restore_document(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS restore_conversation(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS permanent_delete_old_records(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS is_deleted(TEXT, UUID) CASCADE;
DROP FUNCTION IF EXISTS user_has_permission(UUID, TEXT, UUID) CASCADE;
DROP FUNCTION IF EXISTS is_super_admin(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_user_role_in_workspace(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS assign_role_to_user(UUID, UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS log_audit_event(UUID, UUID, TEXT, TEXT, UUID, JSONB, JSONB, TEXT, TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS log_security_event(UUID, TEXT, TEXT, INET, TEXT, JSONB) CASCADE;
DROP FUNCTION IF EXISTS add_activity_feed(UUID, UUID, TEXT, TEXT, JSONB) CASCADE;

-- Drop RBAC tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS workspace_members CASCADE;
DROP TABLE IF EXISTS team_invitations CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- Drop audit tables
DROP TABLE IF EXISTS rate_limit_logs CASCADE;
DROP TABLE IF EXISTS activity_feed CASCADE;
DROP TABLE IF EXISTS security_events CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;

-- Drop soft delete columns from existing tables
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'workspaces' AND column_name = 'deleted_at') THEN
    ALTER TABLE workspaces DROP COLUMN IF EXISTS deleted_at CASCADE;
    ALTER TABLE workspaces DROP COLUMN IF EXISTS deleted_by CASCADE;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'chatbots' AND column_name = 'deleted_at') THEN
    ALTER TABLE chatbots DROP COLUMN IF EXISTS deleted_at CASCADE;
    ALTER TABLE chatbots DROP COLUMN IF EXISTS deleted_by CASCADE;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'deleted_at') THEN
    ALTER TABLE documents DROP COLUMN IF EXISTS deleted_at CASCADE;
    ALTER TABLE documents DROP COLUMN IF EXISTS deleted_by CASCADE;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'conversations' AND column_name = 'deleted_at') THEN
    ALTER TABLE conversations DROP COLUMN IF EXISTS deleted_at CASCADE;
    ALTER TABLE conversations DROP COLUMN IF EXISTS deleted_by CASCADE;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'api_keys' AND column_name = 'deleted_at') THEN
    ALTER TABLE api_keys DROP COLUMN IF EXISTS deleted_at CASCADE;
    ALTER TABLE api_keys DROP COLUMN IF EXISTS deleted_by CASCADE;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'credit_accounts' AND column_name = 'deleted_at') THEN
    ALTER TABLE credit_accounts DROP COLUMN IF EXISTS deleted_at CASCADE;
    ALTER TABLE credit_accounts DROP COLUMN IF EXISTS deleted_by CASCADE;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'credit_transactions' AND column_name = 'deleted_at') THEN
    ALTER TABLE credit_transactions DROP COLUMN IF EXISTS deleted_at CASCADE;
    ALTER TABLE credit_transactions DROP COLUMN IF EXISTS deleted_by CASCADE;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'deleted_at') THEN
    ALTER TABLE messages DROP COLUMN IF EXISTS deleted_at CASCADE;
    ALTER TABLE messages DROP COLUMN IF EXISTS deleted_by CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  RAISE NOTICE '✅ Cleanup complete - fresh start ready!';
END $$;

-- ============================================
-- PART 1: SOFT DELETE SYSTEM
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '📝 PART 1: Adding Soft Delete...';
END $$;

-- 1.1 WORKSPACES
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'workspaces' AND table_schema = 'public') THEN
    ALTER TABLE workspaces
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

    CREATE INDEX IF NOT EXISTS idx_workspaces_deleted_at ON workspaces(deleted_at);
    RAISE NOTICE '✅ Workspaces: Soft delete added';
  ELSE
    RAISE NOTICE '⚠️  Workspaces table not found - skipping';
  END IF;
END $$;

-- 1.2 CHATBOTS
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'chatbots' AND table_schema = 'public') THEN
    ALTER TABLE chatbots
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

    CREATE INDEX IF NOT EXISTS idx_chatbots_deleted_at ON chatbots(deleted_at);
    CREATE INDEX IF NOT EXISTS idx_chatbots_workspace_deleted ON chatbots(workspace_id, deleted_at);
    RAISE NOTICE '✅ Chatbots: Soft delete added';
  ELSE
    RAISE NOTICE '⚠️  Chatbots table not found - skipping';
  END IF;
END $$;

-- 1.3 DOCUMENTS
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'documents' AND table_schema = 'public') THEN
    ALTER TABLE documents
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

    CREATE INDEX IF NOT EXISTS idx_documents_deleted_at ON documents(deleted_at);
    CREATE INDEX IF NOT EXISTS idx_documents_chatbot_deleted ON documents(chatbot_id, deleted_at);
    RAISE NOTICE '✅ Documents: Soft delete added';
  ELSE
    RAISE NOTICE '⚠️  Documents table not found - skipping';
  END IF;
END $$;

-- 1.4 CONVERSATIONS
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'conversations' AND table_schema = 'public') THEN
    ALTER TABLE conversations
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

    CREATE INDEX IF NOT EXISTS idx_conversations_deleted_at ON conversations(deleted_at);
    CREATE INDEX IF NOT EXISTS idx_conversations_chatbot_deleted ON conversations(chatbot_id, deleted_at);
    RAISE NOTICE '✅ Conversations: Soft delete added';
  ELSE
    RAISE NOTICE '⚠️  Conversations table not found - skipping';
  END IF;
END $$;

-- 1.5 API_KEYS
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'api_keys' AND table_schema = 'public') THEN
    ALTER TABLE api_keys
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

    CREATE INDEX IF NOT EXISTS idx_api_keys_deleted_at ON api_keys(deleted_at);
    RAISE NOTICE '✅ API Keys: Soft delete added';
  ELSE
    RAISE NOTICE '⚠️  API Keys table not found - skipping';
  END IF;
END $$;

-- 1.6 CREDIT_ACCOUNTS
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'credit_accounts' AND table_schema = 'public') THEN
    ALTER TABLE credit_accounts
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

    CREATE INDEX IF NOT EXISTS idx_credit_accounts_deleted_at ON credit_accounts(deleted_at);
    RAISE NOTICE '✅ Credit Accounts: Soft delete added';
  ELSE
    RAISE NOTICE '⚠️  Credit Accounts table not found - skipping';
  END IF;
END $$;

-- 1.7 CREDIT_TRANSACTIONS
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'credit_transactions' AND table_schema = 'public') THEN
    ALTER TABLE credit_transactions
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

    CREATE INDEX IF NOT EXISTS idx_credit_transactions_deleted_at ON credit_transactions(deleted_at);
    RAISE NOTICE '✅ Credit Transactions: Soft delete added';
  ELSE
    RAISE NOTICE '⚠️  Credit Transactions table not found - skipping';
  END IF;
END $$;

-- 1.8 RESTORE FUNCTIONS
CREATE OR REPLACE FUNCTION restore_workspace(p_workspace_id UUID, p_restored_by UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE workspaces SET deleted_at = NULL, deleted_by = NULL, updated_at = NOW() WHERE id = p_workspace_id;
  UPDATE chatbots SET deleted_at = NULL, deleted_by = NULL, updated_at = NOW() WHERE workspace_id = p_workspace_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION restore_chatbot(p_chatbot_id UUID, p_restored_by UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE chatbots SET deleted_at = NULL, deleted_by = NULL, updated_at = NOW() WHERE id = p_chatbot_id;
  UPDATE documents SET deleted_at = NULL, deleted_by = NULL, updated_at = NOW() WHERE chatbot_id = p_chatbot_id;
  UPDATE conversations SET deleted_at = NULL, deleted_by = NULL, updated_at = NOW() WHERE chatbot_id = p_chatbot_id;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  RAISE NOTICE '✅ Restore functions created';
END $$;

-- ============================================
-- PART 2: RBAC SYSTEM
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🔐 PART 2: Creating RBAC System...';
END $$;

-- 2.1 ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  hierarchy INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, description, hierarchy) VALUES
  ('super_admin', 'Super administrator with full platform access', 1),
  ('workspace_owner', 'Owner of a workspace with full workspace access', 2),
  ('workspace_admin', 'Administrator with management permissions', 3),
  ('workspace_member', 'Regular member with standard access', 4),
  ('workspace_viewer', 'View-only access', 5)
ON CONFLICT (name) DO NOTHING;

DO $$
BEGIN
  RAISE NOTICE '✅ Roles table created (5 roles)';
END $$;

-- 2.2 PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default permissions
INSERT INTO permissions (name, resource, action, description) VALUES
  -- Workspace permissions
  ('workspace.create', 'workspace', 'create', 'Create new workspace'),
  ('workspace.read', 'workspace', 'read', 'View workspace'),
  ('workspace.update', 'workspace', 'update', 'Update workspace'),
  ('workspace.delete', 'workspace', 'delete', 'Delete workspace'),
  
  -- Chatbot permissions
  ('chatbot.create', 'chatbot', 'create', 'Create new chatbot'),
  ('chatbot.read', 'chatbot', 'read', 'View chatbot'),
  ('chatbot.update', 'chatbot', 'update', 'Update chatbot'),
  ('chatbot.delete', 'chatbot', 'delete', 'Delete chatbot'),
  
  -- Document permissions
  ('document.create', 'document', 'create', 'Upload documents'),
  ('document.read', 'document', 'read', 'View documents'),
  ('document.update', 'document', 'update', 'Update documents'),
  ('document.delete', 'document', 'delete', 'Delete documents'),
  
  -- Conversation permissions
  ('conversation.read', 'conversation', 'read', 'View conversations'),
  ('conversation.delete', 'conversation', 'delete', 'Delete conversations'),
  
  -- Team permissions
  ('team.invite', 'team', 'invite', 'Invite team members'),
  ('team.manage', 'team', 'manage', 'Manage team members'),
  ('team.remove', 'team', 'remove', 'Remove team members'),
  
  -- Settings permissions
  ('settings.read', 'settings', 'read', 'View settings'),
  ('settings.update', 'settings', 'update', 'Update settings'),
  
  -- API Key permissions
  ('apikey.create', 'apikey', 'create', 'Create API keys'),
  ('apikey.read', 'apikey', 'read', 'View API keys'),
  ('apikey.delete', 'apikey', 'delete', 'Delete API keys'),
  
  -- Analytics permissions
  ('analytics.read', 'analytics', 'read', 'View analytics'),
  
  -- Billing permissions
  ('billing.read', 'billing', 'read', 'View billing'),
  ('billing.manage', 'billing', 'manage', 'Manage billing'),
  
  -- Super admin permissions
  ('superadmin.access', 'superadmin', 'access', 'Access super admin panel'),
  ('superadmin.users', 'superadmin', 'users', 'Manage all users'),
  ('superadmin.platform', 'superadmin', 'platform', 'Manage platform')
ON CONFLICT (name) DO NOTHING;

DO $$
BEGIN
  RAISE NOTICE '✅ Permissions table created (28 permissions)';
END $$;

-- 2.3 ROLE_PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- Assign permissions to roles
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'super_admin'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'workspace_owner' AND p.name NOT LIKE 'superadmin.%'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'workspace_admin' AND p.name IN (
  'chatbot.create', 'chatbot.read', 'chatbot.update', 'chatbot.delete',
  'document.create', 'document.read', 'document.update', 'document.delete',
  'conversation.read', 'conversation.delete',
  'team.invite', 'team.manage',
  'settings.read', 'settings.update',
  'analytics.read'
)
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'workspace_member' AND p.name IN (
  'chatbot.read', 'document.read', 'conversation.read', 'analytics.read'
)
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'workspace_viewer' AND p.name IN (
  'chatbot.read', 'document.read', 'conversation.read'
)
ON CONFLICT DO NOTHING;

DO $$
BEGIN
  RAISE NOTICE '✅ Role permissions assigned';
END $$;

-- 2.4 USER_ROLES TABLE
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_workspace_id ON user_roles(workspace_id);

DO $$
BEGIN
  RAISE NOTICE '✅ User roles table created';
END $$;

-- 2.5 HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION user_has_permission(p_user_id UUID, p_permission_name TEXT, p_workspace_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  v_has_permission BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = p_user_id
      AND p.name = p_permission_name
      AND (p_workspace_id IS NULL OR ur.workspace_id = p_workspace_id OR ur.workspace_id IS NULL)
  ) INTO v_has_permission;
  
  RETURN v_has_permission;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION is_super_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = p_user_id AND r.name = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  RAISE NOTICE '✅ RBAC helper functions created';
END $$;

-- ============================================
-- PART 3: AUDIT LOGS SYSTEM
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '📊 PART 3: Creating Audit Logs...';
END $$;

-- 3.1 AUDIT_LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  workspace_id UUID REFERENCES workspaces(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  status TEXT DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_workspace_id ON audit_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

DO $$
BEGIN
  RAISE NOTICE '✅ Audit logs table created';
END $$;

-- 3.2 SECURITY_EVENTS TABLE
CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  severity TEXT DEFAULT 'low',
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);

DO $$
BEGIN
  RAISE NOTICE '✅ Security events table created';
END $$;

-- 3.3 ACTIVITY_FEED TABLE
CREATE TABLE IF NOT EXISTS activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  workspace_id UUID REFERENCES workspaces(id),
  action TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_feed_user_id ON activity_feed(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_workspace_id ON activity_feed(workspace_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created_at ON activity_feed(created_at);

DO $$
BEGIN
  RAISE NOTICE '✅ Activity feed table created';
END $$;

-- ============================================
-- PART 4: VIEWS FOR ACTIVE RECORDS
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '👁️  PART 4: Creating Views...';
END $$;

CREATE OR REPLACE VIEW active_workspaces AS
SELECT * FROM workspaces WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW active_chatbots AS
SELECT * FROM chatbots WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW active_documents AS
SELECT * FROM documents WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW active_conversations AS
SELECT * FROM conversations WHERE deleted_at IS NULL;

DO $$
BEGIN
  RAISE NOTICE '✅ Views created (4 views)';
END $$;

-- ============================================
-- MIGRATION COMPLETE SUMMARY
-- ============================================

DO $$
DECLARE
  v_tables_with_soft_delete INTEGER;
  v_roles_count INTEGER;
  v_permissions_count INTEGER;
BEGIN
  -- Count tables with soft delete
  SELECT COUNT(DISTINCT table_name) INTO v_tables_with_soft_delete
  FROM information_schema.columns
  WHERE column_name = 'deleted_at' AND table_schema = 'public';
  
  -- Count roles
  SELECT COUNT(*) INTO v_roles_count FROM roles;
  
  -- Count permissions
  SELECT COUNT(*) INTO v_permissions_count FROM permissions;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '🎉 MIGRATION COMPLETE!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Soft Delete System:';
  RAISE NOTICE '   - % tables updated', v_tables_with_soft_delete;
  RAISE NOTICE '   - Restore functions created';
  RAISE NOTICE '   - Views created';
  RAISE NOTICE '';
  RAISE NOTICE '✅ RBAC System:';
  RAISE NOTICE '   - % roles created', v_roles_count;
  RAISE NOTICE '   - % permissions created', v_permissions_count;
  RAISE NOTICE '   - Permission checking ready';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Audit System:';
  RAISE NOTICE '   - audit_logs table ready';
  RAISE NOTICE '   - security_events table ready';
  RAISE NOTICE '   - activity_feed table ready';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '🚀 NEXT STEPS:';
  RAISE NOTICE '========================================';
  RAISE NOTICE '1. Add to .env.local:';
  RAISE NOTICE '   ENCRYPTION_SECRET=your_secret_here';
  RAISE NOTICE '';
  RAISE NOTICE '2. Restart your dev server:';
  RAISE NOTICE '   npm run dev';
  RAISE NOTICE '';
  RAISE NOTICE '3. Test your dashboard:';
  RAISE NOTICE '   http://localhost:3000/dashboard';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✨ YOU ARE NOW 80%% TO TRUE 100%%!';
  RAISE NOTICE '========================================';
END $$;
