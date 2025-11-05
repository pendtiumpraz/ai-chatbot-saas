import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getCurrentUser, hasPermission } from '@/lib/rbac';

// GET /api/conversations - List conversations
export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chatbotId = req.nextUrl.searchParams.get('chatbotId');
    const search = req.nextUrl.searchParams.get('search');
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '50');
    const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0');

    // Build query (only non-deleted)
    let query = supabase
      .from('conversations')
      .select('*, chatbots!inner(name, workspace_id)')
      .eq('chatbots.workspace_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filters
    if (chatbotId) {
      query = query.eq('chatbot_id', chatbotId);
    }

    const { data: conversations, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      conversations,
      total: count || 0,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error('Conversations GET error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Create conversation (auto-created during chat)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatbotId, visitorId, messages, metadata } = body;

    if (!chatbotId || !visitorId) {
      return NextResponse.json(
        { error: 'chatbotId and visitorId required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert({
        chatbot_id: chatbotId,
        visitor_id: visitorId,
        messages: messages || [],
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error: any) {
    console.error('Conversation POST error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
