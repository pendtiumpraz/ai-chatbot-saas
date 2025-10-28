# Google Drive Integration - Quick Start Guide

## 5-Minute Setup

### 1. Get Google OAuth Credentials (3 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project
3. Enable **Google Drive API** and **Google+ API**
4. Create **OAuth 2.0 Client ID** (Web application)
5. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy **Client ID** and **Client Secret**

### 2. Configure Environment (1 minute)

Create `.env` file:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/lms_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
GOOGLE_CLIENT_ID="your-client-id-here"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/callback/google"
NODE_ENV="development"
```

### 3. Run Database Migrations (1 minute)

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

### 4. Test It Out

1. Open `http://localhost:3000`
2. Sign in with Google
3. Go to `/examples/upload-example`
4. Upload a file
5. Check your Google Drive for "LMS-Community" folder

## Basic Usage

### Upload Course Material

```tsx
import { FileUploader } from '@/components/upload';
import { useCourseMaterialUpload } from '@/hooks/useFileUpload';

function MyComponent({ courseId }) {
  const { uploadFile } = useCourseMaterialUpload(courseId);

  return (
    <FileUploader
      onFilesSelected={(files) => {
        files.forEach(file =>
          uploadFile(file, {
            courseId,
            title: file.name,
            type: 'PDF',
          })
        );
      }}
    />
  );
}
```

### Display Files

```tsx
import { FileList } from '@/components/upload';

function MyComponent({ files }) {
  return (
    <FileList
      files={files}
      onDownload={(file) => window.open(file.url, '_blank')}
      showActions
    />
  );
}
```

## API Endpoints

```bash
# Upload course material
POST /api/upload/material

# Upload assignment file
POST /api/upload/assignment

# Upload student submission
POST /api/upload/submission

# Upload payment proof
POST /api/upload/payment-proof

# Delete file
DELETE /api/upload/[fileId]

# Get file info
GET /api/upload/[fileId]
```

## Common Issues

**Can't sign in with Google?**
- Check OAuth redirect URI matches exactly
- Verify Google Client ID and Secret are correct

**Files not uploading?**
- Check file size (max 100MB for materials)
- Verify file type is allowed
- Check browser console for errors

**"No access token available"?**
- Sign in with Google OAuth
- Re-authenticate if token expired

## Need More Help?

- **Full Documentation**: `GOOGLE_DRIVE_INTEGRATION.md`
- **Setup Checklist**: `GOOGLE_DRIVE_SETUP_CHECKLIST.md`
- **Implementation Report**: `GOOGLE_DRIVE_IMPLEMENTATION_REPORT.md`
- **Example Page**: `/examples/upload-example`

## What's Included

✅ File uploads to Google Drive
✅ Automatic folder organization
✅ Progress tracking
✅ Role-based permissions
✅ Image & PDF preview
✅ Drag-and-drop support
✅ File management (list, download, delete)
✅ Support for PDFs, images, videos, documents

## File Structure in Google Drive

```
LMS-Community/
├── Courses/
│   └── {course-id}/
│       ├── materials/
│       ├── assignments/
│       └── submissions/
└── Payments/
```

## Supported File Types

**Course Materials** (max 100MB):
- PDF, Images (JPG, PNG, GIF, WebP)
- Videos (MP4, WebM)
- Documents (DOC, DOCX, PPT, PPTX)

**Submissions** (max 50MB):
- PDF, Images, Documents, ZIP

**Payment Proofs** (max 10MB):
- Images, PDF only

## Next Steps

1. ✅ Complete setup above
2. 📚 Read full documentation
3. 🧪 Test with example page
4. 🚀 Integrate into your pages
5. 📊 Monitor usage in Google Cloud Console

---

**Quick Start Complete!**
Ready to upload files to Google Drive from your LMS.
