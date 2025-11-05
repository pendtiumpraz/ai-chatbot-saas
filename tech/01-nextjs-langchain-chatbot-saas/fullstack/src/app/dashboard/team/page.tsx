'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, UserPlus, Shield, Trash2, Clock } from 'lucide-react';

export default function TeamPage() {
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<any[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('workspace_member');

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/team');
      const data = await response.json();
      
      if (data.team) {
        setTeam(data.team);
      }
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) {
      alert('Please enter an email');
      return;
    }

    try {
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          role_name: inviteRole
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(data.message || 'Invitation sent!');
        setShowInviteModal(false);
        setInviteEmail('');
        fetchTeam();
      } else {
        alert(data.error || 'Failed to send invitation');
      }
    } catch (error) {
      alert('Error sending invitation');
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) {
      return;
    }

    try {
      const response = await fetch(`/api/team/${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Team member removed');
        fetchTeam();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to remove member');
      }
    } catch (error) {
      alert('Error removing member');
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/team/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role_name: newRole })
      });

      if (response.ok) {
        alert('Role updated successfully');
        fetchTeam();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update role');
      }
    } catch (error) {
      alert('Error updating role');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'workspace_owner': return 'bg-purple-100 text-purple-700';
      case 'workspace_admin': return 'bg-blue-100 text-blue-700';
      case 'workspace_member': return 'bg-green-100 text-green-700';
      case 'workspace_viewer': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold mb-2">Team Management</h1>
            <p className="text-muted-foreground">Manage team members and their permissions</p>
          </div>
          <button 
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Invite Member
          </button>
        </div>

        {/* Team Members List */}
        <div className="glass-card rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Team Members ({team.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {team.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <div className="text-4xl mb-2">👥</div>
                <p>No team members yet</p>
              </div>
            ) : (
              team.map((member) => (
                <div key={member.user_id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                        {member.full_name 
                          ? member.full_name.charAt(0).toUpperCase()
                          : member.email.charAt(0).toUpperCase()
                        }
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {member.full_name || 'No name'}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {member.email}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                            {member.role.replace('workspace_', '')}
                          </span>
                          {member.last_active && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Last active {new Date(member.last_active).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <select
                        value={member.role}
                        onChange={(e) => handleChangeRole(member.user_id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="workspace_owner">Owner</option>
                        <option value="workspace_admin">Admin</option>
                        <option value="workspace_member">Member</option>
                        <option value="workspace_viewer">Viewer</option>
                      </select>
                      <button
                        onClick={() => handleRemove(member.user_id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Roles Info */}
        <div className="mt-6 glass-card rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Roles & Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-purple-500/30 rounded-lg p-4 bg-purple-500/10 dark:bg-purple-500/5">
              <div className="font-semibold text-purple-600 dark:text-purple-400 mb-1">Workspace Owner</div>
              <p className="text-xs text-purple-600/80 dark:text-purple-400/80">Full access to everything including billing</p>
            </div>
            <div className="border border-blue-500/30 rounded-lg p-4 bg-blue-500/10 dark:bg-blue-500/5">
              <div className="font-semibold text-blue-600 dark:text-blue-400 mb-1">Workspace Admin</div>
              <p className="text-xs text-blue-600/80 dark:text-blue-400/80">Manage chatbots, documents, and team members</p>
            </div>
            <div className="border border-green-500/30 rounded-lg p-4 bg-green-500/10 dark:bg-green-500/5">
              <div className="font-semibold text-green-600 dark:text-green-400 mb-1">Workspace Member</div>
              <p className="text-xs text-green-600/80 dark:text-green-400/80">Create and use chatbots, view conversations</p>
            </div>
            <div className="border border-border rounded-lg p-4 bg-accent">
              <div className="font-semibold mb-1">Workspace Viewer</div>
              <p className="text-xs text-muted-foreground">Read-only access, cannot make changes</p>
            </div>
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-card rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Invite Team Member</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="workspace_member">Member</option>
                    <option value="workspace_admin">Admin</option>
                    <option value="workspace_viewer">Viewer</option>
                  </select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    💡 Email invitation feature is under development. In production, this will send an invitation email.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
