'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import {
  Bot,
  MessageSquare,
  FileText,
  TrendingUp,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Zap,
  Building2,
  Plus,
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface Workspace {
  id: string;
  name: string;
  slug: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkspaces();
    
    // Listen for storage events (when workspace created in another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'workspace_created') {
        fetchWorkspaces();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom event (when workspace created in same window)
    const handleWorkspaceUpdate = () => {
      fetchWorkspaces();
    };
    
    window.addEventListener('workspaceUpdated', handleWorkspaceUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('workspaceUpdated', handleWorkspaceUpdate);
    };
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch('/api/workspaces');
      if (response.ok) {
        const data = await response.json();
        const workspaceList = data.workspaces || [];
        setWorkspaces(workspaceList);
        
        // Get saved workspace ID from localStorage
        const savedWorkspaceId = localStorage.getItem('selectedWorkspaceId');
        
        if (workspaceList.length > 0) {
          // Use saved ID if exists and valid, otherwise use first
          const validWorkspace = workspaceList.find((w: Workspace) => w.id === savedWorkspaceId);
          const selectedId = validWorkspace ? savedWorkspaceId : workspaceList[0].id;
          setSelectedWorkspaceId(selectedId!);
        }
      }
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkspaceChange = (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
    
    // Save to localStorage
    localStorage.setItem('selectedWorkspaceId', workspaceId);
    
    // Refresh page to load new workspace data
    router.refresh();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/dashboard/chatbots', label: 'Chatbots', icon: Bot },
    { href: '/dashboard/knowledge', label: 'Knowledge Base', icon: FileText },
    { href: '/dashboard/conversations', label: 'Conversations', icon: MessageSquare },
    { href: '/dashboard/analytics', label: 'Analytics', icon: TrendingUp },
    { href: '/dashboard/team', label: 'Team', icon: Users },
    { href: '/dashboard/workspaces', label: 'Workspaces', icon: Building2 },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 h-screen sidebar p-6 sticky top-0 flex flex-col overflow-y-auto">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2 mb-8 group">
        <Bot className="w-8 h-8 text-purple-600 group-hover:rotate-12 transition-transform" />
        <span className="text-xl font-bold ai-gradient-text">Universal AI</span>
      </Link>

      {/* Workspace Selector */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-foreground/60">WORKSPACE</label>
          <Link 
            href="/dashboard/workspaces"
            className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            New
          </Link>
        </div>
        
        {loading ? (
          <div className="w-full px-3 py-2 rounded-lg glass-card border border-border text-sm text-center text-muted-foreground">
            Loading...
          </div>
        ) : workspaces.length === 0 ? (
          <Link href="/dashboard/workspaces">
            <div className="w-full px-3 py-2 rounded-lg glass-card border border-dashed border-purple-600/50 text-sm text-center text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors cursor-pointer">
              <Plus className="w-4 h-4 inline mr-1" />
              Create Workspace
            </div>
          </Link>
        ) : (
          <select 
            value={selectedWorkspaceId}
            onChange={(e) => handleWorkspaceChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg glass-card border border-border text-sm focus:border-purple-600 outline-none"
          >
            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium'
                  : 'hover:bg-accent'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/10 hover:text-red-600 transition-colors w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Upgrade CTA */}
      <div className="mt-4 glass-card p-4 rounded-xl bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-purple-600" />
          <span className="font-bold text-sm">Upgrade to Pro</span>
        </div>
        <p className="text-xs text-foreground/60 mb-3">
          Unlock unlimited messages and advanced features
        </p>
        <Button size="sm" className="w-full">
          Upgrade Now
        </Button>
      </div>
    </aside>
  );
}
