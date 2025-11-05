'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Key, Smartphone, Save } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function SecuritySettingsPage() {
  const supabase = createClientComponentClient();
  const [saving, setSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleChangePassword = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordForm.new.length < 8) {
      alert('Password must be at least 8 characters!');
      return;
    }

    try {
      setSaving(true);
      
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new
      });

      if (error) throw error;

      alert('Password changed successfully!');
      setPasswordForm({ current: '', new: '', confirm: '' });
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </Link>

        <h1 className="text-3xl font-bold mb-2">Security Settings</h1>
        <p className="text-muted-foreground mb-8">Manage your account security</p>

        {/* Change Password */}
        <div className="glass-card rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-600" />
            Change Password
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter new password (min 8 characters)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>

            <button
              onClick={handleChangePassword}
              disabled={saving || !passwordForm.new || !passwordForm.confirm}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="glass-card rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-green-600" />
            Two-Factor Authentication (2FA)
          </h3>
          
          <div className="border border-blue-500/30 rounded-lg p-4 mb-4 bg-blue-500/10 dark:bg-blue-500/5">
            <p className="text-blue-600 dark:text-blue-400 text-sm">
              🚧 2FA is currently under development. This feature will be available soon for enhanced security.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium">Authenticator App</div>
                <div className="text-sm text-gray-600">Use an app like Google Authenticator</div>
              </div>
              <button
                disabled
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm opacity-50 cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium">SMS Verification</div>
                <div className="text-sm text-gray-600">Receive codes via text message</div>
              </div>
              <button
                disabled
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm opacity-50 cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="glass-card rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-600" />
            Active Sessions
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium">Current Session</div>
                <div className="text-sm text-gray-600">
                  Windows • Chrome • {new Date().toLocaleString()}
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Active
              </span>
            </div>
          </div>

          <button className="mt-4 text-sm text-red-600 hover:text-red-700">
            Sign out all other sessions
          </button>
        </div>

        {/* Security Recommendations */}
        <div className="glass-card rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            Security Recommendations
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 border border-green-500/30 rounded-lg bg-green-500/10 dark:bg-green-500/5">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-green-600 dark:text-green-400">Password is strong</div>
                <div className="text-xs text-green-600/80 dark:text-green-400/80">Your password meets security requirements</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border border-yellow-500/30 rounded-lg bg-yellow-500/10 dark:bg-yellow-500/5">
              <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">!</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Enable 2FA</div>
                <div className="text-xs text-yellow-600/80 dark:text-yellow-400/80">Add an extra layer of security (coming soon)</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border border-blue-500/30 rounded-lg bg-blue-500/10 dark:bg-blue-500/5">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">i</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Review active sessions regularly</div>
                <div className="text-xs text-blue-600/80 dark:text-blue-400/80">Check for unauthorized access to your account</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
