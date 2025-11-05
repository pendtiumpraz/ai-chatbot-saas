import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getCurrentUser, hasPermission } from '@/lib/rbac';

// GET /api/documents - List documents
export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chatbotId = req.nextUrl.searchParams.get('chatbotId');
    const status = req.nextUrl.searchParams.get('status');
    const search = req.nextUrl.searchParams.get('search');

    if (!chatbotId) {
      return NextResponse.json(
        { error: 'chatbotId required' },
        { status: 400 }
      );
    }

    // Get chatbot (only non-deleted)
    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('workspace_id')
      .eq('id', chatbotId)
      .is('deleted_at', null)
      .single();

    if (!chatbot) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });
    }

    // Check permission
    const canRead = await hasPermission(user.id, 'document.read', {
      workspaceId: chatbot.workspace_id
    });

    if (!canRead) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let query = supabase
      .from('documents')
      .select('*')
      .eq('chatbot_id', chatbotId)
      .is('deleted_at', null) // Only non-deleted
      .order('created_at', { ascending: false });

    // Filters
    if (status) {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.ilike('filename', `%${search}%`);
    }

    const { data: documents, error } = await query;

    if (error) throw error;

    // Calculate totals
    const totalSize = documents?.reduce((sum, doc) => sum + (doc.file_size || 0), 0) || 0;
    const totalChunks = documents?.reduce((sum, doc) => sum + (doc.chunk_count || 0), 0) || 0;

    return NextResponse.json({
      documents,
      total: documents?.length || 0,
      totalSize,
      totalChunks,
    });
  } catch (error: any) {
    console.error('Documents GET error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
