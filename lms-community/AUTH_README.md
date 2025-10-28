# LMS Community Platform - Authentication System

Complete authentication system implementation with NextAuth.js v5, Google OAuth, and role-based access control.

## Features

- Google OAuth authentication with Drive API access
- Role-based access control (SUPER_ADMIN, FINANCE, TEACHER, STUDENT)
- Automatic route protection via middleware
- Server and client-side authentication helpers
- OAuth token management and refresh
- Secure session handling
- User role management

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for development)
- `NEXTAUTH_SECRET` - Random secret (generate with `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

### 3. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Or run migrations
npx prisma migrate dev --name init
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## File Structure

```
src/
├── lib/
│   ├── auth.ts                 # NextAuth configuration
│   ├── auth-helpers.ts         # Authentication helper functions
│   └── prisma.ts               # Prisma client singleton
├── middleware.ts               # Route protection middleware
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts    # NextAuth API route
│   ├── auth/
│   │   ├── signin/
│   │   │   └── page.tsx        # Sign-in page
│   │   └── error/
│   │       └── page.tsx        # Error page
│   └── unauthorized/
│       └── page.tsx            # Unauthorized access page
├── components/
│   └── providers/
│       └── AuthProvider.tsx    # Session provider wrapper
prisma/
└── schema.prisma               # Database schema
```

## User Roles

### SUPER_ADMIN
- Full system access
- Can manage all users, courses, and payments
- Can assign/modify user roles
- Access to all dashboard areas

### FINANCE
- Payment and invoicing management
- View financial reports
- Process refunds
- Cannot manage courses or users

### TEACHER
- Course creation and management
- Upload materials to Google Drive
- Grade assignments
- View enrolled students

### STUDENT (Default)
- Enroll in courses
- View materials
- Submit assignments
- View own grades

## Usage Examples

### Server Components

```typescript
import { requireAuth, requireRole } from "@/lib/auth-helpers"

// Require authentication
export default async function DashboardPage() {
  const session = await requireAuth()
  return <div>Welcome, {session.user.name}</div>
}

// Require specific role
export default async function AdminPage() {
  await requireRole(["SUPER_ADMIN"])
  return <div>Admin Dashboard</div>
}
```

### Client Components

```typescript
"use client"
import { useSession, signIn, signOut } from "next-auth/react"

export function ProfileButton() {
  const { data: session } = useSession()
  
  if (!session) {
    return <button onClick={() => signIn("google")}>Sign In</button>
  }
  
  return (
    <div>
      <p>{session.user.name}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}
```

### API Routes

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
  
  return NextResponse.json({ data: "Secret data" })
}
```

## Helper Functions

### Authentication Helpers

- `getSession()` - Get current session
- `getCurrentUser()` - Get current user
- `requireAuth(redirectTo?)` - Require authentication
- `requireRole(roles, redirectUrl?)` - Require specific role
- `checkRole(roles)` - Check if user has role
- `isSuperAdmin()` - Check if user is super admin
- `isFinance()` - Check if user is finance
- `isTeacher()` - Check if user is teacher
- `isStudent()` - Check if user is student

### User Management

- `updateUserRole(userId, newRole)` - Update user role (Super Admin only)
- `getUsers(options)` - Get users with pagination
- `getUserById(userId)` - Get user by ID

### Google Drive Integration

- `getValidGoogleToken(userId)` - Get valid access token
- `refreshGoogleToken(userId)` - Refresh expired token

## Protected Routes

The middleware automatically protects these routes:

- `/dashboard/super-admin/*` - SUPER_ADMIN only
- `/dashboard/finance/*` - SUPER_ADMIN, FINANCE
- `/dashboard/teacher/*` - SUPER_ADMIN, TEACHER
- `/dashboard/student/*` - SUPER_ADMIN, STUDENT

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Drive API
4. Configure OAuth consent screen
5. Create OAuth 2.0 credentials
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env`

For detailed setup instructions, see [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)

## Security Best Practices

1. **Never commit `.env` file**
2. Use strong, random `NEXTAUTH_SECRET`
3. Enable HTTPS in production
4. Regularly rotate secrets
5. Implement rate limiting
6. Monitor authentication logs
7. Keep dependencies updated

## Documentation

- [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) - Complete setup guide
- [examples/](./examples/) - Code examples
  - `server-component-auth.tsx` - Server component examples
  - `client-component-auth.tsx` - Client component examples
  - `api-route-auth.ts` - API route examples

## Troubleshooting

### OAuth Redirect URI Mismatch
Ensure redirect URI in Google Console matches: `http://localhost:3000/api/auth/callback/google`

### Session Not Persisting
Check that `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set correctly

### Database Connection Errors
Verify `DATABASE_URL` is correct and PostgreSQL is running

### Role-Based Access Not Working
Clear Next.js cache: `rm -rf .next && npm run dev`

## Support

For issues or questions:
1. Check documentation
2. Review error logs
3. Search existing issues
4. Create new issue with details

## License

MIT License - see LICENSE file for details
