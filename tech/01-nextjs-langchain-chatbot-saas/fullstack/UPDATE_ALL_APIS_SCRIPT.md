# 🔧 UPDATE ALL APIs - COMPLETE SCRIPT

## ✅ **COMPLETED:**
- `src/app/api/chatbots/[id]/route.ts` ✅ DONE
- `src/app/api/chatbots/route.ts` ✅ DONE

---

## 📋 **REMAINING APIS TO UPDATE:**

### **Pattern for ALL endpoints:**

```typescript
// 1. Add imports at top
import { getCurrentUser, hasPermission } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

// 2. Replace auth check
// OLD:
const { data: { user }, error: userError } = await supabase.auth.getUser();
if (userError || !user) { ... }

// NEW:
const user = await getCurrentUser();
if (!user) { ... }

// 3. Add .is('deleted_at', null) to ALL SELECT queries
// OLD:
.from('table').select('*').eq('id', id)

// NEW:
.from('table').select('*').eq('id', id).is('deleted_at', null)

// 4. Replace .delete() with soft delete
// OLD:
.from('table').delete().eq('id', id)

// NEW:
.from('table').update({
  deleted_at: new Date().toISOString(),
  deleted_by: user.id
}).eq('id', id)

// 5. Add permission checks
const canRead = await hasPermission(user.id, 'resource.read', { workspaceId });
if (!canRead) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

// 6. Add audit logging
await logAudit({
  userId: user.id,
  workspaceId,
  action: 'action_resource',
  resourceType: 'resource',
  resourceId: id,
  oldValues: old, // for UPDATE/DELETE
  newValues: new, // for CREATE/UPDATE
  status: 'success'
});
```

---

## 1️⃣ **DOCUMENTS API**

### **File: `src/app/api/documents/route.ts`**

**Changes:**
```typescript
// Add imports
import { getCurrentUser, hasPermission } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

// GET - List documents
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const chatbotId = req.nextUrl.searchParams.get('chatbotId');
  
  // Get chatbot to check workspace
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('workspace_id')
    .eq('id', chatbotId)
    .is('deleted_at', null)
    .single();

  if (!chatbot) return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });

  // Check permission
  const canRead = await hasPermission(user.id, 'document.read', {
    workspaceId: chatbot.workspace_id
  });
  if (!canRead) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  // Query documents (filter deleted)
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('chatbot_id', chatbotId)
    .is('deleted_at', null) // ⚠️ ADD THIS
    .order('created_at', { ascending: false });

  return NextResponse.json({ documents });
}
```

---

### **File: `src/app/api/documents/[id]/route.ts`**

**Changes:**
```typescript
import { getCurrentUser, hasPermission } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

// GET
export async function GET(req, { params }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: document } = await supabase
    .from('documents')
    .select('*, chatbots(workspace_id)')
    .eq('id', params.id)
    .is('deleted_at', null) // ⚠️ ADD
    .single();

  if (!document) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const canRead = await hasPermission(user.id, 'document.read', {
    workspaceId: document.chatbots.workspace_id
  });
  if (!canRead) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  return NextResponse.json({ document });
}

// DELETE - Soft delete
export async function DELETE(req, { params }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Get document first
  const { data: document } = await supabase
    .from('documents')
    .select('*, chatbots(workspace_id)')
    .eq('id', params.id)
    .is('deleted_at', null)
    .single();

  if (!document) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const canDelete = await hasPermission(user.id, 'document.delete', {
    workspaceId: document.chatbots.workspace_id
  });
  if (!canDelete) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  // SOFT DELETE (not .delete()!)
  const { error } = await supabase
    .from('documents')
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: user.id
    })
    .eq('id', params.id);

  if (error) {
    await logAudit({
      userId: user.id,
      workspaceId: document.chatbots.workspace_id,
      action: 'delete_document',
      resourceType: 'document',
      resourceId: params.id,
      status: 'failed',
      errorMessage: error.message
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log success
  await logAudit({
    userId: user.id,
    workspaceId: document.chatbots.workspace_id,
    action: 'delete_document',
    resourceType: 'document',
    resourceId: document.id,
    oldValues: document,
    status: 'success'
  });

  return NextResponse.json({ success: true });
}
```

---

## 2️⃣ **CONVERSATIONS API**

### **File: `src/app/api/conversations/route.ts`**

**Changes:**
```typescript
import { getCurrentUser, hasPermission } from '@/lib/rbac';

// GET - List conversations
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const chatbotId = req.nextUrl.searchParams.get('chatbotId');
  const search = req.nextUrl.searchParams.get('search');

  // Get chatbot to check workspace
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('workspace_id')
    .eq('id', chatbotId)
    .is('deleted_at', null)
    .single();

  if (!chatbot) return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });

  const canRead = await hasPermission(user.id, 'conversation.read', {
    workspaceId: chatbot.workspace_id
  });
  if (!canRead) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  let query = supabase
    .from('conversations')
    .select('*')
    .eq('chatbot_id', chatbotId)
    .is('deleted_at', null) // ⚠️ ADD
    .order('created_at', { ascending: false });

  if (search) {
    query = query.ilike('visitor_id', `%${search}%`);
  }

  const { data: conversations } = await query;

  return NextResponse.json({ conversations });
}

// POST - Create conversation (PUBLIC - for widget!)
// This one stays PUBLIC (no auth) for widget usage
export async function POST(req: NextRequest) {
  // Keep as is - widget needs to create conversations without auth
}
```

---

### **File: `src/app/api/conversations/[id]/route.ts`**

Same pattern as documents!

---

## 3️⃣ **WORKSPACES API**

### **File: `src/app/api/workspaces/route.ts`**

```typescript
import { getCurrentUser, hasPermission } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

// GET - List workspaces
export async function GET(req) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: workspaces } = await supabase
    .from('workspaces')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null) // ⚠️ ADD
    .order('created_at', { ascending: false });

  return NextResponse.json({ workspaces });
}

// POST - Create workspace
export async function POST(req) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const canCreate = await hasPermission(user.id, 'workspace.create');
  if (!canCreate) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { name, slug } = body;

  const { data: workspace, error } = await supabase
    .from('workspaces')
    .insert({
      user_id: user.id,
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-')
    })
    .select()
    .single();

  if (error) {
    await logAudit({
      userId: user.id,
      action: 'create_workspace',
      resourceType: 'workspace',
      status: 'failed',
      errorMessage: error.message
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logAudit({
    userId: user.id,
    workspaceId: workspace.id,
    action: 'create_workspace',
    resourceType: 'workspace',
    resourceId: workspace.id,
    newValues: workspace,
    status: 'success'
  });

  return NextResponse.json({ workspace });
}
```

---

### **File: `src/app/api/workspaces/[id]/route.ts`**

```typescript
// DELETE - Soft delete workspace
export async function DELETE(req, { params }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('*')
    .eq('id', params.id)
    .is('deleted_at', null)
    .single();

  if (!workspace) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Only owner can delete
  if (workspace.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // SOFT DELETE
  const { error } = await supabase
    .from('workspaces')
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: user.id
    })
    .eq('id', params.id);

  if (error) {
    await logAudit({
      userId: user.id,
      workspaceId: params.id,
      action: 'delete_workspace',
      resourceType: 'workspace',
      resourceId: params.id,
      status: 'failed',
      errorMessage: error.message
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logAudit({
    userId: user.id,
    workspaceId: params.id,
    action: 'delete_workspace',
    resourceType: 'workspace',
    resourceId: workspace.id,
    oldValues: workspace,
    status: 'success'
  });

  return NextResponse.json({ success: true });
}
```

---

## 4️⃣ **API KEYS API**

### **File: `src/app/api/settings/api-keys/route.ts`**

```typescript
// Same pattern - add permission checks + soft delete + audit logging
```

---

## 📊 **SUMMARY CHECKLIST:**

```
✅ src/app/api/chatbots/[id]/route.ts
✅ src/app/api/chatbots/route.ts
⏸️ src/app/api/documents/route.ts
⏸️ src/app/api/documents/[id]/route.ts
⏸️ src/app/api/conversations/route.ts
⏸️ src/app/api/conversations/[id]/route.ts
⏸️ src/app/api/workspaces/route.ts
⏸️ src/app/api/workspaces/[id]/route.ts
⏸️ src/app/api/settings/api-keys/route.ts
⏸️ src/app/api/settings/api-keys/[id]/route.ts
⏸️ src/app/api/credits/route.ts
```

---

## ⏱️ **TIME ESTIMATE:**

- ✅ Chatbots: DONE (1 hour)
- Documents: 30-45 min
- Conversations: 30-45 min
- Workspaces: 30-45 min
- API Keys: 30-45 min
- Others: 1-2 hours

**TOTAL: 4-6 hours** (systematic work following template!)

---

## 🚀 **NEXT AFTER APIs:**

Once all APIs updated:
1. Build Super Admin Dashboard
2. Build Analytics Dashboard
3. Build Team Management
4. Build Settings Pages
5. Testing & Polish

**YOU CAN NOW:**
- Follow this script to update remaining APIs
- Or I can continue building in next session
- Each API follows same pattern!
