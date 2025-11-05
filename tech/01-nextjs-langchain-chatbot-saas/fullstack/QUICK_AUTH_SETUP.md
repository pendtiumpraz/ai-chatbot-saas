# ⚡ Quick Supabase Auth Setup (5 Minutes)

## 🎯 Langkah Cepat Aktivasi Login

### 1. Setup Supabase (2 menit)

1. **Buat Supabase Project:**
   - Go to https://supabase.com
   - Sign in dengan GitHub/Google
   - Click "New Project"
   - Isi:
     - Name: `universal-ai-chatbot`
     - Database Password: (simpan ini!)
     - Region: Singapore (untuk Indonesia)
   - Click "Create new project"
   - Tunggu ~2 menit

2. **Get API Keys:**
   - Go to Settings → API
   - Copy 3 values ini:
     ```
     Project URL
     anon public key
     service_role key
     ```

3. **Update `.env.local`:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

4. **Run Database Schema:**
   - Go to SQL Editor di Supabase
   - Copy paste isi file `supabase/schema.sql`
   - Click "Run"
   - Done! ✅

---

### 2. Files yang Sudah Saya Buat (1 menit)

✅ **Middleware** (`src/middleware.ts`)
- Protects `/dashboard/*` routes
- Auto redirect ke login jika belum login
- Auto redirect ke dashboard jika sudah login

✅ **OAuth Callback** (`src/app/auth/callback/route.ts`)
- Handle Google/GitHub OAuth redirect

---

### 3. Enable Email Auth di Supabase (1 menit)

1. Go to **Authentication** → **Providers**
2. **Email** sudah enabled by default ✅
3. (Optional) Disable "Confirm email" untuk testing cepat:
   - Go to Authentication → Settings
   - Uncheck "Enable email confirmations"
   - Ini biar bisa langsung login tanpa verify email

---

### 4. Test Login (1 menit)

#### **Test dengan UI yang sudah ada:**

1. **Signup:**
   ```
   http://localhost:3011/signup
   
   Fill:
   - Full Name: Test User
   - Email: test@example.com
   - Company: Test Company
   - Password: test123456
   
   Click "Create Account"
   ```

2. **Login:**
   ```
   http://localhost:3011/login
   
   Email: test@example.com
   Password: test123456
   
   Click "Sign In"
   ```

3. **Test Protection:**
   - Logout
   - Try akses: http://localhost:3011/dashboard
   - Should redirect to login ✅

---

## 🔧 Yang Perlu Diupdate (Jika Mau Full Functional)

### Update Login Page (`src/app/login/page.tsx`)

Tambahkan ini di bagian atas:
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
```

Update `handleLogin` function:
```typescript
const router = useRouter()
const supabase = createClientComponentClient()

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    alert(error.message)
  } else {
    router.push('/dashboard')
  }
}
```

### Update Signup Page (`src/app/signup/page.tsx`)

Similar update untuk signup.

---

## 🎯 **TL;DR - Minimal Setup:**

```bash
# 1. Buat Supabase project
# 2. Copy API keys ke .env.local
# 3. Run schema.sql di Supabase SQL Editor
# 4. Restart dev server:

npm run dev

# 5. Test:
# - Signup: http://localhost:3011/signup
# - Login: http://localhost:3011/login
# - Dashboard: http://localhost:3011/dashboard (akan redirect jika belum login)
```

---

## ✅ Expected Behavior:

### ❌ Belum Login:
- `/` → ✅ Bisa akses
- `/pricing` → ✅ Bisa akses
- `/login` → ✅ Bisa akses
- `/signup` → ✅ Bisa akses
- `/dashboard` → ❌ Redirect ke `/login`

### ✅ Sudah Login:
- Semua page → ✅ Bisa akses
- `/login` → Auto redirect ke `/dashboard`
- `/signup` → Auto redirect ke `/dashboard`
- `/dashboard` → ✅ Bisa akses!

---

## 🐛 Troubleshooting:

### "Invalid login credentials"
- Check email/password benar
- Pastikan user sudah terdaftar (signup dulu)
- Check Supabase Dashboard → Authentication → Users

### "User already registered"
- Email sudah terdaftar
- Langsung login aja

### Redirect loop
- Clear browser cookies
- Check `.env.local` sudah benar
- Restart dev server

### OAuth not working
- Check callback URL di Supabase:
  - Go to Authentication → URL Configuration
  - Add: `http://localhost:3011/auth/callback`

---

## 📚 Full Details:

Lihat `SUPABASE_AUTH_SETUP.md` untuk:
- OAuth setup (Google, GitHub)
- Email templates customization
- Password reset flow
- User profile management
- Team permissions

---

**Setup selesai! Dashboard sekarang protected dengan login!** 🔐✅
