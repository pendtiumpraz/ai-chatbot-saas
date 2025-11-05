'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Download, 
  Trash2,
  Eye,
  Calendar,
  User,
  Bot,
  Loader2
} from 'lucide-react'

interface Conversation {
  id: string
  chatbot_id: string
  visitor_id: string
  messages: any[]
  metadata: any
  created_at: string
  updated_at: string
  chatbots: {
    name: string
    workspace_id: string
  }
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedChatbot, setSelectedChatbot] = useState<string>('all')
  const [chatbots, setChatbots] = useState<any[]>([])

  useEffect(() => {
    fetchChatbots()
    fetchConversations()
  }, [selectedChatbot])

  const fetchChatbots = async () => {
    try {
      const response = await fetch('/api/chatbots')
      const data = await response.json()
      
      if (response.ok) {
        setChatbots(data.chatbots || [])
      }
    } catch (err) {
      console.error('Failed to load chatbots')
    }
  }

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: '50',
        offset: '0',
      })
      
      if (selectedChatbot !== 'all') {
        params.append('chatbotId', selectedChatbot)
      }

      const response = await fetch(`/api/conversations?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setConversations(data.conversations || [])
      }
    } catch (err) {
      console.error('Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return

    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setConversations(conversations.filter(c => c.id !== id))
      }
    } catch (err) {
      alert('Failed to delete conversation')
    }
  }

  const getMessageCount = (conversation: Conversation) => {
    return Array.isArray(conversation.messages) ? conversation.messages.length : 0
  }

  const getFirstMessage = (conversation: Conversation) => {
    if (!Array.isArray(conversation.messages) || conversation.messages.length === 0) {
      return 'No messages'
    }
    const firstMsg = conversation.messages[0]
    return typeof firstMsg === 'string' ? firstMsg : firstMsg.content || 'New conversation'
  }

  const filteredConversations = conversations.filter(conv => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      conv.visitor_id.toLowerCase().includes(searchLower) ||
      getFirstMessage(conv).toLowerCase().includes(searchLower) ||
      conv.chatbots.name.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 grid-background opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Conversations</h1>
          <p className="text-foreground/60">
            View and manage all chatbot conversations
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 rounded-xl mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 rounded-lg glass-card border border-border focus:border-purple-600 outline-none"
              />
            </div>

            {/* Chatbot Filter */}
            <select
              value={selectedChatbot}
              onChange={(e) => setSelectedChatbot(e.target.value)}
              className="px-4 py-2 rounded-lg glass-card border border-border focus:border-purple-600 outline-none"
            >
              <option value="all">All Chatbots</option>
              {chatbots.map((bot) => (
                <option key={bot.id} value={bot.id}>
                  {bot.name}
                </option>
              ))}
            </select>

            {/* Export Button */}
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-1">Total Conversations</p>
                <p className="text-2xl font-bold">{conversations.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-1">Unique Visitors</p>
                <p className="text-2xl font-bold">
                  {new Set(conversations.map(c => c.visitor_id)).size}
                </p>
              </div>
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-1">Total Messages</p>
                <p className="text-2xl font-bold">
                  {conversations.reduce((sum, c) => sum + getMessageCount(c), 0)}
                </p>
              </div>
              <Bot className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Conversations List */}
        {loading ? (
          <div className="glass-card p-8 rounded-xl text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-foreground/60">Loading conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="glass-card p-8 rounded-xl text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-foreground/40" />
            <h3 className="text-xl font-bold mb-2">No Conversations Yet</h3>
            <p className="text-foreground/60">
              Conversations will appear here when users interact with your chatbots
            </p>
          </div>
        ) : (
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-accent/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium">Visitor</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Chatbot</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">First Message</th>
                    <th className="px-6 py-3 text-center text-sm font-medium">Messages</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
                    <th className="px-6 py-3 text-right text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredConversations.map((conversation) => (
                    <tr key={conversation.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                            {conversation.visitor_id.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm font-mono">
                            {conversation.visitor_id.slice(0, 8)}...
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-purple-600" />
                          <span className="font-medium">{conversation.chatbots.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <p className="text-sm text-foreground/60 truncate">
                          {getFirstMessage(conversation)}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 rounded bg-purple-600/20 text-purple-600 text-xs font-medium">
                          {getMessageCount(conversation)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-foreground/60">
                          <Calendar className="w-4 h-4" />
                          {new Date(conversation.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/dashboard/conversations/${conversation.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(conversation.id)}
                            className="text-red-600 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-between">
              <div className="text-sm text-foreground/60">
                Showing {filteredConversations.length} of {conversations.length} conversations
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
