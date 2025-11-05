// ============================================
// RBAC (Role-Based Access Control) Library
// ============================================
// Purpose: Helper functions for permission checking
// Author: AI Assistant

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// ============================================
// TYPES
// ============================================

export type Role = 
  | 'super_admin'
  | 'workspace_owner'
  | 'workspace_admin'
  | 'workspace_member'
  | 'workspace_viewer'

export type Permission =
  // Workspace
  | 'workspace.create'
  | 'workspace.read'
  | 'workspace.update'
  | 'workspace.delete'
  | 'workspace.manage_members'
  // Chatbot
  | 'chatbot.create'
  | 'chatbot.read'
  | 'chatbot.update'
  | 'chatbot.delete'
  | 'chatbot.test'
  // Document
  | 'document.create'
  | 'document.read'
  | 'document.update'
  | 'document.delete'
  // Conversation
  | 'conversation.create'
  | 'conversation.read'
  | 'conversation.update'
  | 'conversation.delete'
  // API Key
  | 'api_key.create'
  | 'api_key.read'
  | 'api_key.update'
  | 'api_key.delete'
  // Credit
  | 'credit.read'
  | 'credit.purchase'
  // Analytics
  | 'analytics.read'
  | 'analytics.export'
  // Team
  | 'team.invite'
  | 'team.read'
  | 'team.update'
  | 'team.remove'
  // Platform (Super Admin)
  | 'platform.manage_users'
  | 'platform.view_stats'
  | 'platform.manage_billing'
  | 'platform.impersonate'

export interface UserRole {
  id: string
  user_id: string
  role_id: string
  role_name: Role
  role_level: number
  workspace_id: string | null
  assigned_by: string | null
  assigned_at: string
  expires_at: string | null
}

export interface CheckPermissionOptions {
  workspaceId?: string
  resourceId?: string
  throwError?: boolean
}

// ============================================
// SERVER-SIDE FUNCTIONS (for API routes)
// ============================================

/**
 * Get current user from server-side context
 */
export async function getCurrentUser() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

/**
 * Get user's roles
 */
export async function getUserRoles(userId: string, workspaceId?: string) {
  const supabase = createRouteHandlerClient({ cookies })
  
  let query = supabase
    .from('user_roles')
    .select(`
      *,
      roles (
        id,
        name,
        level
      )
    `)
    .eq('user_id', userId)
    .or('expires_at.is.null,expires_at.gt.now()')
  
  if (workspaceId) {
    query = query.eq('workspace_id', workspaceId)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching user roles:', error)
    return []
  }
  
  return data as any[]
}

/**
 * Check if user has specific permission
 */
export async function hasPermission(
  userId: string,
  permission: Permission,
  options: CheckPermissionOptions = {}
): Promise<boolean> {
  const { workspaceId, throwError = false } = options
  
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    // Get user roles
    let query = supabase
      .from('user_roles')
      .select(`
        role_id,
        roles (
          name,
          permissions
        )
      `)
      .eq('user_id', userId)
    
    if (workspaceId) {
      query = query.eq('workspace_id', workspaceId)
    }
    
    const { data: userRoles, error } = await query
    
    if (error) {
      console.error('Error fetching user roles:', error)
      return false
    }
    
    if (!userRoles || userRoles.length === 0) {
      console.log(`No roles found for user ${userId} in workspace ${workspaceId}`)
      return false
    }
    
    // Check if any role has the permission
    for (const userRole of userRoles) {
      const role = userRole.roles as any
      if (!role) continue
      
      const permissions = role.permissions as string[]
      
      // Check for wildcard permission
      if (permissions.includes('*')) {
        return true
      }
      
      // Check for exact permission match
      if (permissions.includes(permission)) {
        return true
      }
      
      // Check for wildcard prefix (e.g., "chatbot.*" matches "chatbot.create")
      const permissionPrefix = permission.split('.')[0]
      if (permissions.includes(`${permissionPrefix}.*`)) {
        return true
      }
    }
    
    return false
  } catch (error: any) {
    console.error('Error checking permission:', error)
    if (throwError) {
      throw new Error(`Permission check failed: ${error.message}`)
    }
    return false
  }
}

/**
 * Check if user has any of the specified roles
 */
export async function hasRole(
  userId: string,
  roles: Role | Role[],
  workspaceId?: string
): Promise<boolean> {
  const roleArray = Array.isArray(roles) ? roles : [roles]
  const userRoles = await getUserRoles(userId, workspaceId)
  
  return userRoles.some(ur => 
    roleArray.includes(ur.roles.name as Role)
  )
}

/**
 * Check if user is super admin
 */
export async function isSuperAdmin(userId: string): Promise<boolean> {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data, error } = await supabase.rpc('is_super_admin', {
    p_user_id: userId
  })
  
  if (error) {
    console.error('Error checking super admin:', error)
    return false
  }
  
  return data === true
}

/**
 * Get user's highest role in workspace
 */
export async function getUserRoleInWorkspace(
  userId: string,
  workspaceId: string
): Promise<Role | null> {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data, error } = await supabase.rpc('get_user_role_in_workspace', {
    p_user_id: userId,
    p_workspace_id: workspaceId
  })
  
  if (error) {
    console.error('Error getting user role:', error)
    return null
  }
  
  return data as Role
}

/**
 * Require permission (throws error if not authorized)
 */
export async function requirePermission(
  userId: string,
  permission: Permission,
  options: CheckPermissionOptions = {}
): Promise<void> {
  const allowed = await hasPermission(userId, permission, options)
  
  if (!allowed) {
    throw new Error(`Forbidden: Missing permission '${permission}'`)
  }
}

/**
 * Require role (throws error if not authorized)
 */
export async function requireRole(
  userId: string,
  roles: Role | Role[],
  workspaceId?: string
): Promise<void> {
  const allowed = await hasRole(userId, roles, workspaceId)
  
  if (!allowed) {
    const roleStr = Array.isArray(roles) ? roles.join(', ') : roles
    throw new Error(`Forbidden: Requires role '${roleStr}'`)
  }
}

/**
 * Require super admin (throws error if not)
 */
export async function requireSuperAdmin(userId: string): Promise<void> {
  const isAdmin = await isSuperAdmin(userId)
  
  if (!isAdmin) {
    throw new Error('Forbidden: Super admin access required')
  }
}

/**
 * Check if user owns workspace
 */
export async function isWorkspaceOwner(
  userId: string,
  workspaceId: string
): Promise<boolean> {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data, error } = await supabase
    .from('workspaces')
    .select('user_id')
    .eq('id', workspaceId)
    .single()
  
  if (error || !data) {
    return false
  }
  
  return data.user_id === userId
}

/**
 * Require workspace ownership (throws error if not owner)
 */
export async function requireWorkspaceOwner(
  userId: string,
  workspaceId: string
): Promise<void> {
  const isOwner = await isWorkspaceOwner(userId, workspaceId)
  
  if (!isOwner) {
    throw new Error('Forbidden: Workspace owner access required')
  }
}

/**
 * Assign role to user
 */
export async function assignRole(
  userId: string,
  role: Role,
  workspaceId: string | null,
  assignedBy: string
): Promise<string> {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data, error } = await supabase.rpc('assign_role_to_user', {
    p_user_id: userId,
    p_role_name: role,
    p_workspace_id: workspaceId,
    p_assigned_by: assignedBy
  })
  
  if (error) {
    throw new Error(`Failed to assign role: ${error.message}`)
  }
  
  return data
}

// ============================================
// CLIENT-SIDE FUNCTIONS (for React components)
// ============================================

/**
 * Client-side permission check hook
 */
export async function checkPermissionClient(
  permission: Permission,
  workspaceId?: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/check-permission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permission, workspaceId })
    })
    
    const data = await response.json()
    return data.hasPermission === true
  } catch (error) {
    console.error('Error checking permission:', error)
    return false
  }
}

/**
 * Client-side role check
 */
export async function checkRoleClient(
  roles: Role | Role[],
  workspaceId?: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/check-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roles, workspaceId })
    })
    
    const data = await response.json()
    return data.hasRole === true
  } catch (error) {
    console.error('Error checking role:', error)
    return false
  }
}

// ============================================
// MIDDLEWARE HELPERS
// ============================================

/**
 * Create RBAC middleware for API routes
 */
export function withPermission(permission: Permission, workspaceIdKey: string = 'workspaceId') {
  return async (req: Request, context: any) => {
    const user = await getCurrentUser()
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const workspaceId = context.params?.[workspaceIdKey]
    
    const allowed = await hasPermission(user.id, permission, { workspaceId })
    
    if (!allowed) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Permission granted, continue to handler
    return null
  }
}

/**
 * Create RBAC middleware for roles
 */
export function withRole(roles: Role | Role[], workspaceIdKey: string = 'workspaceId') {
  return async (req: Request, context: any) => {
    const user = await getCurrentUser()
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const workspaceId = context.params?.[workspaceIdKey]
    
    const allowed = await hasRole(user.id, roles, workspaceId)
    
    if (!allowed) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    return null
  }
}

/**
 * Super admin only middleware
 */
export function requireSuperAdminMiddleware() {
  return async (req: Request, context: any) => {
    const user = await getCurrentUser()
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const isAdmin = await isSuperAdmin(user.id)
    
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden: Super admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    return null
  }
}

// ============================================
// ROLE HIERARCHY
// ============================================

export const ROLE_HIERARCHY: Record<Role, number> = {
  super_admin: 100,
  workspace_owner: 50,
  workspace_admin: 40,
  workspace_member: 30,
  workspace_viewer: 20
}

/**
 * Check if role1 has higher level than role2
 */
export function isHigherRole(role1: Role, role2: Role): boolean {
  return ROLE_HIERARCHY[role1] > ROLE_HIERARCHY[role2]
}

/**
 * Check if role1 has equal or higher level than role2
 */
export function isEqualOrHigherRole(role1: Role, role2: Role): boolean {
  return ROLE_HIERARCHY[role1] >= ROLE_HIERARCHY[role2]
}
