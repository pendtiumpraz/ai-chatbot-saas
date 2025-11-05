-- ============================================
-- DEBUG RLS - Check What's Wrong
-- ============================================

-- 1. Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'workspaces';

-- 2. Check current policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual as using_clause,
  with_check as with_check_clause
FROM pg_policies
WHERE tablename = 'workspaces';

-- 3. Check your user roles
SELECT 
  ur.id,
  ur.user_id,
  ur.workspace_id,
  r.name as role_name,
  r.permissions
FROM user_roles ur
JOIN roles r ON r.id = ur.role_id
WHERE ur.user_id = auth.uid();

-- 4. Try to disable RLS temporarily (DANGEROUS - only for testing)
-- Uncomment this ONLY for testing:
-- ALTER TABLE workspaces DISABLE ROW LEVEL SECURITY;

SELECT '
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DEBUG INFO ABOVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Check:
1. RLS enabled? (should be true)
2. Policy exists? (workspace_full_access)
3. WITH CHECK clause? (should be true or NULL)
4. User roles? (should show your roles)

If RLS is the problem:
→ Temporarily disable with ALTER TABLE command above
→ Test create workspace
→ If works, problem is in policy
→ Re-enable and fix policy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
' as info;
