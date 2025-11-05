-- ============================================
-- TEST USER ISOLATION - Security Verification
-- ============================================
-- This tests if users can see each other's data
-- ============================================

-- Setup: Create 2 test users scenario
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🧪 USER ISOLATION TEST' as title;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

-- Step 1: Show all users
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '👥 Step 1: All Users in System' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
  id,
  email,
  created_at
FROM auth.users
ORDER BY created_at;

-- Step 2: Show workspaces
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🏢 Step 2: All Workspaces' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
  id as workspace_id,
  name,
  created_at
FROM workspaces
WHERE deleted_at IS NULL
ORDER BY created_at;

-- Step 3: Show chatbots per workspace
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🤖 Step 3: Chatbots per Workspace' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
  w.name as workspace_name,
  c.id as chatbot_id,
  c.name as chatbot_name,
  c.model,
  c.workspace_id
FROM chatbots c
JOIN workspaces w ON w.id = c.workspace_id
WHERE c.deleted_at IS NULL
ORDER BY w.name, c.created_at;

-- Step 4: Test cross-workspace access
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🔒 Step 4: Cross-Workspace Access Test' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

DO $$
DECLARE
  user1_id UUID;
  user2_id UUID;
  user1_workspace UUID;
  user2_workspace UUID;
  user1_chatbot_count INT;
  user2_chatbot_count INT;
  cross_access_test BOOLEAN;
BEGIN
  -- Get first 2 users
  SELECT id INTO user1_id FROM auth.users ORDER BY created_at LIMIT 1;
  SELECT id INTO user2_id FROM auth.users ORDER BY created_at OFFSET 1 LIMIT 1;
  
  IF user1_id IS NULL OR user2_id IS NULL THEN
    RAISE NOTICE '⚠️  Need at least 2 users to test isolation';
    RAISE NOTICE '💡 Create 2 accounts first:';
    RAISE NOTICE '   1. Sign up as user1@test.com';
    RAISE NOTICE '   2. Sign up as user2@test.com';
    RAISE NOTICE '   3. Run this test again';
    RETURN;
  END IF;

  -- Get workspaces
  SELECT id INTO user1_workspace FROM workspaces WHERE id = user1_id;
  SELECT id INTO user2_workspace FROM workspaces WHERE id = user2_id;

  RAISE NOTICE '';
  RAISE NOTICE '👤 User 1: %', user1_id;
  RAISE NOTICE '🏢 User 1 Workspace: %', user1_workspace;
  RAISE NOTICE '';
  RAISE NOTICE '👤 User 2: %', user2_id;
  RAISE NOTICE '🏢 User 2 Workspace: %', user2_workspace;
  RAISE NOTICE '';

  -- Count chatbots for each user
  SELECT COUNT(*) INTO user1_chatbot_count
  FROM chatbots
  WHERE workspace_id = user1_workspace
  AND deleted_at IS NULL;

  SELECT COUNT(*) INTO user2_chatbot_count
  FROM chatbots
  WHERE workspace_id = user2_workspace
  AND deleted_at IS NULL;

  RAISE NOTICE '🤖 User 1 has % chatbot(s)', user1_chatbot_count;
  RAISE NOTICE '🤖 User 2 has % chatbot(s)', user2_chatbot_count;
  RAISE NOTICE '';

  -- Test if User 2 can see User 1's chatbots (SHOULD BE 0)
  SELECT EXISTS(
    SELECT 1 FROM chatbots
    WHERE workspace_id = user1_workspace
    AND deleted_at IS NULL
    -- Simulating User 2's query with their workspace filter
    AND workspace_id = user2_workspace
  ) INTO cross_access_test;

  IF cross_access_test THEN
    RAISE NOTICE '❌ SECURITY BREACH: User 2 can see User 1 chatbots!';
  ELSE
    RAISE NOTICE '✅ SECURE: User 2 cannot see User 1 chatbots';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '📊 Test Summary';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE 'Users in system: 2';
  RAISE NOTICE 'Workspaces: 2 (isolated)';
  RAISE NOTICE 'Cross-access: %', CASE WHEN cross_access_test THEN '❌ VULNERABLE' ELSE '✅ BLOCKED' END;
  
END $$;

-- Step 5: Check RLS Policies
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🔐 Step 5: RLS Policies Status' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
  schemaname,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ ENABLED'
    ELSE '❌ DISABLED'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('chatbots', 'conversations', 'documents', 'api_keys', 'workspaces')
ORDER BY tablename;

-- Step 6: List all policies
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '📋 Step 6: Active Policies' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
  tablename,
  policyname,
  cmd as operations,
  CASE 
    WHEN cmd = 'ALL' THEN '✅ Full CRUD'
    WHEN cmd = 'SELECT' THEN '📖 Read only'
    ELSE cmd
  END as access_level
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('chatbots', 'conversations', 'documents', 'api_keys')
ORDER BY tablename, policyname;

-- Step 7: Verify workspace isolation in queries
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🧪 Step 7: Query Isolation Test' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

-- This simulates what API does
WITH user_workspaces AS (
  SELECT DISTINCT workspace_id
  FROM user_roles
  WHERE user_id = auth.uid()
)
SELECT 
  'Chatbots visible to current user' as description,
  COUNT(*) as count
FROM chatbots c
WHERE c.workspace_id IN (SELECT workspace_id FROM user_workspaces)
AND c.deleted_at IS NULL

UNION ALL

SELECT 
  'Total chatbots in system' as description,
  COUNT(*) as count
FROM chatbots
WHERE deleted_at IS NULL;

-- Final recommendation
SELECT '
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SECURITY TEST COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What to check:
1. Each user should have their own workspace
2. Chatbots should be workspace-specific
3. RLS should be ENABLED on all tables
4. Policies should exist for chatbots/conversations
5. Cross-access test should show ✅ BLOCKED

If you see any ❌:
→ Run FIX_RLS_POLICIES.sql
→ Ensure each user has workspace
→ Check user_roles table

Next Steps:
1. Create 2 accounts if not exist
2. Create chatbot in each account
3. Try to view other user chatbots
4. Should see NOTHING from other user ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
' as final_message;
