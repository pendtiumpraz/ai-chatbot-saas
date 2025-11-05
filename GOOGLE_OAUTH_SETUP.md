# 🔐 Google OAuth Setup - Step by Step

## 📋 Prerequisites:
- Google Account
- Supabase project running
- 15 minutes

---

## 🚀 Step 1: Get Google OAuth Credentials

### 1.1 Go to Google Cloud Console
Open: https://console.cloud.google.com/

### 1.2 Create New Project (or use existing)
1. Click project dropdown (top left)
2. Click "New Project"
3. Name: `Universal AI Chatbot`
4. Click "Create"
5. Wait ~30 seconds

### 1.3 Enable Google+ API
1. Go to: https://console.cloud.google.com/apis/library
2. Search: "Google+ API"
3. Click "Google+ API"
4. Click "Enable"
5. Wait for activation

### 1.4 Configure OAuth Consent Screen
1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Select "External" (unless you have Google Workspace)
3. Click "Create"

**Fill in OAuth consent screen:**
- App name: `Universal AI Chatbot`
- User support email: Your email
- Developer contact: Your email
- Click "Save and Continue"

**Scopes:**
- Click "Add or Remove Scopes"
- Select:
  - `../auth/userinfo.email`
  - `../auth/userinfo.profile`
  - `openid`
- Click "Update"
- Click "Save and Continue"

**Test users (for development):**
- Click "Add Users"
- Add your email
- Click "Save and Continue"

**Summary:**
- Review and click "Back to Dashboard"

### 1.5 Create OAuth Credentials
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: **Web application**
4. Name: `Universal AI Chatbot - Dev`

**Authorized JavaScript origins:**
```
http://localhost:3011
```

**Authorized redirect URIs:**
```
https://bfmwpnrjlpelpatwobfv.supabase.co/auth/v1/callback
```

5. Click "Create"
6. **Copy these values:**
   - Client ID: `xxxxx.apps.googleusercontent.com`
   - Client secret: `GOCSPX-xxxxx`

---

## 🗄️ Step 2: Configure Supabase

### 2.1 Go to Supabase Auth Settings
Open: https://supabase.com/dashboard/project/bfmwpnrjlpelpatwobfv/auth/providers

### 2.2 Enable Google Provider
1. Find "Google" in the list
2. Toggle "Enable Sign in with Google" to **ON**
3. Paste your Google credentials:
   - **Client ID:** (from Google Console)
   - **Client Secret:** (from Google Console)
4. Click "Save"

### 2.3 Configure Redirect URLs
Go to: https://supabase.com/dashboard/project/bfmwpnrjlpelpatwobfv/auth/url-configuration

**Site URL:**
```
http://localhost:3011
```

**Redirect URLs:**
```
http://localhost:3011/**
http://localhost:3011/auth/callback
```

Click "Save"

---

## ✅ Step 3: Test Google OAuth

### 3.1 Restart Dev Server
```bash
# In your terminal
# Stop server: Ctrl+C
# Restart:
cd D:\AI\tech\01-nextjs-langchain-chatbot-saas\fullstack
npm run dev
```

### 3.2 Test Login Flow

1. **Open login page:**
   ```
   http://localhost:3011/login
   ```

2. **Click "Google" button**

3. **Expected flow:**
   - Opens Google login popup
   - Select your Google account
   - Grant permissions
   - Redirects to `/auth/callback`
   - Redirects to `/dashboard`
   - ✅ You're logged in!

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"

**Cause:** Redirect URI not matching

**Fix:**
1. Go back to Google Console → Credentials
2. Edit OAuth client
3. Make sure redirect URI is **EXACTLY:**
   ```
   https://bfmwpnrjlpelpatwobfv.supabase.co/auth/v1/callback
   ```
4. Save and try again

### Error: "Access blocked: Authorization Error"

**Cause:** App not verified by Google

**Fix (for development):**
1. OAuth consent screen → "Publishing status"
2. Keep it "Testing"
3. Add your email as "Test user"
4. Use that email to login

### Error: "Invalid client: no application name"

**Cause:** OAuth consent screen not completed

**Fix:**
1. Complete OAuth consent screen
2. Add app name
3. Add support email
4. Save

### Google button does nothing

**Check browser console:**
- Press F12
- Check Console tab for errors
- Check Network tab for failed requests

**Common fixes:**
1. Clear browser cache
2. Check Supabase credentials saved
3. Restart dev server

---

## 📝 Quick Reference

### Google Cloud Console URLs:
- **Dashboard:** https://console.cloud.google.com/
- **Credentials:** https://console.cloud.google.com/apis/credentials
- **OAuth Consent:** https://console.cloud.google.com/apis/credentials/consent

### Supabase URLs:
- **Auth Providers:** https://supabase.com/dashboard/project/bfmwpnrjlpelpatwobfv/auth/providers
- **URL Config:** https://supabase.com/dashboard/project/bfmwpnrjlpelpatwobfv/auth/url-configuration

### Important Values:
```
Project ID: bfmwpnrjlpelpatwobfv
Site URL: http://localhost:3011
Callback URL: https://bfmwpnrjlpelpatwobfv.supabase.co/auth/v1/callback
```

---

## 🎯 After Setup Complete:

1. ✅ Test Google login works
2. ✅ Test regular email/password login still works
3. ✅ Test signup flow
4. ✅ Verify user created in Supabase → Authentication → Users

---

## 🚀 Next Steps (Optional):

### GitHub OAuth Setup (similar process):
1. Go to: https://github.com/settings/developers
2. New OAuth App
3. Callback URL: `https://bfmwpnrjlpelpatwobfv.supabase.co/auth/v1/callback`
4. Get Client ID + Secret
5. Add to Supabase Auth → Providers → GitHub

---

## 💡 Production Considerations:

When deploying to production:

1. **Google Console:**
   - Add production domain to Authorized origins
   - Add production callback to Redirect URIs
   - Submit app for verification (if needed)

2. **Supabase:**
   - Update Site URL to production URL
   - Add production redirect URLs

Example:
```
Site URL: https://yourdomain.com
Redirect: https://yourdomain.com/auth/callback
Google Redirect: https://bfmwpnrjlpelpatwobfv.supabase.co/auth/v1/callback
```

---

**Setup time: ~15 minutes**
**Difficulty: Medium**

**Ready to start? Follow Step 1!** 🎯
