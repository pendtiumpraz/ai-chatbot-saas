# Google Drive Integration Documentation

## Overview

This LMS platform includes complete Google Drive API integration for managing file uploads including PDFs, images, videos, and documents. All files are stored in Google Drive with proper organization and access control.

## Features

- ✅ OAuth2 authentication with automatic token refresh
- ✅ File uploads to Google Drive with proper folder structure
- ✅ Support for PDFs, images, videos, documents
- ✅ Progress tracking for uploads
- ✅ Drag-and-drop file upload
- ✅ File management (list, download, delete, share)
- ✅ Role-based access control
- ✅ Database tracking of all uploads
- ✅ Public/private file permissions
- ✅ File previews (images, PDFs)

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Google Drive API
   - Google+ API (for OAuth)

4. Configure OAuth Consent Screen:
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type
   - Fill in required information
   - Add scopes:
     - `https://www.googleapis.com/auth/drive.file`
     - `https://www.googleapis.com/auth/drive.readonly`
     - `openid`
     - `email`
     - `profile`

5. Create OAuth Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
   - Copy the Client ID and Client Secret

### 2. Environment Variables

Add the following to your `.env` file:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Database
DATABASE_URL=your_postgresql_connection_string
```

### 3. Install Dependencies

The following packages are already installed:
- `@googleapis/drive` - Google Drive API client
- `googleapis` - Google APIs client library
- `next-auth` - Authentication with OAuth support

### 4. Database Migration

Run Prisma migrations to create the necessary tables:

```bash
npx prisma migrate dev
npx prisma generate
```

## File Structure

```
src/
├── lib/
│   └── google-drive/
│       ├── client.ts          # Google Drive client setup
│       ├── upload.ts          # File upload functions
│       ├── files.ts           # File management functions
│       └── index.ts           # Exports
├── app/
│   └── api/
│       └── upload/
│           ├── material/      # Course material uploads
│           ├── assignment/    # Assignment file uploads
│           ├── submission/    # Student submission uploads
│           ├── payment-proof/ # Payment proof uploads
│           └── [fileId]/      # File operations (delete, get)
├── hooks/
│   ├── useFileUpload.ts       # Upload hook with progress
│   └── useDragAndDrop.ts      # Drag-and-drop hook
└── components/
    └── upload/
        ├── FileUploader.tsx   # Upload component
        ├── FileList.tsx       # File list display
        ├── UploadProgress.tsx # Progress indicator
        ├── ImagePreview.tsx   # Image preview
        └── PDFViewer.tsx      # PDF viewer
```

## Usage Examples

### 1. Upload Course Material (Teacher)

```tsx
'use client';

import { useState } from 'react';
import { FileUploader, UploadProgress } from '@/components/upload';
import { useCourseMaterialUpload } from '@/hooks/useFileUpload';

export function CourseMaterialUpload({ courseId }: { courseId: string }) {
  const { uploadFile, uploading, progress } = useCourseMaterialUpload(courseId);

  const handleFilesSelected = async (files: File[]) => {
    for (const file of files) {
      await uploadFile(file, {
        courseId,
        title: file.name,
        type: 'PDF', // or 'IMAGE', 'VIDEO', 'DOCUMENT'
        isFree: false,
        isDownloadable: true,
        order: 0,
      });
    }
  };

  return (
    <div className="space-y-4">
      <FileUploader
        onFilesSelected={handleFilesSelected}
        accept={['application/pdf', 'image/*', 'video/*']}
        maxFiles={5}
        maxSize={100}
        disabled={uploading}
        label="Upload Course Materials"
      />

      <UploadProgress progress={progress} />
    </div>
  );
}
```

### 2. Upload Student Submission

```tsx
'use client';

import { FileUploader } from '@/components/upload';
import { useSubmissionUpload } from '@/hooks/useFileUpload';
import { toast } from 'react-hot-toast';

export function SubmissionUpload({
  courseId,
  assignmentId,
  submissionId,
}: {
  courseId: string;
  assignmentId: string;
  submissionId: string;
}) {
  const { uploadFile, uploading } = useSubmissionUpload(
    courseId,
    assignmentId,
    submissionId
  );

  const handleUpload = async (files: File[]) => {
    const result = await uploadFile(files[0], {
      courseId,
      assignmentId,
      submissionId,
      content: 'My submission content',
    });

    if (result) {
      toast.success('Submission uploaded successfully!');
    }
  };

  return (
    <FileUploader
      onFilesSelected={handleUpload}
      accept={['application/pdf', 'application/msword', 'application/zip']}
      maxFiles={1}
      maxSize={50}
      disabled={uploading}
      label="Upload Your Submission"
    />
  );
}
```

### 3. Upload Payment Proof

```tsx
'use client';

import { FileUploader } from '@/components/upload';
import { usePaymentProofUpload } from '@/hooks/useFileUpload';

export function PaymentProofUpload({ paymentId }: { paymentId: string }) {
  const { uploadFile, uploading } = usePaymentProofUpload(paymentId);

  const handleUpload = async (files: File[]) => {
    await uploadFile(files[0], { paymentId });
  };

  return (
    <FileUploader
      onFilesSelected={handleUpload}
      accept={['image/*', 'application/pdf']}
      maxFiles={1}
      maxSize={10}
      disabled={uploading}
      label="Upload Payment Proof"
      description="Upload a screenshot or scan of your payment receipt (Max 10MB)"
    />
  );
}
```

### 4. Display Uploaded Files

```tsx
'use client';

import { FileList } from '@/components/upload';
import { useState, useEffect } from 'react';

export function MaterialsList({ courseId }: { courseId: string }) {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetch(`/api/upload/material?courseId=${courseId}`)
      .then(res => res.json())
      .then(data => setMaterials(data.data));
  }, [courseId]);

  const handleDelete = async (file: any) => {
    const confirmed = confirm('Delete this file?');
    if (confirmed) {
      await fetch(`/api/upload/${file.fileId}`, { method: 'DELETE' });
      // Refresh list
      setMaterials(materials.filter(m => m.id !== file.id));
    }
  };

  const handleDownload = (file: any) => {
    window.open(file.fileUrl, '_blank');
  };

  return (
    <FileList
      files={materials.map(m => ({
        id: m.id,
        name: m.fileName,
        size: m.fileSize,
        url: m.fileUrl,
        mimeType: m.mimeType,
        uploadedAt: m.createdAt,
      }))}
      onDelete={handleDelete}
      onDownload={handleDownload}
      showActions
    />
  );
}
```

### 5. Image Preview

```tsx
'use client';

import { ImagePreview } from '@/components/upload';

export function ImageDisplay({ imageUrl }: { imageUrl: string }) {
  return (
    <ImagePreview
      src={imageUrl}
      alt="Uploaded image"
      onDownload={() => window.open(imageUrl, '_blank')}
    />
  );
}
```

### 6. PDF Viewer

```tsx
'use client';

import { PDFViewer } from '@/components/upload';

export function PDFDisplay({ pdfUrl }: { pdfUrl: string }) {
  return (
    <PDFViewer
      src={pdfUrl}
      title="Course Material PDF"
      height="800px"
      onDownload={() => window.open(pdfUrl, '_blank')}
    />
  );
}
```

## API Endpoints

### POST `/api/upload/material`
Upload course material (Teacher/Super Admin only)

**FormData:**
- `file`: File to upload
- `courseId`: Course ID
- `title`: Material title
- `description`: Material description (optional)
- `type`: Material type (PDF, IMAGE, VIDEO, DOCUMENT)
- `isFree`: Make material free preview (boolean)
- `isDownloadable`: Allow downloads (boolean)
- `order`: Display order (number)

**Response:**
```json
{
  "success": true,
  "message": "Material uploaded successfully",
  "data": {
    "material": { /* material object */ },
    "uploadResult": {
      "fileId": "google-drive-file-id",
      "fileName": "filename.pdf",
      "fileUrl": "https://drive.google.com/...",
      "webViewLink": "https://drive.google.com/...",
      "mimeType": "application/pdf",
      "size": 1024000
    }
  }
}
```

### POST `/api/upload/assignment`
Upload assignment file (Teacher/Super Admin only)

**FormData:**
- `file`: File to upload
- `assignmentId`: Assignment ID
- `courseId`: Course ID

### POST `/api/upload/submission`
Upload student submission (Student only, own submissions)

**FormData:**
- `file`: File to upload
- `submissionId`: Submission ID
- `assignmentId`: Assignment ID
- `courseId`: Course ID
- `content`: Submission text content (optional)

### POST `/api/upload/payment-proof`
Upload payment proof (Student/Finance/Super Admin)

**FormData:**
- `file`: File to upload (image or PDF)
- `paymentId`: Payment ID

### DELETE `/api/upload/[fileId]`
Delete file from Google Drive and database

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

### GET `/api/upload/[fileId]`
Get file information

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "file-id",
    "fileName": "filename.pdf",
    "mimeType": "application/pdf",
    "fileSize": 1024000,
    "driveFileId": "google-drive-file-id",
    "driveFileUrl": "https://drive.google.com/...",
    "uploadedBy": { /* user object */ },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Folder Structure in Google Drive

Files are automatically organized in Google Drive:

```
LMS-Community/
├── Courses/
│   ├── {courseId-1}/
│   │   ├── materials/
│   │   ├── assignments/
│   │   └── submissions/
│   └── {courseId-2}/
│       ├── materials/
│       ├── assignments/
│       └── submissions/
└── Payments/
    └── payment-proofs/
```

## Security & Permissions

### Role-Based Access Control

- **SUPER_ADMIN**: Full access to all files
- **TEACHER**: Can upload materials and assignments for their courses
- **STUDENT**: Can upload submissions and payment proofs
- **FINANCE**: Can view and verify payment proofs

### File Permissions

- **Course Materials**: Can be public (free preview) or private (enrolled students only)
- **Assignments**: Private to course participants
- **Submissions**: Private to student and teacher
- **Payment Proofs**: Private to student, finance, and admins

## Database Schema

The `FileUpload` model tracks all uploaded files:

```prisma
model FileUpload {
  id              String   @id @default(cuid())
  fileName        String
  originalName    String
  mimeType        String
  fileSize        Int
  driveFileId     String   @unique
  driveFileUrl    String
  driveFolderId   String?
  description     String?
  tags            String[]
  uploadedById    String
  uploadedBy      User     @relation(fields: [uploadedById], references: [id])
  isPublic        Boolean  @default(false)
  downloadCount   Int      @default(0)
  lastAccessedAt  DateTime?
  deletedAt       DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## Error Handling

All API routes include proper error handling:

- **400**: Bad request (missing fields, invalid file type/size)
- **401**: Unauthorized (not logged in)
- **403**: Forbidden (insufficient permissions)
- **404**: Not found (file/course/assignment not found)
- **500**: Server error (Google Drive API errors, database errors)

## File Type Support

### Course Materials
- PDFs: `application/pdf`
- Images: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- Videos: `video/mp4`, `video/webm`
- Documents: `.doc`, `.docx`, `.ppt`, `.pptx`
- Text: `text/plain`

### Assignments & Submissions
- PDFs: `application/pdf`
- Images: `image/jpeg`, `image/png`
- Documents: `.doc`, `.docx`
- Archives: `application/zip`
- Text: `text/plain`

### Payment Proofs
- Images: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- PDFs: `application/pdf`

## File Size Limits

- **Course Materials**: 100 MB
- **Assignments**: 50 MB
- **Submissions**: 50 MB
- **Payment Proofs**: 10 MB

## Advanced Features

### Custom Upload Hook

```tsx
import { useFileUpload } from '@/hooks/useFileUpload';

const { uploadFile, uploading, progress, error } = useFileUpload({
  endpoint: '/api/upload/custom',
  maxSize: 50,
  allowedTypes: ['application/pdf'],
  onSuccess: (data) => {
    console.log('Upload successful:', data);
  },
  onError: (error) => {
    console.error('Upload failed:', error);
  },
});
```

### Drag and Drop

```tsx
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

const { isDragging, dragHandlers } = useDragAndDrop({
  onDrop: (files) => {
    console.log('Files dropped:', files);
  },
  maxFiles: 5,
  accept: ['image/*', 'application/pdf'],
});
```

## Testing

### Test Google Drive Connection

```typescript
import { hasGoogleDriveAccess } from '@/lib/google-drive';

const hasAccess = await hasGoogleDriveAccess(userId);
if (!hasAccess) {
  // Prompt user to re-authenticate
}
```

### Test File Upload

```bash
curl -X POST http://localhost:3000/api/upload/material \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/file.pdf" \
  -F "courseId=course-id" \
  -F "title=Test Material" \
  -F "type=PDF"
```

## Troubleshooting

### "No access token available"
- User needs to sign in with Google OAuth
- Refresh tokens may have expired - user needs to re-authenticate

### "Failed to upload file to Google Drive"
- Check Google Drive API is enabled in Google Cloud Console
- Verify OAuth credentials are correct
- Check quota limits in Google Cloud Console

### Files not showing in Google Drive
- Check folder permissions
- Verify files are not in trash
- Check Google Drive storage quota

## Best Practices

1. **Always validate file types and sizes** on both client and server
2. **Use role-based access control** for all uploads
3. **Track file usage** in database for analytics
4. **Implement soft deletes** to allow recovery
5. **Use progress indicators** for better UX
6. **Handle errors gracefully** with user-friendly messages
7. **Optimize images** before upload when possible
8. **Use thumbnails** for image galleries
9. **Implement rate limiting** to prevent abuse
10. **Regular cleanup** of unused files

## Support

For issues or questions:
1. Check this documentation
2. Review error logs in browser console
3. Check Google Cloud Console for API errors
4. Verify environment variables are set correctly

## License

This integration is part of the LMS Community Platform.
