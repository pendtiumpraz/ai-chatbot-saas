'use client'

import { Button } from '@/components/ui/button'
import {
  FileText,
  Upload,
  Search,
  MoreVertical,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  File,
  FileType,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface Document {
  id: string
  chatbot_id: string
  filename: string
  file_url: string
  file_size: number
  mime_type: string
  chunk_count: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error_message?: string
  created_at: string
}

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [chatbots, setChatbots] = useState<any[]>([])
  const [selectedChatbot, setSelectedChatbot] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchChatbots()
  }, [])

  useEffect(() => {
    if (selectedChatbot) {
      fetchDocuments()
    }
  }, [selectedChatbot])

  const fetchChatbots = async () => {
    try {
      const response = await fetch('/api/chatbots')
      const data = await response.json()
      
      if (response.ok && data.chatbots && data.chatbots.length > 0) {
        setChatbots(data.chatbots)
        setSelectedChatbot(data.chatbots[0].id) // Select first chatbot
      }
    } catch (err) {
      console.error('Failed to load chatbots')
    }
  }

  const fetchDocuments = async () => {
    if (!selectedChatbot) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/documents?chatbotId=${selectedChatbot}`)
      const data = await response.json()
      
      if (response.ok) {
        setDocuments(data.documents || [])
      }
    } catch (err) {
      console.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const filteredDocuments = documents.filter(doc =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !selectedChatbot) return
    
    setUploading(true)

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData()
        formData.append('file', files[i])
        formData.append('chatbotId', selectedChatbot)

        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${files[i].name}`)
        }
      }

      // Refresh documents
      await fetchDocuments()
      alert('Files uploaded successfully!')
    } catch (err: any) {
      alert(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDocuments(documents.filter(d => d.id !== id))
      } else {
        alert('Failed to delete document')
      }
    } catch (err) {
      alert('Failed to delete document')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleUpload(e.dataTransfer.files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpload(e.target.files)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Knowledge Base</h1>
          <p className="text-foreground/60">Upload documents for your chatbots to learn from</p>
        </div>

        {/* Upload Area */}
        <div
          className={`glass-card rounded-xl p-8 mb-8 border-2 border-dashed transition-all ${
            isDragging 
              ? 'border-purple-600 bg-purple-600/5' 
              : 'border-border hover:border-purple-600/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Upload Documents</h3>
            <p className="text-foreground/60 mb-6">
              Drag and drop your files here, or click to browse
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || !selectedChatbot}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </>
              )}
            </Button>
            <p className="text-xs text-foreground/60 mt-4">
              Supported formats: PDF, DOCX, TXT (Max 10MB per file)
            </p>
          </div>
        </div>

        {/* Chatbot Selector & Search */}
        <div className="flex items-center gap-4 mb-6">
          <select
            value={selectedChatbot}
            onChange={(e) => setSelectedChatbot(e.target.value)}
            className="px-4 py-3 rounded-lg glass-card border border-border focus:border-purple-600 outline-none"
          >
            {chatbots.map((bot) => (
              <option key={bot.id} value={bot.id}>
                {bot.name}
              </option>
            ))}
          </select>
          
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-3 rounded-lg glass-card border border-border focus:border-purple-600 outline-none"
            />
          </div>

          <Button variant="outline" onClick={fetchDocuments}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Documents Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600/10 to-blue-600/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium">Document</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Size</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Chunks</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Uploaded</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p className="text-foreground/60">Loading documents...</p>
                    </td>
                  </tr>
                ) : filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-foreground/40" />
                      <h3 className="text-lg font-bold mb-2">No Documents Yet</h3>
                      <p className="text-foreground/60">Upload documents above to get started</p>
                    </td>
                  </tr>
                ) : filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                          {doc.mime_type.includes('pdf') ? (
                            <FileText className="w-5 h-5 text-white" />
                          ) : doc.mime_type.includes('word') ? (
                            <FileType className="w-5 h-5 text-white" />
                          ) : (
                            <File className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{doc.filename}</div>
                          <div className="text-xs text-foreground/60">{doc.mime_type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{formatFileSize(doc.file_size)}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        {doc.chunk_count} chunks
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {doc.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          Completed
                        </span>
                      )}
                      {doc.status === 'processing' && (
                        <span className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
                          <Clock className="w-4 h-4 animate-spin" />
                          Processing...
                        </span>
                      )}
                      {doc.status === 'failed' && (
                        <div className="flex flex-col">
                          <span className="inline-flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                            <AlertCircle className="w-4 h-4" />
                            Failed
                          </span>
                          {doc.error_message && (
                            <span className="text-xs text-foreground/60">{doc.error_message}</span>
                          )}
                        </div>
                      )}
                      {doc.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400">
                          <Clock className="w-4 h-4" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/60">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <a
                          href={doc.file_url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button 
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-600"
                          disabled={uploading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="glass-card rounded-xl p-12 text-center mt-8">
            <FileText className="w-16 h-16 mx-auto mb-4 text-foreground/40" />
            <h3 className="text-xl font-bold mb-2">No documents found</h3>
            <p className="text-foreground/60 mb-6">
              {searchQuery ? 'Try adjusting your search' : 'Upload your first document to get started'}
            </p>
          </div>
        )}

        {/* Storage Info */}
        <div className="mt-8 glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold mb-1">Storage Usage</h3>
              <p className="text-sm text-foreground/60">7.8 MB of 100 MB used</p>
            </div>
            <Button variant="outline" size="sm">
              Upgrade Storage
            </Button>
          </div>
          <div className="w-full h-2 bg-background rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-600 to-blue-600" style={{width: '7.8%'}} />
          </div>
        </div>
      </div>
    </div>
  )
}
