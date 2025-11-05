'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Bot,
  Plus,
  Search,
  Edit,
  Trash2,
  Power,
  ExternalLink,
  MessageSquare,
  FileText,
  Loader2,
  RefreshCw,
  Activity,
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface Chatbot {
  id: string
  workspace_id: string
  name: string
  description: string | null
  system_prompt: string
  model: string
  temperature: number
  pinecone_namespace: string
  use_case: string | null
  is_active: boolean
  widget_settings: any
  created_at: string
  updated_at: string
}

export default function ChatbotsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [loading, setLoading] = useState(true)
  const [filterUseCase, setFilterUseCase] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchChatbots()
  }, [filterUseCase, filterStatus])

  const fetchChatbots = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filterUseCase !== 'all') params.append('useCase', filterUseCase)
      if (filterStatus !== 'all') params.append('status', filterStatus === 'active' ? 'true' : 'false')
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/chatbots?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setChatbots(data.chatbots || [])
      } else {
        console.error('Failed to load chatbots:', data.error)
      }
    } catch (err) {
      console.error('Failed to load chatbots:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchChatbots()
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all associated documents and conversations.`)) return

    try {
      const response = await fetch(`/api/chatbots/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setChatbots(chatbots.filter(c => c.id !== id))
      } else {
        const data = await response.json()
        alert(`Failed to delete: ${data.error}`)
      }
    } catch (err) {
      alert('Failed to delete chatbot')
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/chatbots/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        setChatbots(chatbots.map(c => 
          c.id === id ? { ...c, is_active: !currentStatus } : c
        ))
      } else {
        alert('Failed to update status')
      }
    } catch (err) {
      alert('Failed to update chatbot status')
    }
  }

  const filteredChatbots = chatbots.filter(bot =>
    bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (bot.description && bot.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getUseCaseLabel = (useCase: string | null) => {
    const labels: Record<string, string> = {
      'customer-support': 'Customer Support',
      'sales-assistant': 'Sales Assistant',
      'hr-assistant': 'HR Assistant',
      'education-tutor': 'Education',
      'healthcare-info': 'Healthcare',
      'legal-assistant': 'Legal',
      'finance-advisor': 'Finance',
      'general': 'General',
    }
    return labels[useCase || 'general'] || 'General'
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">Chatbots</h1>
              <p className="text-foreground/60">Manage your AI chatbots</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={fetchChatbots}
                variant="outline"
                size="lg"
                className="gap-2"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Link href="/dashboard/chatbots/new">
                <Button size="lg" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Create Chatbot
                </Button>
              </Link>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search chatbots..."
                className="w-full pl-10 pr-4 py-3 rounded-lg glass-card border border-border focus:border-purple-600 outline-none"
              />
            </div>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-lg glass-card border border-border focus:border-purple-600 outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
            <select 
              value={filterUseCase}
              onChange={(e) => setFilterUseCase(e.target.value)}
              className="px-4 py-3 rounded-lg glass-card border border-border focus:border-purple-600 outline-none"
            >
              <option value="all">All Use Cases</option>
              <option value="customer-support">Customer Support</option>
              <option value="sales-assistant">Sales Assistant</option>
              <option value="hr-assistant">HR Assistant</option>
              <option value="education-tutor">Education</option>
              <option value="healthcare-info">Healthcare</option>
              <option value="legal-assistant">Legal</option>
              <option value="finance-advisor">Finance</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-card rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60">Total Chatbots</p>
                <p className="text-2xl font-bold">{chatbots.length}</p>
              </div>
              <Bot className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="glass-card rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {chatbots.filter(b => b.is_active).length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="glass-card rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60">Paused</p>
                <p className="text-2xl font-bold text-gray-600">
                  {chatbots.filter(b => !b.is_active).length}
                </p>
              </div>
              <Power className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="col-span-3 text-center py-20">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600 mb-4" />
            <p className="text-foreground/60">Loading chatbots...</p>
          </div>
        ) : filteredChatbots.length === 0 ? (
          /* Empty State */
          <div className="col-span-3 text-center py-20">
            <div className="w-20 h-20 rounded-full bg-purple-600/10 flex items-center justify-center mx-auto mb-4">
              <Bot className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">No chatbots yet</h3>
            <p className="text-foreground/60 mb-6">
              {searchQuery || filterUseCase !== 'all' || filterStatus !== 'all'
                ? 'No chatbots match your filters'
                : 'Create your first AI chatbot to get started'}
            </p>
            <Link href="/dashboard/chatbots/new">
              <Button size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Create Your First Chatbot
              </Button>
            </Link>
          </div>
        ) : (
          /* Chatbots Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChatbots.map((bot) => (
              <div key={bot.id} className="glass-card rounded-xl p-6 hover:scale-105 transition-all group">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{bot.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        bot.is_active
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                      }`}>
                        {bot.is_active ? (
                          <><Activity className="w-3 h-3 mr-1" /> Active</>
                        ) : (
                          <><Power className="w-3 h-3 mr-1" /> Paused</>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-foreground/60 mb-4 line-clamp-2">
                  {bot.description || 'No description provided'}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="text-foreground/60">Use Case:</span>
                  </div>
                  <div className="text-sm font-medium">
                    {getUseCaseLabel(bot.use_case)}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span className="text-foreground/60">Model:</span>
                  </div>
                  <div className="text-sm font-medium">
                    {bot.model.replace('gpt-', 'GPT-').replace('claude-', 'Claude-')}
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-foreground/40 mb-4 pt-4 border-t border-border">
                  <span>Created {formatDate(bot.created_at)}</span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/dashboard/chatbots/${bot.id}/test`}>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Test
                    </Button>
                  </Link>
                  <Link href={`/dashboard/chatbots/${bot.id}/edit`}>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleToggleStatus(bot.id, bot.is_active)}
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                  >
                    <Power className="w-4 h-4" />
                    {bot.is_active ? 'Pause' : 'Activate'}
                  </Button>
                  <Button
                    onClick={() => handleDelete(bot.id, bot.name)}
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
