import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getCurrentUser, isSuperAdmin } from '@/lib/rbac';

// GET /api/super-admin/stats - Platform-wide statistics (super admin only)
export async function GET() {
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

    // Count all users (from workspaces table as proxy)
    const { count: totalUsers } = await supabase
      .from('workspaces')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null);

    // Count all workspaces
    const { count: totalWorkspaces } = await supabase
      .from('workspaces')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null);

    // Count all chatbots
    const { count: totalChatbots } = await supabase
      .from('chatbots')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null);

    const { count: activeChatbots } = await supabase
      .from('chatbots')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .is('deleted_at', null);

    // Count all documents
    const { count: totalDocuments } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null);

    // Count all conversations
    const { count: totalConversations } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null);

    // Calculate total revenue from credit transactions
    const { data: transactions } = await supabase
      .from('credit_transactions')
      .select('amount, transaction_type')
      .eq('transaction_type', 'purchase');

    const totalRevenue = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

    // Count active users today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count: activeToday } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())
      .is('deleted_at', null);

    // Get recent security events
    const { data: recentSecurityEvents } = await supabase
      .from('security_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    // Get recent audit logs
    const { data: recentAuditLogs } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    // Growth metrics (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: newWorkspaces } = await supabase
      .from('workspaces')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString())
      .is('deleted_at', null);

    const { count: newChatbots } = await supabase
      .from('chatbots')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString())
      .is('deleted_at', null);

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        totalWorkspaces: totalWorkspaces || 0,
        totalChatbots: totalChatbots || 0,
        activeChatbots: activeChatbots || 0,
        totalDocuments: totalDocuments || 0,
        totalConversations: totalConversations || 0,
        totalRevenue,
        activeToday: activeToday || 0,
        growth: {
          newWorkspaces: newWorkspaces || 0,
          newChatbots: newChatbots || 0
        }
      },
      recentSecurityEvents: recentSecurityEvents || [],
      recentAuditLogs: recentAuditLogs || []
    });
  } catch (error: any) {
    console.error('Super admin stats error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
