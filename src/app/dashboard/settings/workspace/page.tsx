'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building, Globe, Save, Trash2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function WorkspaceSettingsPage() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workspace, setWorkspace] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    industry: '',
    website: '',
    description: ''
  });

  useEffect(() => {
    fetchWorkspace();
  }, []);

  const fetchWorkspace = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', user.id)
        .is('deleted_at', null)
        .single();

      if (data) {
        setWorkspace(data);
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          industry: data.industry || '',
          website: data.website || '',
          description: data.description || ''
        });
      }
    } catch (error) {
      console.error('Error fetching workspace:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('workspaces')
        .update({
          name: formData.name,
          slug: formData.slug,
          industry: formData.industry,
          website: formData.website,
          description: formData.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', workspace.id);

      if (error) throw error;

      alert('Workspace updated successfully!');
      fetchWorkspace();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = prompt(
      'Type "DELETE" to permanently delete this workspace and all its data:'
    );
    
    if (confirmed !== 'DELETE') return;

    try {
      // Soft delete
      const { error } = await supabase
        .from('workspaces')
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: workspace.id
        })
        .eq('id', workspace.id);

      if (error) throw error;

      alert('Workspace deleted. Logging out...');
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (error: any) {
      alert(`Error: ${error.message}`);
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
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </Link>

        <h1 className="text-3xl font-bold mb-2">Workspace Settings</h1>
        <p className="text-muted-foreground mb-8">Manage your workspace information</p>

        <div className="glass-card rounded-lg p-6 space-y-6">
          {/* Workspace Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Building className="w-4 h-4 inline mr-2" />
              Workspace Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="My Company"
            />
          </div>

          {/* Workspace Slug */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Workspace Slug
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                yourapp.com/
              </span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="my-company"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Used in URLs and public links</p>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Industry
            </label>
            <select
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select Industry</option>
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
              <option value="retail">Retail</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="services">Services</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Globe className="w-4 h-4 inline mr-2" />
              Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="What does your workspace do?"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-card rounded-lg mt-6 p-6 border-2 border-red-500/30 bg-red-500/5">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Once you delete a workspace, there is no going back. All chatbots, documents, and conversations will be deleted.
          </p>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
