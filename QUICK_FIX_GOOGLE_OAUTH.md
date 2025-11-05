# ⚡ Quick Fix: Enable Google OAuth in Supabase

## Error Message:
```
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

## 🔧 Quick Fix (5 minutes):

### Step 1: Enable Google in Supabase (FIRST!)

1. **Go to Supabase Auth Providers:**
   https://supabase.com/dashboard/project/bfmwpnrjlpelpatwobfv/auth/providers

2. **Scroll to find "Google"**

3. **Toggle "Enable" to ON** (even without credentials yet)

4. **Click "Save"**

---

### Step 2: Get Google Credentials (THEN setup properly)

Now follow full guide in `GOOGLE_OAUTH_SETUP.md`

---

## 🚀 Fastest Way (Test First):

### Option 1: Enable with Default Config (Quick Test)

Supabase might provide default credentials for testing:

1. Enable Google provider in Supabase
2. Leave Client ID/Secret empty (use Supabase's)
3. Save
4. Test immediately!

**Note:** This uses Supabase's credentials (limited, but works for testing)

---

### Option 2: Use Email Auth Instead (0 setup time)

While setting up Google OAuth, you can use **email/password** which is already working!

**Test email auth now:**
1. Go to: http://localhost:3011/signup
2. Create account with email
3. Login works immediately ✅

---

## 🎯 Recommended Flow:

**Now (1 minute):**
1. Enable Google provider in Supabase
2. Save (even empty)

**Later (15 minutes):**
1. Get Google OAuth credentials
2. Add to Supabase
3. Test properly

**For now (0 minutes):**
- Use email/password auth (already working!)
- Continue building features
- Setup OAuth when needed

---

## 🔗 Direct Link:

**Enable Google here:**
https://supabase.com/dashboard/project/bfmwpnrjlpelpatwobfv/auth/providers

**Look for:**
- [ ] Google (toggle this ON)

**Click "Save"**

---

**After enabling, error will be different (asking for credentials) - that's progress!** ✅
