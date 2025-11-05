# 🔑 Cara Mendapatkan Supabase Service Role Key

## ✅ Yang Sudah Saya Setup:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bfmwpnrjlpelpatwobfv.supabase.co ✅
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... ✅
```

## ❌ Yang Masih Perlu:

### 1. **Service Role Key** (PENTING!)

**Cara Mendapatkan:**

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select project: **universal-ai-chatbot**
3. Go to: **Settings** → **API**
4. Scroll down ke section **"Project API keys"**
5. Cari key dengan label: **`service_role` `secret`**
6. Click **"Reveal"** atau **"Copy"**
7. Paste ke `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ WARNING:** Service role key ini bypass Row Level Security! Jangan share atau commit ke Git!

---

### 2. **Run Database Schema**

Setelah dapat service role key, run schema SQL:

1. Di Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy paste isi file: `supabase/schema.sql`
4. Click **"Run"** (atau press Ctrl + Enter)

Expected output:
```
Success. No rows returned
```

5. Verify di **Table Editor** → Should see tables:
   - `workspaces` ✅
   - `chatbots` ✅
   - `conversations` ✅
   - `documents` ✅

6. Verify di **Storage** → Should see bucket:
   - `documents` ✅

---

### 3. **Optional: OpenAI & Pinecone Keys**

**Untuk testing chat & RAG features:**

#### **OpenAI API Key:**
1. Go to: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Name: `chatbot-saas-dev`
4. Copy key: `sk-proj-...`
5. **Add payment method** di Billing ($5 minimum)

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

#### **Pinecone API Key:**
1. Go to: https://app.pinecone.io
2. Sign up (free tier OK)
3. Create index:
   - Name: `chatbot-knowledge-base`
   - Dimensions: `1536`
   - Metric: `cosine`
4. Copy API key dari **API Keys** tab
5. Note environment (e.g., `us-east-1-aws`)

```env
PINECONE_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX=chatbot-knowledge-base
```

---

## ✅ Final `.env.local` Should Look Like:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://bfmwpnrjlpelpatwobfv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbXdwbnJqbHBlbHBhdHdvYmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMjYyMDYsImV4cCI6MjA3NzkwMjIwNn0.Fh_AYkoj7pGyJeEWgJIiU8veU7no625rfP8KAlBUOvI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...GET_THIS_FROM_DASHBOARD

# OpenAI (optional for now)
OPENAI_API_KEY=sk-proj-xxxxx

# Pinecone (optional for now)
PINECONE_API_KEY=xxxxx
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX=chatbot-knowledge-base

# App
NEXT_PUBLIC_APP_URL=http://localhost:3011
```

---

## 🚀 After You Get the Keys:

1. **Update `.env.local`** with service role key
2. **Run database schema** in Supabase SQL Editor
3. **Restart dev server:**
   ```bash
   # Stop current server (Ctrl+C di PowerShell yang running)
   # Then restart:
   cd D:\AI\tech\01-nextjs-langchain-chatbot-saas\fullstack
   npm run dev
   ```

---

## 🧪 Quick Test After Setup:

1. **Test Database Connection:**
   - Open: http://localhost:3011/dashboard
   - Should not error (even if redirects to login)
   - Check browser console for errors

2. **Test Signup:**
   - Go to: http://localhost:3011/signup
   - Fill form
   - Submit (should work once auth connected)

---

**Setelah dapat service role key, kasih tau saya dan saya akan:**
1. ✅ Update `.env.local`
2. ✅ Run database schema
3. ✅ Implement authentication logic
4. ✅ Test signup/login flow

**Ready!** 🎯
