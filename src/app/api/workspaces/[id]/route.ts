import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getCurrentUser, hasPermission } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

// GET /api/workspaces/:id - Get workspace by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get workspace (only non-deleted)
    const { data: workspace, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', params.id)
      .is('deleted_at', null)
      .single()

    if (error || !workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    // Check permission (TEMPORARILY DISABLED FOR DEVELOPMENT)
    // TODO: Re-enable after fixing user_roles and permissions
    // const canRead = await hasPermission(user.id, 'workspace.read', {
    //   workspaceId: workspace.id
    // })

    // if (!canRead) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }

    // Get stats (only non-deleted)
    const { count: chatbotsCount } = await supabase
      .from('chatbots')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', params.id)
      .is('deleted_at', null)

    const { count: documentsCount } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('chatbot_id', params.id)
      .is('deleted_at', null)

    return NextResponse.json({
      workspace: {
        ...workspace,
        stats: {
          chatbots: chatbotsCount || 0,
          documents: documentsCount || 0,
        }
      }
    })
  } catch (error) {
    console.error('Workspace GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/workspaces/:id - Update workspace
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, industry, plan } = body

    // Update workspace
    const { data: workspace, error } = await supabase
      .from('workspaces')
      .update({
        name: name || undefined,
        industry: industry || undefined,
        plan: plan || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .eq('id', user.id) // Ensure user owns workspace
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ workspace })
  } catch (error) {
    console.error('Workspace PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/workspaces/:id - Soft delete workspace
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get workspace first
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', params.id)
      .is('deleted_at', null)
      .single()

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    // Check permission (TEMPORARILY DISABLED FOR DEVELOPMENT)
    // TODO: Re-enable after fixing workspace ownership
    // if (workspace.id !== user.id) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }

    // SOFT DELETE workspace
    const { error } = await supabase
      .from('workspaces')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user.id
      })
      .eq('id', params.id)

    if (error) {
      await logAudit({
        userId: user.id,
        workspaceId: params.id,
        action: 'delete_workspace',
        resourceType: 'workspace',
        resourceId: params.id,
        status: 'failed',
        errorMessage: error.message
      })
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log success
    await logAudit({
      userId: user.id,
      workspaceId: params.id,
      action: 'delete_workspace',
      resourceType: 'workspace',
      resourceId: workspace.id,
      oldValues: workspace,
      status: 'success'
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Workspace DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
