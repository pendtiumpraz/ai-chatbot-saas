-- ============================================
-- DISABLE ALL RLS - FOR TESTING ONLY
-- ============================================
-- ⚠️ WARNING: This removes ALL security
-- ⚠️ Use ONLY for development/testing
-- ⚠️ Re-enable after confirming app works
-- ============================================

-- Disable RLS on ALL tables
ALTER TABLE workspaces DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE chatbots DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;

-- Verify
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN '🔒 ENABLED' ELSE '🔓 DISABLED' END as rls_status
FROM pg_tables
WHERE tablename IN ('workspaces', 'user_roles', 'chatbots', 'documents', 'conversations', 'api_keys', 'audit_logs')
AND schemaname = 'public'
ORDER BY tablename;

SELECT '
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  ALL RLS DISABLED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All tables now have NO security restrictions.
This is ONLY for testing to confirm the app works.

Next Steps:
1. Refresh your app (Ctrl+F5)
2. Try creating workspace
3. Try creating chatbot
4. If works → Problem was RLS policies
5. Re-enable RLS with proper policies

⚠️  DO NOT USE IN PRODUCTION!
⚠️  All users can see all data!

To re-enable security:
→ Run ENABLE_RLS_PROPER.sql after testing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
' as warning;
