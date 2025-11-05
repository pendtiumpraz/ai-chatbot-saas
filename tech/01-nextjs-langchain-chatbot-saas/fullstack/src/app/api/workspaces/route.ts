import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getCurrentUser, hasPermission } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

// GET /api/workspaces - List user's workspaces
export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get workspaces where user has access (via user_roles)
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('workspace_id')
      .eq('user_id', user.id)

    if (rolesError) {
      console.error('Error fetching user roles:', rolesError)
      return NextResponse.json({ error: rolesError.message }, { status: 500 })
    }

    const workspaceIds = userRoles.map(ur => ur.workspace_id)

    if (workspaceIds.length === 0) {
      return NextResponse.json({ workspaces: [] })
    }

    // Get workspaces (only non-deleted)
    const { data: workspaces, error } = await supabase
      .from('workspaces')
      .select('*')
      .in('id', workspaceIds)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching workspaces:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ workspaces })
  } catch (error) {
    console.error('Workspaces GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/workspaces - Create new workspace
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, industry } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Note: All authenticated users can create workspaces
    // No permission check needed for workspace creation

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Generate unique workspace ID
    const workspaceId = crypto.randomUUID()

    // Create workspace
    const { data: workspace, error } = await supabase
      .from('workspaces')
      .insert({
        id: workspaceId,
        name,
        slug: `${slug}-${Math.random().toString(36).substring(7)}`, // Add random suffix to ensure uniqueness
        industry: industry || null,
        plan: 'free',
      })
      .select()
      .single()

    if (error) {
      await logAudit({
        userId: user.id,
        action: 'create_workspace',
        resourceType: 'workspace',
        status: 'failed',
        errorMessage: error.message
      })
      console.error('Error creating workspace:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Assign owner role to user
    const { data: ownerRole } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'workspace_owner')
      .single()

    if (ownerRole) {
      await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role_id: ownerRole.id,
          workspace_id: workspace.id,
        })
    }

    // Log success
    await logAudit({
      userId: user.id,
      workspaceId: workspace.id,
      action: 'create_workspace',
      resourceType: 'workspace',
      resourceId: workspace.id,
      newValues: workspace,
      status: 'success'
    })

    return NextResponse.json({ workspace }, { status: 201 })
  } catch (error) {
    console.error('Workspaces POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
