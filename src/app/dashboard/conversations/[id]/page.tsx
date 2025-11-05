'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  Bot, 
  User, 
  Download, 
  Trash2,
  Calendar,
  Clock,
  MessageSquare,
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

export default function ConversationDetailPage({ params }: { params: { id: string } }) {
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchConversation()
  }, [params.id])

  const fetchConversation = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/conversations/${params.id}`)
      const data = await response.json()
      
      if (response.ok) {
        setConversation(data.conversation)
        setNotes(data.conversation.metadata?.notes || '')
      }
    } catch (err) {
      console.error('Failed to load conversation')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this conversation?')) return

    try {
      const response = await fetch(`/api/conversations/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/dashboard/conversations')
      }
    } catch (err) {
      alert('Failed to delete conversation')
    }
  }

  const handleSaveNotes = async () => {
    if (!conversation) return

    try {
      const response = await fetch(`/api/conversations/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metadata: {
            ...conversation.metadata,
            notes,
          },
        }),
      })

      if (response.ok) {
        alert('Notes saved!')
      }
    } catch (err) {
      alert('Failed to save notes')
    }
  }

  const handleExport = () => {
    if (!conversation) return

    const text = conversation.messages.map((msg: any, idx: number) => {
      const role = idx % 2 === 0 ? 'User' : 'Bot'
      const content = typeof msg === 'string' ? msg : msg.content || ''
      return `${role}: ${content}`
    }).join('\n\n')

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conversation-${params.id}.txt`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Conversation Not Found</h2>
          <Button onClick={() => router.push('/dashboard/conversations')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Conversations
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 grid-background opacity-20" />
      </div>

      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/conversations')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Conversations
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Conversation Details</h1>
              <p className="text-foreground/60">
                {conversation.chatbots.name} • Visitor {conversation.visitor_id.slice(0, 8)}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:bg-red-500/10">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Conversation */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Messages ({conversation.messages?.length || 0})
              </h2>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {conversation.messages?.map((message: any, index: number) => {
                  const isUser = index % 2 === 0
                  const content = typeof message === 'string' ? message : message.content || ''

                  return (
                    <div key={index} className={`flex gap-3 ${isUser ? '' : 'flex-row-reverse'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isUser
                          ? 'bg-gradient-to-br from-blue-600 to-cyan-600'
                          : 'bg-gradient-to-br from-purple-600 to-pink-600'
                      }`}>
                        {isUser ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <Bot className="w-5 h-5 text-white" />
                        )}
                      </div>

                      <div className={`flex-1 ${isUser ? 'text-left' : 'text-right'}`}>
                        <div className={`inline-block px-4 py-3 rounded-lg max-w-[80%] ${
                          isUser
                            ? 'bg-blue-600/20 text-left'
                            : 'bg-purple-600/20 text-left'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{content}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {(!conversation.messages || conversation.messages.length === 0) && (
                  <div className="text-center py-8 text-foreground/60">
                    No messages in this conversation
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-bold mb-4">Conversation Info</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-foreground/60 mb-1">Visitor ID</div>
                  <div className="font-mono">{conversation.visitor_id}</div>
                </div>

                <div>
                  <div className="text-foreground/60 mb-1">Chatbot</div>
                  <div className="font-medium">{conversation.chatbots.name}</div>
                </div>

                <div>
                  <div className="text-foreground/60 mb-1 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Created
                  </div>
                  <div>
                    {new Date(conversation.created_at).toLocaleDateString()}<br />
                    {new Date(conversation.created_at).toLocaleTimeString()}
                  </div>
                </div>

                <div>
                  <div className="text-foreground/60 mb-1 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Last Updated
                  </div>
                  <div>
                    {new Date(conversation.updated_at).toLocaleDateString()}<br />
                    {new Date(conversation.updated_at).toLocaleTimeString()}
                  </div>
                </div>

                <div>
                  <div className="text-foreground/60 mb-1">Total Messages</div>
                  <div className="font-bold text-lg">
                    {conversation.messages?.length || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-bold mb-4">Notes</h3>
              
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this conversation..."
                className="w-full h-32 px-3 py-2 rounded-lg glass-card border border-border focus:border-purple-600 outline-none resize-none text-sm"
              />

              <Button onClick={handleSaveNotes} className="w-full mt-3" size="sm">
                Save Notes
              </Button>
            </div>

            {/* Metadata */}
            {conversation.metadata && Object.keys(conversation.metadata).length > 0 && (
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-bold mb-4">Metadata</h3>
                <pre className="text-xs bg-black/20 p-3 rounded overflow-auto">
                  {JSON.stringify(conversation.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
