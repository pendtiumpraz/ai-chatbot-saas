# 🔐 Supabase Authentication Setup Guide

## Cara Aktivasi Login & Protect Dashboard

---

## 📋 Table of Contents
1. [Setup Supabase Project](#1-setup-supabase-project)
2. [Configure Authentication](#2-configure-authentication)
3. [Update Code untuk Auth](#3-update-code-untuk-auth)
4. [Protect Dashboard Routes](#4-protect-dashboard-routes)
5. [Testing](#5-testing)

---

## 1. Setup Supabase Project

### Step 1.1: Create Supabase Account
1. Go to https://supabase.com
2. Click **"Start your project"**
3. Sign in dengan GitHub/Google
4. Create new organization (atau pilih existing)

### Step 1.2: Create New Project
1. Click **"New Project"**
2. Fill in:
   - **Name:** `universal-ai-chatbot` (atau nama lain)
   - **Database Password:** (save ini! butuh nanti)
   - **Region:** Choose closest to you (e.g., Singapore for Indonesia)
   - **Pricing Plan:** Free tier (sufficient untuk start)
3. Click **"Create new project"**
4. Wait ~2 minutes for provisioning

### Step 1.3: Get API Keys
1. Di Supabase Dashboard, go to **Settings** → **API**
2. Copy these values:
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 1.4: Run Database Schema
1. Go to **SQL Editor** di Supabase Dashboard
2. Click **"New Query"**
3. Copy paste entire content dari file `supabase/schema.sql`
4. Click **"Run"** (or press Ctrl+Enter)
5. Verify: Check **Table Editor** → should see tables:
   - `workspaces`
   - `chatbots`
   - `conversations`
   - `documents`

### Step 1.5: Update Environment Variables
Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 2. Configure Authentication

### Step 2.1: Enable Email Auth
1. Go to **Authentication** → **Providers**
2. **Email** should be enabled by default
3. Configure:
   - ✅ Enable email provider
   - ✅ Confirm email (optional for testing, disable untuk fast testing)
   - ✅ Secure email change (recommended)

### Step 2.2: Configure OAuth Providers (Optional)

#### **Google OAuth:**
1. Go to https://console.cloud.google.com
2. Create new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure:
   - Application type: **Web application**
   - Authorized redirect URIs: 
     ```
     https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback
     ```
6. Copy **Client ID** and **Client Secret**
7. In Supabase:
   - Go to **Authentication** → **Providers** → **Google**
   - Enable and paste Client ID & Secret

#### **GitHub OAuth:**
1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - Application name: `Universal AI Chatbot`
   - Homepage URL: `http://localhost:3011` (or your domain)
   - Authorization callback URL: 
     ```
     https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback
     ```
4. Click **"Register application"**
5. Copy **Client ID** and generate **Client Secret**
6. In Supabase:
   - Go to **Authentication** → **Providers** → **GitHub**
   - Enable and paste Client ID & Secret

### Step 2.3: Configure Email Templates (Optional)
1. Go to **Authentication** → **Email Templates**
2. Customize:
   - Confirm signup
   - Invite user
   - Magic link
   - Reset password

---

## 3. Update Code untuk Auth

### Step 3.1: Install Supabase Auth Helpers
Already installed! ✅ (in package.json)

### Step 3.2: Update Login Page

Edit `src/app/login/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Bot, Mail, Lock, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      setError(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleGithubLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    // ... existing JSX, update form onSubmit and OAuth buttons
  )
}
```

### Step 3.3: Update Signup Page

Edit `src/app/signup/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
// ... other imports

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    companyName: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            company_name: formData.companyName,
          },
        },
      })

      if (authError) throw authError

      // 2. Create workspace
      if (authData.user) {
        const { error: workspaceError } = await supabase
          .from('workspaces')
          .insert({
            name: formData.companyName,
            slug: formData.companyName.toLowerCase().replace(/\s+/g, '-'),
            plan: 'free',
          })

        if (workspaceError) throw workspaceError
      }

      // 3. Redirect
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      setError(error.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  // ... rest of component
}
```

### Step 3.4: Create Auth Callback Handler

Create `src/app/auth/callback/route.ts`:

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
```

---

## 4. Protect Dashboard Routes

### Step 4.1: Create Auth Middleware

Create `src/middleware.ts` di root src folder:

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // Redirect to dashboard if already logged in
  if (session && (
    req.nextUrl.pathname === '/login' ||
    req.nextUrl.pathname === '/signup'
  )) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}
```

### Step 4.2: Update Dashboard Layout

Create `src/app/dashboard/layout.tsx`:

```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return <>{children}</>
}
```

### Step 4.3: Add Logout Function

Update Dashboard Sidebar dengan logout button:

```typescript
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export function DashboardSidebar() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="sidebar">
      {/* ... existing sidebar content ... */}
      
      <button
        onClick={handleLogout}
        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-red-600"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </aside>
  )
}
```

### Step 4.4: Get User Info in Dashboard

Update `src/app/dashboard/page.tsx`:

```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user's workspace
  const { data: workspaces } = await supabase
    .from('workspaces')
    .select('*')
    .limit(1)
    .single()

  return (
    <div>
      <h1>Welcome, {user?.user_metadata?.full_name || user?.email}!</h1>
      <p>Workspace: {workspaces?.name}</p>
      {/* ... rest of dashboard ... */}
    </div>
  )
}
```

---

## 5. Testing

### Step 5.1: Test Signup
1. Go to http://localhost:3011/signup
2. Fill form:
   - Full Name: John Doe
   - Email: test@example.com
   - Company: Test Company
   - Password: test123456
3. Click "Create Account"
4. Should redirect to dashboard ✅

### Step 5.2: Test Login
1. Go to http://localhost:3011/login
2. Enter email & password
3. Click "Sign In"
4. Should redirect to dashboard ✅

### Step 5.3: Test Protected Routes
1. Logout from dashboard
2. Try to access http://localhost:3011/dashboard directly
3. Should redirect to login page ✅

### Step 5.4: Test OAuth (if configured)
1. Click "Continue with Google" or GitHub
2. Authorize app
3. Should redirect to dashboard ✅

---

## 🔍 Debugging

### Check User Table
1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Should see registered users

### Check Session
```typescript
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)
```

### Check Workspace Creation
1. Go to Supabase → **Table Editor** → **workspaces**
2. Should see created workspaces

### Common Errors:

#### "User already registered"
- User exists in database
- Try login instead or use different email

#### "Invalid login credentials"
- Check email/password correct
- Check if email confirmed (if enabled)

#### "Redirect URL not allowed"
- Add callback URL to Supabase:
  - Go to **Authentication** → **URL Configuration**
  - Add redirect URLs:
    ```
    http://localhost:3011/auth/callback
    https://yourdomain.com/auth/callback
    ```

---

## 📋 Quick Setup Checklist

- [ ] Create Supabase project
- [ ] Get API keys
- [ ] Update `.env.local`
- [ ] Run database schema
- [ ] Enable Email auth
- [ ] (Optional) Configure OAuth providers
- [ ] Update login page with auth logic
- [ ] Update signup page with auth logic
- [ ] Create auth callback handler
- [ ] Create middleware for protection
- [ ] Add logout functionality
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test protected routes
- [ ] Test logout

---

## 🎯 Expected Behavior

### Before Login:
- ✅ Can access: `/`, `/pricing`, `/login`, `/signup`
- ❌ Cannot access: `/dashboard/*` (redirects to login)

### After Login:
- ✅ Can access: All pages including dashboard
- ✅ Redirect: `/login` → `/dashboard` (already logged in)
- ✅ Redirect: `/signup` → `/dashboard` (already logged in)

### User Data Available:
```typescript
{
  id: "uuid",
  email: "user@example.com",
  user_metadata: {
    full_name: "John Doe",
    company_name: "Test Company"
  }
}
```

---

## 🚀 Next Steps After Auth Setup

1. **Email Verification:**
   - Enable in Supabase settings
   - Customize email template
   - Test email flow

2. **Password Reset:**
   - Create forgot password page
   - Implement reset flow
   - Customize reset email

3. **User Profile:**
   - Add profile page
   - Allow update name, avatar
   - Change password feature

4. **Team Management:**
   - Invite team members
   - Assign roles
   - Manage permissions

5. **Session Management:**
   - Remember me feature
   - Session timeout
   - Refresh token handling

---

## 📚 Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [OAuth Providers Setup](https://supabase.com/docs/guides/auth/social-login)

---

**Authentication setup complete! Your dashboard is now protected!** 🔐✅
