# Installation Guide - Step by Step

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] **Node.js 18+** installed ([Download](https://nodejs.org/))
- [ ] **Git** installed ([Download](https://git-scm.com/))
- [ ] **Code Editor** (VS Code recommended)
- [ ] **Supabase Account** (Free tier OK)
- [ ] **OpenAI API Key** ($5 minimum credit recommended)
- [ ] **Pinecone Account** (Free tier OK)
- [ ] **Vercel Account** (for deployment, optional for local dev)

---

## 🚀 Quick Start (5 Minutes)

### Option 1: Local Development

```bash
# 1. Navigate to project
cd D:\AI\tech\01-nextjs-langchain-chatbot-saas\fullstack

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Edit .env.local with your keys (see below)

# 5. Run development server
npm run dev

# 6. Open browser
# Visit http://localhost:3000
```

### Option 2: One-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/your-repo)

---

## 🔧 Detailed Setup

### Step 1: Clone or Navigate to Project

If you haven't already:
```bash
cd D:\AI\tech\01-nextjs-langchain-chatbot-saas\fullstack
```

### Step 2: Install Dependencies

```bash
npm install
```

Expected output:
```
added 456 packages, and audited 457 packages in 45s
found 0 vulnerabilities
```

### Step 3: Setup Supabase

#### 3.1 Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - **Project name:** `chatbot-saas` (or any name)
   - **Database password:** (save this!)
   - **Region:** Choose closest to you
4. Click **"Create new project"**
5. Wait ~2 minutes for provisioning

#### 3.2 Run Database Schema
1. In Supabase Dashboard → **SQL Editor**
2. Click **"New query"**
3. Copy entire content from `supabase/schema.sql`
4. Paste into editor
5. Click **"Run"** (or press Ctrl/Cmd + Enter)
6. Verify success: Check **Table Editor** → Should see tables:
   - `workspaces`
   - `chatbots`
   - `conversations`
   - `documents`

#### 3.3 Create Storage Bucket
1. Go to **Storage** in Supabase Dashboard
2. Click **"Create a new bucket"**
3. Bucket name: `documents`
4. **Public bucket:** ✅ Yes (check this!)
5. Click **"Create bucket"**

#### 3.4 Get Supabase API Keys
1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL** → Save as `NEXT_PUBLIC_SUPABASE_URL`
   - **`anon` `public`** key → Save as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **`service_role` `secret`** key → Save as `SUPABASE_SERVICE_ROLE_KEY`

### Step 4: Setup Pinecone

#### 4.1 Create Pinecone Account
1. Go to https://www.pinecone.io/
2. Click **"Sign Up"** (free tier available)
3. Verify email

#### 4.2 Create Index
1. In Pinecone Console → **"Create Index"**
2. Fill in:
   - **Index Name:** `chatbot-knowledge-base`
   - **Dimensions:** `1536` (important! OpenAI embeddings size)
   - **Metric:** `cosine`
   - **Cloud Provider:** AWS (or GCP, your choice)
   - **Region:** Choose closest to you (e.g., `us-east-1`)
3. Click **"Create Index"**
4. Wait ~1 minute for index to be ready

#### 4.3 Get Pinecone API Key
1. Go to **API Keys** tab
2. Copy your API key → Save as `PINECONE_API_KEY`
3. Note your **Environment** (e.g., `us-east-1-aws`) → Save as `PINECONE_ENVIRONMENT`

### Step 5: Get OpenAI API Key

#### 5.1 Create OpenAI Account
1. Go to https://platform.openai.com/signup
2. Sign up (or login)
3. **Add payment method** in Billing (required for API access)

#### 5.2 Create API Key
1. Go to https://platform.openai.com/api-keys
2. Click **"Create new secret key"**
3. Name it: `chatbot-saas`
4. Copy key immediately (you can't see it again!) → Save as `OPENAI_API_KEY`

#### 5.3 Add Credits
- Minimum: $5 (enough for testing)
- Recommended: $20-$50 for production use

### Step 6: Configure Environment Variables

Create `.env.local` file in `fullstack/` folder:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Pinecone
PINECONE_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX=chatbot-knowledge-base

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Security Note:** Never commit `.env.local` to Git!

### Step 7: Test Installation

```bash
# Start development server
npm run dev
```

Expected output:
```
  ▲ Next.js 14.2.0
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.x:3000

 ✓ Ready in 2.5s
```

### Step 8: Verify Setup

1. Open browser: http://localhost:3000
2. Check browser console for errors
3. Check terminal for startup errors

---

## 🧪 Testing Your Installation

### Test 1: Create Workspace

**Option A: Via Database**
```sql
-- In Supabase SQL Editor
INSERT INTO workspaces (name, slug, industry, plan)
VALUES ('Test Company', 'test-company', 'Technology', 'pro')
RETURNING id;
```

Copy the returned `id`.

**Option B: Via API (requires auth setup)**
```bash
curl -X POST http://localhost:3000/api/workspaces \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Company",
    "slug": "test-company",
    "industry": "Technology"
  }'
```

### Test 2: Create Chatbot

```bash
curl -X POST http://localhost:3000/api/chatbots \
  -H "Content-Type: application/json" \
  -d '{
    "workspaceId": "YOUR_WORKSPACE_ID_FROM_STEP_1",
    "name": "Test Bot",
    "description": "My first chatbot",
    "useCase": "general"
  }'
```

Expected response:
```json
{
  "success": true,
  "chatbot": {
    "id": "...",
    "name": "Test Bot",
    "pinecone_namespace": "workspace-...",
    ...
  }
}
```

Copy the `chatbot.id`.

### Test 3: Upload Document

Create a test file `test-doc.txt`:
```
This is a test document for the chatbot.
Our company offers AI chatbot solutions.
We support multiple industries and use cases.
Contact us at info@example.com for more information.
```

Upload:
```bash
curl -X POST http://localhost:3000/api/documents/upload \
  -F "file=@test-doc.txt" \
  -F "chatbotId=YOUR_CHATBOT_ID_FROM_STEP_2"
```

Expected response:
```json
{
  "success": true,
  "documentId": "...",
  "message": "Document uploaded and processing started"
}
```

Wait ~10-30 seconds for processing.

### Test 4: Chat with Bot

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "chatbotId": "YOUR_CHATBOT_ID",
    "messages": [
      {"role": "user", "content": "What does your company do?"}
    ],
    "visitorId": "test-user-123"
  }'
```

Expected: Streaming response with AI answer based on your test document.

---

## 🐛 Troubleshooting

### Problem: `npm install` fails

**Solution:**
```bash
# Clear cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Problem: "Module not found: Can't resolve '@/lib/...'"

**Solution:** Check `tsconfig.json` has correct paths:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Problem: Supabase connection error

**Checklist:**
- [ ] `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `.env.local` has correct `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `.env.local` has correct `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Supabase project is running (not paused)
- [ ] Database schema was executed successfully

Test connection:
```bash
curl https://YOUR_PROJECT.supabase.co/rest/v1/ \
  -H "apikey: YOUR_ANON_KEY"
```

### Problem: OpenAI API error "Insufficient quota"

**Solution:**
1. Go to https://platform.openai.com/account/billing
2. Add payment method
3. Add credits ($5 minimum)
4. Wait 5-10 minutes for activation

### Problem: Pinecone error "Index not found"

**Checklist:**
- [ ] Index name in `.env.local` matches Pinecone console
- [ ] Index dimensions are `1536`
- [ ] Index status is "Ready" (not "Initializing")

### Problem: Document upload fails

**Checklist:**
- [ ] Supabase storage bucket `documents` exists
- [ ] Bucket is public
- [ ] File size < 10 MB
- [ ] File type is PDF, DOCX, or TXT

### Problem: "TypeError: Cannot read property 'asRetriever' of undefined"

**Solution:** Make sure you uploaded documents and they finished processing.

Check document status:
```sql
-- In Supabase SQL Editor
SELECT * FROM documents WHERE chatbot_id = 'YOUR_CHATBOT_ID';
```

Status should be `completed`, not `pending` or `processing`.

---

## 📦 Package Installation Issues

### If `sharp` fails to install (Windows)

```bash
npm install --platform=win32 --arch=x64 sharp
```

### If `pdf-parse` fails

```bash
npm install --legacy-peer-deps
```

### Alternative: Use Yarn

```bash
npm install -g yarn
yarn install
yarn dev
```

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] `.env.local` is in `.gitignore`
- [ ] Never commit API keys to Git
- [ ] Use `SUPABASE_SERVICE_ROLE_KEY` only in server-side code
- [ ] Enable Supabase RLS policies
- [ ] Implement rate limiting
- [ ] Add user authentication
- [ ] Validate file uploads (type, size)
- [ ] Sanitize user inputs
- [ ] Use HTTPS in production

---

## 🚀 Ready for Production?

Once local setup works:

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repo
   - Add environment variables
   - Deploy!

3. **Update URLs:**
   - Change `NEXT_PUBLIC_APP_URL` to your Vercel URL
   - Update CORS settings if needed

---

## 📚 Next Steps

- [ ] Read `USE_CASES.md` for industry examples
- [ ] Read `DEPLOYMENT_GUIDE.md` for production deployment
- [ ] Build admin dashboard UI
- [ ] Add authentication (Supabase Auth)
- [ ] Create embeddable widget
- [ ] Implement analytics

---

## 🆘 Need Help?

- **Documentation:** Check other markdown files in this folder
- **Supabase Docs:** https://supabase.com/docs
- **LangChain Docs:** https://js.langchain.com/
- **Next.js Docs:** https://nextjs.org/docs
- **GitHub Issues:** Create issue in your repo

---

**Installation Complete! Happy Building! 🎉**
