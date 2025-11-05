-- ============================================
-- ⚡ QUICK FIX - ASSIGN ROLE TO YOUR USER
-- ============================================
-- Run this if AUTO_ASSIGN_ROLES.sql fails
-- This manually assigns workspace_owner role
-- ============================================

-- Step 1: Find your user ID
SELECT 
  '🔍 Your User Info:' as step,
  id as user_id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Step 2: Check if you have a workspace
SELECT 
  '🏢 Your Workspace:' as step,
  id as workspace_id,
  name as workspace_name,
  created_at
FROM workspaces
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 5;

-- Step 3: Check current roles
SELECT 
  '👤 Current Roles:' as step,
  ur.user_id,
  r.name as role_name,
  ur.workspace_id
FROM user_roles ur
JOIN roles r ON ur.role_id = r.id
LIMIT 10;

-- ============================================
-- MANUAL FIX (if needed):
-- ============================================
-- Replace YOUR_USER_ID with your actual user ID from Step 1
-- Replace YOUR_WORKSPACE_ID with workspace ID from Step 2
-- ============================================

-- UNCOMMENT AND EDIT THIS SECTION:
/*
INSERT INTO user_roles (user_id, role_id, workspace_id)
VALUES (
  'YOUR_USER_ID_HERE',  -- Copy from Step 1
  (SELECT id FROM roles WHERE name = 'workspace_owner'),
  'YOUR_WORKSPACE_ID_HERE'  -- Copy from Step 2 (usually same as user_id)
)
ON CONFLICT (user_id, role_id, workspace_id) DO NOTHING;
*/

-- ============================================
-- AUTOMATIC FIX (Safer):
-- ============================================
-- This assigns workspace_owner to the FIRST user found
-- Only use if you have ONE user!
-- ============================================

DO $$
DECLARE
  v_user_id UUID;
  v_workspace_id UUID;
  v_role_id UUID;
BEGIN
  -- Get the most recent user
  SELECT id INTO v_user_id
  FROM auth.users
  ORDER BY created_at DESC
  LIMIT 1;

  -- Get their workspace (workspace.id = user.id usually)
  SELECT id INTO v_workspace_id
  FROM workspaces
  WHERE id = v_user_id
  AND deleted_at IS NULL;

  -- Get workspace_owner role ID
  SELECT id INTO v_role_id
  FROM roles
  WHERE name = 'workspace_owner';

  -- Check if all IDs exist
  IF v_user_id IS NOT NULL AND v_workspace_id IS NOT NULL AND v_role_id IS NOT NULL THEN
    -- Assign role
    INSERT INTO user_roles (user_id, role_id, workspace_id)
    VALUES (v_user_id, v_role_id, v_workspace_id)
    ON CONFLICT (user_id, role_id, workspace_id) DO NOTHING;

    RAISE NOTICE '✅ Role assigned to user: %', v_user_id;
  ELSE
    RAISE NOTICE '❌ Missing data: user=%, workspace=%, role=%', v_user_id, v_workspace_id, v_role_id;
  END IF;
END $$;

-- Step 4: Verify the fix
SELECT 
  '✅ Verification:' as step,
  au.email,
  r.name as role,
  w.name as workspace
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
JOIN roles r ON ur.role_id = r.id
LEFT JOIN workspaces w ON ur.workspace_id = w.id
ORDER BY au.created_at DESC;

-- ============================================
-- ✅ DONE! Now refresh dashboard and try again
-- ============================================

SELECT '
========================================
✅ ROLE ASSIGNMENT COMPLETE!
========================================
1. Close browser tab
2. Open: http://localhost:3011/dashboard
3. Try create chatbot again
========================================
' as result;
