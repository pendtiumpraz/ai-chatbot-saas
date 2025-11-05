# ✅ Complete Implementation Checklist

## 🎯 Detailed Task List untuk Full CRUD + AI Features

---

## 📋 PHASE 1: Authentication & Session (PRIORITY 1)

### Task 1.1: Supabase Auth Integration
- [ ] Install Supabase auth helpers (already installed)
- [ ] Configure Supabase client
- [ ] Test connection to Supabase

### Task 1.2: Login Implementation
**File:** `src/app/login/page.tsx`
- [ ] Import `createClientComponentClient`
- [ ] Add `useRouter` for navigation
- [ ] Implement `handleLogin` with Supabase auth
- [ ] Add error handling & display
- [ ] Add loading state
- [ ] Test login with email/password

### Task 1.3: Signup Implementation
**File:** `src/app/signup/page.tsx`
- [ ] Implement `handleSignup` with Supabase auth
- [ ] Create workspace after signup
- [ ] Create default chatbot (optional)
- [ ] Add error handling
- [ ] Add loading state
- [ ] Test signup flow

### Task 1.4: OAuth Implementation
**Files:** `src/app/login/page.tsx`, `src/app/signup/page.tsx`
- [ ] Implement Google OAuth
- [ ] Implement GitHub OAuth
- [ ] Create auth callback handler (`src/app/auth/callback/route.ts`) ✅ Already created
- [ ] Test OAuth flow

### Task 1.5: Route Protection
**File:** `src/middleware.ts` ✅ Already created
- [ ] Test middleware protection
- [ ] Add redirect to login for protected routes
- [ ] Add redirect to dashboard for logged-in users

### Task 1.6: Session Management
- [ ] Get user session in components
- [ ] Display user info in dashboard
- [ ] Add logout functionality
- [ ] Test session persistence

### Task 1.7: Password Reset
**Files to Create:**
- [ ] `src/app/forgot-password/page.tsx`
- [ ] `src/app/reset-password/page.tsx`
- [ ] Implement forgot password flow
- [ ] Implement reset password flow
- [ ] Test email delivery

---

## 📋 PHASE 2: Workspaces CRUD (PRIORITY 2)

### Task 2.1: Workspaces API - CREATE
**File:** `src/app/api/workspaces/route.ts`
- [ ] POST endpoint to create workspace
- [ ] Validate workspace name uniqueness
- [ ] Generate slug from name
- [ ] Set default quota & plan
- [ ] Return created workspace

### Task 2.2: Workspaces API - READ
**File:** `src/app/api/workspaces/route.ts`
- [ ] GET endpoint to list user's workspaces
- [ ] Include usage stats
- [ ] Filter by plan
- [ ] Sort by created date

### Task 2.3: Workspace Detail API
**File:** `src/app/api/workspaces/[id]/route.ts`
- [ ] GET endpoint for workspace details
- [ ] Include full stats (messages, chatbots, documents)
- [ ] Include team members
- [ ] Include quota usage

### Task 2.4: Workspaces API - UPDATE
**File:** `src/app/api/workspaces/[id]/route.ts`
- [ ] PUT endpoint to update workspace
- [ ] Update name, industry, settings
- [ ] Update plan (with validation)
- [ ] Update quota

### Task 2.5: Workspaces API - DELETE
**File:** `src/app/api/workspaces/[id]/route.ts`
- [ ] DELETE endpoint
- [ ] Cascade delete all chatbots
- [ ] Cascade delete all documents
- [ ] Clean up Pinecone namespaces
- [ ] Soft delete option

### Task 2.6: Workspace Switcher UI
**File:** Create component `src/components/workspace-switcher.tsx`
- [ ] Dropdown to switch workspaces
- [ ] Show current workspace
- [ ] Create new workspace button
- [ ] Integrate in dashboard sidebar

### Task 2.7: Workspace Settings Page
**File:** `src/app/dashboard/settings/workspace/page.tsx`
- [ ] Workspace info form
- [ ] Update workspace name
- [ ] View usage & quota
- [ ] Upgrade plan button
- [ ] Delete workspace (with confirmation)

---

## 📋 PHASE 3: Chatbots CRUD Complete (PRIORITY 3)

### Task 3.1: Enhance Chatbots CREATE
**File:** `src/app/api/chatbots/route.ts`
- [ ] Add AI provider selection
- [ ] Add model selection
- [ ] Add temperature & maxTokens
- [ ] Add RAG settings
- [ ] Add widget customization
- [ ] Return with full config

### Task 3.2: Chatbots READ (List)
**File:** `src/app/api/chatbots/route.ts` ✅ Basic exists
- [ ] Add pagination
- [ ] Add search by name
- [ ] Add filter by use case
- [ ] Add filter by status
- [ ] Include stats in response

### Task 3.3: Chatbots READ (Detail)
**File:** `src/app/api/chatbots/[id]/route.ts`
- [ ] GET endpoint for single chatbot
- [ ] Include full configuration
- [ ] Include statistics
- [ ] Include linked documents
- [ ] Include recent conversations

### Task 3.4: Chatbots UPDATE
**File:** `src/app/api/chatbots/[id]/route.ts`
- [ ] PUT endpoint to update all settings
- [ ] Validate before update
- [ ] Update widget settings
- [ ] Update AI configuration
- [ ] Update system prompt

### Task 3.5: Chatbots DELETE
**File:** `src/app/api/chatbots/[id]/route.ts`
- [ ] DELETE endpoint
- [ ] Option: keep/delete conversations
- [ ] Option: keep/delete documents
- [ ] Clean up Pinecone namespace
- [ ] Soft delete option

### Task 3.6: Chatbot Actions
**Files:** `src/app/api/chatbots/[id]/[action]/route.ts`
- [ ] POST /duplicate - Clone chatbot
- [ ] POST /toggle - Enable/disable
- [ ] POST /reset - Reset stats
- [ ] GET /embed-code - Get widget code
- [ ] GET /stats - Detailed analytics

### Task 3.7: Chatbot Create Wizard UI
**File:** `src/app/dashboard/chatbots/new/page.tsx`
- [ ] Step 1: Basic info (name, description, use case)
- [ ] Step 2: AI config (provider, model, temperature)
- [ ] Step 3: System prompt (templates + custom)
- [ ] Step 4: Widget customization (preview)
- [ ] Step 5: Review & create
- [ ] Progress indicator
- [ ] Save as draft option

### Task 3.8: Chatbot Edit Page
**File:** `src/app/dashboard/chatbots/[id]/edit/page.tsx`
- [ ] Reuse create wizard
- [ ] Load existing data
- [ ] Show before/after preview
- [ ] Implement save changes
- [ ] Add delete button

### Task 3.9: Chatbot Detail Page
**File:** `src/app/dashboard/chatbots/[id]/page.tsx`
- [ ] Overview tab (stats, info)
- [ ] Configuration tab (view/edit)
- [ ] Documents tab (linked docs)
- [ ] Conversations tab (recent)
- [ ] Analytics tab (detailed)
- [ ] Settings tab (advanced)

---

## 📋 PHASE 4: Documents CRUD Complete (PRIORITY 4)

### Task 4.1: Documents READ
**File:** `src/app/api/documents/route.ts`
- [ ] GET endpoint with pagination
- [ ] Filter by chatbotId
- [ ] Filter by status
- [ ] Search by filename
- [ ] Include stats (total size, quota)

### Task 4.2: Document Detail
**File:** `src/app/api/documents/[id]/route.ts`
- [ ] GET endpoint for single document
- [ ] Include chunks preview
- [ ] Include usage stats
- [ ] Include metadata

### Task 4.3: Documents UPDATE
**File:** `src/app/api/documents/[id]/route.ts`
- [ ] PUT endpoint to update metadata
- [ ] Rename document
- [ ] Update tags
- [ ] Update description

### Task 4.4: Documents DELETE
**File:** `src/app/api/documents/[id]/route.ts`
- [ ] DELETE endpoint
- [ ] Delete from storage
- [ ] Delete from Pinecone
- [ ] Update chatbot stats

### Task 4.5: Bulk Operations
**File:** `src/app/api/documents/bulk/route.ts`
- [ ] POST /bulk-upload - Multiple files
- [ ] DELETE /bulk-delete - Multiple docs
- [ ] POST /bulk-reprocess - Re-process failed

### Task 4.6: Document Actions
**Files:** `src/app/api/documents/[id]/[action]/route.ts`
- [ ] POST /reprocess - Re-process failed doc
- [ ] GET /download - Download original
- [ ] GET /chunks - View chunks (debugging)
- [ ] GET /stats - Document usage stats

### Task 4.7: Upload Enhancement
**File:** `src/app/api/documents/upload/route.ts` ✅ Basic exists
- [ ] Add progress tracking
- [ ] Add file validation (size, type)
- [ ] Add virus scanning (optional)
- [ ] Add batch processing
- [ ] Add webhook notification

### Task 4.8: Upload UI Enhancement
**File:** `src/app/dashboard/knowledge/page.tsx` ✅ UI exists
- [ ] Connect to upload API
- [ ] Show upload progress bar
- [ ] Show processing status real-time
- [ ] Implement delete functionality
- [ ] Implement reprocess button
- [ ] Add bulk actions

---

## 📋 PHASE 5: Conversations CRUD (PRIORITY 5)

### Task 5.1: Conversations API
**File:** `src/app/api/conversations/route.ts`
- [ ] GET endpoint with pagination
- [ ] Filter by chatbot, date, status
- [ ] Search messages content
- [ ] Include visitor info

### Task 5.2: Conversation Detail API
**File:** `src/app/api/conversations/[id]/route.ts`
- [ ] GET full conversation
- [ ] PUT to add notes/tags
- [ ] DELETE conversation

### Task 5.3: Conversations Page
**File:** `src/app/dashboard/conversations/page.tsx`
- [ ] List all conversations
- [ ] Filter & search
- [ ] Quick view conversation
- [ ] Export conversations
- [ ] Delete conversations
- [ ] Bulk actions

### Task 5.4: Conversation Detail Page
**File:** `src/app/dashboard/conversations/[id]/page.tsx`
- [ ] Full message thread
- [ ] Visitor information
- [ ] Add notes
- [ ] Add tags
- [ ] Rate conversation
- [ ] Export transcript

---

## 📋 PHASE 6: Multi-AI Provider System (PRIORITY 6) ⭐ CRITICAL

### Task 6.1: Database Schema Update
**File:** `supabase/schema.sql`
- [ ] Add `api_keys` table
- [ ] Add `credits` table
- [ ] Add `credit_transactions` table
- [ ] Add `usage_logs` table
- [ ] Run migration

### Task 6.2: API Provider Abstraction
**File:** `src/lib/ai/providers/base.ts`
- [ ] Create `AIProvider` interface
- [ ] Define standard methods (chat, embed, validate)

### Task 6.3: Provider Implementations
**Files:** `src/lib/ai/providers/`
- [ ] `openai.ts` - OpenAI provider
- [ ] `anthropic.ts` - Anthropic provider
- [ ] `google.ts` - Google Gemini provider
- [ ] `replicate.ts` - Open source models
- [ ] `custom.ts` - Custom endpoint

### Task 6.4: Provider Router
**File:** `src/lib/ai/router.ts`
- [ ] Check user API keys first
- [ ] Fallback to platform credits
- [ ] Handle errors gracefully
- [ ] Track usage

### Task 6.5: Encryption Service
**File:** `src/lib/encryption.ts`
- [ ] Encrypt API keys before storage
- [ ] Decrypt for usage
- [ ] Use strong encryption (AES-256)

### Task 6.6: API Keys Management API
**Files:** `src/app/api/settings/api-keys/`
- [ ] POST /api/settings/api-keys - Add key
- [ ] GET /api/settings/api-keys - List keys (masked)
- [ ] PUT /api/settings/api-keys/:id - Update key
- [ ] DELETE /api/settings/api-keys/:id - Delete key
- [ ] POST /api/settings/api-keys/:id/test - Validate key

### Task 6.7: Credits System API
**Files:** `src/app/api/credits/`
- [ ] GET /api/credits/balance - Current balance
- [ ] POST /api/credits/purchase - Buy credits (Stripe)
- [ ] GET /api/credits/transactions - History
- [ ] GET /api/credits/usage - Usage breakdown

### Task 6.8: Usage Tracking
**File:** `src/lib/ai/usage-tracker.ts`
- [ ] Log every API call
- [ ] Calculate cost per request
- [ ] Deduct from credits
- [ ] Alert when low balance

### Task 6.9: API Keys Settings Page
**File:** `src/app/dashboard/settings/api-keys/page.tsx`
- [ ] Add API key form
- [ ] List API keys (masked)
- [ ] Test key button
- [ ] Delete key with confirmation
- [ ] Usage stats per key
- [ ] Set spending limit

### Task 6.10: Credits Page
**File:** `src/app/dashboard/credits/page.tsx`
- [ ] Display current balance
- [ ] Buy credits button (Stripe)
- [ ] Transaction history table
- [ ] Usage chart by chatbot
- [ ] Export usage report

### Task 6.11: Model Selector Component
**File:** `src/components/model-selector.tsx`
- [ ] Dropdown by provider
- [ ] Show model specs (context, cost)
- [ ] Show available models
- [ ] Disable if no API key

### Task 6.12: Update Chat API
**File:** `src/app/api/chat/route.ts` ✅ Basic exists
- [ ] Add provider routing
- [ ] Check API key availability
- [ ] Use user key or platform credits
- [ ] Log usage
- [ ] Deduct credits
- [ ] Handle provider errors

---

## 📋 PHASE 7: Enhanced Chatbots CRUD

### Task 7.1: Chatbot Create API Enhancement
**File:** `src/app/api/chatbots/route.ts` ✅ Basic exists
- [ ] Add AI provider field
- [ ] Add model selection
- [ ] Add temperature, maxTokens
- [ ] Add RAG configuration
- [ ] Add rate limiting settings
- [ ] Validate all inputs

### Task 7.2: Chatbot Detail API
**File:** `src/app/api/chatbots/[id]/route.ts`
- [ ] GET - Full chatbot details + stats
- [ ] PUT - Update chatbot config
- [ ] DELETE - Delete chatbot + cleanup

### Task 7.3: Chatbot Actions APIs
**Files:** `src/app/api/chatbots/[id]/`
- [ ] `duplicate/route.ts` - Clone chatbot
- [ ] `toggle/route.ts` - Enable/disable
- [ ] `stats/route.ts` - Detailed stats
- [ ] `embed-code/route.ts` - Get widget code

### Task 7.4: Chatbot Create Wizard
**File:** `src/app/dashboard/chatbots/new/page.tsx`
- [ ] Multi-step form (5 steps)
- [ ] Step 1: Basic info
- [ ] Step 2: AI configuration (provider, model)
- [ ] Step 3: System prompt (templates)
- [ ] Step 4: Widget customization
- [ ] Step 5: Review & create
- [ ] Progress indicator
- [ ] Form validation

### Task 7.5: Chatbot Edit Page
**File:** `src/app/dashboard/chatbots/[id]/edit/page.tsx`
- [ ] Fetch existing chatbot data
- [ ] Reuse wizard components
- [ ] Show changes preview
- [ ] Save changes API call
- [ ] Redirect after save

### Task 7.6: Chatbot Detail Page
**File:** `src/app/dashboard/chatbots/[id]/page.tsx`
- [ ] Tabbed interface
- [ ] Overview tab (stats, info)
- [ ] Configuration tab
- [ ] Documents tab (linked)
- [ ] Conversations tab
- [ ] Analytics tab
- [ ] Settings tab

---

## 📋 PHASE 8: Documents CRUD Complete

### Task 8.1: Documents List API
**File:** `src/app/api/documents/route.ts`
- [ ] GET endpoint with pagination
- [ ] Filter by chatbotId, status
- [ ] Search by filename
- [ ] Include quota stats
- [ ] Sort by date, size, status

### Task 8.2: Document Detail API
**File:** `src/app/api/documents/[id]/route.ts`
- [ ] GET - Document details
- [ ] PUT - Update metadata
- [ ] DELETE - Delete doc + embeddings

### Task 8.3: Document Actions
**Files:** `src/app/api/documents/[id]/`
- [ ] `reprocess/route.ts` - Re-process failed
- [ ] `download/route.ts` - Download original
- [ ] `chunks/route.ts` - View chunks

### Task 8.4: Upload API Enhancement
**File:** `src/app/api/documents/upload/route.ts` ✅ Basic exists
- [ ] Add real-time progress updates
- [ ] Add file validation
- [ ] Add batch upload support
- [ ] Improve error handling
- [ ] Add webhook notifications

### Task 8.5: Upload UI Enhancement
**File:** `src/app/dashboard/knowledge/page.tsx` ✅ UI exists
- [ ] Connect to upload API
- [ ] Show upload progress
- [ ] Real-time status updates (WebSocket or polling)
- [ ] Implement delete (connect to API)
- [ ] Implement reprocess button
- [ ] Implement bulk delete

### Task 8.6: Document Viewer
**File:** `src/app/dashboard/knowledge/[id]/page.tsx`
- [ ] View document details
- [ ] View chunks list
- [ ] View usage stats
- [ ] Edit metadata
- [ ] Reprocess button
- [ ] Delete button

---

## 📋 PHASE 9: Conversations Management

### Task 9.1: Conversations API
**File:** `src/app/api/conversations/route.ts`
- [ ] GET - List with pagination
- [ ] POST - Create (auto from chat)
- [ ] Filter by chatbot, date, status
- [ ] Search message content

### Task 9.2: Conversation Detail API
**File:** `src/app/api/conversations/[id]/route.ts`
- [ ] GET - Full conversation
- [ ] PUT - Update (tags, notes, status)
- [ ] DELETE - Delete conversation

### Task 9.3: Conversation Stats API
**File:** `src/app/api/conversations/stats/route.ts`
- [ ] GET - Aggregate stats
- [ ] Total conversations
- [ ] Avg messages per conversation
- [ ] Avg satisfaction score

### Task 9.4: Conversations List Page
**File:** `src/app/dashboard/conversations/page.tsx`
- [ ] Table view with filters
- [ ] Search functionality
- [ ] Quick preview modal
- [ ] Export selected
- [ ] Delete selected
- [ ] Pagination

### Task 9.5: Conversation Detail Page
**File:** `src/app/dashboard/conversations/[id]/page.tsx`
- [ ] Full message thread
- [ ] Visitor info panel
- [ ] Add notes textarea
- [ ] Add tags input
- [ ] Rating selector
- [ ] Export button
- [ ] Delete button

### Task 9.6: Update Chat API
**File:** `src/app/api/chat/route.ts` ✅ Basic exists
- [ ] Save conversation to database
- [ ] Update existing conversation
- [ ] Track visitor info
- [ ] Real-time updates

---

## 📋 PHASE 10: Analytics & Reporting

### Task 10.1: Analytics API
**File:** `src/app/api/analytics/overview/route.ts`
- [ ] GET - Dashboard metrics
- [ ] Date range filter
- [ ] Workspace-level stats
- [ ] Chatbot comparison

### Task 10.2: Chatbot Analytics API
**File:** `src/app/api/analytics/chatbots/[id]/route.ts`
- [ ] GET - Chatbot-specific analytics
- [ ] Messages over time
- [ ] Response times
- [ ] Satisfaction scores
- [ ] Popular questions

### Task 10.3: Analytics Dashboard Page
**File:** `src/app/dashboard/analytics/page.tsx`
- [ ] Date range picker
- [ ] Chatbot selector
- [ ] Metrics cards
- [ ] Charts (Line, Bar, Pie)
- [ ] Top questions table
- [ ] Export reports

### Task 10.4: Charts Components
**Files:** `src/components/charts/`
- [ ] `messages-chart.tsx` - Messages over time
- [ ] `response-time-chart.tsx` - Response times
- [ ] `satisfaction-chart.tsx` - Satisfaction scores
- [ ] `usage-chart.tsx` - Usage by chatbot

---

## 📋 PHASE 11: Team Management

### Task 11.1: Team Database Schema
- [ ] Add `team_members` table
- [ ] Add `invitations` table
- [ ] Define roles & permissions

### Task 11.2: Team API
**Files:** `src/app/api/team/`
- [ ] POST /invite - Invite team member
- [ ] GET /members - List team members
- [ ] PUT /members/:id - Update role
- [ ] DELETE /members/:id - Remove member

### Task 11.3: Team Page
**File:** `src/app/dashboard/team/page.tsx`
- [ ] List team members
- [ ] Invite member form
- [ ] Role selector
- [ ] Remove member
- [ ] Pending invitations

---

## 📋 PHASE 12: Settings & Configuration

### Task 12.1: Settings Pages Structure
**Files:** `src/app/dashboard/settings/`
- [ ] `page.tsx` - Settings overview
- [ ] `workspace/page.tsx` - Workspace settings ✅ Planned
- [ ] `api-keys/page.tsx` - API keys management ✅ Planned
- [ ] `billing/page.tsx` - Subscription & billing
- [ ] `team/page.tsx` - Team settings
- [ ] `notifications/page.tsx` - Notification preferences

### Task 12.2: Billing Integration
**Files:** `src/app/api/billing/`
- [ ] Stripe integration
- [ ] POST /subscribe - Subscribe to plan
- [ ] POST /upgrade - Upgrade plan
- [ ] POST /cancel - Cancel subscription
- [ ] GET /invoices - Billing history
- [ ] Webhook handler for Stripe events

---

## 📋 PHASE 13: Widget & Embeddable Chat

### Task 13.1: Widget Script
**File:** `public/widget.js`
- [ ] Standalone JavaScript for embedding
- [ ] Initialize chatbot on page load
- [ ] Connect to chat API
- [ ] Customizable appearance
- [ ] Mobile-responsive

### Task 13.2: Widget API
**File:** `src/app/api/widget/[chatbotId]/route.ts`
- [ ] GET chatbot config for widget
- [ ] Public endpoint (no auth required)
- [ ] Rate limiting per IP

### Task 13.3: Widget Preview
**File:** `src/app/dashboard/chatbots/[id]/widget/page.tsx`
- [ ] Preview widget appearance
- [ ] Customize settings
- [ ] Copy embed code
- [ ] Test widget

### Task 13.4: Embed Code Generator
**File:** `src/lib/embed-code-generator.ts`
- [ ] Generate script tag
- [ ] Generate configuration
- [ ] Generate styling options

---

## 🎯 Implementation Priority Order

### 🔴 **Must Have (Week 1-2):**
1. ✅ Authentication complete
2. ✅ Workspaces CRUD
3. ✅ Chatbots CRUD (full)
4. ✅ Documents CRUD (full)
5. ✅ Multi-AI Provider system
6. ✅ API Keys management

### 🟡 **Should Have (Week 3):**
7. ✅ Conversations CRUD
8. ✅ Basic Analytics
9. ✅ Credits system
10. ✅ Usage tracking

### 🟢 **Nice to Have (Week 4):**
11. ✅ Team management
12. ✅ Advanced analytics
13. ✅ Embeddable widget
14. ✅ Billing integration

---

## 📊 File Count to Create/Update

### New Files to Create: **~80 files**

**API Routes:** ~35 files
- Workspaces: 3 files
- Chatbots: 10 files
- Documents: 8 files
- Conversations: 6 files
- API Keys: 5 files
- Credits: 4 files
- Analytics: 6 files
- Team: 3 files

**Pages:** ~25 files
- Settings pages: 6 files
- Chatbot pages: 8 files
- Knowledge base pages: 4 files
- Conversations pages: 3 files
- Credits pages: 2 files
- Analytics pages: 2 files

**Components:** ~15 files
- Forms
- Charts
- Tables
- Modals

**Libraries:** ~5 files
- AI providers
- Encryption
- Usage tracker
- Embed code generator

---

## 💡 Feature Comparison: User API Key vs Platform Credits

### **Option 1: User Brings API Key (BYO)**

**Pros:**
- ✅ No cost to platform
- ✅ Unlimited usage for user
- ✅ User controls spending
- ✅ Direct billing to user's account

**Cons:**
- ❌ Setup friction (user must get API key)
- ❌ Technical knowledge required
- ❌ Platform has no revenue from AI usage

**Implementation:**
```typescript
// User adds their OpenAI key
await supabase.from('api_keys').insert({
  workspace_id: workspaceId,
  provider: 'openai',
  encrypted_key: encrypt(userApiKey),
})

// System uses user's key
const response = await openai.chat({
  apiKey: decrypt(userKey),
  ...params
})
```

### **Option 2: Platform Credits (Resell)**

**Pros:**
- ✅ Easy for users (no API key needed)
- ✅ Platform revenue (markup on credits)
- ✅ Simpler onboarding
- ✅ Usage controls

**Cons:**
- ❌ Platform must front cost
- ❌ Need payment processing
- ❌ Risk of abuse

**Implementation:**
```typescript
// User buys credits
await stripe.checkout.create({
  amount: 10.00, // $10
  credits: 100000, // tokens
})

// System uses platform key
const response = await openai.chat({
  apiKey: process.env.OPENAI_API_KEY,
  ...params
})

// Deduct from user's balance
await deductCredits(workspaceId, cost)
```

### **Option 3: Hybrid (Recommended!)** ⭐

**Implementation:**
```typescript
async function routeAIRequest(params) {
  // Priority 1: Check user's API key
  const userKey = await getUserApiKey(provider)
  if (userKey && userKey.is_active) {
    return useUserKey(userKey, params)
  }
  
  // Priority 2: Check platform credits
  const credits = await getCredits(workspaceId)
  if (credits.balance >= estimatedCost) {
    const response = await usePlatformKey(params)
    await deductCredits(workspaceId, actualCost)
    return response
  }
  
  // No key & no credits
  throw new Error('Please add API key or purchase credits')
}
```

**UI Flow:**
```
1. User creates chatbot
2. System asks: "How do you want to use AI?"
   - Option A: Use my API key (unlimited, no cost)
   - Option B: Buy credits from us (easy, $10 = 100k tokens)
   - Option C: Use both (API key primary, credits fallback)
3. User chooses & configures
4. Chatbot works! ✅
```

---

## 💰 Pricing Strategy for Credits

### **Credit Packages:**

| Package | Price (USD) | Price (IDR) | Tokens | Cost per 1k |
|---------|-------------|-------------|--------|-------------|
| Starter | $10 | Rp 150,000 | 100,000 | $0.10 |
| Pro | $50 | Rp 750,000 | 600,000 | $0.083 |
| Business | $200 | Rp 3,000,000 | 2,500,000 | $0.08 |
| Enterprise | Custom | Custom | Custom | Negotiated |

### **Markup Calculation:**

**OpenAI Pricing:**
- GPT-4 Turbo: $0.01 per 1k input tokens, $0.03 per 1k output
- Avg cost per request: ~$0.02 (assuming 1k tokens total)

**Platform Pricing:**
- Sell at $0.10 per 1k tokens
- **Markup:** 3-5x (industry standard)
- **Profit margin:** 67-80%

**Example:**
- User pays $10 for 100k tokens
- Actual OpenAI cost: ~$2
- Platform profit: $8 (80%)
- Covers: infrastructure, support, development

---

## 🎯 Development Time Estimates

### **Realistic Timeline:**

**Week 1:** Authentication & Workspaces (40 hours)
- Day 1-2: Auth complete (login, signup, logout)
- Day 3-4: Workspaces CRUD
- Day 5: Testing & bug fixes

**Week 2:** Chatbots CRUD Complete (40 hours)
- Day 1-2: API endpoints (GET, PUT, DELETE)
- Day 3-4: Create wizard UI
- Day 5: Edit page & testing

**Week 3:** Multi-AI Provider System (40 hours) ⭐
- Day 1: Database schema & migration
- Day 2: Provider implementations
- Day 3: Router & encryption
- Day 4: API Keys UI & Credits UI
- Day 5: Integration & testing

**Week 4:** Documents & Conversations (40 hours)
- Day 1-2: Documents CRUD complete
- Day 3-4: Conversations CRUD
- Day 5: Testing

**Week 5:** Analytics & Reporting (30 hours)
- Day 1-2: Analytics APIs
- Day 3-4: Analytics dashboard UI
- Day 5: Charts & exports

**Week 6:** Polish & Deploy (30 hours)
- Day 1-2: Bug fixes
- Day 3: Performance optimization
- Day 4: Documentation
- Day 5: Deploy to production

**Total:** 6 weeks (220 hours) for complete implementation

---

## 📈 MVP (Minimum Viable Product)

**If time is limited, focus on:**

### **2-Week MVP Sprint:**

**Week 1:**
- ✅ Auth (login, signup, logout)
- ✅ Chatbots CRUD (basic)
- ✅ Documents upload (basic)
- ✅ Chat working (OpenAI only)

**Week 2:**
- ✅ Multi-AI provider (OpenAI + Anthropic)
- ✅ User API keys (BYO)
- ✅ Platform credits (basic)
- ✅ Basic analytics

**Result:** Sellable MVP in 2 weeks! 🚀

---

## 🔥 Hot Features for Indonesia Market

### **Must-Have for Indonesia:**
1. ✅ **Midtrans Payment** (bukan Stripe)
2. ✅ **QRIS Payment** integration
3. ✅ **Bahasa Indonesia** prompts & UI
4. ✅ **WhatsApp Integration** (high demand!)
5. ✅ **IDR Pricing** prominent

### **Nice-to-Have:**
- OVO, GoPay, Dana integration
- Bank transfer (virtual account)
- Indonesian phone number auth
- Regional language support (Javanese, Sundanese)

---

## 📝 Next Immediate Steps

**What to Build First (Priority Order):**

1. **Supabase Auth Integration** (2 days)
   - Login, signup, logout working
   - Route protection active
   - Session management

2. **Workspaces CRUD** (2 days)
   - Create, read, update, delete
   - Workspace switcher
   - Settings page

3. **Multi-AI Provider Core** (3 days)
   - API keys table & encryption
   - Provider router
   - API keys management UI

4. **Chatbots CRUD Complete** (3 days)
   - Full CRUD operations
   - Create wizard
   - Edit page

5. **Documents CRUD Complete** (2 days)
   - List, upload, delete working
   - Status tracking real-time

**Total:** 12 days to core features complete!

---

## 🎯 Decision Time

**Mau saya implement sekarang?**

**Option A:** Start dengan Authentication (most critical)
**Option B:** Start dengan Multi-AI Provider (unique feature)
**Option C:** Complete all CRUDs systematically (A-Z)

**Atau mau buat prioritas sendiri?** 🤔

---

**This is the complete blueprint for production-ready SaaS!** 🎯✨
