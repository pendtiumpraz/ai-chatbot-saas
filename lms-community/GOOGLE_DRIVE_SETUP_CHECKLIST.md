# Google Drive Integration Setup Checklist

Follow this checklist to set up Google Drive integration for your LMS platform.

## Prerequisites

- [ ] Google account with access to Google Cloud Console
- [ ] PostgreSQL database setup and running
- [ ] Node.js 18+ and npm/yarn installed
- [ ] Project cloned and dependencies installed

## Step 1: Google Cloud Console Setup

### 1.1 Create/Select Project
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Create a new project or select existing one
- [ ] Note your project ID

### 1.2 Enable Required APIs
- [ ] Navigate to "APIs & Services" > "Library"
- [ ] Search and enable "Google Drive API"
- [ ] Search and enable "Google+ API"
- [ ] Wait for APIs to be fully enabled (may take a few minutes)

### 1.3 Configure OAuth Consent Screen
- [ ] Go to "APIs & Services" > "OAuth consent screen"
- [ ] Select "External" user type (or "Internal" if using Google Workspace)
- [ ] Fill in required app information:
  - App name: "LMS Community Platform"
  - User support email: your-email@example.com
  - Developer contact email: your-email@example.com
- [ ] Add authorized domains (your production domain)
- [ ] Click "Save and Continue"

### 1.4 Add OAuth Scopes
- [ ] In OAuth consent screen, click "Add or Remove Scopes"
- [ ] Add the following scopes:
  - `openid`
  - `https://www.googleapis.com/auth/userinfo.email`
  - `https://www.googleapis.com/auth/userinfo.profile`
  - `https://www.googleapis.com/auth/drive.file`
  - `https://www.googleapis.com/auth/drive.readonly`
- [ ] Save scopes

### 1.5 Add Test Users (if using External)
- [ ] Add your test user emails
- [ ] Click "Save and Continue"

### 1.6 Create OAuth Credentials
- [ ] Go to "APIs & Services" > "Credentials"
- [ ] Click "Create Credentials" > "OAuth client ID"
- [ ] Choose "Web application"
- [ ] Add name: "LMS Platform Web Client"
- [ ] Add Authorized JavaScript origins:
  - Development: `http://localhost:3000`
  - Production: `https://yourdomain.com`
- [ ] Add Authorized redirect URIs:
  - Development: `http://localhost:3000/api/auth/callback/google`
  - Production: `https://yourdomain.com/api/auth/callback/google`
- [ ] Click "Create"
- [ ] Copy Client ID and Client Secret (you'll need these!)

## Step 2: Environment Configuration

### 2.1 Create .env File
- [ ] Copy `.env.example` to `.env` in project root
- [ ] Never commit `.env` to version control

### 2.2 Update Environment Variables
- [ ] Set `DATABASE_URL` to your PostgreSQL connection string
- [ ] Set `NEXTAUTH_URL` to your app URL
  - Development: `http://localhost:3000`
  - Production: `https://yourdomain.com`
- [ ] Generate and set `NEXTAUTH_SECRET`:
  ```bash
  openssl rand -base64 32
  ```
- [ ] Set `GOOGLE_CLIENT_ID` from OAuth credentials
- [ ] Set `GOOGLE_CLIENT_SECRET` from OAuth credentials
- [ ] Set `GOOGLE_REDIRECT_URI`:
  - Development: `http://localhost:3000/api/auth/callback/google`
  - Production: `https://yourdomain.com/api/auth/callback/google`
- [ ] Set `NODE_ENV`:
  - Development: `development`
  - Production: `production`

Example `.env` file:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/lms_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"
GOOGLE_CLIENT_ID="123456789-abcdefg.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-secret-here"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/callback/google"
NODE_ENV="development"
```

## Step 3: Database Setup

### 3.1 Install Dependencies
- [ ] Run: `npm install` or `yarn install`
- [ ] Verify `@googleapis/drive` is installed
- [ ] Verify `googleapis` is installed
- [ ] Verify `next-auth` is installed

### 3.2 Run Prisma Migrations
- [ ] Run: `npx prisma generate`
- [ ] Run: `npx prisma migrate dev --name init`
- [ ] Verify tables are created in database
- [ ] Check that `FileUpload` model exists

### 3.3 Verify Database Connection
- [ ] Run: `npx prisma studio`
- [ ] Open browser to check database contents
- [ ] Verify connection is working

## Step 4: Test Google Authentication

### 4.1 Start Development Server
- [ ] Run: `npm run dev`
- [ ] Open browser to `http://localhost:3000`
- [ ] Check for any console errors

### 4.2 Test Google Sign-In
- [ ] Navigate to sign-in page
- [ ] Click "Sign in with Google"
- [ ] Complete Google OAuth flow
- [ ] Verify user is created in database
- [ ] Check that `googleAccessToken` and `googleRefreshToken` are saved

### 4.3 Verify Google Drive Access
- [ ] After sign-in, open browser console
- [ ] Navigate to a page that uses Google Drive
- [ ] Check for any Google Drive API errors
- [ ] Verify folder structure is created in Google Drive

## Step 5: Test File Upload

### 5.1 Test Course Material Upload
- [ ] Navigate to `/examples/upload-example` (or create a course)
- [ ] Upload a PDF file
- [ ] Verify file appears in Google Drive
- [ ] Check database for `FileUpload` record
- [ ] Verify file URL is accessible

### 5.2 Test Different File Types
- [ ] Upload PDF
- [ ] Upload Image (JPEG, PNG)
- [ ] Upload Video (MP4)
- [ ] Upload Document (DOCX)
- [ ] Verify all files are properly stored

### 5.3 Test File Operations
- [ ] Download file
- [ ] View file preview
- [ ] Delete file
- [ ] Verify deletion in both Google Drive and database

## Step 6: Test API Endpoints

### 6.1 Test Material Upload
```bash
curl -X POST http://localhost:3000/api/upload/material \
  -H "Cookie: your-session-cookie" \
  -F "file=@test.pdf" \
  -F "courseId=test-course-id" \
  -F "title=Test Material" \
  -F "type=PDF" \
  -F "isFree=false" \
  -F "isDownloadable=true"
```
- [ ] Verify 200 response
- [ ] Check file in Google Drive
- [ ] Verify database record

### 6.2 Test File Deletion
```bash
curl -X DELETE http://localhost:3000/api/upload/[fileId] \
  -H "Cookie: your-session-cookie"
```
- [ ] Verify 200 response
- [ ] Check file is deleted from Google Drive
- [ ] Verify database record is deleted

### 6.3 Test File Retrieval
```bash
curl http://localhost:3000/api/upload/[fileId] \
  -H "Cookie: your-session-cookie"
```
- [ ] Verify 200 response
- [ ] Check file metadata is returned

## Step 7: Verify Folder Structure

### 7.1 Check Google Drive Organization
- [ ] Open your Google Drive
- [ ] Look for "LMS-Community" folder
- [ ] Verify folder structure:
  ```
  LMS-Community/
  ├── Courses/
  │   └── [course-id]/
  │       ├── materials/
  │       ├── assignments/
  │       └── submissions/
  └── Payments/
  ```
- [ ] Verify files are in correct folders

## Step 8: Test Permissions

### 8.1 Test Role-Based Access
- [ ] Create test users with different roles:
  - [ ] STUDENT
  - [ ] TEACHER
  - [ ] FINANCE
  - [ ] SUPER_ADMIN
- [ ] Test upload permissions for each role
- [ ] Verify students can't upload course materials
- [ ] Verify teachers can upload to their courses only
- [ ] Verify admins have full access

### 8.2 Test File Permissions
- [ ] Upload public file (free preview)
- [ ] Verify anyone can access
- [ ] Upload private file
- [ ] Verify only authorized users can access

## Step 9: Production Setup

### 9.1 Update Production Environment
- [ ] Update Google OAuth redirect URIs with production domain
- [ ] Update environment variables for production
- [ ] Set `NODE_ENV=production`
- [ ] Set production `NEXTAUTH_URL`
- [ ] Verify SSL certificate is valid

### 9.2 Update OAuth Consent Screen
- [ ] Change from "Testing" to "Published" (if ready)
- [ ] Or keep in testing and add authorized users

### 9.3 Test Production Deployment
- [ ] Deploy to production
- [ ] Test sign-in flow
- [ ] Test file uploads
- [ ] Monitor for errors

## Step 10: Monitoring & Maintenance

### 10.1 Set Up Monitoring
- [ ] Monitor Google Cloud Console quotas
- [ ] Set up alerts for API usage
- [ ] Monitor database storage
- [ ] Set up error logging

### 10.2 Regular Maintenance
- [ ] Review uploaded files periodically
- [ ] Clean up deleted files (if using soft delete)
- [ ] Monitor Google Drive storage usage
- [ ] Review and rotate OAuth tokens if needed

## Troubleshooting

### Common Issues

**"Redirect URI mismatch"**
- [ ] Verify redirect URI in Google Console matches your app
- [ ] Check for trailing slashes
- [ ] Ensure protocol matches (http vs https)

**"No refresh token available"**
- [ ] Check OAuth consent screen has offline access
- [ ] Verify `access_type: "offline"` in auth config
- [ ] Re-authenticate user

**"Insufficient permissions"**
- [ ] Verify all required scopes are added
- [ ] Re-authenticate user to get new permissions

**"File not found in Google Drive"**
- [ ] Check if file was deleted
- [ ] Verify user has Google Drive access
- [ ] Check folder permissions

**"Token expired"**
- [ ] Token refresh should be automatic
- [ ] Check refresh token is saved in database
- [ ] User may need to re-authenticate

## Security Checklist

- [ ] Never commit `.env` file
- [ ] Use environment variables for all secrets
- [ ] Implement rate limiting on upload endpoints
- [ ] Validate all file uploads (type, size)
- [ ] Use role-based access control
- [ ] Sanitize file names
- [ ] Implement CSRF protection
- [ ] Use HTTPS in production
- [ ] Regular security audits

## Performance Optimization

- [ ] Implement file size limits
- [ ] Use image compression before upload
- [ ] Implement upload progress tracking
- [ ] Use CDN for file delivery (if needed)
- [ ] Cache file metadata
- [ ] Implement pagination for file lists
- [ ] Clean up old/unused files

## Documentation

- [ ] Read `GOOGLE_DRIVE_INTEGRATION.md` thoroughly
- [ ] Review example page at `/examples/upload-example`
- [ ] Understand folder structure
- [ ] Know all API endpoints
- [ ] Understand role permissions

## Final Verification

- [ ] All tests pass
- [ ] No console errors
- [ ] Files upload successfully
- [ ] Files are accessible
- [ ] Permissions work correctly
- [ ] Production is working
- [ ] Team is trained
- [ ] Documentation is complete

## Support Resources

- [Google Drive API Documentation](https://developers.google.com/drive/api/v3/about-sdk)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- Project Documentation: `GOOGLE_DRIVE_INTEGRATION.md`

---

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

**Last Updated**: {Current Date}

**Completed By**: {Your Name}
