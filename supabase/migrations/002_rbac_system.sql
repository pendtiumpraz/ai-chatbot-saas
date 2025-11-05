-- ============================================
-- MIGRATION 002: ROLE-BASED ACCESS CONTROL (RBAC)
-- ============================================
-- Purpose: Implement comprehensive RBAC system
-- Author: AI Assistant
-- Date: 2025-01-05

-- ============================================
-- 1. ROLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  level INTEGER NOT NULL, -- Hierarchy level (higher = more permissions)
  is_system BOOLEAN DEFAULT false, -- System roles can't be deleted
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, description, level, is_system) VALUES
  ('super_admin', 'Platform super administrator - full access to everything', 100, true),
  ('workspace_owner', 'Workspace owner - full control over workspace', 50, true),
  ('workspace_admin', 'Workspace admin - can manage workspace settings and members', 40, true),
  ('workspace_member', 'Workspace member - can use chatbots and view data', 30, true),
  ('workspace_viewer', 'Workspace viewer - read-only access', 20, true)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 2. PERMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  resource VARCHAR(50) NOT NULL, -- e.g., 'chatbot', 'document', 'workspace'
  action VARCHAR(50) NOT NULL, -- e.g., 'create', 'read', 'update', 'delete'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default permissions
INSERT INTO permissions (name, description, resource, action) VALUES
  -- Workspace permissions
  ('workspace.create', 'Create new workspace', 'workspace', 'create'),
  ('workspace.read', 'View workspace details', 'workspace', 'read'),
  ('workspace.update', 'Update workspace settings', 'workspace', 'update'),
  ('workspace.delete', 'Delete workspace', 'workspace', 'delete'),
  ('workspace.manage_members', 'Manage workspace members', 'workspace', 'manage'),
  
  -- Chatbot permissions
  ('chatbot.create', 'Create new chatbot', 'chatbot', 'create'),
  ('chatbot.read', 'View chatbot details', 'chatbot', 'read'),
  ('chatbot.update', 'Update chatbot settings', 'chatbot', 'update'),
  ('chatbot.delete', 'Delete chatbot', 'chatbot', 'delete'),
  ('chatbot.test', 'Test chatbot', 'chatbot', 'test'),
  
  -- Document permissions
  ('document.create', 'Upload documents', 'document', 'create'),
  ('document.read', 'View documents', 'document', 'read'),
  ('document.update', 'Update documents', 'document', 'update'),
  ('document.delete', 'Delete documents', 'document', 'delete'),
  
  -- Conversation permissions
  ('conversation.create', 'Create conversations', 'conversation', 'create'),
  ('conversation.read', 'View conversations', 'conversation', 'read'),
  ('conversation.update', 'Update conversation notes', 'conversation', 'update'),
  ('conversation.delete', 'Delete conversations', 'conversation', 'delete'),
  
  -- API Key permissions
  ('api_key.create', 'Add API keys', 'api_key', 'create'),
  ('api_key.read', 'View API keys', 'api_key', 'read'),
  ('api_key.update', 'Update API keys', 'api_key', 'update'),
  ('api_key.delete', 'Delete API keys', 'api_key', 'delete'),
  
  -- Credits permissions
  ('credit.read', 'View credits balance', 'credit', 'read'),
  ('credit.purchase', 'Purchase credits', 'credit', 'create'),
  
  -- Analytics permissions
  ('analytics.read', 'View analytics', 'analytics', 'read'),
  ('analytics.export', 'Export analytics data', 'analytics', 'export'),
  
  -- Team permissions
  ('team.invite', 'Invite team members', 'team', 'create'),
  ('team.read', 'View team members', 'team', 'read'),
  ('team.update', 'Update member roles', 'team', 'update'),
  ('team.remove', 'Remove team members', 'team', 'delete'),
  
  -- Super Admin permissions
  ('platform.manage_users', 'Manage all users', 'platform', 'manage'),
  ('platform.view_stats', 'View platform statistics', 'platform', 'read'),
  ('platform.manage_billing', 'Manage platform billing', 'platform', 'manage'),
  ('platform.impersonate', 'Impersonate users', 'platform', 'impersonate')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 3. ROLE_PERMISSIONS TABLE (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (role_id, permission_id)
);

-- Assign permissions to super_admin (ALL permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'super_admin'
ON CONFLICT DO NOTHING;

-- Assign permissions to workspace_owner (all workspace-related)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'workspace_owner'
  AND p.resource IN ('workspace', 'chatbot', 'document', 'conversation', 'api_key', 'credit', 'analytics', 'team')
ON CONFLICT DO NOTHING;

-- Assign permissions to workspace_admin (can manage but not delete workspace)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'workspace_admin'
  AND p.resource IN ('chatbot', 'document', 'conversation', 'api_key', 'credit', 'analytics', 'team')
  AND p.action != 'delete'
ON CONFLICT DO NOTHING;

-- Assign permissions to workspace_member (can use, limited management)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'workspace_member'
  AND p.resource IN ('chatbot', 'document', 'conversation')
  AND p.action IN ('create', 'read', 'test')
ON CONFLICT DO NOTHING;

-- Assign permissions to workspace_viewer (read-only)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'workspace_viewer'
  AND p.action = 'read'
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. USER_ROLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NULL, -- NULL for super_admin
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- Optional: for temporary access
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role_id, workspace_id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_workspace ON user_roles(workspace_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);

-- ============================================
-- 5. WORKSPACE_MEMBERS TABLE (Detailed)
-- ============================================
CREATE TABLE IF NOT EXISTS workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id),
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID REFERENCES auth.users(id),
  UNIQUE(workspace_id, user_id)
);

CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id, deleted_at);
CREATE INDEX idx_workspace_members_user ON workspace_members(user_id, deleted_at);

-- ============================================
-- 6. TEAM_INVITATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS team_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role_id UUID REFERENCES roles(id),
  invited_by UUID REFERENCES auth.users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, expired, cancelled
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_team_invitations_workspace ON team_invitations(workspace_id);
CREATE INDEX idx_team_invitations_email ON team_invitations(email);
CREATE INDEX idx_team_invitations_token ON team_invitations(token);
CREATE INDEX idx_team_invitations_status ON team_invitations(status);

-- ============================================
-- 7. HELPER FUNCTIONS
-- ============================================

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION user_has_permission(
  p_user_id UUID,
  p_permission_name VARCHAR,
  p_workspace_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  has_perm BOOLEAN;
BEGIN
  -- Check if user has the permission through their role
  SELECT EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = p_user_id
      AND p.name = p_permission_name
      AND (ur.workspace_id = p_workspace_id OR ur.workspace_id IS NULL)
      AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
  ) INTO has_perm;
  
  RETURN has_perm;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's role in workspace
CREATE OR REPLACE FUNCTION get_user_role_in_workspace(
  p_user_id UUID,
  p_workspace_id UUID
)
RETURNS VARCHAR AS $$
DECLARE
  role_name VARCHAR;
BEGIN
  SELECT r.name INTO role_name
  FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  WHERE ur.user_id = p_user_id
    AND ur.workspace_id = p_workspace_id
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
  ORDER BY r.level DESC
  LIMIT 1;
  
  RETURN role_name;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = p_user_id
      AND r.name = 'super_admin'
      AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
  );
END;
$$ LANGUAGE plpgsql;

-- Function to assign role to user
CREATE OR REPLACE FUNCTION assign_role_to_user(
  p_user_id UUID,
  p_role_name VARCHAR,
  p_workspace_id UUID DEFAULT NULL,
  p_assigned_by UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  role_id UUID;
  user_role_id UUID;
BEGIN
  -- Get role ID
  SELECT id INTO role_id FROM roles WHERE name = p_role_name;
  
  IF role_id IS NULL THEN
    RAISE EXCEPTION 'Role % not found', p_role_name;
  END IF;
  
  -- Insert user role
  INSERT INTO user_roles (user_id, role_id, workspace_id, assigned_by)
  VALUES (p_user_id, role_id, p_workspace_id, p_assigned_by)
  ON CONFLICT (user_id, role_id, workspace_id) DO UPDATE
  SET assigned_by = p_assigned_by, assigned_at = NOW()
  RETURNING id INTO user_role_id;
  
  RETURN user_role_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. TRIGGERS
-- ============================================

-- Auto-assign workspace_owner role when workspace is created
CREATE OR REPLACE FUNCTION assign_workspace_owner_role()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM assign_role_to_user(
    NEW.user_id,
    'workspace_owner',
    NEW.id,
    NEW.user_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_assign_workspace_owner
  AFTER INSERT ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION assign_workspace_owner_role();

-- ============================================
-- 9. RBAC VIEWS
-- ============================================

-- View: User permissions per workspace
CREATE OR REPLACE VIEW user_workspace_permissions AS
SELECT 
  ur.user_id,
  ur.workspace_id,
  r.name as role_name,
  r.level as role_level,
  p.name as permission_name,
  p.resource,
  p.action
FROM user_roles ur
JOIN roles r ON ur.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE (ur.expires_at IS NULL OR ur.expires_at > NOW());

-- View: Active workspace members with roles
CREATE OR REPLACE VIEW active_workspace_members AS
SELECT 
  wm.id,
  wm.workspace_id,
  wm.user_id,
  wm.joined_at,
  wm.last_active_at,
  r.name as role_name,
  r.level as role_level
FROM workspace_members wm
JOIN roles r ON wm.role_id = r.id
WHERE wm.deleted_at IS NULL
  AND wm.is_active = true;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- To verify:
-- SELECT * FROM roles;
-- SELECT * FROM permissions;
-- SELECT * FROM role_permissions;
-- SELECT * FROM user_roles;
