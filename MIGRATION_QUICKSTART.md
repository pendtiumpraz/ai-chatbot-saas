# 🚀 MIGRATION QUICKSTART GUIDE

## ✅ **COMPLETE STEP-BY-STEP INSTRUCTIONS**

### **Prerequisites:**
- ✅ Supabase project created
- ✅ Database tables exist (workspaces, chatbots, documents, conversations, messages, api_keys)
- ✅ Access to Supabase SQL Editor

---

## 📋 **STEP 1: BACKUP YOUR DATABASE** ⚠️

Before running ANY migrations, BACKUP your database!

**In Supabase Dashboard:**
1. Go to **Database** → **Backups**
2. Click **"Create backup"**
3. Wait for backup to complete
4. ✅ You're safe now!

---

## 🗄️ **STEP 2: RUN SOFT DELETE MIGRATION**

### **Option A: Using Supabase Dashboard (Recommended)**

1. **Open SQL Editor:**
   ```
   https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new
   ```

2. **Copy Migration File:**
   - Open: `supabase/migrations/001_add_soft_delete_FIXED.sql`
   - Copy ALL content (Ctrl+A, Ctrl+C)

3. **Paste in SQL Editor:**
   - Paste into Supabase SQL Editor
   - Click **"Run"** button

4. **Wait for completion:**
   - Should see: "Success. No rows returned"
   - This means migration ran successfully!

5. **Verify Migration:**
   - Open new SQL tab
   - Copy content from: `supabase/VERIFY_SOFT_DELETE.sql`
   - Click **"Run"**
   - Check results:
     - ✅ All tables should have `deleted_at` and `deleted_by` columns
     - ✅ 6 views should be created
     - ✅ 6 functions should be created

### **Option B: Using Supabase CLI**

```bash
# If you have Supabase CLI installed
cd fullstack
supabase db push
```

---

## 🔐 **STEP 3: RUN RBAC MIGRATION**

1. **Open New SQL Tab** in Supabase

2. **Copy Migration File:**
   - Open: `supabase/migrations/002_rbac_system.sql`
   - Copy ALL content

3. **Paste and Run:**
   - Paste into SQL Editor
   - Click **"Run"**

4. **Verify:**
   ```sql
   -- Check if roles were created
   SELECT * FROM roles;
   -- Should show: super_admin, workspace_owner, workspace_admin, workspace_member, workspace_viewer

   -- Check if permissions were created
   SELECT COUNT(*) FROM permissions;
   -- Should show: 30+ permissions
   ```

---

## 📝 **STEP 4: RUN AUDIT LOGS MIGRATION**

1. **Open New SQL Tab**

2. **Copy Migration File:**
   - Open: `supabase/migrations/003_audit_logs.sql`
   - Copy ALL content

3. **Paste and Run:**
   - Click **"Run"**

4. **Verify:**
   ```sql
   -- Check if tables were created
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_name IN ('audit_logs', 'security_events', 'activity_feed', 'rate_limit_logs')
     AND table_schema = 'public';
   -- Should show all 4 tables
   ```

---

## 🌱 **STEP 5: RUN SEEDER (OPTIONAL - TEST DATA)**

**⚠️ WARNING: This will add test data to your database!**

**Only run if:**
- ✅ You're on a development environment
- ✅ You want realistic test data
- ✅ You understand this adds fake users/chatbots

**To Run:**

1. **Open New SQL Tab**

2. **Copy Seeder:**
   - Open: `supabase/seeds.sql`
   - Copy ALL content

3. **Paste and Run:**
   - Click **"Run"**

4. **Verify:**
   ```sql
   -- Check seeded data
   SELECT COUNT(*) FROM workspaces; -- Should show 3
   SELECT COUNT(*) FROM chatbots; -- Should show 5
   SELECT COUNT(*) FROM documents; -- Should show 8
   SELECT COUNT(*) FROM conversations; -- Should show 7
   ```

---

## 🔧 **STEP 6: ADD ENVIRONMENT VARIABLE**

Add to your `.env.local` file:

```bash
# Add this line:
ENCRYPTION_SECRET=your_random_secret_key_here_minimum_32_chars

# Generate a random secret:
# On Linux/Mac:
openssl rand -base64 32

# On Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## ✅ **STEP 7: VERIFY EVERYTHING WORKS**

### **Test 1: Check Database Structure**

```sql
-- Run this in Supabase SQL Editor:

-- 1. Check soft delete columns
SELECT 
  table_name,
  column_name
FROM information_schema.columns
WHERE column_name IN ('deleted_at', 'deleted_by')
  AND table_schema = 'public'
ORDER BY table_name;

-- 2. Check RBAC tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('roles', 'permissions', 'role_permissions', 'user_roles')
  AND table_schema = 'public';

-- 3. Check audit tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('audit_logs', 'security_events', 'activity_feed')
  AND table_schema = 'public';
```

### **Test 2: Test Your Application**

```bash
# Start your dev server
cd fullstack
npm run dev
```

**Open in browser:**
```
http://localhost:3000/dashboard
```

**You should see:**
- ✅ Real stats from database (not hardcoded!)
- ✅ Dashboard loads without errors
- ✅ Chatbots list works
- ✅ No console errors

### **Test 3: Test Super Admin (if applicable)**

**Navigate to:**
```
http://localhost:3000/dashboard/super-admin
```

**If you're a super admin:**
- ✅ Should see platform-wide stats
- ✅ Can view all users
- ✅ Can manage users

**If you're NOT a super admin:**
- ✅ Should redirect to dashboard with "Forbidden" message
- ✅ This is correct behavior!

---

## 🐛 **TROUBLESHOOTING**

### **Error: "relation does not exist"**

**Problem:** Table doesn't exist in your database

**Solution:**
1. Check if table exists:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
2. If missing, create table first
3. Then run migration again

---

### **Error: "column already exists"**

**Problem:** Migration was already partially run

**Solution:**
1. This is usually safe to ignore
2. The `IF NOT EXISTS` clause prevents errors
3. Continue with next migration

---

### **Error: "foreign key constraint"**

**Problem:** `auth.users` table doesn't exist

**Solution:**
1. Check if using Supabase Auth:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'auth';
   ```
2. If `auth.users` exists, continue
3. If not, you may need to enable Supabase Auth first

---

### **Error: "function already exists"**

**Solution:**
```sql
-- Drop and recreate function
DROP FUNCTION IF EXISTS restore_workspace(UUID, UUID);
-- Then run migration again
```

---

## 📊 **MIGRATION STATUS CHECKLIST**

After all migrations, verify:

```
✅ Soft delete columns added to all tables
✅ Indexes created for deleted_at columns
✅ Restore functions created
✅ Views for active records created
✅ RBAC tables created (roles, permissions, etc.)
✅ 5 roles created
✅ 30+ permissions created
✅ Audit log tables created
✅ Security event tracking enabled
✅ Test data seeded (optional)
✅ Environment variable added
✅ Application runs without errors
✅ Dashboard shows real data
```

---

## 🎉 **SUCCESS! WHAT'S NEXT?**

### **Your database now has:**

1. ✅ **Soft Delete System**
   - No data loss
   - Can restore deleted items
   - Automatic cleanup after 90 days

2. ✅ **RBAC System**
   - 5 roles with hierarchy
   - 30+ permissions
   - Fine-grained access control

3. ✅ **Audit Logging**
   - Track all actions
   - Security event monitoring
   - Compliance-ready

4. ✅ **Test Data** (if seeded)
   - 3 workspaces
   - 5 chatbots
   - 8 documents
   - 7 conversations

### **You can now:**

- ✅ Test all CRUD operations
- ✅ Test soft delete (items get `deleted_at` timestamp)
- ✅ Test restore functions
- ✅ Test RBAC permissions
- ✅ View audit logs
- ✅ Monitor security events
- ✅ Use super admin features

---

## 🔥 **QUICK REFERENCE COMMANDS**

### **To soft delete a chatbot:**
```typescript
await supabase
  .from('chatbots')
  .update({
    deleted_at: new Date().toISOString(),
    deleted_by: user.id
  })
  .eq('id', chatbotId);
```

### **To restore a chatbot:**
```sql
SELECT restore_chatbot('chatbot-id-here', 'user-id-here');
```

### **To check audit logs:**
```sql
SELECT * FROM audit_logs 
WHERE user_id = 'your-user-id' 
ORDER BY created_at DESC 
LIMIT 20;
```

### **To view security events:**
```sql
SELECT * FROM security_events 
ORDER BY created_at DESC 
LIMIT 10;
```

### **To permanently delete old records (90+ days):**
```sql
-- DANGER: This permanently deletes!
-- Only run in production with super admin
SELECT * FROM permanent_delete_old_records(90);
```

---

## 📞 **NEED HELP?**

### **Common Issues:**

1. **"Permission denied"**
   - Make sure you're database owner
   - Check RLS policies

2. **"Migration failed"**
   - Restore from backup
   - Check error message
   - Fix issue
   - Run migration again

3. **"Application errors"**
   - Check browser console
   - Check server logs
   - Verify all migrations ran successfully

---

## ✅ **VERIFICATION CHECKLIST**

Run these queries to verify everything:

```sql
-- 1. Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Check soft delete columns
SELECT DISTINCT table_name 
FROM information_schema.columns
WHERE column_name IN ('deleted_at', 'deleted_by')
  AND table_schema = 'public';

-- 3. Check roles
SELECT * FROM roles ORDER BY hierarchy;

-- 4. Check permissions
SELECT COUNT(*) as total_permissions FROM permissions;

-- 5. Check functions
SELECT routine_name 
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE '%restore%';

-- 6. Check views
SELECT table_name 
FROM information_schema.views
WHERE table_name LIKE 'active_%';
```

**If all queries return expected results → ✅ MIGRATIONS SUCCESSFUL!**

---

## 🎯 **NEXT STEPS:**

1. ✅ **Test your application thoroughly**
2. ✅ **Create a chatbot** (test soft delete)
3. ✅ **Delete it** (should get deleted_at timestamp)
4. ✅ **Restore it** (use restore function)
5. ✅ **Check audit logs** (should see all actions)
6. ✅ **Test super admin** (if applicable)
7. ✅ **Deploy to production** (when ready!)

---

**CONGRATULATIONS! YOUR DATABASE IS NOW PRODUCTION-READY!** 🎉

**Time to build the remaining UI pages!** 🚀
