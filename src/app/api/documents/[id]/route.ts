import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getCurrentUser, hasPermission } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

// GET /api/documents/:id - Get document details
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

    // Get document (only non-deleted)
    const { data: document, error } = await supabase
      .from('documents')
      .select('*, chatbots(workspace_id)')
      .eq('id', params.id)
      .is('deleted_at', null)
      .single();

    if (error || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check permission
    const canRead = await hasPermission(user.id, 'document.read', {
      workspaceId: document.chatbots.workspace_id
    });

    if (!canRead) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ document });
  } catch (error: any) {
    console.error('Document GET error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/documents/:id - Update document metadata
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

    const body = await req.json();
    const { filename, status } = body;

    // Get existing document
    const { data: oldDocument } = await supabase
      .from('documents')
      .select('*, chatbots(workspace_id)')
      .eq('id', params.id)
      .is('deleted_at', null)
      .single();

    if (!oldDocument) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check permission
    const canUpdate = await hasPermission(user.id, 'document.update', {
      workspaceId: oldDocument.chatbots.workspace_id
    });

    if (!canUpdate) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateData: any = { updated_at: new Date().toISOString() };
    if (filename !== undefined) updateData.filename = filename;
    if (status !== undefined) updateData.status = status;

    const { data: document, error } = await supabase
      .from('documents')
      .update(updateData)
      .eq('id', params.id)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      await logAudit({
        userId: user.id,
        workspaceId: oldDocument.chatbots.workspace_id,
        action: 'update_document',
        resourceType: 'document',
        resourceId: params.id,
        status: 'failed',
        errorMessage: error.message
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log success
    await logAudit({
      userId: user.id,
      workspaceId: document.chatbots.workspace_id,
      action: 'update_document',
      resourceType: 'document',
      resourceId: document.id,
      oldValues: oldDocument,
      newValues: document,
      status: 'success'
    });

    return NextResponse.json({ document });
  } catch (error: any) {
    console.error('Document PUT error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/:id - Soft delete document
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

    // Get document to verify ownership
    const { data: document } = await supabase
      .from('documents')
      .select('*, chatbots(workspace_id)')
      .eq('id', params.id)
      .is('deleted_at', null)
      .single();

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check permission
    const canDelete = await hasPermission(user.id, 'document.delete', {
      workspaceId: document.chatbots.workspace_id
    });

    if (!canDelete) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // SOFT DELETE (don't actually delete file yet)
    const { error } = await supabase
      .from('documents')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user.id
      })
      .eq('id', params.id);

    if (error) {
      await logAudit({
        userId: user.id,
        workspaceId: document.chatbots.workspace_id,
        action: 'delete_document',
        resourceType: 'document',
        resourceId: params.id,
        status: 'failed',
        errorMessage: error.message
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log successful delete
    await logAudit({
      userId: user.id,
      workspaceId: document.chatbots.workspace_id,
      action: 'delete_document',
      resourceType: 'document',
      resourceId: document.id,
      oldValues: document,
      status: 'success'
    });

    // TODO: Delete from Pinecone as well (in background job)
    // TODO: Actually delete file from storage after 30 days (cleanup job)

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Document DELETE error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
