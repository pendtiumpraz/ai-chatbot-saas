import { Readable } from 'stream';
import { createDriveClient, createCourseFolderStructure, getPaymentProofFolder } from './client';
import { prisma } from '../prisma';
import { getSession } from '../auth-helpers';

export interface UploadResult {
  fileId: string;
  fileName: string;
  fileUrl: string;
  webViewLink: string;
  mimeType: string;
  size: number;
}

export interface UploadOptions {
  folderId?: string;
  makePublic?: boolean;
  description?: string;
}

/**
 * Upload a file to Google Drive
 * @param file - File to upload (can be Buffer, Readable stream, or Blob)
 * @param fileName - Name for the file
 * @param mimeType - MIME type of the file
 * @param options - Upload options
 */
export async function uploadFile(
  file: Buffer | Readable | Blob,
  fileName: string,
  mimeType: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const drive = await createDriveClient();

  try {
    // Convert Blob to Buffer if needed
    let fileData: Buffer | Readable;
    let fileSize: number;

    if (file instanceof Blob) {
      const arrayBuffer = await file.arrayBuffer();
      fileData = Buffer.from(arrayBuffer);
      fileSize = file.size;
    } else if (Buffer.isBuffer(file)) {
      fileData = file;
      fileSize = file.length;
    } else {
      fileData = file;
      // For streams, we'll get the size from the upload response
      fileSize = 0;
    }

    const fileMetadata: any = {
      name: fileName,
      mimeType: mimeType,
    };

    if (options.description) {
      fileMetadata.description = options.description;
    }

    if (options.folderId) {
      fileMetadata.parents = [options.folderId];
    }

    const media = {
      mimeType: mimeType,
      body: fileData,
    };

    // Upload file
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, mimeType, size, webViewLink, webContentLink',
    });

    const fileId = response.data.id!;

    // Make file public if requested
    if (options.makePublic) {
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
    }

    // Save to database
    const session = await getSession();
    if (session?.user?.id) {
      await prisma.fileUpload.create({
        data: {
          fileName: fileName,
          originalName: fileName,
          mimeType: mimeType,
          fileSize: parseInt(response.data.size || '0') || fileSize,
          driveFileId: fileId,
          driveFileUrl: response.data.webViewLink || '',
          driveFolderId: options.folderId,
          uploadedById: session.user.id,
          isPublic: options.makePublic || false,
          description: options.description,
        },
      });
    }

    return {
      fileId: fileId,
      fileName: response.data.name!,
      fileUrl: response.data.webContentLink || response.data.webViewLink || '',
      webViewLink: response.data.webViewLink || '',
      mimeType: response.data.mimeType!,
      size: parseInt(response.data.size || '0') || fileSize,
    };
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    throw new Error('Failed to upload file to Google Drive');
  }
}

/**
 * Upload multiple files
 */
export async function uploadMultipleFiles(
  files: Array<{ file: Buffer | Blob; fileName: string; mimeType: string }>,
  options: UploadOptions = {}
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (const fileData of files) {
    try {
      const result = await uploadFile(
        fileData.file,
        fileData.fileName,
        fileData.mimeType,
        options
      );
      results.push(result);
    } catch (error) {
      console.error(`Error uploading file ${fileData.fileName}:`, error);
      // Continue with other files even if one fails
    }
  }

  return results;
}

/**
 * Upload course material
 */
export async function uploadCourseMaterial(
  file: Buffer | Blob,
  fileName: string,
  mimeType: string,
  courseId: string,
  makePublic: boolean = false
): Promise<UploadResult> {
  const folderId = await createCourseFolderStructure(courseId, 'materials');

  return uploadFile(file, fileName, mimeType, {
    folderId,
    makePublic,
    description: `Course material for course ${courseId}`,
  });
}

/**
 * Upload assignment file
 */
export async function uploadAssignmentFile(
  file: Buffer | Blob,
  fileName: string,
  mimeType: string,
  courseId: string,
  assignmentId: string
): Promise<UploadResult> {
  const folderId = await createCourseFolderStructure(courseId, 'assignments');

  return uploadFile(file, fileName, mimeType, {
    folderId,
    makePublic: false,
    description: `Assignment file for assignment ${assignmentId} in course ${courseId}`,
  });
}

/**
 * Upload student submission
 */
export async function uploadSubmission(
  file: Buffer | Blob,
  fileName: string,
  mimeType: string,
  courseId: string,
  assignmentId: string,
  studentId: string
): Promise<UploadResult> {
  const folderId = await createCourseFolderStructure(courseId, 'submissions');

  return uploadFile(file, fileName, mimeType, {
    folderId,
    makePublic: false,
    description: `Submission by student ${studentId} for assignment ${assignmentId}`,
  });
}

/**
 * Upload payment proof
 */
export async function uploadPaymentProof(
  file: Buffer | Blob,
  fileName: string,
  mimeType: string,
  paymentId: string,
  studentId: string
): Promise<UploadResult> {
  const folderId = await getPaymentProofFolder();

  return uploadFile(file, fileName, mimeType, {
    folderId,
    makePublic: false,
    description: `Payment proof for payment ${paymentId} by student ${studentId}`,
  });
}

/**
 * Update file metadata
 */
export async function updateFileMetadata(
  fileId: string,
  updates: {
    name?: string;
    description?: string;
  }
): Promise<void> {
  const drive = await createDriveClient();

  try {
    await drive.files.update({
      fileId: fileId,
      requestBody: updates,
    });
  } catch (error) {
    console.error('Error updating file metadata:', error);
    throw new Error('Failed to update file metadata');
  }
}

/**
 * Share file with specific users
 */
export async function shareFile(
  fileId: string,
  emails: string[],
  role: 'reader' | 'writer' | 'commenter' = 'reader'
): Promise<void> {
  const drive = await createDriveClient();

  try {
    for (const email of emails) {
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          type: 'user',
          role: role,
          emailAddress: email,
        },
        sendNotificationEmail: false,
      });
    }
  } catch (error) {
    console.error('Error sharing file:', error);
    throw new Error('Failed to share file');
  }
}

/**
 * Make file public and get shareable link
 */
export async function makeFilePublic(fileId: string): Promise<string> {
  const drive = await createDriveClient();

  try {
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const file = await drive.files.get({
      fileId: fileId,
      fields: 'webViewLink',
    });

    return file.data.webViewLink || '';
  } catch (error) {
    console.error('Error making file public:', error);
    throw new Error('Failed to make file public');
  }
}

/**
 * Convert File/Blob from FormData to Buffer
 */
export async function fileToBuffer(file: File | Blob): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Validate file size
 */
export function validateFileSize(
  file: File | Blob,
  maxSizeInMB: number = 100
): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

/**
 * Validate file type
 */
export function validateFileType(
  file: File | Blob,
  allowedTypes: string[]
): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Get file extension from MIME type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'application/pdf': 'pdf',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'text/plain': 'txt',
    'application/zip': 'zip',
  };

  return mimeToExt[mimeType] || 'bin';
}
