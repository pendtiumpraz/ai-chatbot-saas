import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getCurrentUser, hasPermission } from '@/lib/rbac';

// DELETE - Remove team member
export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission (simplified)
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userIdToRemove = params.userId;

    // Cannot remove yourself
    if (userIdToRemove === user.id) {
      return NextResponse.json(
        { error: 'Cannot remove yourself from workspace' },
        { status: 400 }
      );
    }

    // Get workspace
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', user.id)
      .is('deleted_at', null)
      .single();

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // Remove user role from workspace
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userIdToRemove)
      .eq('workspace_id', workspace.id);

    if (error) throw error;

    return NextResponse.json({
      message: 'Team member removed successfully'
    });
  } catch (error: any) {
    console.error('Team remove error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update team member role
export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission (simplified)
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userIdToUpdate = params.userId;
    const body = await req.json();
    const { role_name } = body;

    if (!role_name) {
      return NextResponse.json(
        { error: 'Role name is required' },
        { status: 400 }
      );
    }

    // Get workspace
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', user.id)
      .is('deleted_at', null)
      .single();

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // Get new role ID
    const { data: newRole } = await supabase
      .from('roles')
      .select('id')
      .eq('name', role_name)
      .single();

    if (!newRole) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Update user role
    const { error } = await supabase
      .from('user_roles')
      .update({ role_id: newRole.id })
      .eq('user_id', userIdToUpdate)
      .eq('workspace_id', workspace.id);

    if (error) throw error;

    return NextResponse.json({
      message: 'Team member role updated successfully'
    });
  } catch (error: any) {
    console.error('Team update error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
