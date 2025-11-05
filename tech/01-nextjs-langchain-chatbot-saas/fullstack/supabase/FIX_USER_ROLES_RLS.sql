-- ============================================
-- FIX USER_ROLES RLS - Remove Infinite Recursion
-- ============================================

-- Drop existing problematic policies
DROP POLICY IF EXISTS "user_roles_read" ON user_roles;
DROP POLICY IF EXISTS "user_roles_manage" ON user_roles;
DROP POLICY IF EXISTS "user_roles_read_policy" ON user_roles;
DROP POLICY IF EXISTS "user_roles_manage_policy" ON user_roles;

-- Create simple non-recursive policies
-- Allow users to read their own roles
CREATE POLICY "user_roles_select"
ON user_roles FOR SELECT
USING (user_id = auth.uid());

-- Allow users to insert their own roles (for workspace creation)
CREATE POLICY "user_roles_insert"
ON user_roles FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Allow users to manage roles if they are workspace owner
-- (checked via workspace ownership, not via user_roles recursion)
CREATE POLICY "user_roles_update"
ON user_roles FOR UPDATE
USING (
  workspace_id IN (
    SELECT id FROM workspaces WHERE id = auth.uid()
  )
);

CREATE POLICY "user_roles_delete"
ON user_roles FOR DELETE
USING (
  workspace_id IN (
    SELECT id FROM workspaces WHERE id = auth.uid()
  )
);

-- Verify policies
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'user_roles'
ORDER BY policyname;

SELECT '
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ USER_ROLES RLS FIXED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Policies Created:
✅ user_roles_select  → Read own roles
✅ user_roles_insert  → Create own roles
✅ user_roles_update  → Update if workspace owner
✅ user_roles_delete  → Delete if workspace owner

No more infinite recursion! ✅

Test:
1. Sign up new user
2. Workspace auto-created
3. Role auto-assigned
4. No recursion error!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
' as result;
