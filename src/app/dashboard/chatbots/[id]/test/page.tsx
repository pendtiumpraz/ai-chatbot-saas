'use client'

import { Button } from '@/components/ui/button'
import {
  Bot,
  Send,
  Paperclip,
  RotateCcw,
  Download,
  Settings,
  Sparkles,
  User,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function TestChatbotPage({ params }: { params: { id: string } }) {
  const [chatbot, setChatbot] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [messages, setMessages] = useState<Array<{
    role: string;
    content: string;
    timestamp: Date;
    status?: 'sending' | 'delivered' | 'error';
  }>>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date(),
      status: 'delivered',
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [responseTime, setResponseTime] = useState<number>(0)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch chatbot details
  useEffect(() => {
    const fetchChatbot = async () => {
      try {
        const response = await fetch(`/api/chatbots/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setChatbot(data.chatbot)
        }
      } catch (error) {
        console.error('Failed to fetch chatbot:', error)
      }
    }
    fetchChatbot()
  }, [params.id])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
      status: 'sending' as const,
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    const messageIndex = messages.length
    setInput('')
    setIsLoading(true)

    try {
      // Mark as sending
      setMessages(prev => prev.map((msg, idx) => 
        idx === messageIndex ? { ...msg, status: 'sending' as const } : msg
      ))

      const startTime = Date.now()
      
      // Call real AI API
      const response = await fetch(`/api/chatbots/${params.id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          conversationId: conversationId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get response')
      }

      const data = await response.json()
      const endTime = Date.now()
      setResponseTime((endTime - startTime) / 1000)

      // Mark user message as delivered
      setMessages(prev => prev.map((msg, idx) => 
        idx === messageIndex ? { ...msg, status: 'delivered' as const } : msg
      ))

      // Save conversation ID for future messages
      if (data.conversationId) {
        setConversationId(data.conversationId)
      }

      const aiMessage = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        status: 'delivered' as const,
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error: any) {
      console.error('Chat error:', error)
      
      // Mark user message as error
      setMessages(prev => prev.map((msg, idx) => 
        idx === messageIndex ? { ...msg, status: 'error' as const } : msg
      ))

      const errorMessage = {
        role: 'assistant',
        content: `❌ Error: ${error.message}\n\n💡 Make sure you have:\n1. Added an API key in Settings → API Keys\n2. Selected the correct AI model\n3. API key is active`,
        timestamp: new Date(),
        status: 'error' as const,
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hi! I\'m your AI assistant. How can I help you today?',
        timestamp: new Date(),
      }
    ])
    setConversationId(null) // Start new conversation
    setResponseTime(0)
  }

  const handleExport = () => {
    const content = messages.map(m => `${m.role}: ${m.content}`).join('\n\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-export-${new Date().toISOString()}.txt`
    a.click()
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="glass-card rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Test Chatbot</h1>
                <p className="text-sm text-foreground/60">Customer Support Bot • Active</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="glass-card rounded-xl flex flex-col" style={{height: 'calc(100vh - 280px)'}}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message, i) => (
              <div key={i} className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-600' 
                    : 'bg-gradient-to-br from-purple-600 to-blue-600'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                  <div className={`${
                    message.role === 'user' 
                      ? 'chat-bubble-user' 
                      : 'chat-bubble-ai'
                  }`}>
                    <div className="mb-2 prose prose-sm dark:prose-invert max-w-none">
                      {message.role === 'user' ? (
                        <div>{message.content}</div>
                      ) : (
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                            li: ({node, ...props}) => <li className="mb-1" {...props} />,
                            code: ({node, inline, ...props}: any) => 
                              inline ? (
                                <code className="bg-purple-500/20 px-1 py-0.5 rounded text-sm" {...props} />
                              ) : (
                                <code className="block bg-purple-500/20 p-2 rounded text-sm my-2 overflow-x-auto" {...props} />
                              ),
                            strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                            em: ({node, ...props}) => <em className="italic" {...props} />,
                            a: ({node, ...props}) => <a className="text-purple-600 dark:text-purple-400 hover:underline" {...props} />,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </div>
                    <div 
                      className={`text-xs flex items-center gap-1 ${
                        message.role === 'user' ? 'text-white/70' : 'text-foreground/60'
                      }`}
                      suppressHydrationWarning
                    >
                      <span>{mounted ? message.timestamp.toLocaleTimeString() : '--:--:--'}</span>
                      {message.role === 'user' && message.status && (
                        <span className="flex items-center" title={
                          message.status === 'sending' ? 'Sending...' :
                          message.status === 'delivered' ? 'Delivered' :
                          message.status === 'error' ? 'Failed to send' : ''
                        }>
                          {message.status === 'sending' && (
                            <Clock className="w-3 h-3 animate-pulse text-yellow-400" />
                          )}
                          {message.status === 'delivered' && (
                            <CheckCheck className="w-3 h-3 text-blue-400" />
                          )}
                          {message.status === 'error' && (
                            <AlertCircle className="w-3 h-3 text-red-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="chat-bubble-ai">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-6">
            <div className="flex items-end gap-4">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder="Type your message... (Shift + Enter for new line)"
                  className="w-full px-4 py-3 pr-12 rounded-lg glass-card border border-border focus:border-purple-600 outline-none resize-none"
                  rows={3}
                  disabled={isLoading}
                />
                <button className="absolute right-3 bottom-3 p-2 hover:bg-accent rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-foreground/60" />
                </button>
              </div>
              <Button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="lg"
                className="h-[76px]"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-foreground/60 mt-2">
              <Sparkles className="w-3 h-3 inline mr-1" />
              Powered by {chatbot?.model || 'AI'} • {chatbot?.temperature || 0.7} temp
            </p>
          </div>
        </div>

        {/* Info Panel */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="glass-card p-4 rounded-xl">
            <div className="text-sm text-foreground/60 mb-1">Response Time</div>
            <div className="text-2xl font-bold">{responseTime > 0 ? `${responseTime.toFixed(2)}s` : '-'}</div>
          </div>
          <div className="glass-card p-4 rounded-xl">
            <div className="text-sm text-foreground/60 mb-1">Messages</div>
            <div className="text-2xl font-bold">{messages.length}</div>
          </div>
          <div className="glass-card p-4 rounded-xl">
            <div className="text-sm text-foreground/60 mb-1">Model</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {chatbot?.model ? (
                <>
                  {chatbot.model.includes('gemini') && '✨ '}
                  {chatbot.model.includes('gpt') && '🤖 '}
                  {chatbot.model.includes('claude') && '🧠 '}
                  {chatbot.model}
                </>
              ) : '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
