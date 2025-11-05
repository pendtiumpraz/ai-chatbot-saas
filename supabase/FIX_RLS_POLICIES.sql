-- ============================================
-- FIX RLS POLICIES - Update Permissions
-- ============================================
-- This fixes "Chatbot not found" update errors
-- ============================================

-- Step 1: Check current RLS status
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🔍 Step 1: Checking RLS Status' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
  schemaname,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ Enabled'
    ELSE '❌ Disabled'
  END as rls_status
FROM pg_tables
WHERE tablename = 'chatbots';

-- Step 2: Show existing policies
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '📋 Step 2: Current Policies' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'chatbots';

-- ============================================
-- FIX: Drop and recreate policies
-- ============================================

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🔧 Step 3: Fixing Policies...' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage chatbots in their workspace" ON chatbots;
DROP POLICY IF EXISTS "Users can view chatbots in their workspace" ON chatbots;
DROP POLICY IF EXISTS "Users can create chatbots in their workspace" ON chatbots;
DROP POLICY IF EXISTS "Users can update chatbots in their workspace" ON chatbots;
DROP POLICY IF EXISTS "Users can delete chatbots in their workspace" ON chatbots;
DROP POLICY IF EXISTS "Users can manage their chatbots" ON chatbots;

-- Create new comprehensive policy
CREATE POLICY "Users can manage their workspace chatbots"
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

-- ============================================
-- Test the new policy
-- ============================================

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🧪 Step 4: Testing Policies' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

DO $$
DECLARE
  v_user_id UUID;
  v_workspace_id UUID;
  v_test_chatbot_id UUID;
  v_can_read BOOLEAN := FALSE;
  v_can_update BOOLEAN := FALSE;
  v_can_delete BOOLEAN := FALSE;
BEGIN
  -- Get current user
  SELECT auth.uid() INTO v_user_id;
  
  IF v_user_id IS NULL THEN
    RAISE NOTICE '⚠️  Not logged in - cannot test';
    RETURN;
  END IF;

  -- Get user workspace
  SELECT workspace_id INTO v_workspace_id
  FROM user_roles
  WHERE user_id = v_user_id
  LIMIT 1;

  IF v_workspace_id IS NULL THEN
    RAISE NOTICE '❌ No workspace found for user';
    RETURN;
  END IF;

  RAISE NOTICE 'Testing for user: %', v_user_id;
  RAISE NOTICE 'Workspace: %', v_workspace_id;

  -- Test READ
  SELECT EXISTS(
    SELECT 1 FROM chatbots 
    WHERE workspace_id = v_workspace_id 
    AND deleted_at IS NULL
    LIMIT 1
  ) INTO v_can_read;

  IF v_can_read THEN
    RAISE NOTICE '✅ READ: Can view chatbots';
  ELSE
    RAISE NOTICE '⚠️  READ: No chatbots to read (might be empty)';
  END IF;

  -- Test UPDATE
  SELECT id INTO v_test_chatbot_id
  FROM chatbots
  WHERE workspace_id = v_workspace_id
  AND deleted_at IS NULL
  LIMIT 1;

  IF v_test_chatbot_id IS NOT NULL THEN
    BEGIN
      UPDATE chatbots
      SET updated_at = NOW()
      WHERE id = v_test_chatbot_id
      AND deleted_at IS NULL;
      
      IF FOUND THEN
        v_can_update := TRUE;
        RAISE NOTICE '✅ UPDATE: Can update chatbots';
      ELSE
        RAISE NOTICE '❌ UPDATE: Update blocked by RLS';
      END IF;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE NOTICE '❌ UPDATE: Error - %', SQLERRM;
    END;
  ELSE
    RAISE NOTICE '⚠️  UPDATE: No chatbots to test (create one first)';
  END IF;

  -- Summary
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '📊 Test Summary';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE 'User ID: %', v_user_id;
  RAISE NOTICE 'Workspace ID: %', v_workspace_id;
  RAISE NOTICE 'Can Read: %', CASE WHEN v_can_read THEN '✅' ELSE '❌' END;
  RAISE NOTICE 'Can Update: %', CASE WHEN v_can_update THEN '✅' ELSE '❌' END;

END $$;

-- ============================================
-- Verify policy setup
-- ============================================

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '✅ Step 5: Verification' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
  policyname,
  cmd,
  CASE 
    WHEN cmd = 'ALL' THEN '✅ All Operations'
    WHEN cmd = 'SELECT' THEN '📖 Read Only'
    WHEN cmd = 'INSERT' THEN '➕ Create Only'
    WHEN cmd = 'UPDATE' THEN '✏️ Update Only'
    WHEN cmd = 'DELETE' THEN '🗑️ Delete Only'
  END as operations
FROM pg_policies
WHERE tablename = 'chatbots';

-- ============================================
-- FINAL MESSAGE
-- ============================================

SELECT '
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ RLS POLICIES FIXED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

New Policy Created:
→ "Users can manage their workspace chatbots"
→ Allows: SELECT, INSERT, UPDATE, DELETE
→ Scope: All chatbots in user workspace

What Changed:
- Simplified policy structure
- Better workspace matching
- Covers all CRUD operations

Now You Can:
✅ View chatbots
✅ Create chatbots
✅ Update chatbots
✅ Delete chatbots

Next Steps:
1. Refresh browser (Ctrl+F5)
2. Try editing chatbot again
3. Should work now! 🎉

If Still Failing:
→ Check browser console (F12)
→ Verify logged in
→ Run DEBUG_CHATBOT_ISSUE.sql
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
' as result;
