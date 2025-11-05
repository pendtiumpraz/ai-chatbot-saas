'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PlatformStats {
  totalUsers: number;
  totalWorkspaces: number;
  totalChatbots: number;
  activeChatbots: number;
  totalDocuments: number;
  totalConversations: number;
  totalRevenue: number;
  activeToday: number;
  growth: {
    newWorkspaces: number;
    newChatbots: number;
  };
}

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: string;
  user_id: string;
  ip_address: string;
  created_at: string;
  metadata: any;
}

interface AuditLog {
  id: string;
  action: string;
  user_id: string;
  resource_type: string;
  status: string;
  created_at: string;
}

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalWorkspaces: 0,
    totalChatbots: 0,
    activeChatbots: 0,
    totalDocuments: 0,
    totalConversations: 0,
    totalRevenue: 0,
    activeToday: 0,
    growth: {
      newWorkspaces: 0,
      newChatbots: 0
    }
  });
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/super-admin/stats');
      
      if (response.status === 403) {
        setError('Access denied - Super admin only');
        setTimeout(() => router.push('/dashboard'), 2000);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data.stats);
      setSecurityEvents(data.recentSecurityEvents || []);
      setAuditLogs(data.recentAuditLogs || []);
    } catch (err: any) {
      setError(err.message);
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Platform-wide monitoring and management</p>
          </div>
          <Link
            href="/dashboard/super-admin/users"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Manage Users
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          trend={`+${stats.growth.newWorkspaces} this month`}
          color="blue"
        />
        <StatCard
          title="Total Chatbots"
          value={stats.totalChatbots}
          subtitle={`${stats.activeChatbots} active`}
          icon="🤖"
          trend={`+${stats.growth.newChatbots} this month`}
          color="green"
        />
        <StatCard
          title="Total Conversations"
          value={stats.totalConversations}
          subtitle={`${stats.activeToday} today`}
          icon="💬"
          color="purple"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon="💰"
          color="yellow"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Workspaces</h3>
            <span className="text-2xl">📁</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalWorkspaces}</p>
          <p className="text-sm text-gray-500 mt-2">Active workspaces</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
            <span className="text-2xl">📄</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalDocuments}</p>
          <p className="text-sm text-gray-500 mt-2">Knowledge base documents</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Today</h3>
            <span className="text-2xl">⚡</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.activeToday}</p>
          <p className="text-sm text-gray-500 mt-2">Conversations today</p>
        </div>
      </div>

      {/* Security & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Security Events */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Security Events</h2>
              <Link
                href="/dashboard/super-admin/security"
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                View All →
              </Link>
            </div>
          </div>
          <div className="p-6">
            {securityEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent security events</p>
            ) : (
              <div className="space-y-4">
                {securityEvents.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded ${
                          event.severity === 'high' ? 'bg-red-100 text-red-700' :
                          event.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {event.severity}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {event.event_type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        IP: {event.ip_address} • {new Date(event.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <Link
                href="/dashboard/super-admin/activity"
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                View All →
              </Link>
            </div>
          </div>
          <div className="p-6">
            {auditLogs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            ) : (
              <div className="space-y-4">
                {auditLogs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        <span className="text-sm font-medium text-gray-900">
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {log.resource_type} • {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/super-admin/users"
            className="bg-white rounded-lg p-4 text-center hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">👥</div>
            <div className="text-sm font-medium text-gray-900">Manage Users</div>
          </Link>
          <Link
            href="/dashboard/super-admin/security"
            className="bg-white rounded-lg p-4 text-center hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">🔒</div>
            <div className="text-sm font-medium text-gray-900">Security</div>
          </Link>
          <Link
            href="/dashboard/super-admin/analytics"
            className="bg-white rounded-lg p-4 text-center hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium text-gray-900">Analytics</div>
          </Link>
          <button
            onClick={fetchStats}
            className="bg-white rounded-lg p-4 text-center hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">🔄</div>
            <div className="text-sm font-medium text-gray-900">Refresh</div>
          </button>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  trend?: string;
  color: 'blue' | 'green' | 'purple' | 'yellow';
}

function StatCard({ title, value, subtitle, icon, trend, color }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200',
    green: 'from-green-50 to-green-100 border-green-200',
    purple: 'from-purple-50 to-purple-100 border-purple-200',
    yellow: 'from-yellow-50 to-yellow-100 border-yellow-200'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-lg shadow-sm p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        {trend && (
          <p className="text-xs text-gray-500 mt-2">
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}
