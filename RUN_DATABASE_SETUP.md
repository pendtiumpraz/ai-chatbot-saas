# 🗄️ Database Setup - Step by Step

## ✅ Status Check:

- ✅ Supabase Project Created: `universal-ai-chatbot`
- ✅ Environment Variables Updated (`.env.local`)
- ✅ Service Role Key Added
- ⏳ Database Schema: **READY TO RUN**

---

## 🚀 Step 1: Run Database Schema

### **Option A: Via Supabase Dashboard (Recommended)**

1. **Open SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/bfmwpnrjlpelpatwobfv/sql/new
   - Or: Dashboard → SQL Editor → New Query

2. **Copy Schema SQL:**
   - Open file: `supabase/schema.sql`
   - Select All (Ctrl+A) → Copy (Ctrl+C)

3. **Paste & Run:**
   - Paste in SQL Editor
   - Click **"Run"** button (bottom right)
   - Or press: Ctrl + Enter

4. **Expected Output:**
   ```
   Success. No rows returned
   ```

5. **Verify Tables Created:**
   - Go to: Table Editor
   - Should see 4 tables:
     - ✅ `workspaces`
     - ✅ `chatbots`
     - ✅ `conversations`
     - ✅ `documents`

6. **Verify Sample Data:**
   - Click `workspaces` table
   - Should see 1 row: "Demo Workspace"

---

### **Option B: Via Supabase CLI (Advanced)**

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref bfmwpnrjlpelpatwobfv

# Run migrations
supabase db push

# Or run SQL file directly
supabase db push < supabase/schema.sql
```

---

## 🪣 Step 2: Verify Storage Bucket

1. **Go to Storage:**
   - Dashboard → Storage → Buckets
   - Or: https://supabase.com/dashboard/project/bfmwpnrjlpelpatwobfv/storage/buckets

2. **Check Bucket Created:**
   - Should see: `documents` bucket ✅
   - Public: Yes ✅

3. **If NOT created, create manually:**
   - Click "New Bucket"
   - Name: `documents`
   - Public: ✅ Yes (checked)
   - Click "Create Bucket"

---

## 🧪 Step 3: Test Database Connection

### **Quick Test via SQL Editor:**

Run this query:
```sql
-- Test query
SELECT 
  'Workspaces' as table_name, COUNT(*) as count FROM workspaces
UNION ALL
SELECT 
  'Chatbots', COUNT(*) FROM chatbots
UNION ALL
SELECT 
  'Conversations', COUNT(*) FROM conversations
UNION ALL
SELECT 
  'Documents', COUNT(*) FROM documents;
```

Expected output:
```
table_name     | count
---------------|------
Workspaces     | 1
Chatbots       | 0
Conversations  | 0
Documents      | 0
```

---

## 🔐 Step 4: Verify RLS Policies

1. **Go to Authentication:**
   - Dashboard → Authentication → Policies
   - Or: Table Editor → Select table → Policies tab

2. **Check Policies Exist:**
   - ✅ Workspaces: 1 policy
   - ✅ Chatbots: 3 policies
   - ✅ Conversations: 3 policies
   - ✅ Documents: 1 policy

---

## ⚙️ Step 5: Configure Auth Settings

1. **Go to Authentication Settings:**
   - Dashboard → Authentication → Settings
   - Or: https://supabase.com/dashboard/project/bfmwpnrjlpelpatwobfv/auth/settings

2. **Site URL Configuration:**
   - Site URL: `http://localhost:3011`
   - Redirect URLs: `http://localhost:3011/**`

3. **Email Auth Settings:**
   - ✅ Enable Email Signup
   - ✅ Enable Email Confirmations (or disable for testing)
   - Email Templates: Can customize later

4. **Optional - Disable Email Confirmation (for faster testing):**
   - Scroll to "Email Auth"
   - Uncheck "Enable email confirmations"
   - Click "Save"
   - **Note:** For production, enable this back!

---

## 🧪 Step 6: Test with Sample Data

### **Create Test Chatbot:**

Run in SQL Editor:
```sql
INSERT INTO chatbots (
  workspace_id,
  name,
  description,
  system_prompt,
  pinecone_namespace
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Customer Support Bot',
  'Helps answer customer questions',
  'You are a helpful customer support assistant. Be friendly and professional.',
  'demo-workspace-customer-support'
);
```

### **Verify:**
```sql
SELECT 
  c.name as chatbot_name,
  w.name as workspace_name,
  c.is_active,
  c.created_at
FROM chatbots c
JOIN workspaces w ON c.workspace_id = w.id;
```

---

## ✅ Verification Checklist:

After running schema, verify:

- [ ] ✅ 4 tables created (workspaces, chatbots, conversations, documents)
- [ ] ✅ Indexes created (6 indexes)
- [ ] ✅ Triggers created (updated_at)
- [ ] ✅ RLS enabled on all tables
- [ ] ✅ RLS policies created (8+ policies)
- [ ] ✅ Storage bucket "documents" exists
- [ ] ✅ Sample workspace inserted
- [ ] ✅ Auth settings configured

---

## 🐛 Troubleshooting:

### **Error: "extension uuid-ossp does not exist"**
```sql
-- Run this first:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### **Error: "relation storage.buckets does not exist"**
- Storage bucket creation via SQL might not work
- Create manually in Dashboard → Storage

### **Error: "policy already exists"**
- Schema was already run before
- Drop policies first or skip RLS section

### **Error: RLS prevents data access**
- For testing, temporarily disable RLS:
```sql
ALTER TABLE workspaces DISABLE ROW LEVEL SECURITY;
ALTER TABLE chatbots DISABLE ROW LEVEL SECURITY;
-- (Enable back after testing!)
```

---

## 🎯 Next Steps After Database Setup:

Once database is ready, I will implement:

1. **Authentication Logic** (2-3 hours)
   - Connect login form to Supabase
   - Connect signup form + create workspace
   - Add logout functionality
   - Test auth flow

2. **API Endpoints** (3-4 hours)
   - Complete chatbots CRUD
   - Complete documents CRUD
   - Complete conversations CRUD

3. **Multi-AI Provider** (4-5 hours)
   - Add tables for API keys & credits
   - Implement encryption
   - Build provider router
   - Create UI for API keys management

---

## 📞 Ready to Continue?

**After you run the schema, tell me:**
- ✅ Schema ran successfully
- ✅ Tables created
- ✅ Storage bucket verified

**Then I will:**
1. Start implementing authentication
2. Connect all UI to backend
3. Build Multi-AI Provider system
4. Make everything fully functional!

---

**Database file location:**
```
D:\AI\tech\01-nextjs-langchain-chatbot-saas\fullstack\supabase\schema.sql
```

**Run it here:**
https://supabase.com/dashboard/project/bfmwpnrjlpelpatwobfv/sql/new

**Let's go!** 🚀
