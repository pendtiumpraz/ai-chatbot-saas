import { createDriveClient } from './client';
import { prisma } from '../prisma';

export interface FileInfo {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  createdTime: string;
  modifiedTime: string;
  webViewLink: string;
  webContentLink?: string;
  thumbnailLink?: string;
  iconLink?: string;
}

export interface ListFilesOptions {
  folderId?: string;
  query?: string;
  pageSize?: number;
  orderBy?: string;
}

/**
 * List files in a folder or by query
 */
export async function listFiles(
  options: ListFilesOptions = {}
): Promise<FileInfo[]> {
  const drive = await createDriveClient();

  try {
    const queryParts: string[] = ['trashed=false'];

    if (options.folderId) {
      queryParts.push(`'${options.folderId}' in parents`);
    }

    if (options.query) {
      queryParts.push(options.query);
    }

    const response = await drive.files.list({
      q: queryParts.join(' and '),
      pageSize: options.pageSize || 100,
      orderBy: options.orderBy || 'modifiedTime desc',
      fields:
        'files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink, thumbnailLink, iconLink)',
    });

    return (response.data.files || []).map((file) => ({
      id: file.id!,
      name: file.name!,
      mimeType: file.mimeType!,
      size: parseInt(file.size || '0'),
      createdTime: file.createdTime!,
      modifiedTime: file.modifiedTime!,
      webViewLink: file.webViewLink!,
      webContentLink: file.webContentLink,
      thumbnailLink: file.thumbnailLink,
      iconLink: file.iconLink,
    }));
  } catch (error) {
    console.error('Error listing files:', error);
    throw new Error('Failed to list files from Google Drive');
  }
}

/**
 * Get file metadata
 */
export async function getFileMetadata(fileId: string): Promise<FileInfo> {
  const drive = await createDriveClient();

  try {
    const response = await drive.files.get({
      fileId: fileId,
      fields:
        'id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink, thumbnailLink, iconLink',
    });

    return {
      id: response.data.id!,
      name: response.data.name!,
      mimeType: response.data.mimeType!,
      size: parseInt(response.data.size || '0'),
      createdTime: response.data.createdTime!,
      modifiedTime: response.data.modifiedTime!,
      webViewLink: response.data.webViewLink!,
      webContentLink: response.data.webContentLink,
      thumbnailLink: response.data.thumbnailLink,
      iconLink: response.data.iconLink,
    };
  } catch (error) {
    console.error('Error getting file metadata:', error);
    throw new Error('Failed to get file metadata from Google Drive');
  }
}

/**
 * Download file content
 */
export async function downloadFile(fileId: string): Promise<Buffer> {
  const drive = await createDriveClient();

  try {
    const response = await drive.files.get(
      {
        fileId: fileId,
        alt: 'media',
      },
      { responseType: 'arraybuffer' }
    );

    return Buffer.from(response.data as ArrayBuffer);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error('Failed to download file from Google Drive');
  }
}

/**
 * Get file public URL
 */
export async function getFilePublicUrl(fileId: string): Promise<string> {
  const drive = await createDriveClient();

  try {
    // Check if file is already public
    const permissions = await drive.permissions.list({
      fileId: fileId,
      fields: 'permissions(id, type, role)',
    });

    const isPublic = permissions.data.permissions?.some(
      (p) => p.type === 'anyone'
    );

    if (!isPublic) {
      // Make file public
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
    }

    const file = await drive.files.get({
      fileId: fileId,
      fields: 'webViewLink, webContentLink',
    });

    return file.data.webContentLink || file.data.webViewLink || '';
  } catch (error) {
    console.error('Error getting public URL:', error);
    throw new Error('Failed to get public URL for file');
  }
}

/**
 * Delete file from Google Drive
 */
export async function deleteFile(fileId: string): Promise<void> {
  const drive = await createDriveClient();

  try {
    await drive.files.delete({
      fileId: fileId,
    });

    // Also delete from database if exists
    await prisma.fileUpload.deleteMany({
      where: { driveFileId: fileId },
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file from Google Drive');
  }
}

/**
 * Copy file
 */
export async function copyFile(
  fileId: string,
  newName: string,
  destinationFolderId?: string
): Promise<FileInfo> {
  const drive = await createDriveClient();

  try {
    const requestBody: any = {
      name: newName,
    };

    if (destinationFolderId) {
      requestBody.parents = [destinationFolderId];
    }

    const response = await drive.files.copy({
      fileId: fileId,
      requestBody: requestBody,
      fields:
        'id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink',
    });

    return {
      id: response.data.id!,
      name: response.data.name!,
      mimeType: response.data.mimeType!,
      size: parseInt(response.data.size || '0'),
      createdTime: response.data.createdTime!,
      modifiedTime: response.data.modifiedTime!,
      webViewLink: response.data.webViewLink!,
      webContentLink: response.data.webContentLink,
    };
  } catch (error) {
    console.error('Error copying file:', error);
    throw new Error('Failed to copy file');
  }
}

/**
 * Move file to different folder
 */
export async function moveFile(
  fileId: string,
  destinationFolderId: string
): Promise<void> {
  const drive = await createDriveClient();

  try {
    // Get current parents
    const file = await drive.files.get({
      fileId: fileId,
      fields: 'parents',
    });

    const previousParents = file.data.parents?.join(',') || '';

    // Move file
    await drive.files.update({
      fileId: fileId,
      addParents: destinationFolderId,
      removeParents: previousParents,
      fields: 'id, parents',
    });
  } catch (error) {
    console.error('Error moving file:', error);
    throw new Error('Failed to move file');
  }
}

/**
 * Search files by name or content
 */
export async function searchFiles(
  searchTerm: string,
  options: {
    mimeType?: string;
    folderId?: string;
    limit?: number;
  } = {}
): Promise<FileInfo[]> {
  const queryParts: string[] = [
    'trashed=false',
    `(name contains '${searchTerm}' or fullText contains '${searchTerm}')`,
  ];

  if (options.mimeType) {
    queryParts.push(`mimeType='${options.mimeType}'`);
  }

  if (options.folderId) {
    queryParts.push(`'${options.folderId}' in parents`);
  }

  return listFiles({
    query: queryParts.join(' and '),
    pageSize: options.limit || 50,
    orderBy: 'modifiedTime desc',
  });
}

/**
 * Get files by MIME type
 */
export async function getFilesByType(
  mimeType: string,
  folderId?: string
): Promise<FileInfo[]> {
  const queryParts: string[] = ['trashed=false', `mimeType='${mimeType}'`];

  if (folderId) {
    queryParts.push(`'${folderId}' in parents`);
  }

  return listFiles({
    query: queryParts.join(' and '),
    orderBy: 'modifiedTime desc',
  });
}

/**
 * Get files uploaded by user from database
 */
export async function getUserFiles(
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    mimeType?: string;
  } = {}
) {
  const where: any = {
    uploadedById: userId,
    deletedAt: null,
  };

  if (options.mimeType) {
    where.mimeType = options.mimeType;
  }

  const [files, total] = await Promise.all([
    prisma.fileUpload.findMany({
      where,
      take: options.limit || 50,
      skip: options.offset || 0,
      orderBy: { createdAt: 'desc' },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.fileUpload.count({ where }),
  ]);

  return {
    files,
    total,
    hasMore: total > (options.offset || 0) + (options.limit || 50),
  };
}

/**
 * Track file download
 */
export async function trackFileDownload(fileId: string): Promise<void> {
  try {
    await prisma.fileUpload.updateMany({
      where: { driveFileId: fileId },
      data: {
        downloadCount: {
          increment: 1,
        },
        lastAccessedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error tracking file download:', error);
    // Don't throw error, just log it
  }
}

/**
 * Get file info from database
 */
export async function getFileInfo(driveFileId: string) {
  return prisma.fileUpload.findUnique({
    where: { driveFileId },
    include: {
      uploadedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

/**
 * Update file download count
 */
export async function incrementDownloadCount(driveFileId: string) {
  await prisma.fileUpload.updateMany({
    where: { driveFileId },
    data: {
      downloadCount: { increment: 1 },
      lastAccessedAt: new Date(),
    },
  });
}

/**
 * Soft delete file from database
 */
export async function softDeleteFile(driveFileId: string) {
  await prisma.fileUpload.updateMany({
    where: { driveFileId },
    data: {
      deletedAt: new Date(),
    },
  });
}
