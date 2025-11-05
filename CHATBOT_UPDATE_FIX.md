# 🔧 **FIX CHATBOT UPDATE ERROR - COMPLETE GUIDE**

## 📋 **Status Script yang Sudah Dijalankan:**

```
✅ FIX_CHATBOT_SCHEMA.sql     → Columns added
✅ FIX_API_KEY_ERROR.sql      → Workspace & roles fixed
✅ DEBUG_CHATBOT_ISSUE.sql    → Diagnostic ran
```

Output: "If chatbot exists but update fails..."

---

## 🔍 **NEXT STEPS - CHECK BROWSER:**

### **Step 1: Open Browser Console**

1. **Buka dashboard:**
   ```
   http://localhost:3011/dashboard/chatbots
   ```

2. **Press F12** (Open DevTools)

3. **Click "Console" tab**

4. **Try to edit chatbot:**
   - Click chatbot
   - Click "Edit"
   - Change something
   - Click "Save"

5. **Look for errors in Console:**
   ```
   Look for RED errors like:
   - Error: ...
   - Failed to ...
   - Cannot ...
   ```

---

### **Step 2: Check Network Tab**

1. **Press F12** → Click "Network" tab

2. **Try to edit chatbot again**

3. **Look for failed requests:**
   - Red text = Failed request
   - Click on it
   - Check "Response" tab

4. **Common errors:**
   ```
   Status 404: Chatbot not found
   Status 403: Forbidden (no permission)
   Status 500: Server error
   ```

---

## 🧪 **MANUAL TEST IN SUPABASE:**

### **Test 1: Check Chatbot Exists**

Run this in Supabase SQL Editor:

```sql
-- Check active chatbots
SELECT 
  id,
  name,
  workspace_id,
  model,
  max_tokens,
  deleted_at,
  created_at
FROM chatbots
WHERE deleted_at IS NULL
ORDER BY created_at DESC;
```

**Expected:** Should see your chatbot(s)

---

### **Test 2: Simulate Update**

```sql
-- Replace YOUR_CHATBOT_ID with actual ID from Test 1
DO $$
DECLARE
  v_chatbot_id UUID := 'YOUR_CHATBOT_ID';
  v_result RECORD;
BEGIN
  -- Try to update
  UPDATE chatbots
  SET 
    name = 'Test Update',
    updated_at = NOW()
  WHERE id = v_chatbot_id
  AND deleted_at IS NULL
  RETURNING * INTO v_result;

  IF FOUND THEN
    RAISE NOTICE '✅ Update successful!';
    RAISE NOTICE 'Updated chatbot: %', v_result.name;
  ELSE
    RAISE NOTICE '❌ Update failed! Chatbot not found or deleted.';
  END IF;
END $$;
```

**If successful:**
```
✅ Update successful!
Updated chatbot: Test Update
```

**If failed:**
```
❌ Update failed! Chatbot not found or deleted.
```

---

### **Test 3: Check User Permissions**

```sql
-- Check if you have update permission
SELECT 
  au.email,
  r.name as role,
  ur.workspace_id,
  c.name as chatbot_name,
  CASE 
    WHEN r.name IN ('workspace_owner', 'admin') 
    THEN '✅ Can Update'
    ELSE '❌ Cannot Update'
  END as can_update
FROM auth.users au
JOIN user_roles ur ON ur.user_id = au.id
JOIN roles r ON r.id = ur.role_id
LEFT JOIN chatbots c ON c.workspace_id = ur.workspace_id AND c.deleted_at IS NULL
WHERE au.id = auth.uid()
ORDER BY c.created_at DESC;
```

**Expected:** Should see "✅ Can Update"

---

## 🔧 **COMMON FIXES:**

### **Fix 1: Chatbot ID Mismatch**

**Problem:** Frontend sends wrong chatbot ID

**Check:**
```javascript
// In browser console (F12):
localStorage.getItem('selectedChatbotId')

// Or check URL:
// Should be: /dashboard/chatbots/[valid-uuid]/edit
```

**Fix:**
```
1. Go back to chatbots list
2. Click chatbot again
3. Try edit again
```

---

### **Fix 2: Workspace Mismatch**

**Problem:** Chatbot belongs to different workspace

**Fix in Supabase:**
```sql
-- Check workspace match
SELECT 
  c.id as chatbot_id,
  c.name as chatbot_name,
  c.workspace_id as chatbot_workspace,
  au.id as user_id,
  ur.workspace_id as user_workspace,
  CASE 
    WHEN c.workspace_id = ur.workspace_id 
    THEN '✅ Match'
    ELSE '❌ Mismatch'
  END as status
FROM chatbots c
CROSS JOIN auth.users au
LEFT JOIN user_roles ur ON ur.user_id = au.id
WHERE au.id = auth.uid()
AND c.deleted_at IS NULL;
```

**If mismatch, fix it:**
```sql
-- Update chatbot to correct workspace
UPDATE chatbots
SET workspace_id = (
  SELECT workspace_id 
  FROM user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1
)
WHERE deleted_at IS NULL;
```

---

### **Fix 3: Soft Delete Issue**

**Problem:** Chatbot marked as deleted

**Check:**
```sql
-- Check deleted status
SELECT 
  id,
  name,
  deleted_at,
  CASE 
    WHEN deleted_at IS NULL THEN '✅ Active'
    ELSE '❌ Soft Deleted'
  END as status
FROM chatbots
ORDER BY created_at DESC;
```

**Fix if soft deleted:**
```sql
-- Restore chatbot
UPDATE chatbots
SET 
  deleted_at = NULL,
  deleted_by = NULL
WHERE id = 'YOUR_CHATBOT_ID';
```

---

### **Fix 4: Missing Columns**

**Problem:** Update tries to set column that doesn't exist

**Check:**
```sql
-- Verify all required columns exist
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'chatbots'
AND column_name IN (
  'id', 'workspace_id', 'name', 'description', 
  'system_prompt', 'model', 'temperature', 
  'max_tokens', 'is_active', 'deleted_at'
)
ORDER BY column_name;
```

**Should return:**
```
deleted_at
description
id
is_active
max_tokens
model
name
system_prompt
temperature
workspace_id
```

**If missing, run:**
```sql
-- Run FIX_CHATBOT_SCHEMA.sql again
```

---

## 🐛 **ADVANCED DEBUGGING:**

### **Enable API Logging:**

Add to `.env.local`:
```env
NEXT_PUBLIC_DEBUG=true
```

Restart dev server:
```bash
# Stop: Ctrl+C
npm run dev
```

---

### **Check API Response:**

In browser console (F12):
```javascript
// Test API directly
fetch('/api/chatbots/YOUR_CHATBOT_ID', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Test Update',
    description: 'Testing update',
  })
})
.then(r => r.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

**Expected response:**
```json
{
  "chatbot": {
    "id": "...",
    "name": "Test Update",
    ...
  }
}
```

**Error response:**
```json
{
  "error": "Chatbot not found or already deleted"
}
```

---

## 📝 **COLLECT DIAGNOSTIC INFO:**

Run these and share output:

### **1. Count Chatbots:**
```sql
SELECT 
  COUNT(*) FILTER (WHERE deleted_at IS NULL) as active,
  COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as deleted,
  COUNT(*) as total
FROM chatbots;
```

### **2. Show Latest Chatbot:**
```sql
SELECT 
  id,
  name,
  workspace_id,
  model,
  temperature,
  max_tokens,
  is_active,
  deleted_at
FROM chatbots
ORDER BY created_at DESC
LIMIT 1;
```

### **3. Check User Role:**
```sql
SELECT 
  au.email,
  r.name as role,
  ur.workspace_id
FROM auth.users au
JOIN user_roles ur ON ur.user_id = au.id
JOIN roles r ON r.id = ur.role_id
WHERE au.id = auth.uid();
```

---

## 🎯 **QUICK FIX CHECKLIST:**

```
□ Run DEBUG_CHATBOT_ISSUE.sql
□ Check browser console (F12)
□ Check Network tab for errors
□ Verify chatbot exists and not deleted
□ Verify user has correct workspace
□ Verify user has correct role
□ Test manual update in Supabase
□ Check all required columns exist
□ Restart dev server (npm run dev)
□ Clear browser cache (Ctrl+F5)
□ Try update again
```

---

## 💡 **MOST LIKELY CAUSES:**

### **1. RLS Policy Issue (Most Common)**

**Problem:** Row Level Security blocking update

**Fix:**
```sql
-- Temporarily disable RLS for testing
ALTER TABLE chatbots DISABLE ROW LEVEL SECURITY;

-- Try update again
-- If works, the issue is RLS policy

-- Re-enable RLS
ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;

-- Fix RLS policy
DROP POLICY IF EXISTS "Users can manage chatbots in their workspace" ON chatbots;

CREATE POLICY "Users can manage chatbots in their workspace"
ON chatbots FOR ALL
USING (
  workspace_id IN (
    SELECT workspace_id 
    FROM user_roles 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  workspace_id IN (
    SELECT workspace_id 
    FROM user_roles 
    WHERE user_id = auth.uid()
  )
);
```

### **2. Auth Session Issue**

**Fix:**
```
1. Logout
2. Clear cookies (DevTools → Application → Cookies)
3. Login again
4. Try update again
```

### **3. Stale Data**

**Fix:**
```
1. Refresh chatbots list
2. Click chatbot again
3. Try edit with fresh data
```

---

## 🚀 **AFTER FIX VERIFICATION:**

```sql
-- Final test: Create, Read, Update, Delete
DO $$
DECLARE
  v_chatbot_id UUID;
  v_test_result TEXT;
BEGIN
  -- CREATE
  INSERT INTO chatbots (
    workspace_id,
    name,
    system_prompt,
    model,
    temperature,
    max_tokens,
    pinecone_namespace
  ) VALUES (
    (SELECT workspace_id FROM user_roles WHERE user_id = auth.uid() LIMIT 1),
    'CRUD Test Bot',
    'Test prompt',
    'gemini-2.0-flash',
    0.7,
    2048,
    'test-' || gen_random_uuid()
  )
  RETURNING id INTO v_chatbot_id;
  
  RAISE NOTICE '✅ CREATE: Success (ID: %)', v_chatbot_id;
  
  -- READ
  SELECT name INTO v_test_result 
  FROM chatbots 
  WHERE id = v_chatbot_id;
  
  RAISE NOTICE '✅ READ: Success (Name: %)', v_test_result;
  
  -- UPDATE
  UPDATE chatbots 
  SET name = 'Updated Test Bot'
  WHERE id = v_chatbot_id
  RETURNING name INTO v_test_result;
  
  RAISE NOTICE '✅ UPDATE: Success (New name: %)', v_test_result;
  
  -- DELETE (soft)
  UPDATE chatbots
  SET deleted_at = NOW()
  WHERE id = v_chatbot_id;
  
  RAISE NOTICE '✅ DELETE: Success (Soft deleted)';
  
  -- Cleanup
  DELETE FROM chatbots WHERE id = v_chatbot_id;
  
  RAISE NOTICE '🎉 ALL CRUD OPERATIONS WORKING!';
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ CRUD TEST FAILED: %', SQLERRM;
END $$;
```

---

## 📞 **NEXT STEPS:**

1. **Share diagnostic output from:**
   - Browser console errors
   - Network tab response
   - SQL queries above

2. **Try the fixes above**

3. **If still failing, check:**
   - Is dev server running? (`npm run dev`)
   - Is Supabase connected? (check .env.local)
   - Are you logged in?

---

**Status:** Waiting for diagnostic info to provide targeted fix! 🔍
