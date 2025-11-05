-- ============================================
-- FIX WORKSPACES RLS - Allow User Create Workspace
-- ============================================

-- Drop existing policy
DROP POLICY IF EXISTS "workspace_isolation" ON workspaces;

-- Create new policy that allows INSERT
CREATE POLICY "workspace_full_access"
ON workspaces FOR ALL
USING (
  -- User can read/update/delete their own workspace
  id = auth.uid() OR
  -- Or workspaces they have access via user_roles
  id IN (
    SELECT workspace_id FROM user_roles WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  -- User can create workspace (no restriction on INSERT)
  true
);

-- Verify
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'workspaces';

SELECT '
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ WORKSPACES RLS FIXED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Policy: workspace_full_access
- SELECT: Can read own workspaces
- INSERT: ✅ Can create new workspaces
- UPDATE: Can update own workspaces
- DELETE: Can delete own workspaces

Test:
1. Create new workspace
2. Should work! ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
' as result;
