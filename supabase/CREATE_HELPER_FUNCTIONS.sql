-- ============================================
-- CREATE HELPER FUNCTIONS
-- ============================================
-- Functions to get user's workspace ID
-- ============================================

-- Function: Get user's first workspace ID
CREATE OR REPLACE FUNCTION get_user_workspace_id(p_user_id UUID)
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT workspace_id
    FROM user_roles
    WHERE user_id = p_user_id
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get all user's workspace IDs
CREATE OR REPLACE FUNCTION get_user_workspace_ids(p_user_id UUID)
RETURNS TABLE(workspace_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ur.workspace_id
  FROM user_roles ur
  WHERE ur.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check if user has access to workspace
CREATE OR REPLACE FUNCTION has_workspace_access(p_user_id UUID, p_workspace_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = p_user_id
    AND workspace_id = p_workspace_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

SELECT '
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ HELPER FUNCTIONS CREATED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Functions:
1. get_user_workspace_id(user_id)
   → Returns first workspace ID for user

2. get_user_workspace_ids(user_id)
   → Returns all workspace IDs for user

3. has_workspace_access(user_id, workspace_id)
   → Returns true if user has access

Usage in queries:
- WHERE workspace_id = get_user_workspace_id(auth.uid())
- WHERE workspace_id IN (SELECT * FROM get_user_workspace_ids(auth.uid()))

This fixes all "user.id" workspace issues!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
' as result;
