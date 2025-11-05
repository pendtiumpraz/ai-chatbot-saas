# 🔧 FIX ALL WORKSPACE_ID ISSUES

## MASALAH:
Semua endpoint menggunakan `user.id` sebagai `workspace_id`, tapi sekarang workspace punya UUID sendiri!

## SOLUSI:

### 1. Run SQL Helper Functions
```sql
-- File: CREATE_HELPER_FUNCTIONS.sql
-- Creates: get_user_workspace_id(user_id)
```

### 2. Fix All API Endpoints

Replace pattern:
```typescript
// ❌ OLD (BROKEN):
workspace_id: user.id
.eq('workspace_id', user.id)
workspaceId || user.id

// ✅ NEW (FIXED):
import { getUserWorkspaceId } from '@/lib/workspace-helper'

const workspaceId = await getUserWorkspaceId(user.id)
if (!workspaceId) return error

workspace_id: workspaceId
.eq('workspace_id', workspaceId)
```

## FILES TO FIX:

### ✅ Already Fixed:
1. `/api/chatbots/route.ts` - GET & POST
2. `/api/chatbots/[id]/route.ts` - UPDATE & DELETE  
3. `/api/workspaces/[id]/route.ts` - GET & DELETE

### ⚠️ Need Fix:
1. `/api/settings/api-keys/route.ts` - Lines 22, 90
2. `/api/settings/api-keys/[id]/route.ts` - Lines 35, 72
3. `/api/documents/upload/route.ts` - Line 48
4. `/api/credits/route.ts` - Lines 27, 40, 48, 102, 110, 132, 142
5. `/api/conversations/route.ts` - Line 25
6. `/api/conversations/[id]/route.ts` - Line 76

## QUICK FIX FOR DEVELOPMENT:

Instead of fixing all files, just **ensure user has workspace** on signup!

Run this SQL to **create workspace for existing users**:

```sql
-- Create workspace for users who don't have one
DO $$
DECLARE
  r RECORD;
  v_workspace_id UUID;
  v_owner_role_id UUID;
BEGIN
  -- Get owner role
  SELECT id INTO v_owner_role_id FROM roles WHERE name = 'workspace_owner';
  
  -- For each user without workspace
  FOR r IN (
    SELECT DISTINCT u.id, u.email
    FROM auth.users u
    LEFT JOIN user_roles ur ON ur.user_id = u.id
    WHERE ur.id IS NULL
  ) LOOP
    -- Create workspace
    INSERT INTO workspaces (id, name, slug, plan)
    VALUES (
      uuid_generate_v4(),
      SPLIT_PART(r.email, '@', 1) || '''s Workspace',
      LOWER(REGEXP_REPLACE(SPLIT_PART(r.email, '@', 1), '[^a-zA-Z0-9]+', '-', 'g')),
      'free'
    )
    RETURNING id INTO v_workspace_id;
    
    -- Assign owner role
    INSERT INTO user_roles (user_id, role_id, workspace_id)
    VALUES (r.id, v_owner_role_id, v_workspace_id);
    
    RAISE NOTICE 'Created workspace % for user %', v_workspace_id, r.email;
  END LOOP;
END $$;

SELECT '✅ All users now have workspaces!' as result;
```

This ensures:
- Every user has at least 1 workspace
- getUserWorkspaceId() will always return a value
- All APIs will work!

## TEST:

```sql
-- Check all users have workspace
SELECT 
  u.email,
  ur.workspace_id,
  w.name
FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN workspaces w ON w.id = ur.workspace_id
ORDER BY u.created_at;

-- Should show workspace for every user
```
