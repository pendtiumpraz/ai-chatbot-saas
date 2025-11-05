import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getCurrentUser, isSuperAdmin } from '@/lib/rbac';

// GET /api/super-admin/users - List all users (super admin only)
export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if super admin
    const isAdmin = await isSuperAdmin(user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Super admin only' }, { status: 403 });
    }

    const search = req.nextUrl.searchParams.get('search');
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '50');
    const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0');

    // Get all workspaces with user info
    let query = supabase
      .from('workspaces')
      .select(`
        id,
        name,
        slug,
        plan,
        created_at,
        updated_at,
        deleted_at
      `)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
    }

    const { data: workspaces, error, count } = await query;

    if (error) throw error;

    // Enrich with stats
    const enrichedUsers = await Promise.all(
      (workspaces || []).map(async (workspace) => {
        // Count chatbots
        const { count: chatbots } = await supabase
          .from('chatbots')
          .select('*', { count: 'exact', head: true })
          .eq('workspace_id', workspace.id)
          .is('deleted_at', null);

        // Count conversations
        const { data: userChatbots } = await supabase
          .from('chatbots')
          .select('id')
          .eq('workspace_id', workspace.id)
          .is('deleted_at', null);

        const chatbotIds = userChatbots?.map(c => c.id) || [];
        let conversations = 0;
        if (chatbotIds.length > 0) {
          const { count } = await supabase
            .from('conversations')
            .select('*', { count: 'exact', head: true })
            .in('chatbot_id', chatbotIds)
            .is('deleted_at', null);
          conversations = count || 0;
        }

        // Get credit balance
        const { data: creditAccount } = await supabase
          .from('credit_accounts')
          .select('balance')
          .eq('workspace_id', workspace.id)
          .single();

        return {
          ...workspace,
          stats: {
            chatbots: chatbots || 0,
            conversations,
            credits: creditAccount?.balance || 0
          }
        };
      })
    );

    return NextResponse.json({
      users: enrichedUsers,
      total: count || 0,
      limit,
      offset
    });
  } catch (error: any) {
    console.error('Super admin users error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
