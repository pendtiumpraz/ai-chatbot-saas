# 🔧 **FIX: "new row violates" Error saat Add API Key**

## ❌ **ERROR YANG TERJADI:**

```
Error: new row violates foreign key constraint
"api_keys_workspace_id_fkey"
```

---

## 🔍 **PENYEBAB:**

Error ini terjadi karena:

1. **API Key table** butuh `workspace_id` yang valid
2. `workspace_id` harus **exist** di table `workspaces`
3. User kamu **belum punya workspace** di database
4. Foreign key constraint **mencegah** insert ke table yang tidak ada

**Schema:**
```sql
api_keys.workspace_id → workspaces.id (FOREIGN KEY)
```

Kalau `workspaces.id` tidak ada, insert **GAGAL**!

---

## ✅ **SOLUSI LENGKAP:**

### **CARA 1: Automatic Fix (Recommended)** ⭐

**Run script ini di Supabase SQL Editor:**

#### **Step 1: Open Supabase**
```
1. https://app.supabase.com
2. Pilih project kamu
3. Klik "SQL Editor" (sidebar kiri)
```

#### **Step 2: Run Fix Script**
```
1. Copy file: FIX_API_KEY_ERROR.sql
2. Paste ke SQL Editor
3. Klik "Run" (atau Ctrl+Enter)
4. Tunggu sampai selesai
```

**Script akan:**
- ✅ Check user kamu
- ✅ Create workspace (jika belum ada)
- ✅ Assign `workspace_owner` role
- ✅ Verify everything ready

#### **Step 3: Test**
```
1. Refresh browser
2. Go to Settings → API Keys
3. Click "+ Add API Key"
4. Should work now! ✅
```

---

### **CARA 2: Manual Fix (Jika Auto Gagal)**

#### **Step 1: Find Your User ID**
```sql
SELECT id, email FROM auth.users ORDER BY created_at DESC;
```

Copy `id` kamu (misal: `a1b2c3d4-...`)

#### **Step 2: Check Workspace**
```sql
SELECT * FROM workspaces WHERE id = 'YOUR_USER_ID';
```

Jika **EMPTY**, workspace belum ada!

#### **Step 3: Create Workspace**
```sql
-- Ganti YOUR_USER_ID dan YOUR_EMAIL
INSERT INTO workspaces (id, name, slug)
VALUES (
  'YOUR_USER_ID',                    -- User ID dari Step 1
  'My Workspace',                     -- Nama workspace
  'my-workspace'                      -- URL slug
);
```

#### **Step 4: Assign Role**
```sql
-- Ganti YOUR_USER_ID
INSERT INTO user_roles (user_id, role_id, workspace_id)
VALUES (
  'YOUR_USER_ID',
  (SELECT id FROM roles WHERE name = 'workspace_owner'),
  'YOUR_USER_ID'
);
```

#### **Step 5: Verify**
```sql
-- Check workspace created
SELECT * FROM workspaces WHERE id = 'YOUR_USER_ID';

-- Check role assigned
SELECT * FROM user_roles WHERE user_id = 'YOUR_USER_ID';
```

---

## 🧪 **VERIFICATION:**

### **Check 1: Workspace Exists**
```sql
SELECT 
  au.email,
  w.name as workspace,
  CASE 
    WHEN w.id IS NOT NULL THEN '✅ Exists'
    ELSE '❌ Missing'
  END as status
FROM auth.users au
LEFT JOIN workspaces w ON w.id = au.id
WHERE au.id = auth.uid();
```

Expected: `✅ Exists`

### **Check 2: Role Assigned**
```sql
SELECT 
  au.email,
  r.name as role,
  CASE 
    WHEN ur.role_id IS NOT NULL THEN '✅ Has Role'
    ELSE '❌ No Role'
  END as status
FROM auth.users au
LEFT JOIN user_roles ur ON ur.user_id = au.id
LEFT JOIN roles r ON r.id = ur.role_id
WHERE au.id = auth.uid();
```

Expected: `✅ Has Role` + `workspace_owner`

### **Check 3: Can Insert API Key**
```sql
-- This should NOT error
SELECT 
  CASE 
    WHEN EXISTS(SELECT 1 FROM workspaces WHERE id = auth.uid())
    THEN '✅ Can add API keys'
    ELSE '❌ Still broken'
  END as test_result;
```

Expected: `✅ Can add API keys`

---

## 🎯 **TESTING API KEY:**

### **Test 1: Add via UI**
```
1. Go to http://localhost:3011/dashboard
2. Settings → API Keys
3. Click "+ Add API Key"
4. Select: OpenAI
5. Name: "Test Key"
6. Key: "sk-test-123"
7. Submit
8. Should see success! ✅
```

### **Test 2: Check Database**
```sql
SELECT 
  id,
  workspace_id,
  provider,
  key_name,
  is_active,
  created_at
FROM api_keys
WHERE workspace_id = auth.uid()
ORDER BY created_at DESC;
```

Should show your new API key!

---

## 🐛 **TROUBLESHOOTING:**

### **Problem 1: Script Gagal - No Users Found**
```
Error: ❌ No users found! Please sign up first.
```

**Solution:**
```
1. Go to http://localhost:3011
2. Sign up / Login dulu
3. Run script lagi
```

### **Problem 2: workspace_owner Role Not Found**
```
Error: ❌ workspace_owner role not found!
```

**Solution:**
```sql
-- Run RBAC migration first
-- File: 002_add_rbac_system.sql
```

### **Problem 3: Workspace Created tapi API Key Masih Error**
```
Error: Workspace not found
```

**Solution:**
```
1. Clear browser cache (Ctrl+Shift+Delete)
2. Logout
3. Login again
4. Try add API key
```

### **Problem 4: Permission Denied**
```
Error: permission denied for table workspaces
```

**Solution:**
```sql
-- Check RLS policies
SELECT * FROM workspaces WHERE id = auth.uid();

-- If empty, disable RLS temporarily:
ALTER TABLE workspaces DISABLE ROW LEVEL SECURITY;

-- Add workspace
INSERT INTO workspaces (id, name, slug) VALUES (...);

-- Re-enable RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
```

---

## 📊 **UNDERSTANDING THE ERROR:**

### **Database Structure:**
```
auth.users (Supabase Auth)
    ↓ id
workspaces
    ↓ id (same as user.id)
api_keys
    ↓ workspace_id → FOREIGN KEY to workspaces.id
```

### **What Happens:**
```
1. User sign up → Creates auth.users entry ✅
2. App tries to add API key
3. API key needs workspace_id
4. workspace_id must exist in workspaces table
5. But workspaces table is EMPTY ❌
6. Foreign key constraint FAILS ❌
7. Error: "new row violates..."
```

### **The Fix:**
```
1. Create workspace entry with id = user.id ✅
2. Assign workspace_owner role ✅
3. Now workspace_id is valid ✅
4. API key insert works ✅
```

---

## 🎊 **AFTER FIX:**

### **What Now Works:**
```
✅ Add API keys (OpenAI, Anthropic, Google, Custom)
✅ View API keys (encrypted, safe)
✅ Enable/disable keys
✅ Track usage
✅ Delete keys
✅ Full CRUD operations
```

### **Next Steps:**
```
1. Add your real API keys
2. Create chatbots
3. Select AI provider
4. Start testing!
```

---

## 📝 **FILES TO USE:**

```
1. FIX_API_KEY_ERROR.sql     → Automatic fix (recommended)
2. QUICK_FIX_ROLES.sql       → Alternative fix
3. HOW_TO_FIX_API_KEY_ERROR.md → This guide
```

---

## ⚡ **QUICK FIX (1 Minute):**

```sql
-- Just run this in Supabase SQL Editor:

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get your user ID
  SELECT id INTO v_user_id FROM auth.users ORDER BY created_at DESC LIMIT 1;
  
  -- Create workspace
  INSERT INTO workspaces (id, name, slug)
  VALUES (v_user_id, 'My Workspace', 'my-workspace')
  ON CONFLICT (id) DO NOTHING;
  
  -- Assign role
  INSERT INTO user_roles (user_id, role_id, workspace_id)
  VALUES (
    v_user_id,
    (SELECT id FROM roles WHERE name = 'workspace_owner'),
    v_user_id
  )
  ON CONFLICT DO NOTHING;
  
  RAISE NOTICE '✅ Fixed! User: %', v_user_id;
END $$;
```

**Done!** Refresh browser and try again.

---

## 🎯 **SUMMARY:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Problem:  Foreign key constraint error
Cause:    Missing workspace entry
Solution: Run FIX_API_KEY_ERROR.sql
Time:     1 minute
Result:   ✅ API Keys work!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**RUN SCRIPT SEKARANG! 🚀**

---

**Last Updated:** 2025-11-05
**Status:** Ready to Fix
**Difficulty:** Easy (1 minute)
