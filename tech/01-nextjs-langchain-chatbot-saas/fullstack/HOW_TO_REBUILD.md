# 🔥 **HOW TO REBUILD DATABASE FROM SCRATCH**

## ⚠️ **WARNING**
```
This will DELETE ALL existing data!
Only run this if:
✅ Fresh installation
✅ Testing/development environment
✅ You want to start clean
```

---

## 🚀 **STEPS TO REBUILD:**

### **1. Open Supabase SQL Editor**
```
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click: SQL Editor
```

### **2. Run The Rebuild Script**
```
File: COMPLETE_REBUILD_WITH_ISOLATION.sql

This will:
1. 🗑️  DROP all tables, policies, functions
2. 🏗️  CREATE 7 core tables
3. 🔒 ENABLE Row Level Security
4. 🛡️  CREATE isolation policies
5. 👥 INSERT 4 default roles
6. ✅ VERIFY everything works
```

### **3. Click Execute**
```
SQL Editor → Paste script → Run (Ctrl+Enter)
Wait ~5-10 seconds for completion
```

---

## ✅ **WHAT YOU'LL GET:**

### **Tables Created:**
```
✅ workspaces         → User workspaces (isolated)
✅ chatbots           → AI chatbots
✅ documents          → Knowledge base files
✅ conversations      → Chat history
✅ api_keys           → Encrypted API keys
✅ user_roles         → User permissions
✅ audit_logs         → Activity tracking
```

### **Roles Created:**
```
✅ workspace_owner    → Full access (auto-assigned on signup)
✅ admin              → Admin access
✅ member             → Standard access
✅ viewer             → Read-only access
```

### **Security Features:**
```
✅ Row Level Security → Database-level isolation
✅ Soft Delete        → Can recover deleted data
✅ Audit Trail        → Track all changes
✅ Encrypted Keys     → API keys encrypted
✅ Multi-tenant       → Complete user isolation
```

---

## 🧪 **VERIFY IT WORKED:**

### **Check Tables:**
```sql
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Should show: api_keys, audit_logs, chatbots, etc.
```

### **Check RLS:**
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'chatbots';

-- Should show: rowsecurity = true
```

### **Check Roles:**
```sql
SELECT name, description
FROM roles
ORDER BY name;

-- Should show: 4 roles
```

---

## 🎯 **AFTER REBUILD:**

### **1. Create First Account:**
```
1. Go to: http://localhost:3011
2. Click: Sign Up
3. Enter: email + password
4. Submit
```

### **2. Auto-Magic Happens:**
```
✅ User created in auth.users
✅ Workspace auto-created (your email as workspace)
✅ Role assigned (workspace_owner)
✅ Ready to create chatbots!
```

### **3. Test Isolation:**
```
1. Create Account A
2. Create chatbot in Account A
3. Logout
4. Create Account B
5. Check chatbots list
6. Should see: NOTHING from Account A ✅
```

---

## 🔍 **TROUBLESHOOTING:**

### **Error: "relation does not exist"**
```
Problem: Tables not created
Solution: Run the script again
```

### **Error: "syntax error near ,"**
```
Problem: SQL syntax issue (FIXED!)
Solution: Use updated COMPLETE_REBUILD_WITH_ISOLATION.sql
```

### **Error: "permission denied"**
```
Problem: Not database owner
Solution: Use Supabase SQL Editor (has full permissions)
```

### **Can't create chatbot after rebuild**
```
Problem: No API key configured
Solution:
1. Settings → API Keys
2. Add OpenAI/Gemini/Claude key
3. Try again
```

---

## 📊 **EXPECTED OUTPUT:**

When script runs successfully, you'll see:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗑️  STEP 1: DROPPING ALL EXISTING OBJECTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ All objects dropped

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏗️  STEP 2: CREATING CORE TABLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Workspaces table created
✅ Roles table created with 4 default roles
✅ User roles table created
✅ Chatbots table created
✅ Documents table created
✅ Conversations table created
✅ API Keys table created
✅ Audit logs table created

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 STEP 3: CREATING FUNCTIONS & TRIGGERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Triggers created

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 STEP 4: ENABLING ROW LEVEL SECURITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ RLS enabled on all tables

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️  STEP 5: CREATING RLS POLICIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Workspaces policy created
✅ Chatbots policy created
✅ Documents policy created
✅ Conversations policy created
✅ API Keys policy created
✅ User Roles policies created
✅ Audit Logs policy created

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 STEP 6: CREATING VIEWS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Views created

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 STEP 7: VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tables: 7
RLS Status: All ENABLED
Policies: 9
Roles: 4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ DATABASE REBUILD COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎉 **SUCCESS CHECKLIST:**

After running the script:

```
✅ No error messages
✅ See "DATABASE REBUILD COMPLETE!"
✅ 7 tables created
✅ 4 roles inserted
✅ 9 policies active
✅ RLS enabled on all tables
```

If all ✅, you're ready to go! 🚀

---

## 📝 **QUICK REFERENCE:**

### **File to Run:**
```
COMPLETE_REBUILD_WITH_ISOLATION.sql
```

### **Where to Run:**
```
Supabase Dashboard → SQL Editor
```

### **Time Required:**
```
~5-10 seconds
```

### **Data Loss:**
```
⚠️  ALL EXISTING DATA WILL BE DELETED!
```

---

**Ready? Run the script and start fresh! 🔥**
