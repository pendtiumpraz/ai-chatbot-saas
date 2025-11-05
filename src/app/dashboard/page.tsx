'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Bot,
  MessageSquare,
  FileText,
  TrendingUp,
  Users,
  Plus,
  Search,
  Bell,
  Clock,
  CheckCircle,
  Activity,
  Zap,
  BarChart3,
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface DashboardStats {
  totalChatbots: number;
  activeChatbots: number;
  totalDocuments: number;
  totalConversations: number;
  messagesToday: number;
  creditsBalance: number;
  recentActivity: Array<{
    date: string;
    conversations: number;
  }>;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalChatbots: 0,
    activeChatbots: 0,
    totalDocuments: 0,
    totalConversations: 0,
    messagesToday: 0,
    creditsBalance: 0,
    recentActivity: []
  })

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/stats')
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }

      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const recentActivity = [
    { type: 'chat', message: 'New conversation started', time: '2 min ago', user: 'Anonymous' },
    { type: 'upload', message: 'Document uploaded: product-catalog.pdf', time: '15 min ago', user: 'You' },
    { type: 'bot', message: 'Chatbot "Customer Support" created', time: '1 hour ago', user: 'You' },
    { type: 'chat', message: '50 conversations today', time: '2 hours ago', user: 'System' },
  ]

  const chatbots = [
    { id: 1, name: 'Customer Support', messages: 4523, status: 'active', responseTime: '1.1s' },
    { id: 2, name: 'Product Guide', messages: 3241, status: 'active', responseTime: '0.9s' },
    { id: 3, name: 'HR Assistant', messages: 2156, status: 'active', responseTime: '1.3s' },
    { id: 4, name: 'Sales Bot', messages: 1890, status: 'active', responseTime: '1.0s' },
    { id: 5, name: 'Tech Support', messages: 648, status: 'active', responseTime: '1.4s' },
  ]

  return (
    <div className="p-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
              <p className="text-foreground/60">Welcome back! Here's what's happening.</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 rounded-lg glass-card border border-border focus:border-purple-600 outline-none text-sm"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg glass-card hover:scale-105 transition-transform">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Menu */}
              <div className="flex items-center gap-3 glass-card px-4 py-2 rounded-lg cursor-pointer hover:scale-105 transition-transform">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  JD
                </div>
                <div className="hidden md:block text-sm">
                  <div className="font-medium">John Doe</div>
                  <div className="text-foreground/60 text-xs">Pro Plan</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="metrics-card group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold mb-1">{stats.totalConversations.toLocaleString()}</div>
                <div className="text-sm text-foreground/60">Total Conversations</div>
                <div className="text-xs text-green-500 mt-2">{stats.messagesToday} today</div>
              </div>

              <div className="metrics-card group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-3xl font-bold mb-1">{stats.totalChatbots}</div>
                <div className="text-sm text-foreground/60">Total Chatbots</div>
                <div className="text-xs text-blue-500 mt-2">{stats.activeChatbots} active</div>
              </div>

              <div className="metrics-card group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <CheckCircle className="w-5 h-5 text-teal-500" />
                </div>
                <div className="text-3xl font-bold mb-1">{stats.totalDocuments}</div>
                <div className="text-sm text-foreground/60">Documents</div>
                <div className="text-xs text-teal-500 mt-2">Knowledge base</div>
              </div>

              <div className="metrics-card group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <Zap className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-3xl font-bold mb-1">{stats.creditsBalance.toLocaleString()}</div>
                <div className="text-sm text-foreground/60">Credits Balance</div>
                <div className="text-xs text-purple-500 mt-2">Available now</div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chatbots List */}
            <div className="lg:col-span-2 glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Your Chatbots</h2>
                <Link href="/dashboard/chatbots/new">
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Chatbot
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {chatbots.map((bot) => (
                  <div key={bot.id} className="glass-card p-4 rounded-lg hover:scale-[1.02] transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{bot.name}</div>
                          <div className="text-sm text-foreground/60">{bot.messages.toLocaleString()} messages</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-500">{bot.status}</div>
                        <div className="text-xs text-foreground/60">{bot.responseTime}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'chat' ? 'bg-blue-500' :
                      activity.type === 'upload' ? 'bg-green-500' :
                      activity.type === 'bot' ? 'bg-purple-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-foreground/60">{activity.user}</span>
                        <span className="text-xs text-foreground/40">•</span>
                        <span className="text-xs text-foreground/40">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <Link href="/dashboard/chatbots/new" className="glass-card p-6 rounded-xl hover:scale-105 transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold mb-2">Create Chatbot</h3>
              <p className="text-sm text-foreground/60">Build a new AI chatbot in minutes</p>
            </Link>

            <Link href="/dashboard/knowledge/upload" className="glass-card p-6 rounded-xl hover:scale-105 transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold mb-2">Upload Documents</h3>
              <p className="text-sm text-foreground/60">Add knowledge to your chatbots</p>
            </Link>

            <Link href="/dashboard/analytics" className="glass-card p-6 rounded-xl hover:scale-105 transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold mb-2">View Analytics</h3>
              <p className="text-sm text-foreground/60">Deep dive into your data</p>
            </Link>
          </div>
    </div>
  )
}
