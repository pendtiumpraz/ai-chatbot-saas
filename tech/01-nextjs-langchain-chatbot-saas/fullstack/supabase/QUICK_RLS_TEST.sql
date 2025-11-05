-- ============================================
-- QUICK RLS TEST
-- ============================================
-- Test if RLS is working
-- ============================================

-- Check RLS status
SELECT 
  'RLS Status:' as check_type,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ ENABLED'
    ELSE '❌ DISABLED'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('chatbots', 'conversations', 'documents', 'api_keys')
ORDER BY tablename;

-- Check policies
SELECT 
  'Policies:' as check_type,
  tablename,
  policyname,
  cmd as operation
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('chatbots', 'conversations', 'documents', 'api_keys')
ORDER BY tablename;

-- Count user data
SELECT 
  'Your Data:' as check_type,
  'Chatbots' as resource,
  COUNT(*) as count
FROM chatbots
WHERE workspace_id IN (
  SELECT workspace_id FROM user_roles WHERE user_id = auth.uid()
)
AND deleted_at IS NULL

UNION ALL

SELECT 
  'Your Data:' as check_type,
  'Conversations' as resource,
  COUNT(*) as count
FROM conversations
WHERE chatbot_id IN (
  SELECT id FROM chatbots 
  WHERE workspace_id IN (
    SELECT workspace_id FROM user_roles WHERE user_id = auth.uid()
  )
)
AND deleted_at IS NULL;
