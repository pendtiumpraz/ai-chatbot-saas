'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Eye, EyeOff, Key, Check, X, Loader2 } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface ApiKey {
  id: string
  provider: string
  key_name: string
  is_active: boolean
  usage_limit: number | null
  usage_current: number
  last_used_at: string | null
  created_at: string
}

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', icon: '🤖', placeholder: 'sk-proj-...' },
  { id: 'anthropic', name: 'Anthropic', icon: '🧠', placeholder: 'sk-ant-...' },
  { id: 'google', name: 'Google Gemini', icon: '✨', placeholder: 'AIza...' },
  { id: 'custom', name: 'Custom API', icon: '🔧', placeholder: 'your-api-key' },
]

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newKey, setNewKey] = useState({
    provider: 'openai',
    keyName: '',
    apiKey: '',
    usageLimit: '',
  })
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/settings/api-keys')
      const data = await response.json()
      
      if (response.ok) {
        setApiKeys(data.apiKeys || [])
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to load API keys')
    } finally {
      setLoading(false)
    }
  }

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    setError(null)

    try {
      const response = await fetch('/api/settings/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: newKey.provider,
          keyName: newKey.keyName,
          apiKey: newKey.apiKey,
          usageLimit: newKey.usageLimit ? parseFloat(newKey.usageLimit) : null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccessMessage('API key added successfully!')
        setShowAddModal(false)
        setNewKey({ provider: 'openai', keyName: '', apiKey: '', usageLimit: '' })
        fetchApiKeys()
        
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to add API key')
    } finally {
      setAdding(false)
    }
  }

  const handleDeleteKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return

    try {
      const response = await fetch(`/api/settings/api-keys/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSuccessMessage('API key deleted successfully!')
        fetchApiKeys()
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        const data = await response.json()
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to delete API key')
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/settings/api-keys/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        fetchApiKeys()
      } else {
        const data = await response.json()
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to update API key')
    }
  }

  const getProviderInfo = (providerId: string) => {
    return PROVIDERS.find(p => p.id === providerId) || PROVIDERS[0]
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 grid-background opacity-20" />
      </div>

      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">API Keys Management</h1>
          <p className="text-foreground/60">
            Manage your AI provider API keys. Keys are encrypted and stored securely.
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 flex items-center gap-2">
            <Check className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 flex items-center gap-2">
            <X className="w-5 h-5" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Add Key Button */}
        <div className="mb-6">
          <Button onClick={() => setShowAddModal(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add API Key
          </Button>
        </div>

        {/* API Keys List */}
        {loading ? (
          <div className="glass-card p-8 rounded-xl text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-foreground/60">Loading API keys...</p>
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="glass-card p-8 rounded-xl text-center">
            <Key className="w-12 h-12 mx-auto mb-4 text-foreground/40" />
            <h3 className="text-xl font-bold mb-2">No API Keys Yet</h3>
            <p className="text-foreground/60 mb-4">
              Add your AI provider API keys to start using the chatbots
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First API Key
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((key) => {
              const provider = getProviderInfo(key.provider)
              return (
                <div key={key.id} className="glass-card p-6 rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-4xl">{provider.icon}</div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold">{key.key_name}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            key.is_active 
                              ? 'bg-green-500/20 text-green-600' 
                              : 'bg-gray-500/20 text-gray-600'
                          }`}>
                            {key.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <p className="text-sm text-foreground/60 mb-3">
                          {provider.name} • Added {new Date(key.created_at).toLocaleDateString()}
                        </p>

                        {key.usage_limit && (
                          <div className="mb-2">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-foreground/60">Usage</span>
                              <span className="font-medium">
                                ${key.usage_current.toFixed(2)} / ${key.usage_limit.toFixed(2)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full transition-all"
                                style={{ 
                                  width: `${Math.min((key.usage_current / key.usage_limit) * 100, 100)}%` 
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {key.last_used_at && (
                          <p className="text-xs text-foreground/40">
                            Last used: {new Date(key.last_used_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(key.id, key.is_active)}
                      >
                        {key.is_active ? 'Pause' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteKey(key.id)}
                        className="text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Add API Key Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-card rounded-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6">Add API Key</h2>

              <form onSubmit={handleAddKey} className="space-y-4">
                {/* Provider Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Provider</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PROVIDERS.map((provider) => (
                      <button
                        key={provider.id}
                        type="button"
                        onClick={() => setNewKey({ ...newKey, provider: provider.id })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          newKey.provider === provider.id
                            ? 'border-purple-600 bg-purple-600/10'
                            : 'border-border hover:border-purple-600/50'
                        }`}
                      >
                        <div className="text-2xl mb-1">{provider.icon}</div>
                        <div className="text-sm font-medium">{provider.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Key Name */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Key Name</label>
                  <input
                    type="text"
                    value={newKey.keyName}
                    onChange={(e) => setNewKey({ ...newKey, keyName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg glass-card border border-border focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none"
                    placeholder="e.g., Production Key"
                    required
                  />
                </div>

                {/* API Key */}
                <div>
                  <label className="text-sm font-medium mb-2 block">API Key</label>
                  <input
                    type="password"
                    value={newKey.apiKey}
                    onChange={(e) => setNewKey({ ...newKey, apiKey: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg glass-card border border-border focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none font-mono text-sm"
                    placeholder={getProviderInfo(newKey.provider).placeholder}
                    required
                  />
                  <p className="text-xs text-foreground/60 mt-1">
                    Your API key will be encrypted before storage
                  </p>
                </div>

                {/* Usage Limit */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Monthly Spending Limit (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newKey.usageLimit}
                    onChange={(e) => setNewKey({ ...newKey, usageLimit: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg glass-card border border-border focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none"
                    placeholder="e.g., 100.00"
                  />
                  <p className="text-xs text-foreground/60 mt-1">
                    Set a limit to prevent overspending
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false)
                      setNewKey({ provider: 'openai', keyName: '', apiKey: '', usageLimit: '' })
                      setError(null)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={adding} className="flex-1">
                    {adding ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add API Key'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 glass-card p-6 rounded-xl border-l-4 border-purple-600">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <Key className="w-5 h-5" />
            How It Works
          </h3>
          <ul className="space-y-2 text-sm text-foreground/60">
            <li>• Add your own API keys from AI providers (OpenAI, Anthropic, Google)</li>
            <li>• Keys are encrypted with AES-256 before storage</li>
            <li>• Set spending limits to control costs</li>
            <li>• Pause/activate keys anytime</li>
            <li>• If no key available, system uses platform credits</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
