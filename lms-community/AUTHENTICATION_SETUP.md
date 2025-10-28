# Authentication System Setup Guide

This guide will help you set up the complete authentication system for the LMS Community Platform.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Google OAuth Setup](#google-oauth-setup)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)
6. [Usage Examples](#usage-examples)
7. [Role-Based Access Control](#role-based-access-control)
8. [Security Best Practices](#security-best-practices)

---

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Google Cloud Console account
- Git (for cloning the repository)

---

## Google OAuth Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "LMS Community Platform"
4. Click "Create"

### Step 2: Enable Google Drive API

1. In your Google Cloud Project, go to "APIs & Services" → "Library"
2. Search for "Google Drive API"
3. Click on it and press "Enable"

### Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" user type
3. Fill in the required information:
   - App name: LMS Community Platform
   - User support email: your-email@example.com
   - Developer contact: your-email@example.com
4. Add scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `.../auth/drive.file`
   - `.../auth/drive.readonly`
5. Add test users (during development)
6. Click "Save and Continue"

### Step 4: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Name: "LMS Community Web Client"
5. Authorized JavaScript origins:
   - `http://localhost:3000`
   - `https://yourdomain.com` (production)
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Click "Create"
8. **Save your Client ID and Client Secret** - you'll need these for the `.env` file

---

## Database Setup

### Step 1: Create PostgreSQL Database

```bash
# Using psql
createdb lms_community

# Or connect to PostgreSQL and run:
CREATE DATABASE lms_community;
```

### Step 2: Configure Database Connection

Update your `.env` file with the database URL:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/lms_community?schema=public"
```

### Step 3: Run Prisma Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma db push

# Or use migrations (recommended for production)
npx prisma migrate dev --name init
```

### Step 4: (Optional) Seed Initial Data

Create a seed file to add a super admin user:

```bash
# Create seed script
npx prisma db seed
```

---

## Environment Configuration

### Step 1: Copy Environment Template

```bash
cp .env.example .env
```

### Step 2: Configure Environment Variables

Edit `.env` file with your actual values:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lms_community?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here-generate-a-random-string"

# Google OAuth Credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Environment
NODE_ENV="development"
```

### Step 3: Generate NEXTAUTH_SECRET

```bash
# Generate a secure random string
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Running the Application

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Generate Prisma Client

```bash
npx prisma generate
```

### Step 3: Run Database Migrations

```bash
npx prisma db push
```

### Step 4: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

---

## Usage Examples

### 1. Server-Side Authentication (Server Components)

```typescript
// app/dashboard/page.tsx
import { requireAuth } from "@/lib/auth-helpers"

export default async function DashboardPage() {
  const session = await requireAuth()
  
  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>Your role: {session.user.role}</p>
    </div>
  )
}
```

### 2. Role-Based Page Protection

```typescript
// app/dashboard/super-admin/page.tsx
import { requireRole } from "@/lib/auth-helpers"

export default async function SuperAdminPage() {
  // Only SUPER_ADMIN can access this page
  await requireRole(["SUPER_ADMIN"])
  
  return <div>Super Admin Dashboard</div>
}
```

### 3. Client-Side Authentication (Client Components)

```typescript
"use client"

import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"

export default function ProfileButton() {
  const { data: session, status } = useSession()
  
  if (status === "loading") return <div>Loading...</div>
  
  if (!session) return <div>Not authenticated</div>
  
  return (
    <div>
      <p>Signed in as {session.user.email}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}
```

### 4. API Route Protection

```typescript
// app/api/users/route.ts
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
  
  // Return users data
  return NextResponse.json({ users: [] })
}
```

### 5. Checking User Roles

```typescript
import { 
  isSuperAdmin, 
  isFinance, 
  isTeacher, 
  isStudent 
} from "@/lib/auth-helpers"

export default async function MyPage() {
  const canManageUsers = await isSuperAdmin()
  const canViewPayments = await isFinance()
  const canCreateCourses = await isTeacher()
  
  return (
    <div>
      {canManageUsers && <AdminPanel />}
      {canViewPayments && <PaymentsSection />}
      {canCreateCourses && <CourseCreator />}
    </div>
  )
}
```

### 6. Updating User Roles (Super Admin Only)

```typescript
import { updateUserRole } from "@/lib/auth-helpers"

// In an API route or server action
export async function promoteToTeacher(userId: string) {
  try {
    await updateUserRole(userId, "TEACHER")
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

### 7. Getting User List with Pagination

```typescript
import { getUsers } from "@/lib/auth-helpers"

export default async function UsersPage() {
  const { users, pagination } = await getUsers({
    role: "STUDENT",
    search: "john",
    page: 1,
    limit: 20,
  })
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
      <p>Page {pagination.page} of {pagination.totalPages}</p>
    </div>
  )
}
```

### 8. Using Google Drive Tokens

```typescript
import { getValidGoogleToken } from "@/lib/auth-helpers"

export async function uploadToGoogleDrive(userId: string, file: File) {
  const accessToken = await getValidGoogleToken(userId)
  
  // Use the access token to interact with Google Drive API
  const response = await fetch(
    "https://www.googleapis.com/drive/v3/files",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: file.name,
        mimeType: file.type,
      }),
    }
  )
  
  return response.json()
}
```

---

## Role-Based Access Control

### User Roles Hierarchy

1. **SUPER_ADMIN** (Highest privileges)
   - Full system access
   - Manage all users, courses, and payments
   - Can access all dashboard areas
   - Can assign/modify user roles

2. **FINANCE**
   - Payment and invoicing management
   - View financial reports
   - Process refunds
   - Cannot manage courses or users

3. **TEACHER**
   - Course creation and management
   - Upload materials
   - Grade assignments
   - View enrolled students
   - Cannot manage payments or other users

4. **STUDENT** (Default role)
   - Enroll in courses
   - View materials
   - Submit assignments
   - View own grades
   - Limited access

### Protected Routes

#### Middleware Protection

The middleware automatically protects routes based on role:

- `/dashboard/super-admin/*` - Only SUPER_ADMIN
- `/dashboard/finance/*` - SUPER_ADMIN, FINANCE
- `/dashboard/teacher/*` - SUPER_ADMIN, TEACHER
- `/dashboard/student/*` - SUPER_ADMIN, STUDENT

#### Programmatic Protection

```typescript
// Protect with single role
await requireRole(["SUPER_ADMIN"])

// Protect with multiple roles
await requireRole(["SUPER_ADMIN", "FINANCE"])

// Custom redirect
await requireRole(["TEACHER"], "/dashboard/student")
```

---

## Security Best Practices

### 1. Environment Variables

- **NEVER** commit `.env` file to version control
- Use different secrets for development and production
- Rotate `NEXTAUTH_SECRET` regularly in production
- Use strong, randomly generated secrets

### 2. Database Security

- Use connection pooling for better performance
- Enable SSL for production database connections
- Regularly backup your database
- Use parameterized queries (Prisma handles this)

### 3. OAuth Security

- Keep OAuth credentials secure
- Regularly review authorized applications
- Implement rate limiting on authentication endpoints
- Use HTTPS in production (required for OAuth)

### 4. Session Management

- Sessions expire after 30 days (configurable)
- Implement proper logout functionality
- Clear session storage on logout
- Use secure, httpOnly cookies (NextAuth handles this)

### 5. Token Management

- Google OAuth tokens are stored encrypted in database
- Refresh tokens automatically when expired
- Implement token revocation on password change
- Log token access for audit trails

### 6. Role-Based Access

- Always verify user roles on server-side
- Don't rely solely on client-side checks
- Implement proper error handling for unauthorized access
- Log suspicious access attempts

### 7. Production Checklist

- [ ] Change `NEXTAUTH_SECRET` to a strong random value
- [ ] Update `NEXTAUTH_URL` to your production domain
- [ ] Configure OAuth redirect URIs for production
- [ ] Enable SSL/TLS for all connections
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Enable audit logging
- [ ] Review and test all role permissions
- [ ] Set up monitoring and alerts
- [ ] Document emergency procedures

---

## Troubleshooting

### Common Issues

#### 1. OAuth Redirect URI Mismatch

**Error:** `redirect_uri_mismatch`

**Solution:** Ensure your redirect URI in Google Cloud Console matches exactly:
```
http://localhost:3000/api/auth/callback/google
```

#### 2. Database Connection Errors

**Error:** `Can't reach database server`

**Solution:** 
- Check if PostgreSQL is running
- Verify DATABASE_URL is correct
- Ensure database exists
- Check firewall settings

#### 3. Session Not Persisting

**Error:** User gets logged out on page refresh

**Solution:**
- Check `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again
- Check browser console for errors

#### 4. Role-Based Access Not Working

**Error:** Users can access unauthorized routes

**Solution:**
- Verify middleware is properly configured
- Check middleware matcher patterns
- Ensure database has correct user roles
- Clear Next.js cache: `rm -rf .next`

---

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Documentation](https://nextjs.org/docs)

---

## Support

For issues or questions:
1. Check this documentation
2. Review error logs
3. Search existing issues
4. Create a new issue with detailed information

---

**Last Updated:** October 2025
