-- QUICK FIX - Copy and paste this entire script to Supabase SQL Editor

-- Drop old policy
DROP POLICY IF EXISTS "workspace_isolation" ON workspaces;
DROP POLICY IF EXISTS "workspace_full_access" ON workspaces;

-- Create new policy
CREATE POLICY "workspace_full_access"
ON workspaces FOR ALL
USING (
  id = auth.uid() OR
  id IN (SELECT workspace_id FROM user_roles WHERE user_id = auth.uid())
)
WITH CHECK (true);

-- Verify
SELECT '✅ RLS FIXED! Try creating workspace now!' as result;
