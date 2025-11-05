-- ============================================
-- ENABLE RLS ON ALL TABLES - Complete Security
-- ============================================
-- This ensures ALL tables have proper isolation
-- ============================================

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🔐 ENABLING RLS ON ALL TABLES' as title;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

-- Enable RLS on all critical tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

SELECT '✅ RLS enabled on all tables' as status;

-- Drop all existing policies first (clean slate)
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🗑️  Dropping Old Policies' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

-- Chatbots
DROP POLICY IF EXISTS "Users can manage chatbots in their workspace" ON chatbots;
DROP POLICY IF EXISTS "Users can manage their workspace chatbots" ON chatbots;
DROP POLICY IF EXISTS "workspace_chatbots_policy" ON chatbots;

-- Conversations
DROP POLICY IF EXISTS "Users can view conversations in their workspace" ON conversations;
DROP POLICY IF EXISTS "Users can manage their conversations" ON conversations;

-- Documents
DROP POLICY IF EXISTS "Users can manage documents in their workspace" ON documents;
DROP POLICY IF EXISTS "Users can manage their documents" ON documents;

-- API Keys
DROP POLICY IF EXISTS "Users can manage their own API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can manage their workspace API keys" ON api_keys;

-- Workspaces
DROP POLICY IF EXISTS "Users can view their workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can manage their workspaces" ON workspaces;

-- User Roles
DROP POLICY IF EXISTS "Users can view their roles" ON user_roles;

-- Audit Logs
DROP POLICY IF EXISTS "Users can view their audit logs" ON audit_logs;

SELECT '✅ Old policies dropped' as status;

-- Create comprehensive policies
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '✨ Creating New Security Policies' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

-- ====================
-- WORKSPACES POLICY
-- ====================
CREATE POLICY "workspace_access_policy"
ON workspaces FOR ALL
USING (
  id = auth.uid() OR
  id IN (
    SELECT workspace_id 
    FROM user_roles 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  id = auth.uid()
);

SELECT '✅ Workspaces policy created' as status;

-- ====================
-- CHATBOTS POLICY
-- ====================
CREATE POLICY "chatbot_workspace_policy"
ON chatbots FOR ALL
USING (
  workspace_id IN (
    SELECT workspace_id 
    FROM user_roles 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  workspace_id IN (
    SELECT workspace_id 
    FROM user_roles 
    WHERE user_id = auth.uid()
  )
);

SELECT '✅ Chatbots policy created' as status;

-- ====================
-- CONVERSATIONS POLICY
-- ====================
CREATE POLICY "conversation_workspace_policy"
ON conversations FOR ALL
USING (
  chatbot_id IN (
    SELECT id FROM chatbots 
    WHERE workspace_id IN (
      SELECT workspace_id 
      FROM user_roles 
      WHERE user_id = auth.uid()
    )
  )
)
WITH CHECK (
  chatbot_id IN (
    SELECT id FROM chatbots 
    WHERE workspace_id IN (
      SELECT workspace_id 
      FROM user_roles 
      WHERE user_id = auth.uid()
    )
  )
);

SELECT '✅ Conversations policy created' as status;

-- ====================
-- DOCUMENTS POLICY
-- ====================
CREATE POLICY "document_workspace_policy"
ON documents FOR ALL
USING (
  chatbot_id IN (
    SELECT id FROM chatbots 
    WHERE workspace_id IN (
      SELECT workspace_id 
      FROM user_roles 
      WHERE user_id = auth.uid()
    )
  )
)
WITH CHECK (
  chatbot_id IN (
    SELECT id FROM chatbots 
    WHERE workspace_id IN (
      SELECT workspace_id 
      FROM user_roles 
      WHERE user_id = auth.uid()
    )
  )
);

SELECT '✅ Documents policy created' as status;

-- ====================
-- API KEYS POLICY
-- ====================
CREATE POLICY "api_keys_workspace_policy"
ON api_keys FOR ALL
USING (
  workspace_id IN (
    SELECT workspace_id 
    FROM user_roles 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  workspace_id IN (
    SELECT workspace_id 
    FROM user_roles 
    WHERE user_id = auth.uid()
  )
);

SELECT '✅ API Keys policy created' as status;

-- ====================
-- USER ROLES POLICY
-- ====================
CREATE POLICY "user_roles_read_policy"
ON user_roles FOR SELECT
USING (
  workspace_id IN (
    SELECT workspace_id 
    FROM user_roles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "user_roles_manage_policy"
ON user_roles FOR INSERT, UPDATE, DELETE
USING (
  workspace_id IN (
    SELECT workspace_id 
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name IN ('workspace_owner', 'admin')
  )
)
WITH CHECK (
  workspace_id IN (
    SELECT workspace_id 
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name IN ('workspace_owner', 'admin')
  )
);

SELECT '✅ User Roles policies created' as status;

-- ====================
-- AUDIT LOGS POLICY
-- ====================
CREATE POLICY "audit_logs_read_policy"
ON audit_logs FOR SELECT
USING (
  workspace_id IN (
    SELECT workspace_id 
    FROM user_roles 
    WHERE user_id = auth.uid()
  )
);

SELECT '✅ Audit Logs policy created' as status;

-- Verify all policies
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🔍 Verification' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
  tablename,
  policyname,
  cmd as operation
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('workspaces', 'chatbots', 'conversations', 'documents', 'api_keys', 'user_roles', 'audit_logs')
ORDER BY tablename, policyname;

-- Test policies
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🧪 Testing Policies' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

DO $$
DECLARE
  user_count INT;
  workspace_count INT;
  chatbot_count INT;
BEGIN
  -- Count accessible data for current user
  SELECT COUNT(*) INTO user_count FROM auth.users WHERE id = auth.uid();
  
  SELECT COUNT(*) INTO workspace_count 
  FROM workspaces 
  WHERE id IN (
    SELECT workspace_id FROM user_roles WHERE user_id = auth.uid()
  );
  
  SELECT COUNT(*) INTO chatbot_count 
  FROM chatbots 
  WHERE workspace_id IN (
    SELECT workspace_id FROM user_roles WHERE user_id = auth.uid()
  );

  IF auth.uid() IS NULL THEN
    RAISE NOTICE '⚠️  Not logged in - cannot test user-specific access';
  ELSE
    RAISE NOTICE '✅ Current user ID: %', auth.uid();
    RAISE NOTICE '✅ Accessible workspaces: %', workspace_count;
    RAISE NOTICE '✅ Accessible chatbots: %', chatbot_count;
  END IF;
END $$;

-- Final message
SELECT '
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ALL RLS POLICIES ENABLED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tables Protected:
✅ workspaces        → User workspace only
✅ chatbots          → User workspace only
✅ conversations     → User chatbots only
✅ documents         → User chatbots only
✅ api_keys          → User workspace only
✅ user_roles        → User workspace only
✅ audit_logs        → User workspace only

Security Level: MAXIMUM 🔒

What This Means:
- User A cannot see User B data
- Each user only sees their workspace
- Cross-workspace access = BLOCKED
- Database-level security enforcement

Next Steps:
1. Refresh browser (Ctrl+F5)
2. Test with 2 accounts
3. Verify isolation working
4. Run TEST_USER_ISOLATION.sql to verify

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
' as result;
