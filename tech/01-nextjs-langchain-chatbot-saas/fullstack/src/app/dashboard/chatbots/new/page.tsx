'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  ArrowRight, 
  Bot, 
  Sparkles, 
  MessageSquare, 
  Palette,
  Check,
  Loader2,
  Building2,
  AlertTriangle,
} from 'lucide-react'

// Step components will be inline for simplicity
const steps = [
  { id: 1, name: 'Basic Info', icon: Bot },
  { id: 2, name: 'AI Configuration', icon: Sparkles },
  { id: 3, name: 'System Prompt', icon: MessageSquare },
  { id: 4, name: 'Widget Style', icon: Palette },
  { id: 5, name: 'Review', icon: Check },
]

const useCaseTemplates = {
  'customer-support': {
    label: 'Customer Support',
    prompt: 'You are a helpful customer support assistant. Your goal is to help customers resolve their issues quickly and professionally. Always be polite, empathetic, and solution-oriented.',
  },
  'sales-assistant': {
    label: 'Sales Assistant',
    prompt: 'You are a knowledgeable sales assistant. Help customers find the right products, answer questions about features and pricing, and guide them through the purchasing process.',
  },
  'hr-assistant': {
    label: 'HR Assistant',
    prompt: 'You are an HR assistant helping employees with HR-related questions. Provide accurate information about policies, benefits, leave requests, and other HR topics while maintaining confidentiality.',
  },
  'education-tutor': {
    label: 'Education Tutor',
    prompt: 'You are an educational tutor. Help students understand concepts, answer their questions, and guide them through learning materials. Be patient, encouraging, and adapt your explanations to different learning styles.',
  },
  'healthcare-info': {
    label: 'Healthcare Info',
    prompt: 'You are a healthcare information assistant. Provide general health information and guidance. Always remind users to consult healthcare professionals for medical advice and never provide diagnoses.',
  },
  'legal-assistant': {
    label: 'Legal Assistant',
    prompt: 'You are a legal information assistant. Provide general legal information and guidance. Always clarify that you do not provide legal advice and users should consult licensed attorneys for specific legal matters.',
  },
  'finance-advisor': {
    label: 'Finance Advisor',
    prompt: 'You are a financial information assistant. Help users understand financial concepts, products, and general strategies. Always include disclaimers that you do not provide personalized financial advice.',
  },
  'general': {
    label: 'General Assistant',
    prompt: 'You are a helpful AI assistant. Answer questions, provide information, and assist users with a wide variety of tasks. Be friendly, accurate, and helpful.',
  },
}

export default function CreateChatbotPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [workspaces, setWorkspaces] = useState<any[]>([])
  const [showWorkspaceWarning, setShowWorkspaceWarning] = useState(false)
  const [checkingWorkspace, setCheckingWorkspace] = useState(true)
  
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    description: '',
    useCase: 'general' as keyof typeof useCaseTemplates,
    
    // Step 2: AI Configuration
    model: 'gemini-2.0-flash',
    temperature: 0.7,
    maxTokens: 2000,
    
    // Step 3: System Prompt
    systemPrompt: useCaseTemplates.general.prompt,
    
    // Step 4: Widget Settings
    widgetSettings: {
      theme: 'light',
      primaryColor: '#8B5CF6',
      position: 'bottom-right',
      greetingMessage: 'Hi! How can I help you today?',
      avatarUrl: '',
    },
  })

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleUseCaseChange = (useCase: keyof typeof useCaseTemplates) => {
    setFormData({
      ...formData,
      useCase,
      systemPrompt: useCaseTemplates[useCase].prompt,
    })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const payload = {
        name: formData.name,
        description: formData.description || null,
        systemPrompt: formData.systemPrompt,
        model: formData.model,
        temperature: formData.temperature,
        maxTokens: formData.maxTokens,
        useCase: formData.useCase,
        widgetSettings: formData.widgetSettings,
        isActive: true,
      }

      const response = await fetch('/api/chatbots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/dashboard/chatbots')
      } else {
        alert(`Failed to create chatbot: ${data.error}`)
      }
    } catch (err) {
      alert('Failed to create chatbot')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/chatbots')}
            className="flex items-center gap-2 text-foreground/60 hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Chatbots
          </button>
          <h1 className="text-3xl font-bold mb-2">Create New Chatbot</h1>
          <p className="text-foreground/60">Follow the steps to configure your AI chatbot</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                        isActive
                          ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white scale-110'
                          : isCompleted
                          ? 'bg-green-600 text-white'
                          : 'bg-foreground/10 text-foreground/40'
                      }`}
                    >
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <span
                      className={`text-xs text-center ${
                        isActive ? 'text-foreground font-medium' : 'text-foreground/60'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded ${
                        isCompleted ? 'bg-green-600' : 'bg-foreground/10'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="glass-card rounded-xl p-8 mb-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Basic Information</h2>
                <p className="text-foreground/60 mb-6">Let's start with the basics about your chatbot</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Chatbot Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Customer Support Bot"
                  className="w-full px-4 py-3 rounded-lg glass-card border border-border focus:border-purple-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Briefly describe what this chatbot does..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg glass-card border border-border focus:border-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Use Case <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.useCase}
                  onChange={(e) => handleUseCaseChange(e.target.value as keyof typeof useCaseTemplates)}
                  className="w-full px-4 py-3 rounded-lg glass-card border border-border focus:border-purple-600 outline-none"
                >
                  {Object.entries(useCaseTemplates).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-foreground/60 mt-2">
                  This helps pre-configure your chatbot with the right prompts and settings
                </p>
              </div>
            </div>
          )}

          {/* Step 2: AI Configuration */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">AI Configuration</h2>
                <p className="text-foreground/60 mb-6">Choose the AI model and parameters</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  AI Model <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg glass-card border border-border focus:border-purple-600 outline-none"
                >
                  <optgroup label="OpenAI">
                    <option value="gpt-4-turbo-preview">GPT-4 Turbo (Most Capable)</option>
                    <option value="gpt-4">GPT-4 (Standard)</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast & Affordable)</option>
                  </optgroup>
                  <optgroup label="Anthropic">
                    <option value="claude-3-opus-20240229">Claude 3 Opus (Most Capable)</option>
                    <option value="claude-3-sonnet-20240229">Claude 3 Sonnet (Balanced)</option>
                    <option value="claude-3-haiku-20240307">Claude 3 Haiku (Fastest)</option>
                  </optgroup>
                  <optgroup label="Google Gemini">
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash (Fastest, FREE)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Most Capable)</option>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Balanced)</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Temperature: {formData.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-foreground/60 mt-1">
                  <span>Precise (0)</span>
                  <span>Balanced (1)</span>
                  <span>Creative (2)</span>
                </div>
                <p className="text-xs text-foreground/60 mt-2">
                  Higher values make output more random, lower values more focused
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Max Tokens</label>
                <input
                  type="number"
                  min="100"
                  max="4000"
                  step="100"
                  value={formData.maxTokens}
                  onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg glass-card border border-border focus:border-purple-600 outline-none"
                />
                <p className="text-xs text-foreground/60 mt-2">
                  Maximum length of responses (1 token ≈ 0.75 words)
                </p>
              </div>
            </div>
          )}

          {/* Step 3: System Prompt */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">System Prompt</h2>
                <p className="text-foreground/60 mb-6">
                  Define how your chatbot behaves and responds
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  System Prompt <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.systemPrompt}
                  onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                  placeholder="Enter your system prompt..."
                  rows={12}
                  className="w-full px-4 py-3 rounded-lg glass-card border border-border focus:border-purple-600 outline-none font-mono text-sm"
                  required
                />
                <p className="text-xs text-foreground/60 mt-2">
                  The system prompt defines your chatbot's personality, knowledge, and behavior
                </p>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h4 className="font-medium text-sm mb-2">💡 Tips for great prompts:</h4>
                <ul className="text-xs text-foreground/60 space-y-1">
                  <li>• Be specific about the chatbot's role and expertise</li>
                  <li>• Define the tone and style (professional, friendly, casual)</li>
                  <li>• Include any important rules or limitations</li>
                  <li>• Specify how to handle questions outside its domain</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 4: Widget Style */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Widget Customization</h2>
                <p className="text-foreground/60 mb-6">Customize how your chatbot looks on your website</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Theme</label>
                  <select
                    value={formData.widgetSettings.theme}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        widgetSettings: { ...formData.widgetSettings, theme: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg glass-card border border-border focus:border-purple-600 outline-none"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Position</label>
                  <select
                    value={formData.widgetSettings.position}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        widgetSettings: { ...formData.widgetSettings, position: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg glass-card border border-border focus:border-purple-600 outline-none"
                  >
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Primary Color</label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={formData.widgetSettings.primaryColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        widgetSettings: { ...formData.widgetSettings, primaryColor: e.target.value },
                      })
                    }
                    className="w-20 h-12 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.widgetSettings.primaryColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        widgetSettings: { ...formData.widgetSettings, primaryColor: e.target.value },
                      })
                    }
                    className="flex-1 px-4 py-3 rounded-lg glass-card border border-border focus:border-purple-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Greeting Message</label>
                <input
                  type="text"
                  value={formData.widgetSettings.greetingMessage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      widgetSettings: { ...formData.widgetSettings, greetingMessage: e.target.value },
                    })
                  }
                  placeholder="Hi! How can I help you today?"
                  className="w-full px-4 py-3 rounded-lg glass-card border border-border focus:border-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Avatar URL (Optional)</label>
                <input
                  type="url"
                  value={formData.widgetSettings.avatarUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      widgetSettings: { ...formData.widgetSettings, avatarUrl: e.target.value },
                    })
                  }
                  placeholder="https://example.com/avatar.png"
                  className="w-full px-4 py-3 rounded-lg glass-card border border-border focus:border-purple-600 outline-none"
                />
              </div>

              {/* Widget Preview */}
              <div className="p-6 bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-600/20 rounded-lg">
                <h4 className="font-medium mb-4">Widget Preview</h4>
                <div
                  className="w-full h-64 rounded-lg flex items-end justify-end p-4"
                  style={{
                    backgroundColor: formData.widgetSettings.theme === 'dark' ? '#1a1a1a' : '#ffffff',
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                    style={{ backgroundColor: formData.widgetSettings.primaryColor }}
                  >
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Review & Create</h2>
                <p className="text-foreground/60 mb-6">Review your chatbot configuration before creating</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 glass-card rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Basic Information</h3>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-xs text-purple-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-foreground/60">Name:</span> {formData.name}</p>
                    <p><span className="text-foreground/60">Description:</span> {formData.description || 'None'}</p>
                    <p><span className="text-foreground/60">Use Case:</span> {useCaseTemplates[formData.useCase].label}</p>
                  </div>
                </div>

                <div className="p-4 glass-card rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">AI Configuration</h3>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-xs text-purple-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-foreground/60">Model:</span> {formData.model}</p>
                    <p><span className="text-foreground/60">Temperature:</span> {formData.temperature}</p>
                    <p><span className="text-foreground/60">Max Tokens:</span> {formData.maxTokens}</p>
                  </div>
                </div>

                <div className="p-4 glass-card rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">System Prompt</h3>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="text-xs text-purple-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-foreground/60 line-clamp-3">{formData.systemPrompt}</p>
                </div>

                <div className="p-4 glass-card rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Widget Settings</h3>
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="text-xs text-purple-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-foreground/60">Theme:</span> {formData.widgetSettings.theme}</p>
                    <p><span className="text-foreground/60">Position:</span> {formData.widgetSettings.position}</p>
                    <p>
                      <span className="text-foreground/60">Color:</span>{' '}
                      <span
                        className="inline-block w-4 h-4 rounded"
                        style={{ backgroundColor: formData.widgetSettings.primaryColor }}
                      />
                      {formData.widgetSettings.primaryColor}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handleBack}
            disabled={currentStep === 1 || loading}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="text-sm text-foreground/60">
            Step {currentStep} of {steps.length}
          </div>

          {currentStep < 5 ? (
            <Button
              onClick={handleNext}
              disabled={!formData.name || loading}
              size="lg"
              className="gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              size="lg"
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Create Chatbot
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
