'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Users, CreditCard, Clock, BarChart3, Calendar } from 'lucide-react';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?days=${period}`);
      const data = await response.json();
      
      if (data.analytics) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const summary = analytics?.summary || {};

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track your chatbot performance and usage</p>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <select
              value={period}
              onChange={(e) => setPeriod(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last year</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Conversations</h3>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold">
              {summary.totalConversations?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">in {summary.period}</p>
          </div>

          <div className="glass-card rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Unique Users</h3>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold">
              {summary.uniqueUsers?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">visitors engaged</p>
          </div>

          <div className="glass-card rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Credits Used</h3>
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold">
              {summary.totalCreditsUsed?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">credits consumed</p>
          </div>

          <div className="glass-card rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Avg Response Time</h3>
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold">
              {summary.avgResponseTime || '0'}s
            </div>
            <p className="text-xs text-muted-foreground mt-1">average speed</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Conversations Trend */}
          <div className="glass-card rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Conversations Over Time
            </h3>
            <div className="space-y-2">
              {analytics?.conversationsTrend?.slice(-10).map((item: any) => (
                <div key={item.date} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-accent rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (item.conversations / 10) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{item.conversations}</span>
                  </div>
                </div>
              ))}
            </div>
            {(!analytics?.conversationsTrend || analytics.conversationsTrend.length === 0) && (
              <p className="text-center text-muted-foreground py-8">No conversation data yet</p>
            )}
          </div>

          {/* Chatbot Usage */}
          <div className="glass-card rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Chatbot Usage Distribution
            </h3>
            <div className="space-y-2">
              {analytics?.chatbotUsage?.map((item: any) => {
                const total = analytics.chatbotUsage.reduce((sum: number, c: any) => sum + c.conversations, 0);
                const percentage = total > 0 ? (item.conversations / total) * 100 : 0;
                return (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground truncate flex-1">{item.name}</span>
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-full bg-accent rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{item.conversations}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {(!analytics?.chatbotUsage || analytics.chatbotUsage.length === 0) && (
              <p className="text-center text-muted-foreground py-8">No chatbots yet</p>
            )}
          </div>
        </div>

        {/* Top Performers */}
        <div className="glass-card rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">🏆 Top Performing Chatbots</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {analytics?.topChatbots?.map((chatbot: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                </div>
                <div className="font-medium text-sm truncate">{chatbot.name}</div>
                <div className="text-2xl font-bold text-purple-600 mt-2">
                  {chatbot.conversations}
                </div>
                <div className="text-xs text-muted-foreground">conversations</div>
              </div>
            ))}
          </div>
          {(!analytics?.topChatbots || analytics.topChatbots.length === 0) && (
            <p className="text-center text-muted-foreground py-8">No data available yet</p>
          )}
        </div>

        {/* Note about charts */}
        <div className="mt-6 glass-card border border-blue-500/30 rounded-lg p-4 bg-blue-500/10 dark:bg-blue-500/5">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            💡 <strong>Note:</strong> For advanced visualizations with line charts and pie charts, 
            install recharts library: <code className="bg-blue-500/20 px-2 py-1 rounded">npm install recharts</code>
          </p>
        </div>
      </div>
    </div>
  );
}
