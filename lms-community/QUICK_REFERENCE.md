# Authentication System - Quick Reference Guide

## Common Tasks

### Check if User is Authenticated (Server)

```typescript
import { getSession } from "@/lib/auth-helpers"

const session = await getSession()
if (!session) {
  // User not authenticated
}
```

### Check if User is Authenticated (Client)

```typescript
"use client"
import { useSession } from "next-auth/react"

const { data: session, status } = useSession()
if (status === "loading") {
  // Loading...
}
if (!session) {
  // User not authenticated
}
```

### Protect a Page (Server Component)

```typescript
import { requireAuth } from "@/lib/auth-helpers"

export default async function ProtectedPage() {
  await requireAuth() // Redirects to /auth/signin if not logged in
  return <div>Protected content</div>
}
```

### Protect by Role (Server Component)

```typescript
import { requireRole } from "@/lib/auth-helpers"

export default async function AdminPage() {
  await requireRole(["SUPER_ADMIN"]) // Redirects to /unauthorized if not admin
  return <div>Admin only content</div>
}
```

### Sign In Button

```typescript
"use client"
import { signIn } from "next-auth/react"

<button onClick={() => signIn("google")}>Sign In with Google</button>
```

### Sign Out Button

```typescript
"use client"
import { signOut } from "next-auth/react"

<button onClick={() => signOut()}>Sign Out</button>
```

### Show Content Based on Role

```typescript
const session = await getSession()
const role = session?.user?.role

{role === "SUPER_ADMIN" && <AdminPanel />}
{role === "TEACHER" && <TeacherPanel />}
{role === "STUDENT" && <StudentPanel />}
```

### Protect API Route

```typescript
import { getSession } from "@/lib/auth-helpers"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  if (session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  
  return NextResponse.json({ data: "Protected data" })
}
```

### Get Current User Info

```typescript
import { getCurrentUser } from "@/lib/auth-helpers"

const user = await getCurrentUser()
console.log(user?.name, user?.email, user?.role)
```

### Update User Role (Super Admin Only)

```typescript
import { updateUserRole } from "@/lib/auth-helpers"

await updateUserRole("user-id", "TEACHER")
```

### Get All Users (Paginated)

```typescript
import { getUsers } from "@/lib/auth-helpers"

const { users, pagination } = await getUsers({
  role: "STUDENT",
  search: "john",
  page: 1,
  limit: 10,
})
```

### Access Google Drive Token

```typescript
import { getValidGoogleToken } from "@/lib/auth-helpers"

const token = await getValidGoogleToken(userId)
// Use token for Google Drive API calls
```

## Role Hierarchy

1. **SUPER_ADMIN** - Full access to everything
2. **FINANCE** - Payment management
3. **TEACHER** - Course and materials management
4. **STUDENT** - Course enrollment and viewing

## Protected Routes (Middleware)

- `/dashboard/super-admin/*` → SUPER_ADMIN only
- `/dashboard/finance/*` → SUPER_ADMIN, FINANCE
- `/dashboard/teacher/*` → SUPER_ADMIN, TEACHER
- `/dashboard/student/*` → SUPER_ADMIN, STUDENT

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/lms_community"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generated-secret-key"
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

## File Locations

- Auth Config: `/src/lib/auth.ts`
- Auth Helpers: `/src/lib/auth-helpers.ts`
- Middleware: `/src/middleware.ts`
- API Route: `/src/app/api/auth/[...nextauth]/route.ts`
- Sign In Page: `/src/app/auth/signin/page.tsx`
- Unauthorized Page: `/src/app/unauthorized/page.tsx`

## Useful Commands

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Run migrations
npx prisma migrate dev

# View database in browser
npx prisma studio

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Debugging Tips

### Check Session Server-Side
```typescript
const session = await getSession()
console.log("Session:", session)
```

### Check Session Client-Side
```typescript
const { data: session } = useSession()
console.log("Session:", session)
```

### View Database
```bash
npx prisma studio
```

### Clear Next.js Cache
```bash
rm -rf .next
npm run dev
```

### Check Environment Variables
```typescript
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL)
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID)
```

## Common Errors

| Error | Solution |
|-------|----------|
| `redirect_uri_mismatch` | Check Google Console redirect URI matches exactly |
| `Can't reach database` | Verify DATABASE_URL and PostgreSQL is running |
| Session not persisting | Check NEXTAUTH_SECRET is set |
| Unauthorized on protected route | Clear browser cookies and cache |
| Role check failing | Verify user role in database with Prisma Studio |

## Next Steps

1. ✅ Complete Google OAuth setup
2. ✅ Configure environment variables
3. ✅ Run database migrations
4. ✅ Test authentication flow
5. 📝 Create dashboard pages
6. 📝 Implement course management
7. 📝 Add Google Drive integration
8. 📝 Build student enrollment system

## Support Resources

- [Full Setup Guide](./AUTHENTICATION_SETUP.md)
- [Code Examples](./examples/)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Prisma Docs](https://www.prisma.io/docs/)
