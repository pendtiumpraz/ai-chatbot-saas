-- ============================================
-- 🔧 FIX FORBIDDEN ERROR - ASSIGN ROLES
-- ============================================
-- Run this to give your user permissions!
-- ============================================

-- Step 1: Check current user ID
SELECT 
  'Your User ID:' as info,
  id,
  email
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Step 2: Check if user has any roles
SELECT 
  'Current User Roles:' as info,
  ur.user_id,
  r.name as role_name,
  ur.workspace_id
FROM user_roles ur
JOIN roles r ON ur.role_id = r.id
LIMIT 10;

-- ============================================
-- FIX: Assign workspace_owner role to ALL users
-- ============================================

-- This will give workspace_owner role to all users in their workspaces
INSERT INTO user_roles (user_id, role_id, workspace_id)
SELECT 
  w.id as user_id,
  (SELECT id FROM roles WHERE name = 'workspace_owner') as role_id,
  w.id as workspace_id
FROM workspaces w
WHERE NOT EXISTS (
  SELECT 1 FROM user_roles ur 
  WHERE ur.user_id = w.id 
  AND ur.workspace_id = w.id
)
ON CONFLICT (user_id, role_id, workspace_id) DO NOTHING;

-- Verify roles assigned
SELECT 
  '✅ Roles Assigned:' as info,
  COUNT(*) as total_users_with_roles
FROM user_roles;

-- Show all user roles
SELECT 
  'User Roles Summary:' as info,
  au.email,
  r.name as role,
  w.name as workspace
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
JOIN roles r ON ur.role_id = r.id
LEFT JOIN workspaces w ON ur.workspace_id = w.id
ORDER BY au.email;

-- ============================================
-- DONE! Now reload your dashboard and try again
-- ============================================

SELECT '
========================================
✅ ROLES ASSIGNED!
========================================
1. Close your browser tab
2. Open new tab: http://localhost:3011/dashboard
3. Try create chatbot again
========================================
' as result;
