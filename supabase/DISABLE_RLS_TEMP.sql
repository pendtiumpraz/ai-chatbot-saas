-- ============================================
-- TEMPORARY DISABLE RLS - FOR TESTING ONLY
-- ============================================
-- ⚠️ WARNING: This removes security temporarily
-- ⚠️ Only use for testing/debugging
-- ⚠️ Re-enable after testing!
-- ============================================

-- Disable RLS on workspaces table
ALTER TABLE workspaces DISABLE ROW LEVEL SECURITY;

-- Disable RLS on user_roles table  
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;

-- Verify
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN '🔒 ENABLED' ELSE '🔓 DISABLED' END as rls_status
FROM pg_tables
WHERE tablename IN ('workspaces', 'user_roles')
AND schemaname = 'public';

SELECT '
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  RLS TEMPORARILY DISABLED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next Steps:
1. Try creating workspace now
2. If it works → Problem is in RLS policy
3. If still fails → Problem is elsewhere

After Testing:
→ Run ENABLE_RLS_BACK.sql to re-enable security

⚠️  DONT USE IN PRODUCTION!
⚠️  This is only for debugging!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
' as warning;
