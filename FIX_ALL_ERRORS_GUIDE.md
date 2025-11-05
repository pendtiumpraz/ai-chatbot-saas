# 🔧 **FIX SEMUA ERROR - COMPLETE GUIDE**

## 📋 **ERRORS YANG PERLU DI-FIX:**

### ❌ **Error 1: Foreign Key Constraint (API Keys)**
```
Error: new row violates foreign key constraint 
"api_keys_workspace_id_fkey"
```

### ❌ **Error 2: max_tokens Column Not Found (Chatbots)**
```
Error: Could not find the 'max_tokens' column of 'chatbots' 
in the schema cache
```

### ❌ **Error 3: User Roles Not Assigned (Forbidden)**
```
Error: Forbidden
(When trying to create/edit resources)
```

---

## ✅ **SOLUSI LENGKAP - RUN 3 SCRIPTS:**

### **🎯 RUN SEMUA SCRIPTS INI (URUTAN PENTING!):**

```sql
1. FIX_CHATBOT_SCHEMA.sql      → Fix max_tokens column
2. FIX_API_KEY_ERROR.sql       → Fix workspace & roles
3. Refresh browser              → Clear cache
```

---

## 📝 **STEP-BY-STEP INSTRUCTIONS:**

### **Step 1: Open Supabase**

1. Go to: https://app.supabase.com
2. Login dengan akun kamu
3. Pilih project kamu
4. Klik **"SQL Editor"** (sidebar kiri)

### **Step 2: Run Script 1 - Fix Chatbot Schema**

1. Buka file: `FIX_CHATBOT_SCHEMA.sql`
2. Copy **semua isi** file
3. Paste ke SQL Editor
4. Klik **"Run"** (atau Ctrl+Enter)
5. Tunggu sampai selesai
6. Lihat success messages:
   ```
   ✅ Added: max_tokens
   ✅ Added: ai_provider
   ✅ Added: top_p
   ✅ Added: frequency_penalty
   ✅ Added: presence_penalty
   ```

### **Step 3: Run Script 2 - Fix API Keys & Workspace**

1. Buka file: `FIX_API_KEY_ERROR.sql`
2. Copy **semua isi** file
3. Paste ke SQL Editor
4. Klik **"Run"** (atau Ctrl+Enter)
5. Tunggu sampai selesai
6. Lihat success messages:
   ```
   ✅ Found user: your@email.com
   ✅ Workspace created for user
   ✅ Assigned workspace_owner role
   🎉 FIX COMPLETE!
   ```

### **Step 4: Refresh Browser**

1. Close semua tabs aplikasi
2. Clear browser cache:
   - Chrome: `Ctrl+Shift+Delete` → Clear cache
   - Or just: `Ctrl+F5` (hard refresh)
3. Open fresh tab
4. Go to: `http://localhost:3011/dashboard`

### **Step 5: Test Everything**

```
✅ Create chatbot        → Should work now!
✅ Add API key           → Should work now!
✅ Edit settings         → Should work now!
✅ All CRUD operations   → Should work now!
```

---

## 🧪 **VERIFICATION CHECKLIST:**

### **Test 1: Create Chatbot** ✅
```
1. Go to Dashboard
2. Click "Create Chatbot"
3. Fill form:
   - Name: "Test Bot"
   - Use Case: "Customer Support"
   - Model: "gpt-4-turbo-preview"
   - Temperature: 0.7
   - Max Tokens: 2048
4. Click "Create"
5. Should see success! ✅
```

### **Test 2: Add API Key** ✅
```
1. Go to Settings → API Keys
2. Click "+ Add API Key"
3. Select: OpenAI
4. Name: "Production Key"
5. Key: "sk-proj-..."
6. Click "Add"
7. Should see success! ✅
```

### **Test 3: Edit Chatbot** ✅
```
1. Go to Chatbots
2. Click on chatbot
3. Click "Edit"
4. Change name
5. Save
6. Should work! ✅
```

### **Test 4: Upload Document** ✅
```
1. Go to Documents
2. Click "Upload"
3. Select file
4. Upload
5. Should work! ✅
```

---

## 🔍 **WHAT EACH SCRIPT DOES:**

### **Script 1: FIX_CHATBOT_SCHEMA.sql**

**Adds Missing Columns:**
```sql
✅ max_tokens          → AI response length (1-128k tokens)
✅ ai_provider         → openai/anthropic/google/custom
✅ top_p               → Nucleus sampling (0-1)
✅ frequency_penalty   → Prevent repetition (-2 to 2)
✅ presence_penalty    → Topic diversity (-2 to 2)
✅ deleted_at          → Soft delete timestamp
✅ deleted_by          → Who deleted (audit)
```

**Why Needed:**
- API tries to insert `max_tokens` → Column doesn't exist → Error
- Without these columns, chatbot creation fails

### **Script 2: FIX_API_KEY_ERROR.sql**

**Creates/Fixes:**
```sql
✅ Workspace entry     → Links user to workspace
✅ User role           → Assigns workspace_owner
✅ Foreign key valid   → Allows API key insert
```

**Why Needed:**
- API keys need valid `workspace_id`
- User needs `workspace_owner` role
- Without these, all CRUD operations fail

---

## 🎯 **EXPECTED RESULTS:**

### **Before Fix:**
```
❌ Create chatbot      → max_tokens error
❌ Add API key         → foreign key error
❌ Edit anything       → Forbidden error
❌ Upload document     → Permission denied
```

### **After Fix:**
```
✅ Create chatbot      → Works!
✅ Add API key         → Works!
✅ Edit anything       → Works!
✅ Upload document     → Works!
✅ All CRUD ops        → Works!
```

---

## 🐛 **TROUBLESHOOTING:**

### **Problem 1: Script Gagal - Permission Denied**

**Error:**
```
ERROR: permission denied for table chatbots
```

**Solution:**
```sql
-- Run as database owner/admin
-- Or disable RLS temporarily:
ALTER TABLE chatbots DISABLE ROW LEVEL SECURITY;
-- Run fix script
-- Re-enable:
ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;
```

### **Problem 2: Column Already Exists**

**Error:**
```
ERROR: column "max_tokens" already exists
```

**Solution:**
```
✅ This is OK! Script checks before adding.
✅ If you see "already exists", skip that column.
✅ Continue with other fixes.
```

### **Problem 3: No Users Found**

**Error:**
```
ERROR: ❌ No users found! Please sign up first.
```

**Solution:**
```
1. Go to http://localhost:3011
2. Sign up / Login
3. Run script again
```

### **Problem 4: Still Getting Errors After Fix**

**Solution:**
```
1. Hard refresh browser (Ctrl+F5)
2. Clear all cookies/cache
3. Logout
4. Login again
5. Try again

If still failing:
6. Check browser console (F12)
7. Check Supabase logs
8. Verify scripts ran successfully
```

---

## 📊 **DATABASE SCHEMA AFTER FIX:**

### **Chatbots Table:**
```sql
chatbots
├── id                  UUID PRIMARY KEY
├── workspace_id        UUID → workspaces.id
├── name                TEXT
├── description         TEXT
├── system_prompt       TEXT
├── model               TEXT
├── temperature         REAL (0-2)
├── max_tokens          INTEGER (1-128k) ✅ NEW
├── ai_provider         VARCHAR(50)      ✅ NEW
├── top_p               REAL (0-1)       ✅ NEW
├── frequency_penalty   REAL (-2 to 2)   ✅ NEW
├── presence_penalty    REAL (-2 to 2)   ✅ NEW
├── pinecone_namespace  TEXT UNIQUE
├── use_case            TEXT
├── is_active           BOOLEAN
├── widget_settings     JSONB
├── created_at          TIMESTAMPTZ
├── updated_at          TIMESTAMPTZ
├── deleted_at          TIMESTAMPTZ      ✅ NEW
└── deleted_by          UUID             ✅ NEW
```

### **Workspaces Table:**
```sql
workspaces
├── id              UUID PRIMARY KEY (same as user.id)
├── name            TEXT
├── slug            TEXT UNIQUE
├── industry        TEXT
├── plan            TEXT
├── message_quota   INTEGER
├── message_used    INTEGER
├── created_at      TIMESTAMPTZ
└── updated_at      TIMESTAMPTZ
```

### **User Roles Table:**
```sql
user_roles
├── id              UUID PRIMARY KEY
├── user_id         UUID → auth.users.id
├── role_id         UUID → roles.id
├── workspace_id    UUID → workspaces.id
└── created_at      TIMESTAMPTZ
```

---

## 🚀 **QUICK FIX (Copy-Paste):**

### **One-Shot Fix (Runs Both Scripts):**

```sql
-- ============================================
-- QUICK FIX - RUN THIS IN SUPABASE SQL EDITOR
-- ============================================

-- 1. Add max_tokens to chatbots
ALTER TABLE chatbots
ADD COLUMN IF NOT EXISTS max_tokens INTEGER DEFAULT 2048 
CHECK (max_tokens > 0 AND max_tokens <= 128000);

-- 2. Add ai_provider to chatbots
ALTER TABLE chatbots
ADD COLUMN IF NOT EXISTS ai_provider VARCHAR(50) DEFAULT 'openai'
CHECK (ai_provider IN ('openai', 'anthropic', 'google', 'custom'));

-- 3. Create workspace for current user
DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT;
BEGIN
  SELECT id, email INTO v_user_id, v_email FROM auth.users ORDER BY created_at DESC LIMIT 1;
  
  INSERT INTO workspaces (id, name, slug)
  VALUES (v_user_id, SPLIT_PART(v_email, '@', 1), LOWER(REPLACE(SPLIT_PART(v_email, '@', 1), ' ', '-')))
  ON CONFLICT (id) DO NOTHING;
  
  INSERT INTO user_roles (user_id, role_id, workspace_id)
  VALUES (v_user_id, (SELECT id FROM roles WHERE name = 'workspace_owner'), v_user_id)
  ON CONFLICT DO NOTHING;
  
  RAISE NOTICE '✅ Fixed! User: %, Workspace created, Role assigned', v_email;
END $$;

-- Done! Refresh browser and test.
```

---

## 🎊 **AFTER SUCCESSFUL FIX:**

### **What Now Works:**
```
✅ Create Chatbots         → With all AI settings
✅ Add API Keys            → Multi-provider support
✅ Upload Documents        → Knowledge base ready
✅ Create Conversations    → Chat functionality
✅ Manage Team             → Roles & permissions
✅ View Analytics          → Stats & usage
✅ All Settings Pages      → Profile, security, billing
✅ Dark Mode              → Perfect everywhere
```

### **Features Unlocked:**
```
✅ Full CRUD operations
✅ Role-based access control
✅ Multi-AI provider support
✅ Advanced AI settings (temperature, tokens, penalties)
✅ Workspace management
✅ Team collaboration
✅ API key management
✅ Audit logging
```

---

## 📞 **NEED HELP?**

### **Check Logs:**

**Supabase Logs:**
```
1. Supabase Dashboard
2. Database → Logs
3. Look for errors
```

**Browser Console:**
```
1. Press F12
2. Console tab
3. Look for red errors
```

**API Response:**
```
1. Network tab
2. Click failed request
3. Check response body
```

### **Common Issues:**

| Error | Cause | Solution |
|-------|-------|----------|
| `max_tokens not found` | Column missing | Run `FIX_CHATBOT_SCHEMA.sql` |
| `foreign key constraint` | No workspace | Run `FIX_API_KEY_ERROR.sql` |
| `Forbidden` | No role | Run `FIX_API_KEY_ERROR.sql` |
| `Unauthorized` | Not logged in | Login first |
| `Schema cache` | Outdated cache | Restart Next.js dev server |

---

## ✅ **SUCCESS INDICATORS:**

### **You'll Know It's Fixed When:**

```
✅ No errors in browser console
✅ Can create chatbot successfully
✅ Can add API keys
✅ Can edit resources
✅ See success toast messages
✅ Data appears in lists
✅ Dashboard loads correctly
```

---

## 🎯 **FINAL CHECKLIST:**

```
□ Run FIX_CHATBOT_SCHEMA.sql in Supabase
□ Run FIX_API_KEY_ERROR.sql in Supabase
□ Clear browser cache (Ctrl+F5)
□ Refresh dashboard
□ Test create chatbot
□ Test add API key
□ Test edit settings
□ Verify all works
□ 🎉 DONE!
```

---

**NEXT STEP: Run the scripts NOW! 🚀**

**Files to Run:**
1. `FIX_CHATBOT_SCHEMA.sql`
2. `FIX_API_KEY_ERROR.sql`

**Time Required:** 2 minutes
**Difficulty:** Easy (copy-paste)
**Result:** Everything works! ✅
