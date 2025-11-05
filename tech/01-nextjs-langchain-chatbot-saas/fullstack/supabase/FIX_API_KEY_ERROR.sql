-- ============================================
-- ⚡ FIX API KEY ERROR - "new row violates"
-- ============================================
-- This fixes the foreign key constraint error
-- when adding API keys
-- ============================================

-- Step 1: Check current situation
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🔍 STEP 1: Checking Users' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
  id as user_id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- Step 2: Check workspaces
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🏢 STEP 2: Checking Workspaces' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
  id as workspace_id,
  name,
  created_at,
  deleted_at
FROM workspaces
ORDER BY created_at DESC;

-- Step 3: Check roles
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '👤 STEP 3: Checking User Roles' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
  ur.user_id,
  r.name as role_name,
  ur.workspace_id
FROM user_roles ur
JOIN roles r ON ur.role_id = r.id
ORDER BY ur.created_at DESC;

-- ============================================
-- AUTOMATIC FIX
-- ============================================
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🔧 STEP 4: Auto-Fixing...' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

DO $$
DECLARE
  v_user_id UUID;
  v_user_email TEXT;
  v_workspace_id UUID;
  v_workspace_exists BOOLEAN;
  v_role_id UUID;
  v_role_exists BOOLEAN;
BEGIN
  -- Get the most recent user
  SELECT id, email INTO v_user_id, v_user_email
  FROM auth.users
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '❌ No users found! Please sign up first.';
  END IF;

  RAISE NOTICE '✅ Found user: % (%)', v_user_email, v_user_id;

  -- Check if workspace exists for this user
  SELECT EXISTS(
    SELECT 1 FROM workspaces 
    WHERE id = v_user_id 
    AND deleted_at IS NULL
  ) INTO v_workspace_exists;

  IF NOT v_workspace_exists THEN
    RAISE NOTICE '⚠️  Workspace not found for user. Creating...';
    
    -- Create workspace for this user
    INSERT INTO workspaces (
      id,
      name,
      slug,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      COALESCE(SPLIT_PART(v_user_email, '@', 1), 'My Workspace'),
      LOWER(REPLACE(COALESCE(SPLIT_PART(v_user_email, '@', 1), 'workspace'), ' ', '-')),
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE '✅ Workspace created for user: %', v_user_id;
  ELSE
    RAISE NOTICE '✅ Workspace already exists for user: %', v_user_id;
  END IF;

  v_workspace_id := v_user_id;

  -- Get workspace_owner role ID
  SELECT id INTO v_role_id
  FROM roles
  WHERE name = 'workspace_owner';

  IF v_role_id IS NULL THEN
    RAISE EXCEPTION '❌ workspace_owner role not found! Please run RBAC migration first.';
  END IF;

  -- Check if user already has role
  SELECT EXISTS(
    SELECT 1 FROM user_roles 
    WHERE user_id = v_user_id 
    AND workspace_id = v_workspace_id
    AND role_id = v_role_id
  ) INTO v_role_exists;

  IF NOT v_role_exists THEN
    -- Assign workspace_owner role
    INSERT INTO user_roles (user_id, role_id, workspace_id)
    VALUES (v_user_id, v_role_id, v_workspace_id)
    ON CONFLICT (user_id, role_id, workspace_id) DO NOTHING;

    RAISE NOTICE '✅ Assigned workspace_owner role to user: %', v_user_id;
  ELSE
    RAISE NOTICE '✅ User already has workspace_owner role';
  END IF;

  -- Summary
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '🎉 FIX COMPLETE!';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE 'User: % (%)', v_user_email, v_user_id;
  RAISE NOTICE 'Workspace: %', v_workspace_id;
  RAISE NOTICE 'Role: workspace_owner';
  RAISE NOTICE '';
  RAISE NOTICE '✅ You can now add API keys!';
  RAISE NOTICE '';

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Error: %', SQLERRM;
    RAISE EXCEPTION 'Fix failed: %', SQLERRM;
END $$;

-- Step 5: Verify the fix
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '✅ STEP 5: Verification' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

SELECT 
  'User → Workspace → Role' as verification,
  au.email,
  w.name as workspace,
  r.name as role,
  CASE 
    WHEN ur.user_id IS NOT NULL THEN '✅ Ready'
    ELSE '❌ Missing'
  END as status
FROM auth.users au
LEFT JOIN workspaces w ON w.id = au.id AND w.deleted_at IS NULL
LEFT JOIN user_roles ur ON ur.user_id = au.id AND ur.workspace_id = au.id
LEFT JOIN roles r ON r.id = ur.role_id
ORDER BY au.created_at DESC
LIMIT 5;

-- ============================================
-- TEST API KEY CONSTRAINT
-- ============================================
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;
SELECT '🧪 STEP 6: Testing Constraints' as step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator;

-- Check if we can reference workspaces
DO $$
DECLARE
  v_user_id UUID;
  v_workspace_valid BOOLEAN;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  ORDER BY created_at DESC
  LIMIT 1;

  -- Check if workspace_id is valid
  SELECT EXISTS(
    SELECT 1 FROM workspaces WHERE id = v_user_id
  ) INTO v_workspace_valid;

  IF v_workspace_valid THEN
    RAISE NOTICE '✅ Workspace foreign key is valid';
    RAISE NOTICE '✅ You can now add API keys with workspace_id: %', v_user_id;
  ELSE
    RAISE NOTICE '❌ Workspace foreign key is INVALID';
    RAISE NOTICE '❌ Please run the fix again';
  END IF;
END $$;

-- ============================================
-- FINAL MESSAGE
-- ============================================
SELECT '
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ FIX COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next Steps:
1. Close browser tab
2. Open: http://localhost:3011/dashboard
3. Go to: Settings → API Keys
4. Click: "+ Add API Key"
5. Test adding key ✅

The error should be gone now!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
' as result;
