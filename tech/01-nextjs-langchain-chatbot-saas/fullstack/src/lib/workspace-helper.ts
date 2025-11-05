import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

/**
 * Get user's workspace ID from user_roles table
 * Returns first workspace ID found for the user
 */
export async function getUserWorkspaceId(userId: string): Promise<string | null> {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('workspace_id')
    .eq('user_id', userId)
    .limit(1)
    .single()
  
  return userRole?.workspace_id || null
}

/**
 * Get all workspace IDs for a user
 */
export async function getUserWorkspaceIds(userId: string): Promise<string[]> {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('workspace_id')
    .eq('user_id', userId)
  
  return userRoles?.map(r => r.workspace_id) || []
}

/**
 * Check if user has access to a workspace
 */
export async function hasWorkspaceAccess(userId: string, workspaceId: string): Promise<boolean> {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data } = await supabase
    .from('user_roles')
    .select('workspace_id')
    .eq('user_id', userId)
    .eq('workspace_id', workspaceId)
    .single()
  
  return !!data
}
