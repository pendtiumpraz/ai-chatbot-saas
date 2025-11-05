-- ============================================
-- RE-ENABLE RLS - After Testing
-- ============================================

-- Re-enable RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Drop all old policies
DROP POLICY IF EXISTS "workspace_isolation" ON workspaces;
DROP POLICY IF EXISTS "workspace_full_access" ON workspaces;

-- Create simple policy without restrictions
CREATE POLICY "workspaces_allow_all"
ON workspaces FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Simple user_roles policy
DROP POLICY IF EXISTS "user_roles_select" ON user_roles;
DROP POLICY IF EXISTS "user_roles_insert" ON user_roles;
DROP POLICY IF EXISTS "user_roles_update" ON user_roles;
DROP POLICY IF EXISTS "user_roles_delete" ON user_roles;

CREATE POLICY "user_roles_allow_all"
ON user_roles FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Verify
SELECT 
  pg_tables.tablename,
  policyname,
  CASE WHEN rowsecurity THEN '🔒 ENABLED' ELSE '🔓 DISABLED' END as rls_status
FROM pg_tables
LEFT JOIN pg_policies ON pg_tables.tablename = pg_policies.tablename
WHERE pg_tables.tablename IN ('workspaces', 'user_roles')
AND pg_tables.schemaname = 'public';

SELECT '
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ RLS RE-ENABLED WITH SIMPLE POLICIES!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Policies Created:
✅ workspaces_allow_all
   - USING (true) → All users can read
   - WITH CHECK (true) → All users can write

✅ user_roles_allow_all  
   - USING (true) → All users can read
   - WITH CHECK (true) → All users can write

⚠️  NOTE: This is VERY permissive
⚠️  For development/testing only
⚠️  Add proper isolation later

Now try creating workspace again!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
' as result;
