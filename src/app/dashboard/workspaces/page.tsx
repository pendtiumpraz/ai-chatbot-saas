'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Building2, 
  Plus, 
  Trash2, 
  Users, 
  Crown,
  Settings,
  MoreVertical,
  Edit,
  Check,
} from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface Workspace {
  id: string
  name: string
  slug: string
  plan: string
  message_quota: number
  message_used: number
  created_at: string
}

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    industry: '',
  })
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>('')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    fetchWorkspaces()
    getCurrentWorkspace()
  }, [])

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch('/api/workspaces')
      if (response.ok) {
        const data = await response.json()
        setWorkspaces(data.workspaces || [])
      }
    } catch (error) {
      console.error('Failed to fetch workspaces:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentWorkspace = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setCurrentWorkspaceId(user.id)
    }
  }

  const handleCreateWorkspace = async () => {
    if (!newWorkspace.name) {
      alert('Workspace name is required')
      return
    }

    try {
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWorkspace),
      })

      const data = await response.json()
      
      if (response.ok) {
        setWorkspaces([...workspaces, data.workspace])
        setShowCreateModal(false)
        setNewWorkspace({ name: '', industry: '' })
        
        // Trigger event to update sidebar
        window.dispatchEvent(new Event('workspaceUpdated'))
        
        alert('✅ Workspace created successfully!')
      } else {
        console.error('Create workspace error:', data)
        alert(`❌ Error: ${data.error || 'Failed to create workspace'}\n\nStatus: ${response.status}`)
      }
    } catch (error) {
      console.error('Failed to create workspace:', error)
      alert('❌ Network error: Failed to create workspace')
    }
  }

  const handleDeleteWorkspace = async (workspaceId: string, workspaceName: string) => {
    const confirmMessage = `⚠️ Delete "${workspaceName}"?\n\n` +
      `This will SOFT DELETE:\n` +
      `• All chatbots\n` +
      `• All documents\n` +
      `• All conversations\n` +
      `• All API keys\n\n` +
      `Data can be recovered within 30 days.\n` +
      `Continue?`

    if (!confirm(confirmMessage)) {
      return
    }

    try {
      const response = await fetch(`/api/workspaces/${workspaceId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove from local state
        setWorkspaces(workspaces.filter(w => w.id !== workspaceId))
        
        // Trigger event to update sidebar
        window.dispatchEvent(new Event('workspaceUpdated'))
        
        // If deleting current workspace, redirect to remaining workspace
        if (workspaceId === currentWorkspaceId && workspaces.length > 1) {
          const nextWorkspace = workspaces.find(w => w.id !== workspaceId)
          if (nextWorkspace) {
            alert('✅ Workspace deleted (soft delete). Switching to another workspace...')
            router.push(`/dashboard?workspace=${nextWorkspace.id}`)
            router.refresh()
          }
        } else if (workspaces.length === 1) {
          alert('⚠️ Cannot delete your only workspace!')
        } else {
          alert('✅ Workspace deleted successfully (can be recovered within 30 days)')
        }
      } else {
        const error = await response.json()
        alert(`❌ ${error.error || 'Failed to delete workspace'}`)
      }
    } catch (error) {
      console.error('Failed to delete workspace:', error)
      alert('❌ Failed to delete workspace')
    }
  }

  const getPlanBadge = (plan: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      free: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', label: 'Free' },
      pro: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', label: 'Pro' },
      business: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', label: 'Business' },
      enterprise: { color: 'bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-300', label: 'Enterprise' },
    }
    
    const badge = badges[plan] || badges.free
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Workspaces</h1>
          <p className="text-muted-foreground mt-1">
            Manage your workspaces and switch between them
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Workspace
        </Button>
      </div>

      {/* Workspaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            className={`glass-card p-6 hover:shadow-lg transition-all duration-300 ${
              workspace.id === currentWorkspaceId 
                ? 'ring-2 ring-purple-500 dark:ring-purple-400' 
                : ''
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{workspace.name}</h3>
                  <p className="text-sm text-muted-foreground">{workspace.slug}</p>
                </div>
              </div>
              
              {workspace.id === currentWorkspaceId && (
                <div className="flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                  <Check className="w-3 h-3" />
                  Active
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Plan</span>
                {getPlanBadge(workspace.plan)}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Messages</span>
                <span className="font-medium text-foreground">
                  {workspace.message_used.toLocaleString()} / {workspace.message_quota.toLocaleString()}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((workspace.message_used / workspace.message_quota) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => router.push(`/dashboard?workspace=${workspace.id}`)}
              >
                {workspace.id === currentWorkspaceId ? 'Current' : 'Switch'}
              </Button>
              
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenMenuId(openMenuId === workspace.id ? null : workspace.id)}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
                
                {/* Dropdown Menu */}
                {openMenuId === workspace.id && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setOpenMenuId(null)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 py-1">
                      <button
                        onClick={() => {
                          router.push(`/dashboard/settings/workspace?id=${workspace.id}`)
                          setOpenMenuId(null)
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Workspace
                      </button>
                      
                      {workspaces.length > 1 && (
                        <button
                          onClick={() => {
                            handleDeleteWorkspace(workspace.id, workspace.name)
                            setOpenMenuId(null)
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Workspace
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {workspaces.length === 0 && (
        <div className="text-center py-12 glass-card">
          <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No workspaces yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first workspace to get started
          </p>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Workspace
          </Button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Create New Workspace</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Workspace Name *
                </label>
                <input
                  type="text"
                  value={newWorkspace.name}
                  onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                  placeholder="My Awesome Company"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Industry (Optional)
                </label>
                <input
                  type="text"
                  value={newWorkspace.industry}
                  onChange={(e) => setNewWorkspace({ ...newWorkspace, industry: e.target.value })}
                  placeholder="E-commerce, SaaS, Healthcare..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false)
                  setNewWorkspace({ name: '', industry: '' })
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateWorkspace}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600"
              >
                Create Workspace
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
