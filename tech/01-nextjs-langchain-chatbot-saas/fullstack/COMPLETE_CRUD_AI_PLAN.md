# 📋 Complete CRUD & AI Features Development Plan

## 🎯 Full System Audit & Implementation Roadmap

---

## 📊 Current Status Overview

### ✅ **What's Already Built:**

#### **Frontend (100% Complete):**
- ✅ Landing Page
- ✅ Pricing Page
- ✅ Login/Signup UI
- ✅ Dashboard UI
- ✅ Chatbot List UI
- ✅ Knowledge Base UI
- ✅ Chat Testing UI
- ✅ Dark/Light Mode
- ✅ Responsive Design

#### **Backend (Basic Structure):**
- ✅ RAG Pipeline (LangChain + Pinecone)
- ✅ Chat API (streaming)
- ✅ Document Processing
- ✅ Database Schema (Supabase)

### ❌ **What's Missing (Need Implementation):**

---

## 🔴 PRIORITY 1: Authentication & User Management

### 1.1 Authentication CRUD

#### **Status:** 🔴 Partially Implemented (UI only)

#### **What's Needed:**
```
✅ UI - Login page exists
✅ UI - Signup page exists
❌ Backend - Supabase auth integration
❌ Middleware - Route protection (exists but needs testing)
❌ Session management
❌ Remember me functionality
❌ OAuth integration (Google, GitHub)
```

#### **Files to Create/Update:**

**1. Update Login Handler** (`src/app/login/page.tsx`)
```typescript
// Add actual Supabase auth logic
const handleLogin = async (e) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email, password
  })
  if (!error) router.push('/dashboard')
}
```

**2. Update Signup Handler** (`src/app/signup/page.tsx`)
```typescript
// Add user creation + workspace creation
const handleSignup = async (e) => {
  // 1. Create auth user
  const { data: user } = await supabase.auth.signUp(...)
  
  // 2. Create workspace
  await supabase.from('workspaces').insert({
    user_id: user.id,
    name: companyName,
    ...
  })
}
```

**3. Logout Functionality** (Add to dashboard)
```typescript
// Add logout button in sidebar
const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}
```

**4. Password Reset Flow**
- Create `/forgot-password` page
- Create `/reset-password` page
- Email templates in Supabase

---

## 🔴 PRIORITY 2: Workspace Management CRUD

### 2.1 Workspaces CRUD

#### **Status:** 🔴 Not Implemented

#### **Required Operations:**

**CREATE:**
```typescript
// POST /api/workspaces
- Create new workspace
- Auto-create on signup
- Set default settings
- Initialize quota
```

**READ:**
```typescript
// GET /api/workspaces
- List user's workspaces
- Get current workspace details
- Get workspace stats (usage, quota, etc)
```

**UPDATE:**
```typescript
// PUT /api/workspaces/:id
- Update workspace name
- Update workspace settings
- Change plan (free/pro/business)
- Update quota
```

**DELETE:**
```typescript
// DELETE /api/workspaces/:id
- Delete workspace
- Delete all associated chatbots
- Delete all documents
- Clean up Pinecone namespaces
```

#### **Files to Create:**

**1. Workspace API** (`src/app/api/workspaces/route.ts`)
```typescript
export async function GET(req: Request) {
  // Get user's workspaces
}

export async function POST(req: Request) {
  // Create new workspace
}
```

**2. Workspace Detail API** (`src/app/api/workspaces/[id]/route.ts`)
```typescript
export async function GET(req: Request, { params }) {
  // Get workspace by ID
}

export async function PUT(req: Request, { params }) {
  // Update workspace
}

export async function DELETE(req: Request, { params }) {
  // Delete workspace + cleanup
}
```

**3. Workspace Switcher UI** (Dashboard component)
```typescript
// Add workspace dropdown in dashboard
<WorkspaceSwitcher 
  workspaces={workspaces}
  current={currentWorkspace}
  onSwitch={handleSwitch}
/>
```

**4. Workspace Settings Page** (`src/app/dashboard/settings/workspace/page.tsx`)
- Edit workspace name
- View usage stats
- Manage team members
- Delete workspace

---

## 🟡 PRIORITY 3: Chatbots CRUD (Complete Implementation)

### 3.1 Chatbots CRUD

#### **Status:** 🟡 Partially Implemented

#### **What Exists:**
- ✅ GET /api/chatbots (basic structure)
- ✅ POST /api/chatbots (basic structure)
- ✅ UI for listing chatbots
- ❌ PUT (update chatbot)
- ❌ DELETE (delete chatbot)
- ❌ Detailed configuration

#### **Required Operations:**

**CREATE (Enhance Existing):**
```typescript
// POST /api/chatbots
{
  workspaceId: "uuid",
  name: "Customer Support Bot",
  description: "Handles customer inquiries",
  useCase: "customer-support",
  
  // AI Configuration
  aiProvider: "openai", // openai, anthropic, google, custom
  model: "gpt-4-turbo-preview",
  temperature: 0.7,
  maxTokens: 2000,
  
  // User's API Keys (encrypted)
  apiKeys: {
    openai: "user-provided-key", // or use platform's key
    anthropic: "user-provided-key",
  },
  
  // System Prompt
  systemPrompt: "You are a helpful assistant...",
  
  // Widget Settings
  widgetSettings: {
    theme: "light",
    primaryColor: "#3b82f6",
    greeting: "Hi! How can I help?",
    position: "bottom-right",
    avatar: "url",
  },
  
  // Advanced Settings
  ragSettings: {
    enabled: true,
    chunkSize: 1000,
    chunkOverlap: 200,
    topK: 4,
    similarityThreshold: 0.7,
  },
}
```

**READ (Enhance Existing):**
```typescript
// GET /api/chatbots?workspaceId=xxx
// Returns list with stats

// GET /api/chatbots/:id
// Returns full config + stats
{
  ...chatbot,
  stats: {
    totalMessages: 4523,
    todayMessages: 142,
    avgResponseTime: "1.2s",
    satisfactionScore: 4.5,
    documentsLinked: 12,
  }
}
```

**UPDATE (New):**
```typescript
// PUT /api/chatbots/:id
- Update all chatbot settings
- Change AI model
- Update system prompt
- Modify widget settings
- Enable/disable features
```

**DELETE (New):**
```typescript
// DELETE /api/chatbots/:id
- Delete chatbot
- Keep or delete conversations (option)
- Keep or delete documents (option)
- Clean up Pinecone namespace (option)
```

**Additional Endpoints:**
```typescript
// POST /api/chatbots/:id/duplicate
- Clone existing chatbot

// POST /api/chatbots/:id/toggle
- Enable/disable chatbot

// GET /api/chatbots/:id/stats
- Detailed analytics

// POST /api/chatbots/:id/test
- Test chatbot without affecting stats
```

#### **Files to Create:**

**1. Chatbot Detail API** (`src/app/api/chatbots/[id]/route.ts`)
```typescript
export async function GET(req, { params }) {
  // Get chatbot details + stats
}

export async function PUT(req, { params }) {
  // Update chatbot configuration
}

export async function DELETE(req, { params }) {
  // Delete chatbot + cleanup
}
```

**2. Chatbot Actions API** (`src/app/api/chatbots/[id]/[action]/route.ts`)
```typescript
// /api/chatbots/:id/duplicate
// /api/chatbots/:id/toggle
// /api/chatbots/:id/stats
```

**3. Chatbot Create/Edit Page** (`src/app/dashboard/chatbots/new/page.tsx`)
```typescript
// Multi-step wizard:
// Step 1: Basic Info (name, description, use case)
// Step 2: AI Configuration (provider, model, settings)
// Step 3: System Prompt (templates + custom)
// Step 4: Widget Customization (theme, colors, position)
// Step 5: Advanced Settings (RAG, rate limiting)
```

**4. Chatbot Edit Page** (`src/app/dashboard/chatbots/[id]/edit/page.tsx`)
- Reuse create wizard
- Pre-fill with existing data
- Show preview

---

## 🟡 PRIORITY 4: Knowledge Base / Documents CRUD

### 4.1 Documents CRUD

#### **Status:** 🟡 Partially Implemented

#### **What Exists:**
- ✅ POST /api/documents/upload (basic structure)
- ✅ UI for upload (drag & drop)
- ✅ UI for listing documents
- ❌ GET (list documents)
- ❌ DELETE (delete document)
- ❌ Document status tracking
- ❌ Re-processing failed documents

#### **Required Operations:**

**CREATE (Enhance):**
```typescript
// POST /api/documents/upload
- Support multiple files
- Show upload progress
- Process async (job queue)
- Return processing status
- Extract metadata
- Generate embeddings
- Store in Pinecone
```

**READ:**
```typescript
// GET /api/documents?chatbotId=xxx
{
  documents: [
    {
      id: "uuid",
      filename: "product-catalog.pdf",
      size: 2400000, // bytes
      mimeType: "application/pdf",
      status: "completed", // pending, processing, completed, failed
      chunks: 45,
      uploadedAt: "2024-01-20",
      uploadedBy: "user-id",
      errorMessage: null,
    }
  ],
  total: 28,
  totalSize: 7800000, // bytes
  quotaUsed: "7.8 MB",
  quotaLimit: "100 MB",
}

// GET /api/documents/:id
// Get document details + chunks preview
```

**UPDATE:**
```typescript
// PUT /api/documents/:id
- Update document metadata
- Rename document
- Re-process document (if failed)
```

**DELETE:**
```typescript
// DELETE /api/documents/:id
- Delete file from storage
- Delete embeddings from Pinecone
- Update chunk count

// DELETE /api/documents/bulk
- Delete multiple documents
```

**Additional Endpoints:**
```typescript
// POST /api/documents/:id/reprocess
- Re-extract and re-embed document

// GET /api/documents/:id/download
- Download original file

// GET /api/documents/:id/chunks
- View document chunks (for debugging)
```

#### **Files to Create:**

**1. Documents List API** (`src/app/api/documents/route.ts`)
```typescript
export async function GET(req: Request) {
  // List documents with filters
  const { chatbotId, status, search } = req.query
}
```

**2. Document Detail API** (`src/app/api/documents/[id]/route.ts`)
```typescript
export async function GET(req, { params }) {
  // Get document details
}

export async function PUT(req, { params }) {
  // Update document
}

export async function DELETE(req, { params }) {
  // Delete document + cleanup
}
```

**3. Document Actions** (`src/app/api/documents/[id]/[action]/route.ts`)
```typescript
// /api/documents/:id/reprocess
// /api/documents/:id/download
// /api/documents/:id/chunks
```

**4. Upload Progress Tracking**
```typescript
// WebSocket or polling for real-time status
// Show: Uploading → Processing → Embedding → Completed
```

---

## 🟢 PRIORITY 5: Conversations CRUD

### 5.1 Conversations Management

#### **Status:** 🔴 Not Implemented

#### **Required Operations:**

**CREATE (Automatic):**
```typescript
// Auto-created during chat
// POST /api/conversations
{
  chatbotId: "uuid",
  visitorId: "anonymous-xxx",
  channel: "web", // web, api, widget
  metadata: {
    userAgent: "...",
    referrer: "...",
    ip: "xxx.xxx.xxx.xxx",
    location: "Indonesia",
  }
}
```

**READ:**
```typescript
// GET /api/conversations?chatbotId=xxx
// List conversations with pagination

// GET /api/conversations/:id
// Get full conversation with messages

// GET /api/conversations/stats
// Get aggregate stats
```

**UPDATE:**
```typescript
// PUT /api/conversations/:id
- Add tags
- Add notes
- Mark as resolved
- Assign to team member
- Update satisfaction score
```

**DELETE:**
```typescript
// DELETE /api/conversations/:id
- Delete single conversation

// DELETE /api/conversations/bulk
- Delete multiple (with filters)

// DELETE /api/conversations/export
- Export before delete (GDPR compliance)
```

#### **Files to Create:**

**1. Conversations API** (`src/app/api/conversations/route.ts`)
**2. Conversation Detail API** (`src/app/api/conversations/[id]/route.ts`)
**3. Conversations Page** (`src/app/dashboard/conversations/page.tsx`)
```typescript
// Features:
- List all conversations
- Filter by: chatbot, date, status, rating
- Search messages
- View conversation detail
- Export conversations
- Delete conversations
```

**4. Conversation Detail Page** (`src/app/dashboard/conversations/[id]/page.tsx`)
```typescript
// Features:
- Full message history
- Visitor info
- Conversation metadata
- Add notes
- Add tags
- Export transcript
```

---

## 🔴 PRIORITY 6: Multi-AI Provider System

### 6.1 AI Provider Management

#### **Status:** 🔴 Not Implemented (Critical Feature!)

#### **Concept:**
Users can:
1. Use their own API keys (BYO - Bring Your Own)
2. Buy credits from platform
3. Mix both (fallback)

#### **Supported Providers:**

**1. OpenAI**
- GPT-4 Turbo
- GPT-4
- GPT-3.5 Turbo
- Embeddings (text-embedding-3-large)

**2. Anthropic**
- Claude 3 Opus
- Claude 3 Sonnet
- Claude 3 Haiku

**3. Google**
- Gemini 1.5 Pro
- Gemini 1.5 Flash

**4. Open Source (via Replicate/HuggingFace)**
- Llama 3
- Mixtral
- Falcon

**5. Custom Endpoint**
- Any OpenAI-compatible API
- Self-hosted models

#### **Implementation:**

**Database Schema:**
```sql
-- API Keys Table (encrypted)
CREATE TABLE api_keys (
  id UUID PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id),
  provider VARCHAR(50), -- openai, anthropic, google, custom
  key_name VARCHAR(255), -- user-friendly name
  encrypted_key TEXT, -- encrypted API key
  is_active BOOLEAN DEFAULT true,
  usage_limit DECIMAL, -- optional spending limit
  usage_current DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ
);

-- Platform Credits Table
CREATE TABLE credits (
  id UUID PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id),
  balance DECIMAL DEFAULT 0, -- in USD
  total_purchased DECIMAL DEFAULT 0,
  total_used DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- Credit Transactions
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id),
  type VARCHAR(50), -- purchase, usage, refund
  amount DECIMAL,
  balance_after DECIMAL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ
);

-- Usage Logs (for billing)
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id),
  chatbot_id UUID REFERENCES chatbots(id),
  conversation_id UUID REFERENCES conversations(id),
  provider VARCHAR(50),
  model VARCHAR(100),
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  total_tokens INTEGER,
  cost DECIMAL, -- in USD
  response_time INTEGER, -- milliseconds
  created_at TIMESTAMPTZ
);
```

#### **Files to Create:**

**1. API Keys Management API**
```typescript
// src/app/api/settings/api-keys/route.ts
POST   /api/settings/api-keys       // Add new API key
GET    /api/settings/api-keys       // List API keys (masked)
PUT    /api/settings/api-keys/:id   // Update API key
DELETE /api/settings/api-keys/:id   // Delete API key
POST   /api/settings/api-keys/:id/test // Test API key
```

**2. Credits Management API**
```typescript
// src/app/api/credits/route.ts
GET  /api/credits/balance           // Get current balance
POST /api/credits/purchase          // Buy credits
GET  /api/credits/transactions      // Transaction history
GET  /api/credits/usage             // Usage breakdown
```

**3. AI Provider Service** (`src/lib/ai/providers.ts`)
```typescript
// Abstract provider interface
interface AIProvider {
  chat(params): Promise<Response>
  embed(params): Promise<Embeddings>
  getModels(): Model[]
  validateKey(key): Promise<boolean>
}

// Implementations
class OpenAIProvider implements AIProvider { ... }
class AnthropicProvider implements AIProvider { ... }
class GoogleProvider implements AIProvider { ... }
class CustomProvider implements AIProvider { ... }
```

**4. Provider Router** (`src/lib/ai/router.ts`)
```typescript
// Intelligent routing based on:
// 1. User preference
// 2. API key availability
// 3. Model availability
// 4. Cost optimization
// 5. Fallback strategy

export async function routeRequest(params) {
  // Check user's API keys
  const userKey = await getUserApiKey(provider)
  
  if (userKey) {
    return useUserKey(userKey, params)
  }
  
  // Check platform credits
  const credits = await getCredits(workspaceId)
  
  if (credits > costEstimate) {
    return usePlatformKey(params)
  }
  
  // No credits, return error
  throw new Error('No API key or credits available')
}
```

**5. API Keys Settings Page** (`src/app/dashboard/settings/api-keys/page.tsx`)
```typescript
// Features:
- Add API key for each provider
- Test API key validity
- Set spending limits
- View usage per key
- Enable/disable keys
- Delete keys

// UI:
<ApiKeyCard
  provider="openai"
  name="Production Key"
  maskedKey="sk-...xyz"
  status="active"
  usage={145.32}
  limit={500}
  onTest={handleTest}
  onDelete={handleDelete}
/>
```

**6. Credits Page** (`src/app/dashboard/credits/page.tsx`)
```typescript
// Features:
- View current balance
- Purchase credits (Stripe integration)
- View transaction history
- View usage by chatbot
- Export usage reports

// Pricing:
$10 = 100,000 tokens (OpenAI)
$25 = 250,000 tokens
$100 = 1,000,000 tokens (discount)
```

**7. Enhanced Chat API** (`src/app/api/chat/route.ts`)
```typescript
export async function POST(req: Request) {
  const { chatbotId, messages } = await req.json()
  
  // Get chatbot config
  const chatbot = await getChatbot(chatbotId)
  
  // Route to appropriate provider
  const provider = await routeRequest({
    workspaceId: chatbot.workspace_id,
    preferredProvider: chatbot.aiProvider,
    model: chatbot.model,
  })
  
  // Make request
  const response = await provider.chat({
    model: chatbot.model,
    messages,
    temperature: chatbot.temperature,
  })
  
  // Log usage
  await logUsage({
    workspaceId: chatbot.workspace_id,
    chatbotId,
    provider: provider.name,
    tokens: response.usage,
    cost: calculateCost(response.usage, provider.name),
  })
  
  // Deduct from credits if using platform key
  if (provider.isPlatformKey) {
    await deductCredits(chatbot.workspace_id, cost)
  }
  
  return response
}
```

---

## 🟢 PRIORITY 7: Analytics & Reporting

### 7.1 Analytics System

#### **Status:** 🔴 Not Implemented

#### **Required Features:**

**Dashboard Analytics:**
```typescript
// GET /api/analytics/overview
{
  period: "last_30_days",
  totalMessages: 12458,
  totalConversations: 3241,
  avgResponseTime: "1.2s",
  satisfactionScore: 4.3,
  topQuestions: [
    { question: "What are your hours?", count: 245 },
    { question: "How to return?", count: 189 },
  ],
  messagesByDay: [...],
  conversationsByBot: [...],
}
```

**Chatbot Analytics:**
```typescript
// GET /api/analytics/chatbots/:id
- Messages over time
- Response times
- User satisfaction
- Popular questions
- Drop-off points
- Conversion rate (if tracking)
```

**Documents Analytics:**
```typescript
// GET /api/analytics/documents/:id
- Usage frequency
- Chunks retrieved most
- Relevance scores
- Update recommendations
```

#### **Files to Create:**

**1. Analytics API** (`src/app/api/analytics/route.ts`)
**2. Analytics Page** (`src/app/dashboard/analytics/page.tsx`)
```typescript
// Features:
- Date range selector
- Chatbot selector
- Key metrics cards
- Charts (messages, response time, satisfaction)
- Top questions table
- Export reports (PDF, CSV)
```

---

## 🟡 PRIORITY 8: Team & Permissions

### 8.1 Team Management

#### **Status:** 🔴 Not Implemented

#### **Required Features:**

**Team Members:**
```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id),
  user_id UUID, -- auth user
  role VARCHAR(50), -- owner, admin, member, viewer
  permissions JSONB,
  invited_by UUID,
  invited_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ
);
```

**Roles:**
- **Owner:** Full access, billing
- **Admin:** All except billing
- **Member:** Can manage chatbots & conversations
- **Viewer:** Read-only access

#### **Files to Create:**

**1. Team API** (`src/app/api/team/route.ts`)
**2. Team Page** (`src/app/dashboard/team/page.tsx`)

---

## 📦 Complete CRUD Summary

### What Needs to be Built:

| Module | CREATE | READ | UPDATE | DELETE | Status |
|--------|--------|------|--------|--------|--------|
| **Auth** | ⚠️ Partial | ⚠️ Partial | ❌ Missing | ❌ Missing | 30% |
| **Workspaces** | ❌ Missing | ❌ Missing | ❌ Missing | ❌ Missing | 0% |
| **Chatbots** | ⚠️ Basic | ⚠️ Basic | ❌ Missing | ❌ Missing | 40% |
| **Documents** | ⚠️ Basic | ❌ Missing | ❌ Missing | ❌ Missing | 30% |
| **Conversations** | ⚠️ Auto | ❌ Missing | ❌ Missing | ❌ Missing | 20% |
| **API Keys** | ❌ Missing | ❌ Missing | ❌ Missing | ❌ Missing | 0% |
| **Credits** | ❌ Missing | ❌ Missing | ❌ Missing | ❌ Missing | 0% |
| **Analytics** | N/A | ❌ Missing | N/A | N/A | 0% |
| **Team** | ❌ Missing | ❌ Missing | ❌ Missing | ❌ Missing | 0% |

**Overall Completion:** ~25% (Backend) / 100% (Frontend UI)

---

## 🎯 Development Roadmap

### Phase 1: Core CRUD (Week 1-2)
- ✅ Authentication (complete)
- ✅ Workspaces CRUD
- ✅ Chatbots CRUD (full)
- ✅ Documents CRUD (full)

### Phase 2: AI Features (Week 3)
- ✅ Multi-AI Provider system
- ✅ API Keys management
- ✅ Credits system
- ✅ Usage tracking & billing

### Phase 3: Conversations & Analytics (Week 4)
- ✅ Conversations CRUD
- ✅ Analytics dashboard
- ✅ Reporting & exports

### Phase 4: Team & Advanced (Week 5)
- ✅ Team management
- ✅ Permissions system
- ✅ Advanced settings

### Phase 5: Polish & Deploy (Week 6)
- ✅ Testing all features
- ✅ Bug fixes
- ✅ Performance optimization
- ✅ Documentation
- ✅ Deploy to production

---

## 💰 Monetization Features

### Required for Revenue:

**1. Subscription Management:**
- Stripe integration
- Plan management (upgrade/downgrade)
- Billing portal
- Invoice generation

**2. Credits Marketplace:**
- Buy credits via Stripe
- Credit packages pricing
- Auto-top-up option
- Enterprise custom pricing

**3. Usage-Based Billing:**
- Track API usage
- Calculate costs
- Generate invoices
- Send usage alerts

**4. Enterprise Features:**
- White-label option
- Custom domain
- SSO integration
- SLA guarantees
- Dedicated support

---

## 🚀 Quick Win Priority

**If you have limited time, build in this order:**

1. **Authentication (2 days)** - Must have
2. **Chatbots Full CRUD (3 days)** - Core feature
3. **Multi-AI Provider (4 days)** - Unique selling point
4. **Documents CRUD (2 days)** - Essential
5. **Basic Analytics (2 days)** - User retention

**Total: ~2 weeks for MVP with revenue potential**

---

**This is the complete blueprint! Ready to implement?** 🎯
