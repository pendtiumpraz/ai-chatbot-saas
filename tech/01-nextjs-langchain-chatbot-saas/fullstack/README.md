# 🤖 AI Chatbot SaaS Platform

Multi-tenant SaaS platform untuk membuat dan manage AI chatbots dengan knowledge base integration.

## ✨ Features

### 🎯 Core Features
- ✅ **Multi-tenant Architecture** - Isolated workspace per user
- ✅ **AI Integration** - Support Gemini, OpenAI, Claude
- ✅ **Knowledge Base** - Document upload & RAG
- ✅ **Real-time Chat** - Live testing interface
- ✅ **Analytics Dashboard** - Usage tracking & insights
- ✅ **Team Management** - Role-based access control (RBAC)

### 🤖 AI Models Supported
- **Google Gemini**: 2.0 Flash, 1.5 Pro, 1.5 Flash
- **OpenAI**: GPT-4o, GPT-4o Mini, GPT-3.5 Turbo
- **Anthropic**: Claude 3.5 Sonnet, Claude 3.5 Haiku

### 💼 Workspace Features
- Multiple workspaces per user
- Workspace switching
- Soft delete (recoverable)
- Usage quotas & tracking

### 🔐 Security
- Row Level Security (RLS)
- Encrypted API keys
- Audit logging
- Soft delete on all resources
- Multi-layer permission system

### 🎨 UI Features
- Dark/Light mode
- Responsive design
- Message status indicators
- Markdown rendering
- Real-time updates
- Beautiful glass-morphism design

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **AI**: Gemini API, OpenAI API, Anthropic API
- **Vector DB**: Pinecone (for RAG)
- **Deployment**: Vercel

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm
- Supabase account
- AI API keys (Gemini/OpenAI/Claude)

### Setup

1. **Clone repository**
```bash
git clone https://github.com/pendtiumpraz/ai-chatbot-saas.git
cd ai-chatbot-saas
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI APIs (optional - users can add via UI)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Pinecone
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_environment
PINECONE_INDEX=chatbot-knowledge-base

# App
NEXT_PUBLIC_APP_URL=http://localhost:3011
ENCRYPTION_SECRET=your_random_secret_32_chars
```

4. **Setup database**

Run SQL scripts in Supabase SQL Editor (in order):
```sql
1. COMPLETE_REBUILD_WITH_ISOLATION.sql
2. CREATE_HELPER_FUNCTIONS.sql
3. FIX_NOW.sql (RLS policies)
```

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3011](http://localhost:3011)

## 📚 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Auth pages
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/           # Main app
│   │   ├── chatbots/       # Chatbot CRUD
│   │   ├── knowledge/      # Knowledge base
│   │   ├── conversations/  # Chat history
│   │   ├── analytics/      # Analytics
│   │   ├── team/           # Team management
│   │   ├── workspaces/     # Workspace management
│   │   └── settings/       # Settings
│   └── api/                # API routes
│       ├── chatbots/
│       ├── conversations/
│       ├── workspaces/
│       └── settings/
├── components/
│   ├── dashboard/          # Dashboard components
│   └── ui/                 # UI components
├── lib/
│   ├── ai-clients/         # AI client integrations
│   ├── rbac.ts            # Permission system
│   ├── audit.ts           # Audit logging
│   └── workspace-helper.ts # Workspace utilities
└── supabase/              # Database scripts
    ├── COMPLETE_REBUILD_WITH_ISOLATION.sql
    ├── CREATE_HELPER_FUNCTIONS.sql
    └── FIX_NOW.sql
```

## 🎯 Usage

### Create Chatbot

1. Go to **Dashboard → Chatbots → Create**
2. Fill in basic info (name, description, use case)
3. Configure AI settings (model, temperature, tokens)
4. Write system prompt
5. Customize widget appearance
6. Review & create

### Add Knowledge Base

1. Go to chatbot → **Knowledge Base**
2. Upload documents (PDF, TXT, etc.)
3. Documents automatically processed
4. Chatbot uses knowledge in responses

### Test Chatbot

1. Go to chatbot → **Test**
2. Chat with your bot
3. See real AI responses
4. Message status indicators (sending/delivered/error)
5. Markdown formatting support

### Manage Team

1. Go to **Dashboard → Team**
2. Invite members
3. Assign roles (Owner, Admin, Member, Viewer)
4. Manage permissions

### Create Workspace

1. Click **Workspaces** in sidebar
2. Click **New Workspace**
3. Enter name & industry
4. Workspace created instantly
5. Switch between workspaces in sidebar

## 🔑 API Keys Management

1. Go to **Settings → API Keys**
2. Add your AI provider keys:
   - Google Gemini API
   - OpenAI API
   - Anthropic (Claude) API
3. Keys are encrypted in database
4. Usage tracking per key

## 📊 Analytics

Track chatbot performance:
- Total messages
- Active users
- Response times
- Token usage
- Cost tracking
- Usage trends

## 🛡️ Security Features

- **Row Level Security (RLS)**: Database-level isolation
- **Workspace Isolation**: Complete data separation
- **Encrypted API Keys**: AES-256 encryption
- **Audit Logs**: Track all actions
- **Soft Delete**: Recoverable deletions (30 days)
- **Permission System**: Role-based access control

## 🎨 Customization

### Widget Customization
- Theme (light/dark)
- Primary color
- Position (bottom-right, bottom-left, etc.)
- Greeting message
- Avatar URL

### AI Configuration
- Model selection
- Temperature (0-2)
- Max tokens (100-128000)
- Top P, Frequency penalty, Presence penalty

## 🐛 Troubleshooting

### "Forbidden" errors
Run SQL script:
```sql
-- File: FIX_NOW.sql
-- Sets RLS policies to allow authenticated users
```

### "Workspace not found"
Ensure user has workspace:
```sql
-- Check user workspaces
SELECT * FROM user_roles WHERE user_id = auth.uid();

-- If empty, create workspace via UI
```

### Gemini rate limit (429)
- Free tier: 15 requests/minute
- Solution: Wait 1 minute or upgrade API key
- Alternative: Switch to gpt-4o-mini (500 RPM)

## 📝 License

MIT License

## 👤 Author

**Galih (pendtiumpraz)**
- GitHub: [@pendtiumpraz](https://github.com/pendtiumpraz)
- Email: pendtiumpraz@gmail.com

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database by [Supabase](https://supabase.com/)
- AI by [Google Gemini](https://ai.google.dev/), [OpenAI](https://openai.com/), [Anthropic](https://anthropic.com/)
- UI components from [Tailwind CSS](https://tailwindcss.com/)

---

**Made with ❤️ in Indonesia**
