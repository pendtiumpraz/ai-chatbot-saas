import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getCurrentUser, isSuperAdmin } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

// GET /api/super-admin/users/:id - Get user details (super admin only)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await isSuperAdmin(user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Super admin only' }, { status: 403 });
    }

    // Get workspace (user)
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!workspace) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get chatbots
    const { data: chatbots } = await supabase
      .from('chatbots')
      .select('*')
      .eq('workspace_id', params.id)
      .is('deleted_at', null);

    // Get conversations
    const chatbotIds = chatbots?.map(c => c.id) || [];
    let conversations = [];
    if (chatbotIds.length > 0) {
      const { data } = await supabase
        .from('conversations')
        .select('*')
        .in('chatbot_id', chatbotIds)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(50);
      conversations = data || [];
    }

    // Get credit account
    const { data: creditAccount } = await supabase
      .from('credit_accounts')
      .select('*')
      .eq('workspace_id', params.id)
      .single();

    // Get recent transactions
    const { data: transactions } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('workspace_id', params.id)
      .order('created_at', { ascending: false })
      .limit(20);

    // Get audit logs
    const { data: auditLogs } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', params.id)
      .order('created_at', { ascending: false })
      .limit(50);

    // Get security events
    const { data: securityEvents } = await supabase
      .from('security_events')
      .select('*')
      .eq('user_id', params.id)
      .order('created_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      user: workspace,
      chatbots: chatbots || [],
      conversations,
      creditAccount,
      transactions: transactions || [],
      auditLogs: auditLogs || [],
      securityEvents: securityEvents || []
    });
  } catch (error: any) {
    console.error('Super admin user detail error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/super-admin/users/:id - Update user (super admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await isSuperAdmin(user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Super admin only' }, { status: 403 });
    }

    const body = await req.json();
    const { plan, is_banned, ban_reason } = body;

    // Get old workspace
    const { data: oldWorkspace } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!oldWorkspace) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update workspace
    const updateData: any = { updated_at: new Date().toISOString() };
    if (plan !== undefined) updateData.plan = plan;
    if (is_banned !== undefined) updateData.is_banned = is_banned;
    if (ban_reason !== undefined) updateData.ban_reason = ban_reason;

    const { data: workspace, error } = await supabase
      .from('workspaces')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      await logAudit({
        userId: user.id,
        workspaceId: params.id,
        action: 'update_workspace',
        resourceType: 'workspace',
        resourceId: params.id,
        status: 'failed',
        errorMessage: error.message
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log action
    await logAudit({
      userId: user.id,
      workspaceId: params.id,
      action: 'update_workspace',
      resourceType: 'workspace',
      resourceId: workspace.id,
      oldValues: oldWorkspace,
      newValues: workspace,
      status: 'success'
    });

    return NextResponse.json({ user: workspace });
  } catch (error: any) {
    console.error('Super admin user update error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/super-admin/users/:id - Ban/delete user (super admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await isSuperAdmin(user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Super admin only' }, { status: 403 });
    }

    // Get workspace
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!workspace) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Soft delete workspace
    const { error } = await supabase
      .from('workspaces')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user.id
      })
      .eq('id', params.id);

    if (error) {
      await logAudit({
        userId: user.id,
        workspaceId: params.id,
        action: 'delete_workspace',
        resourceType: 'workspace',
        resourceId: params.id,
        status: 'failed',
        errorMessage: error.message
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log action
    await logAudit({
      userId: user.id,
      workspaceId: params.id,
      action: 'delete_workspace',
      resourceType: 'workspace',
      resourceId: workspace.id,
      oldValues: workspace,
      status: 'success'
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Super admin user delete error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
