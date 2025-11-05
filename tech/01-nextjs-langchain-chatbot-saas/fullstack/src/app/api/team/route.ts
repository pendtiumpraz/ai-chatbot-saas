import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getCurrentUser, hasPermission } from '@/lib/rbac';

// GET - List team members
export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission (simplified - just check if user is authenticated)
    // In production, add proper RBAC check
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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

    // Get team members (users with roles in this workspace)
    const { data: teamMembers, error } = await supabase
      .from('user_roles')
      .select(`
        user_id,
        role_id,
        created_at,
        roles!inner (
          id,
          name,
          description
        )
      `)
      .eq('workspace_id', workspace.id);

    if (error) throw error;

    // Get user details from auth.users
    const userIds = teamMembers?.map(m => m.user_id) || [];
    const userDetails: any[] = [];

    for (const userId of userIds) {
      const { data: { user: authUser } } = await supabase.auth.admin.getUserById(userId);
      if (authUser) {
        userDetails.push({
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || null,
          avatar_url: authUser.user_metadata?.avatar_url || null,
          created_at: authUser.created_at,
          last_sign_in_at: authUser.last_sign_in_at
        });
      }
    }

    // Combine team members with user details and roles
    const team = teamMembers?.map(member => {
      const userDetail = userDetails.find(u => u.id === member.user_id);
      const role = Array.isArray(member.roles) ? member.roles[0] : member.roles;
      return {
        user_id: member.user_id,
        email: userDetail?.email || 'Unknown',
        full_name: userDetail?.full_name || null,
        avatar_url: userDetail?.avatar_url || null,
        role: role?.name || 'No Role',
        role_description: role?.description || '',
        joined_at: member.created_at,
        last_active: userDetail?.last_sign_in_at || null
      };
    }) || [];

    return NextResponse.json({ team });
  } catch (error: any) {
    console.error('Team list error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST - Invite team member
export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { email, role_name } = body;

    if (!email || !role_name) {
      return NextResponse.json(
        { error: 'Email and role are required' },
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

    // Get role ID
    const { data: role } = await supabase
      .from('roles')
      .select('id')
      .eq('name', role_name)
      .single();

    if (!role) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // TODO: In production, you would:
    // 1. Create invitation record in database
    // 2. Send invitation email
    // 3. User clicks link to accept
    // 4. Then create user_roles record

    return NextResponse.json({
      message: 'Invitation feature coming soon!',
      note: 'In production, this would send an email invitation'
    });
  } catch (error: any) {
    console.error('Team invite error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
