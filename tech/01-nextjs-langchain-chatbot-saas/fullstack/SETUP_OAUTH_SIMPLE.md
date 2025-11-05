# 🔐 Setup OAuth - Simple Guide

## ✅ OAuth Buttons Now Active!

Buttons sudah muncul di login/signup page, tinggal setup credentials!

---

## 🎯 Cara Setup OAuth (2 Pilihan)

### **Pilihan A: Google OAuth** (Lebih Populer) ⭐

### **Pilihan B: GitHub OAuth** (Lebih Mudah)

---

# 🟢 Option A: Google OAuth Setup

## Step 1: Buat Google OAuth Credentials (10 menit)

### 1.1 Buka Google Cloud Console
https://console.cloud.google.com/

### 1.2 Create Project (kalau belum ada)
1. Click dropdown project (top left)
2. Click "New Project"
3. Name: `AI Chatbot Platform`
4. Click "Create"

### 1.3 Enable Google+ API (PENTING!)
1. Go to: https://console.cloud.google.com/apis/library
2. Search: **"Google+ API"**
3. Click → Enable
4. Wait 1 minute

### 1.4 Setup OAuth Consent Screen
1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. User Type: **External** (pilih ini)
3. Click "Create"

**App Information:**
- App name: `Universal AI Chatbot`
- User support email: (your email)
- Developer email: (your email)
- Click "Save and Continue"

**Scopes:**
- Click "Add or Remove Scopes"
- Select these 3:
  - ✅ `.../auth/userinfo.email`
  - ✅ `.../auth/userinfo.profile`
  - ✅ `openid`
- Click "Update"
- Click "Save and Continue"

**Test Users (PENTING untuk development!):**
- Click "Add Users"
- Add your email: `youremail@gmail.com`
- Click "Add"
- Click "Save and Continue"

**Review:**
- Click "Back to Dashboard"

### 1.5 Create OAuth Client ID
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" → **"OAuth client ID"**
3. Application type: **Web application**
4. Name: `Universal AI - Dev`

**Authorized JavaScript origins:**
```
http://localhost:3011
```

**Authorized redirect URIs** (COPY EXACTLY!):
```
https://bfmwpnrjlpelpatwobfv.supabase.co/auth/v1/callback
```

5. Click **"Create"**

### 1.6 Copy Credentials
You'll see a popup with:
- **Client ID**: `123456789-xxx.apps.googleusercontent.com`
- **Client secret**: `GOCSPX-xxxxxxxxxxxxx`

**COPY THESE!** You'll need them next!

---

## Step 2: Enable Google di Supabase (2 menit)

### 2.1 Go to Supabase Auth Providers
https://supabase.com/dashboard/project/bfmwpnrjlpelpatwobfv/auth/providers

### 2.2 Find "Google"
Scroll down, find **Google** provider

### 2.3 Enable & Paste Credentials
1. Toggle: **Enable Sign in with Google** → ON
2. Paste **Client ID** (from Google Console)
3. Paste **Client Secret** (from Google Console)
4. Click **"Save"**

Done! ✅

---

## Step 3: Configure Site URL (1 menit)

### 3.1 Go to URL Configuration
https://supabase.com/dashboard/project/bfmwpnrjlpelpatwobfv/auth/url-configuration

### 3.2 Set URLs
**Site URL:**
```
http://localhost:3011
```

**Redirect URLs:**
```
http://localhost:3011/**
```

Click **"Save"**

---

## Step 4: Test! (1 menit)

1. **Restart dev server:**
   ```bash
   # Stop: Ctrl+C
   # Start:
   npm run dev
   ```

2. **Open login:**
   ```
   http://localhost:3011/login
   ```

3. **Click "Google" button**

4. **Expected flow:**
   - Opens Google login popup
   - Select your Google account
   - Grant permissions
   - Redirects back to app
   - Logged in! ✅

---

# 🔵 Option B: GitHub OAuth Setup (Easier!)

## Step 1: Create GitHub OAuth App (5 menit)

### 1.1 Go to GitHub Developer Settings
https://github.com/settings/developers

### 1.2 Click "New OAuth App"

### 1.3 Fill Form:
- **Application name**: `Universal AI Chatbot`
- **Homepage URL**: `http://localhost:3011`
- **Authorization callback URL** (EXACT!):
  ```
  https://bfmwpnrjlpelpatwobfv.supabase.co/auth/v1/callback
  ```
- Click **"Register application"**

### 1.4 Generate Client Secret
1. Click **"Generate a new client secret"**
2. Copy the secret (shows only once!)

### 1.5 Copy Credentials
- **Client ID**: `Iv1.xxxxxxxxxxxxx`
- **Client Secret**: `xxxxxxxxxxxxx` (just generated)

**COPY THESE!**

---

## Step 2: Enable GitHub di Supabase (2 menit)

### 2.1 Go to Supabase Auth Providers
https://supabase.com/dashboard/project/bfmwpnrjlpelpatwobfv/auth/providers

### 2.2 Find "GitHub"
Scroll down, find **GitHub** provider

### 2.3 Enable & Paste
1. Toggle: **Enable Sign in with GitHub** → ON
2. Paste **Client ID**
3. Paste **Client Secret**
4. Click **"Save"**

Done! ✅

---

## Step 3: Configure Site URL (same as Google)

https://supabase.com/dashboard/project/bfmwpnrjlpelpatwobfv/auth/url-configuration

**Site URL:** `http://localhost:3011`
**Redirect URLs:** `http://localhost:3011/**`

Click "Save"

---

## Step 4: Test!

1. Restart dev server
2. Open: http://localhost:3011/login
3. Click "GitHub" button
4. Login with GitHub
5. Grant access
6. Done! ✅

---

# 🔥 Quick Reference

## Important URLs:

### Google:
- **Console**: https://console.cloud.google.com/
- **Credentials**: https://console.cloud.google.com/apis/credentials
- **OAuth Consent**: https://console.cloud.google.com/apis/credentials/consent

### GitHub:
- **Developer Settings**: https://github.com/settings/developers

### Supabase:
- **Auth Providers**: https://supabase.com/dashboard/project/bfmwpnrjlpelpatwobfv/auth/providers
- **URL Config**: https://supabase.com/dashboard/project/bfmwpnrjlpelpatwobfv/auth/url-configuration

---

## Callback URL (CRITICAL!):

**MUST BE EXACTLY THIS:**
```
https://bfmwpnrjlpelpatwobfv.supabase.co/auth/v1/callback
```

This is your Supabase project's callback URL. Use it in:
- Google Console → Authorized redirect URIs
- GitHub OAuth App → Authorization callback URL

---

# 🐛 Common Errors & Fixes

## Error: "redirect_uri_mismatch"

**Fix:** Check callback URL is EXACTLY:
```
https://bfmwpnrjlpelpatwobfv.supabase.co/auth/v1/callback
```

No trailing slash, no extra parameters!

---

## Error: "Access blocked: Authorization Error" (Google)

**Fix:** 
1. OAuth consent screen → Publishing status: **Testing**
2. Add your email as Test User
3. Use that email to login

---

## Error: "Application is in development mode" (Google)

**This is OK!** Just a warning. Your app works fine in development.

To remove:
1. OAuth consent screen
2. Click "Publish App"
3. Submit for verification (only for production)

---

## Button does nothing

**Check:**
1. Browser console (F12) for errors
2. Supabase credentials saved correctly
3. Provider enabled in Supabase
4. Dev server restarted

---

# 💡 Tips

## For Development:

1. **Google**: Better for production (more users use Google)
2. **GitHub**: Easier to setup (no consent screen hassle)
3. **Both**: Setup both for maximum options!

## For Production:

When deploying to production domain:

**Google Console:**
- Add: `https://yourdomain.com` to Authorized origins
- Add: `https://bfmwpnrjlpelpatwobfv.supabase.co/auth/v1/callback` (same!)

**GitHub:**
- Update Homepage URL to production
- Callback URL stays the same!

**Supabase:**
- Update Site URL: `https://yourdomain.com`
- Add redirect: `https://yourdomain.com/**`

---

# ✅ Checklist

## Google OAuth:
- [ ] Create Google Cloud project
- [ ] Enable Google+ API
- [ ] Setup OAuth consent screen
- [ ] Add test users
- [ ] Create OAuth client ID
- [ ] Copy Client ID & Secret
- [ ] Enable in Supabase
- [ ] Paste credentials
- [ ] Configure Site URL
- [ ] Test login!

## GitHub OAuth:
- [ ] Create GitHub OAuth App
- [ ] Set callback URL
- [ ] Generate client secret
- [ ] Copy Client ID & Secret
- [ ] Enable in Supabase
- [ ] Paste credentials
- [ ] Configure Site URL
- [ ] Test login!

---

**Estimated time:**
- Google: 15 minutes
- GitHub: 10 minutes
- Both: 20 minutes

**Difficulty:** Medium

**Required:** Google/GitHub account

---

**Setelah setup, buttons langsung works! No code changes needed!** ✅

**OAuth logic sudah saya implement, tinggal credentials aja!** 🚀
