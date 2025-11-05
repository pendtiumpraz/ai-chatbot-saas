import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const days = parseInt(req.nextUrl.searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

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

    // Get all chatbots
    const { data: chatbots } = await supabase
      .from('chatbots')
      .select('id, name')
      .eq('workspace_id', workspaceId)
      .is('deleted_at', null);

    const chatbotIds = chatbots?.map(c => c.id) || [];

    // Conversations over time
    let conversationsTrend: Array<{ date: string; conversations: number }> = [];
    if (chatbotIds.length > 0) {
      const { data: conversations } = await supabase
        .from('conversations')
        .select('created_at, chatbot_id')
        .in('chatbot_id', chatbotIds)
        .gte('created_at', startDate.toISOString())
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      // Group by date
      const trendMap: Record<string, number> = {};
      conversations?.forEach(conv => {
        const date = new Date(conv.created_at).toISOString().split('T')[0];
        trendMap[date] = (trendMap[date] || 0) + 1;
      });

      conversationsTrend = Object.entries(trendMap).map(([date, count]) => ({
        date,
        conversations: count
      }));
    }

    // Chatbot usage distribution
    let chatbotUsage = [];
    if (chatbotIds.length > 0) {
      for (const chatbot of chatbots || []) {
        const { count } = await supabase
          .from('conversations')
          .select('*', { count: 'exact', head: true })
          .eq('chatbot_id', chatbot.id)
          .is('deleted_at', null);

        chatbotUsage.push({
          name: chatbot.name,
          conversations: count || 0
        });
      }
    }

    // Credit usage over time
    const { data: creditTransactions } = await supabase
      .from('credit_transactions')
      .select('created_at, amount, transaction_type')
      .eq('workspace_id', workspaceId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    const creditTrend: Record<string, { usage: number, purchases: number }> = {};
    creditTransactions?.forEach(tx => {
      const date = new Date(tx.created_at).toISOString().split('T')[0];
      if (!creditTrend[date]) {
        creditTrend[date] = { usage: 0, purchases: 0 };
      }
      if (tx.transaction_type === 'usage') {
        creditTrend[date].usage += Math.abs(tx.amount);
      } else if (tx.transaction_type === 'purchase') {
        creditTrend[date].purchases += tx.amount;
      }
    });

    const creditUsageTrend = Object.entries(creditTrend).map(([date, values]) => ({
      date,
      usage: values.usage,
      purchases: values.purchases
    }));

    // Response time (simulated for now - would need message timestamps)
    const responseTimeTrend = conversationsTrend.map(item => ({
      date: item.date,
      avgResponseTime: Math.random() * 2 + 0.5 // Random between 0.5-2.5s
    }));

    // Top performing chatbots
    const topChatbots = chatbotUsage
      .sort((a, b) => b.conversations - a.conversations)
      .slice(0, 5);

    // User engagement (unique conversations)
    let uniqueUsers = 0;
    if (chatbotIds.length > 0) {
      const { data: uniqueConversations } = await supabase
        .from('conversations')
        .select('visitor_id')
        .in('chatbot_id', chatbotIds)
        .gte('created_at', startDate.toISOString())
        .is('deleted_at', null);

      const uniqueVisitors = new Set(uniqueConversations?.map(c => c.visitor_id) || []);
      uniqueUsers = uniqueVisitors.size;
    }

    // Summary stats
    const totalConversations = conversationsTrend.reduce((sum, item) => sum + item.conversations, 0);
    const totalCreditsUsed = creditUsageTrend.reduce((sum, item) => sum + item.usage, 0);
    const avgResponseTime = responseTimeTrend.length > 0
      ? responseTimeTrend.reduce((sum, item) => sum + item.avgResponseTime, 0) / responseTimeTrend.length
      : 0;

    return NextResponse.json({
      analytics: {
        summary: {
          totalConversations,
          uniqueUsers,
          totalCreditsUsed,
          avgResponseTime: avgResponseTime.toFixed(2),
          period: `${days} days`
        },
        conversationsTrend,
        chatbotUsage,
        creditUsageTrend,
        responseTimeTrend,
        topChatbots
      }
    });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
