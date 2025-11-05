import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/rbac';

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's workspace
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', user.id)
      .is('deleted_at', null)
      .single();

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const workspaceId = workspace.id;

    // Count chatbots
    const { count: totalChatbots } = await supabase
      .from('chatbots')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .is('deleted_at', null);

    const { count: activeChatbots } = await supabase
      .from('chatbots')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .eq('is_active', true)
      .is('deleted_at', null);

    // Count documents
    const { data: chatbots } = await supabase
      .from('chatbots')
      .select('id')
      .eq('workspace_id', workspaceId)
      .is('deleted_at', null);

    const chatbotIds = chatbots?.map(c => c.id) || [];

    let totalDocuments = 0;
    if (chatbotIds.length > 0) {
      const { count } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .in('chatbot_id', chatbotIds)
        .is('deleted_at', null);
      totalDocuments = count || 0;
    }

    // Count conversations
    let totalConversations = 0;
    if (chatbotIds.length > 0) {
      const { count } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .in('chatbot_id', chatbotIds)
        .is('deleted_at', null);
      totalConversations = count || 0;
    }

    // Count today's messages (from conversations created today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let messagesToday = 0;
    if (chatbotIds.length > 0) {
      const { count } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .in('chatbot_id', chatbotIds)
        .gte('created_at', today.toISOString())
        .is('deleted_at', null);
      messagesToday = count || 0;
    }

    // Get credit balance
    const { data: creditAccount } = await supabase
      .from('credit_accounts')
      .select('balance')
      .eq('workspace_id', workspaceId)
      .single();

    const creditsBalance = creditAccount?.balance || 0;

    // Get recent activity (last 7 days of conversations)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let recentActivity: Array<{ date: string; conversations: number }> = [];
    if (chatbotIds.length > 0) {
      const { data: recentConversations } = await supabase
        .from('conversations')
        .select('created_at, chatbot_id')
        .in('chatbot_id', chatbotIds)
        .gte('created_at', sevenDaysAgo.toISOString())
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      // Group by date
      const activityByDate: Record<string, number> = {};
      recentConversations?.forEach(conv => {
        const date = new Date(conv.created_at).toISOString().split('T')[0];
        activityByDate[date] = (activityByDate[date] || 0) + 1;
      });

      recentActivity = Object.entries(activityByDate).map(([date, count]) => ({
        date,
        conversations: count
      }));
    }

    return NextResponse.json({
      stats: {
        totalChatbots: totalChatbots || 0,
        activeChatbots: activeChatbots || 0,
        totalDocuments,
        totalConversations,
        messagesToday,
        creditsBalance,
        recentActivity
      }
    });
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
