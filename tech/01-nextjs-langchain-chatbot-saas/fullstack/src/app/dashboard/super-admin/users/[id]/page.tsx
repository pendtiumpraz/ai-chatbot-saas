'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface UserDetail {
  user: {
    id: string;
    name: string;
    slug: string;
    plan: string;
    created_at: string;
    updated_at: string;
    is_banned?: boolean;
    ban_reason?: string;
  };
  chatbots: any[];
  conversations: any[];
  creditAccount: any;
  transactions: any[];
  auditLogs: any[];
  securityEvents: any[];
}

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<UserDetail | null>(null);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserDetail();
    }
  }, [userId]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/super-admin/users/${userId}`);
      
      if (response.status === 403) {
        setError('Access denied - Super admin only');
        setTimeout(() => router.push('/dashboard'), 2000);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async (newPlan: string) => {
    if (!confirm(`Change user plan to ${newPlan}?`)) return;

    try {
      setUpdating(true);
      const response = await fetch(`/api/super-admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: newPlan })
      });

      if (!response.ok) {
        throw new Error('Failed to update plan');
      }

      alert('Plan updated successfully');
      fetchUserDetail();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleBanUser = async () => {
    if (!banReason.trim()) {
      alert('Please provide a ban reason');
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch(`/api/super-admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_banned: true,
          ban_reason: banReason
        })
      });

      if (!response.ok) {
        throw new Error('Failed to ban user');
      }

      alert('User banned successfully');
      setShowBanModal(false);
      fetchUserDetail();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleUnbanUser = async () => {
    if (!confirm('Unban this user?')) return;

    try {
      setUpdating(true);
      const response = await fetch(`/api/super-admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_banned: false,
          ban_reason: null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to unban user');
      }

      alert('User unbanned successfully');
      fetchUserDetail();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    const confirmed = prompt(
      'Type "DELETE" to confirm permanent deletion of this user and all their data:'
    );
    
    if (confirmed !== 'DELETE') return;

    try {
      setUpdating(true);
      const response = await fetch(`/api/super-admin/users/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      alert('User deleted successfully');
      router.push('/dashboard/super-admin/users');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Error</h3>
          <p className="text-red-600">{error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  const { user, chatbots, conversations, creditAccount, transactions, auditLogs, securityEvents } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/super-admin/users"
          className="text-purple-600 hover:text-purple-700 text-sm mb-2 inline-block"
        >
          ← Back to Users
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="mt-2 text-gray-600">@{user.slug}</p>
            {user.is_banned && (
              <div className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg inline-block">
                ⛔ BANNED: {user.ban_reason}
              </div>
            )}
          </div>
          <div className="flex gap-3">
            {user.is_banned ? (
              <button
                onClick={handleUnbanUser}
                disabled={updating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Unban User
              </button>
            ) : (
              <button
                onClick={() => setShowBanModal(true)}
                disabled={updating}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
              >
                Ban User
              </button>
            )}
            <button
              onClick={handleDeleteUser}
              disabled={updating}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Chatbots</div>
          <div className="text-3xl font-bold text-gray-900">{chatbots.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Conversations</div>
          <div className="text-3xl font-bold text-gray-900">{conversations.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Credit Balance</div>
          <div className="text-3xl font-bold text-gray-900">{creditAccount?.balance || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Member Since</div>
          <div className="text-lg font-semibold text-gray-900">
            {new Date(user.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Plan Management */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Plan Management</h2>
        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm text-gray-600">Current Plan:</span>
            <span className="ml-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {user.plan}
            </span>
          </div>
          <div className="flex gap-2">
            {['free', 'starter', 'pro', 'enterprise'].map((plan) => (
              <button
                key={plan}
                onClick={() => handleUpdatePlan(plan)}
                disabled={updating || user.plan === plan}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Change to {plan}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <TabButton active>Chatbots ({chatbots.length})</TabButton>
            <TabButton>Conversations ({conversations.length})</TabButton>
            <TabButton>Transactions ({transactions.length})</TabButton>
            <TabButton>Audit Logs ({auditLogs.length})</TabButton>
            <TabButton>Security ({securityEvents.length})</TabButton>
          </nav>
        </div>

        {/* Chatbots Tab */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chatbots</h3>
          {chatbots.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No chatbots</p>
          ) : (
            <div className="space-y-3">
              {chatbots.map((bot) => (
                <div key={bot.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{bot.name}</div>
                    <div className="text-sm text-gray-500">{bot.use_case}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 text-xs rounded ${
                      bot.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {bot.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(bot.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ban Modal */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Ban User</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for banning this user:
            </p>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Violation of terms, spam, abuse, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-4"
              rows={4}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowBanModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBanUser}
                disabled={updating || !banReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Ban User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button
      className={`px-6 py-3 text-sm font-medium border-b-2 ${
        active
          ? 'border-purple-600 text-purple-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {children}
    </button>
  );
}
