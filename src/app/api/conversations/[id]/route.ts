import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getCurrentUser, hasPermission } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

// GET /api/conversations/:id - Get conversation with full messages
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

    // Get conversation (only non-deleted)
    const { data: conversation, error } = await supabase
      .from('conversations')
      .select('*, chatbots(name, workspace_id)')
      .eq('id', params.id)
      .is('deleted_at', null)
      .single();

    if (error || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Check permission
    const canRead = await hasPermission(user.id, 'conversation.read', {
      workspaceId: conversation.chatbots.workspace_id
    });

    if (!canRead) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ conversation });
  } catch (error: any) {
    console.error('Conversation GET error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/conversations/:id - Update conversation (add notes, tags, etc.)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { messages, metadata } = body;

    // Get conversation to verify ownership
    const { data: existingConv } = await supabase
      .from('conversations')
      .select('*, chatbots(workspace_id)')
      .eq('id', params.id)
      .single();

    if (!existingConv || existingConv.chatbots.workspace_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };
    
    if (messages !== undefined) updateData.messages = messages;
    if (metadata !== undefined) updateData.metadata = metadata;

    const { data: conversation, error } = await supabase
      .from('conversations')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ conversation });
  } catch (error: any) {
    console.error('Conversation PUT error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/conversations/:id - Soft delete conversation
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

    // Get conversation to verify ownership
    const { data: conversation } = await supabase
      .from('conversations')
      .select('*, chatbots(workspace_id)')
      .eq('id', params.id)
      .is('deleted_at', null)
      .single();

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Check permission
    const canDelete = await hasPermission(user.id, 'conversation.delete', {
      workspaceId: conversation.chatbots.workspace_id
    });

    if (!canDelete) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // SOFT DELETE
    const { error } = await supabase
      .from('conversations')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user.id
      })
      .eq('id', params.id);

    if (error) {
      await logAudit({
        userId: user.id,
        workspaceId: conversation.chatbots.workspace_id,
        action: 'delete_conversation',
        resourceType: 'conversation',
        resourceId: params.id,
        status: 'failed',
        errorMessage: error.message
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log success
    await logAudit({
      userId: user.id,
      workspaceId: conversation.chatbots.workspace_id,
      action: 'delete_conversation',
      resourceType: 'conversation',
      resourceId: conversation.id,
      oldValues: conversation,
      status: 'success'
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Conversation DELETE error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
