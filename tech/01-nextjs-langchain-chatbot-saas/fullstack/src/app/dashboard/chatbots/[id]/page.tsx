'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Power,
  ExternalLink,
  Bot,
  FileText,
  MessageSquare,
  Settings,
  BarChart3,
  Loader2,
  Copy,
  Check,
  Activity,
} from 'lucide-react'

interface Chatbot {
  id: string
  workspace_id: string
  name: string
  description: string | null
  system_prompt: string
  model: string
  temperature: number
  max_tokens: number
  pinecone_namespace: string
  use_case: string | null
  is_active: boolean
  widget_settings: any
  created_at: string
  updated_at: string
}

export default function ChatbotDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [chatbot, setChatbot] = useState<Chatbot | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchChatbot()
  }, [params.id])

  const fetchChatbot = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/chatbots/${params.id}`)
      const data = await response.json()

      if (response.ok && data.chatbot) {
        setChatbot(data.chatbot)
      } else {
        alert('Chatbot not found')
        router.push('/dashboard/chatbots')
      }
    } catch (err) {
      console.error('Failed to fetch chatbot:', err)
      alert('Failed to load chatbot')
      router.push('/dashboard/chatbots')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!chatbot) return
    if (!confirm(`Are you sure you want to delete "${chatbot.name}"? This will also delete all associated documents and conversations.`)) return

    try {
      const response = await fetch(`/api/chatbots/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/dashboard/chatbots')
      } else {
        const data = await response.json()
        alert(`Failed to delete: ${data.error}`)
      }
    } catch (err) {
      alert('Failed to delete chatbot')
    }
  }

  const handleToggleStatus = async () => {
    if (!chatbot) return

    try {
      const response = await fetch(`/api/chatbots/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !chatbot.is_active }),
      })

      if (response.ok) {
        setChatbot({ ...chatbot, is_active: !chatbot.is_active })
      } else {
        alert('Failed to update status')
      }
    } catch (err) {
      alert('Failed to update chatbot status')
    }
  }

  const copyWidgetCode = () => {
    if (!chatbot) return
    
    const code = `<!-- AI Chatbot Widget -->
<script src="https://your-domain.com/widget.js"></script>
<script>
  AIChatbot.init({
    chatbotId: "${chatbot.id}",
    theme: "${chatbot.widget_settings?.theme || 'light'}",
    position: "${chatbot.widget_settings?.position || 'bottom-right'}",
    primaryColor: "${chatbot.widget_settings?.primaryColor || '#8B5CF6'}"
  });
</script>`

    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600 mb-4" />
          <p className="text-foreground/60">Loading chatbot...</p>
        </div>
      </div>
    )
  }

  if (!chatbot) {
    return null
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/chatbots')}
            className="flex items-center gap-2 text-foreground/60 hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Chatbots
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{chatbot.name}</h1>
                <p className="text-foreground/60 mb-3">
                  {chatbot.description || 'No description provided'}
                </p>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    chatbot.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                  }`}>
                    {chatbot.is_active ? (
                      <><Activity className="w-4 h-4 mr-1" /> Active</>
                    ) : (
                      <><Power className="w-4 h-4 mr-1" /> Paused</>
                    )}
                  </span>
                  <span className="text-sm text-foreground/60">
                    {getUseCaseLabel(chatbot.use_case)}
                  </span>
                  <span className="text-sm text-foreground/60">
                    Created {formatDate(chatbot.created_at)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/dashboard/chatbots/${params.id}/test`}>
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Test
                </Button>
              </Link>
              <Link href={`/dashboard/chatbots/${params.id}/edit`}>
                <Button variant="outline" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              </Link>
              <Button
                onClick={handleToggleStatus}
                variant="outline"
                className="gap-2"
              >
                <Power className="w-4 h-4" />
                {chatbot.is_active ? 'Pause' : 'Activate'}
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-1 border-b border-border">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('configuration')}
              className={`px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === 'configuration'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Configuration
            </button>
            <button
              onClick={() => setActiveTab('widget')}
              className={`px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === 'widget'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              <Bot className="w-4 h-4 inline mr-2" />
              Widget Code
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="glass-card rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold">-</p>
                  <p className="text-sm text-foreground/60">Documents</p>
                </div>
                <div className="glass-card rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <MessageSquare className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold">-</p>
                  <p className="text-sm text-foreground/60">Conversations</p>
                </div>
                <div className="glass-card rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold">-</p>
                  <p className="text-sm text-foreground/60">Messages</p>
                </div>
                <div className="glass-card rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <BarChart3 className="w-8 h-8 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold">-</p>
                  <p className="text-sm text-foreground/60">Avg Response</p>
                </div>
              </div>

              <div className="glass-card rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Link href={`/dashboard/knowledge?chatbot=${chatbot.id}`}>
                    <div className="p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                      <FileText className="w-8 h-8 text-purple-600 mb-2" />
                      <h4 className="font-medium mb-1">Manage Documents</h4>
                      <p className="text-xs text-foreground/60">Upload and manage knowledge base</p>
                    </div>
                  </Link>
                  <Link href={`/dashboard/conversations?chatbot=${chatbot.id}`}>
                    <div className="p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                      <MessageSquare className="w-8 h-8 text-blue-600 mb-2" />
                      <h4 className="font-medium mb-1">View Conversations</h4>
                      <p className="text-xs text-foreground/60">See all chat conversations</p>
                    </div>
                  </Link>
                  <Link href={`/dashboard/chatbots/${chatbot.id}/test`}>
                    <div className="p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                      <ExternalLink className="w-8 h-8 text-green-600 mb-2" />
                      <h4 className="font-medium mb-1">Test Chatbot</h4>
                      <p className="text-xs text-foreground/60">Try chatting with your bot</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Configuration Tab */}
          {activeTab === 'configuration' && (
            <div className="space-y-6">
              <div className="glass-card rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4">AI Model Settings</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground/60">Model</p>
                    <p className="font-medium">{chatbot.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Temperature</p>
                    <p className="font-medium">{chatbot.temperature}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Max Tokens</p>
                    <p className="font-medium">{chatbot.max_tokens || 2000}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Use Case</p>
                    <p className="font-medium">{getUseCaseLabel(chatbot.use_case)}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4">System Prompt</h3>
                <pre className="p-4 bg-black/20 dark:bg-white/5 rounded-lg text-sm overflow-auto max-h-96">
                  {chatbot.system_prompt}
                </pre>
              </div>

              <div className="glass-card rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4">Widget Settings</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground/60">Theme</p>
                    <p className="font-medium">{chatbot.widget_settings?.theme || 'light'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Position</p>
                    <p className="font-medium">{chatbot.widget_settings?.position || 'bottom-right'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Primary Color</p>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: chatbot.widget_settings?.primaryColor || '#8B5CF6' }}
                      />
                      <p className="font-medium">{chatbot.widget_settings?.primaryColor || '#8B5CF6'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Greeting Message</p>
                    <p className="font-medium">{chatbot.widget_settings?.greetingMessage || 'Hi!'}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4">Technical Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground/60">Chatbot ID</p>
                    <p className="font-mono text-sm">{chatbot.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Pinecone Namespace</p>
                    <p className="font-mono text-sm">{chatbot.pinecone_namespace}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Created At</p>
                    <p className="text-sm">{formatDate(chatbot.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Last Updated</p>
                    <p className="text-sm">{formatDate(chatbot.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Widget Code Tab */}
          {activeTab === 'widget' && (
            <div className="space-y-6">
              <div className="glass-card rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Embed Widget Code</h3>
                  <Button onClick={copyWidgetCode} variant="outline" className="gap-2">
                    {copied ? (
                      <><Check className="w-4 h-4 text-green-600" /> Copied!</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Copy Code</>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-foreground/60 mb-4">
                  Add this code to your website to embed the chatbot widget
                </p>
                <pre className="p-4 bg-black/20 dark:bg-white/5 rounded-lg text-sm overflow-auto">
                  {`<!-- AI Chatbot Widget -->
<script src="https://your-domain.com/widget.js"></script>
<script>
  AIChatbot.init({
    chatbotId: "${chatbot.id}",
    theme: "${chatbot.widget_settings?.theme || 'light'}",
    position: "${chatbot.widget_settings?.position || 'bottom-right'}",
    primaryColor: "${chatbot.widget_settings?.primaryColor || '#8B5CF6'}"
  });
</script>`}
                </pre>
              </div>

              <div className="glass-card rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4">Integration Guide</h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">1</span>
                    <div>
                      <p className="font-medium">Copy the widget code above</p>
                      <p className="text-foreground/60">Click the "Copy Code" button to copy to clipboard</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">2</span>
                    <div>
                      <p className="font-medium">Paste before closing {'</body>'} tag</p>
                      <p className="text-foreground/60">Add the code at the end of your HTML file, just before {'</body>'}</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">3</span>
                    <div>
                      <p className="font-medium">Refresh your website</p>
                      <p className="text-foreground/60">The chatbot widget will appear on your website</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
