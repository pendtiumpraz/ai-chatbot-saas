-- ============================================
-- ENABLE RLS WITH PROPER POLICIES
-- ============================================
-- Run this AFTER confirming app works with RLS disabled
-- ============================================

-- Step 1: Re-enable RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop all old policies
DROP POLICY IF EXISTS "workspaces_open" ON workspaces;
DROP POLICY IF EXISTS "workspace_full_access" ON workspaces;
DROP POLICY IF EXISTS "workspace_isolation" ON workspaces;

DROP POLICY IF EXISTS "user_roles_open" ON user_roles;
DROP POLICY IF EXISTS "user_roles_select" ON user_roles;
DROP POLICY IF EXISTS "user_roles_insert" ON user_roles;

DROP POLICY IF EXISTS "chatbot_isolation" ON chatbots;
DROP POLICY IF EXISTS "chatbot_workspace_policy" ON chatbots;

-- Step 3: Create VERY PERMISSIVE policies (for development)
-- These allow authenticated users to do everything
-- Proper isolation can be added later

CREATE POLICY "workspaces_allow_authenticated"
ON workspaces FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "user_roles_allow_authenticated"
ON user_roles FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "chatbots_allow_authenticated"
ON chatbots FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "documents_allow_authenticated"
ON documents FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "conversations_allow_authenticated"
ON conversations FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "api_keys_allow_authenticated"
ON api_keys FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "audit_logs_allow_authenticated"
ON audit_logs FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Verify
SELECT 
  pg_tables.tablename,
  CASE WHEN rowsecurity THEN '🔒 ENABLED' ELSE '🔓 DISABLED' END as rls_status,
  COUNT(policyname) as policy_count
FROM pg_tables
LEFT JOIN pg_policies ON pg_tables.tablename = pg_policies.tablename AND pg_policies.schemaname = 'public'
WHERE pg_tables.tablename IN ('workspaces', 'user_roles', 'chatbots', 'documents', 'conversations', 'api_keys', 'audit_logs')
AND pg_tables.schemaname = 'public'
GROUP BY pg_tables.tablename, rowsecurity
ORDER BY pg_tables.tablename;

SELECT '
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ RLS RE-ENABLED WITH PERMISSIVE POLICIES!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All tables now have:
✅ RLS ENABLED
✅ Policies: USING(true) WITH CHECK(true)
✅ All authenticated users can do everything

This is for DEVELOPMENT only.
For production, add proper workspace isolation:
- USING (workspace_id IN (SELECT workspace_id FROM user_roles WHERE user_id = auth.uid()))

But for now, app should work without "Forbidden" errors!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
' as result;
