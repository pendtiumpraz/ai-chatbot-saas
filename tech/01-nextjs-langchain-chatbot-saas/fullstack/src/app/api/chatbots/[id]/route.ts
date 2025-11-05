import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getCurrentUser, hasPermission } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

// GET /api/chatbots/:id - Get chatbot by ID with stats
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get chatbot (only non-deleted)
    const { data: chatbot, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', params.id)
      .is('deleted_at', null)
      .single();

    if (error || !chatbot) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });
    }

    // Check permission
    const canRead = await hasPermission(user.id, 'chatbot.read', { 
      workspaceId: chatbot.workspace_id 
    });
    
    if (!canRead) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get stats (only non-deleted)
    const { count: documentsCount } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('chatbot_id', params.id)
      .is('deleted_at', null);

    const { count: conversationsCount } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('chatbot_id', params.id)
      .is('deleted_at', null);

    return NextResponse.json({
      chatbot: {
        ...chatbot,
        stats: {
          documents: documentsCount || 0,
          conversations: conversationsCount || 0,
        }
      }
    });
  } catch (error: any) {
    console.error('Chatbot GET error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/chatbots/:id - Update chatbot
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get existing chatbot (for audit logging)
    const { data: oldChatbot, error: fetchError } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', params.id)
      .is('deleted_at', null)
      .maybeSingle();

    if (fetchError) {
      console.error('Fetch chatbot error:', fetchError);
      return NextResponse.json({ error: `Database error: ${fetchError.message}` }, { status: 500 });
    }

    if (!oldChatbot) {
      return NextResponse.json({ error: 'Chatbot not found or already deleted' }, { status: 404 });
    }

    // Check permission
    const canUpdate = await hasPermission(user.id, 'chatbot.update', {
      workspaceId: oldChatbot.workspace_id
    });

    if (!canUpdate) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      description,
      systemPrompt,
      model,
      temperature,
      maxTokens,
      useCase,
      isActive,
      widgetSettings,
    } = body;

    // Build update object (only include provided fields)
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (systemPrompt !== undefined) updateData.system_prompt = systemPrompt;
    if (model !== undefined) updateData.model = model;
    if (temperature !== undefined) updateData.temperature = temperature;
    if (maxTokens !== undefined) updateData.max_tokens = maxTokens;
    if (useCase !== undefined) updateData.use_case = useCase;
    if (isActive !== undefined) updateData.is_active = isActive;
    if (widgetSettings !== undefined) updateData.widget_settings = widgetSettings;
    
    updateData.updated_at = new Date().toISOString();

    // Update chatbot
    const { data: chatbot, error } = await supabase
      .from('chatbots')
      .update(updateData)
      .eq('id', params.id)
      .is('deleted_at', null)
      .select()
      .maybeSingle();

    if (error) {
      // Log failed update
      await logAudit({
        userId: user.id,
        workspaceId: oldChatbot.workspace_id,
        action: 'update_chatbot',
        resourceType: 'chatbot',
        resourceId: params.id,
        status: 'failed',
        errorMessage: error.message
      });
      
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!chatbot) {
      return NextResponse.json({ error: 'Chatbot not found or already deleted' }, { status: 404 });
    }

    // Log successful update
    await logAudit({
      userId: user.id,
      workspaceId: chatbot.workspace_id,
      action: 'update_chatbot',
      resourceType: 'chatbot',
      resourceId: chatbot.id,
      oldValues: oldChatbot,
      newValues: chatbot,
      status: 'success'
    });

    return NextResponse.json({ chatbot });
  } catch (error: any) {
    console.error('Chatbot PUT error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/chatbots/:id - Soft delete chatbot
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get chatbot (before deletion, for audit log)
    const { data: chatbot, error: fetchError } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', params.id)
      .is('deleted_at', null)
      .single();

    if (fetchError || !chatbot) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });
    }

    // Check permission
    const canDelete = await hasPermission(user.id, 'chatbot.delete', {
      workspaceId: chatbot.workspace_id
    });

    if (!canDelete) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // SOFT DELETE: Update deleted_at and deleted_by
    const { error } = await supabase
      .from('chatbots')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user.id
      })
      .eq('id', params.id);

    if (error) {
      // Log failed delete
      await logAudit({
        userId: user.id,
        workspaceId: chatbot.workspace_id,
        action: 'delete_chatbot',
        resourceType: 'chatbot',
        resourceId: params.id,
        status: 'failed',
        errorMessage: error.message
      });
      
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log successful soft delete
    await logAudit({
      userId: user.id,
      workspaceId: chatbot.workspace_id,
      action: 'delete_chatbot',
      resourceType: 'chatbot',
      resourceId: chatbot.id,
      oldValues: chatbot,
      status: 'success'
    });

    return NextResponse.json({ success: true, message: 'Chatbot deleted successfully' });
  } catch (error: any) {
    console.error('Chatbot DELETE error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
