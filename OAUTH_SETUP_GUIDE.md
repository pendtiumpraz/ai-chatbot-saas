# 🔐 OAuth Setup Guide - Google & GitHub

## ✅ Buttons Sudah Aktif!

OAuth buttons sekarang muncul di login/signup pages. Tinggal setup credentials!

---

## 📋 Yang Perlu Anda Lakukan:

### **1. Pilih Provider:**
- **Google** (populer, semua punya akun Google)
- **GitHub** (easier setup, cocok untuk developer)
- **Both** (recommended!)

### **2. Get Credentials dari Provider**
- Client ID
- Client Secret

### **3. Paste ke Supabase**
- Enable provider
- Masukkan credentials
- Save

### **4. Test!**
- Click button
- Login dengan Google/GitHub
- Done! ✅

---

## 🟢 GOOGLE OAUTH SETUP

### Step 1: Google Cloud Console

**1.1 Create Project:**
https://console.cloud.google.com/
- New Project → Name: `AI Chatbot`

**1.2 Enable API:**
https://console.cloud.google.com/apis/library
- Search: "Google+ API" → Enable

**1.3 OAuth Consent Screen:**
https://console.cloud.google.com/apis/credentials/consent
- Type: External
- App name: `Universal AI Chatbot`
- Your email
- Scopes: email, profile, openid
- Test users: ADD YOUR EMAIL! (important!)

**1.4 Create Credentials:**
https://console.cloud.google.com/apis/credentials
- Create Credentials → OAuth client ID
- Type: Web application
- Authorized redirect URIs:
  ```
  https://bfmwpnrjlpelpatwobfv.supabase.co/auth/v1/callback
  ```

**1.5 Copy:**
- Client ID: `xxx.apps.googleusercontent.com`
- Client Secret: `GOCSPX-xxx`

### Step 2: Supabase

https://supabase.com/dashboard/project/bfmwpnrjlpelpatwobfv/auth/providers

- Find: Google
- Enable: ON
- Paste: Client ID & Secret
- Save

### Step 3: Test
```
http://localhost:3011/login
Click "Google" → Login → Done! ✅
```

---

## 🔵 GITHUB OAUTH SETUP

### Step 1: GitHub Settings

https://github.com/settings/developers
- New OAuth App
- App name: `Universal AI Chatbot`
- Homepage: `http://localhost:3011`
- Callback:
  ```
  https://bfmwpnrjlpelpatwobfv.supabase.co/auth/v1/callback
  ```
- Generate client secret

**Copy:**
- Client ID
- Client Secret

### Step 2: Supabase

https://supabase.com/dashboard/project/bfmwpnrjlpelpatwobfv/auth/providers

- Find: GitHub
- Enable: ON  
- Paste: Client ID & Secret
- Save

### Step 3: Test
```
http://localhost:3011/login
Click "GitHub" → Login → Done! ✅
```

---

## ⚙️ Site URL Configuration

https://supabase.com/dashboard/project/bfmwpnrjlpelpatwobfv/auth/url-configuration

```
Site URL: http://localhost:3011
Redirect URLs: http://localhost:3011/**
```

---

## 🔑 CRITICAL INFO:

**Callback URL (MUST BE EXACT!):**
```
https://bfmwpnrjlpelpatwobfv.supabase.co/auth/v1/callback
```

Use this in:
- Google: Authorized redirect URIs
- GitHub: Authorization callback URL

**NO trailing slash!**
**NO extra parameters!**

---

## 🐛 Common Errors:

### "redirect_uri_mismatch"
→ Check callback URL is exact!

### "Access blocked" (Google)
→ Add your email as test user in OAuth consent screen

### Button does nothing
→ Check browser console (F12)
→ Restart dev server
→ Verify credentials saved in Supabase

---

## ✅ Quick Checklist:

**Google:**
- [ ] Create project
- [ ] Enable Google+ API
- [ ] OAuth consent (add test user!)
- [ ] Create OAuth client
- [ ] Set callback URL
- [ ] Copy ID & Secret
- [ ] Enable in Supabase
- [ ] Test!

**GitHub:**
- [ ] New OAuth App
- [ ] Set callback URL
- [ ] Generate secret
- [ ] Copy ID & Secret
- [ ] Enable in Supabase
- [ ] Test!

---

**Time:** 10-15 minutes per provider

**Code changes:** NONE! OAuth logic sudah ready! ✅

**After setup:** Buttons langsung works! 🚀
