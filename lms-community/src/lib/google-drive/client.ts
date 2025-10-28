import { google } from 'googleapis';
import { getSession } from '../auth-helpers';
import { prisma } from '../prisma';

export interface GoogleDriveClientOptions {
  accessToken?: string;
  refreshToken?: string;
}

/**
 * Create Google Drive client with OAuth2 authentication
 * Uses session tokens by default, or accepts custom tokens
 */
export async function createDriveClient(options?: GoogleDriveClientOptions) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
  );

  let accessToken = options?.accessToken;
  let refreshToken = options?.refreshToken;

  // If no tokens provided, get from session
  if (!accessToken || !refreshToken) {
    const session = await getSession();
    if (!session?.user?.id) {
      throw new Error('No authenticated user found');
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        googleAccessToken: true,
        googleRefreshToken: true,
      },
    });

    if (!user?.googleAccessToken || !user?.googleRefreshToken) {
      throw new Error('User has not granted Google Drive access. Please re-authenticate.');
    }

    accessToken = user.googleAccessToken;
    refreshToken = user.googleRefreshToken;
  }

  // Set credentials
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  // Handle token refresh automatically
  oauth2Client.on('tokens', async (tokens) => {
    if (tokens.access_token) {
      const session = await getSession();
      if (session?.user?.id) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { googleAccessToken: tokens.access_token },
        });
      }
    }
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
}

/**
 * Get or create a folder in Google Drive
 * @param folderName - Name of the folder to create
 * @param parentFolderId - Optional parent folder ID
 * @returns Folder ID
 */
export async function getOrCreateFolder(
  folderName: string,
  parentFolderId?: string
): Promise<string> {
  const drive = await createDriveClient();

  try {
    // Search for existing folder
    const query = [
      `name='${folderName}'`,
      "mimeType='application/vnd.google-apps.folder'",
      "trashed=false",
      parentFolderId ? `'${parentFolderId}' in parents` : undefined,
    ]
      .filter(Boolean)
      .join(' and ');

    const response = await drive.files.list({
      q: query,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    // Return existing folder if found
    if (response.data.files && response.data.files.length > 0) {
      return response.data.files[0].id!;
    }

    // Create new folder
    const folderMetadata: any = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };

    if (parentFolderId) {
      folderMetadata.parents = [parentFolderId];
    }

    const folder = await drive.files.create({
      requestBody: folderMetadata,
      fields: 'id',
    });

    return folder.data.id!;
  } catch (error) {
    console.error('Error creating/getting folder:', error);
    throw new Error('Failed to create or access folder in Google Drive');
  }
}

/**
 * Create folder structure for LMS
 * Creates: LMS-Community/Courses/{courseId}/{materialType}
 */
export async function createCourseFolderStructure(
  courseId: string,
  materialType: 'materials' | 'assignments' | 'submissions'
): Promise<string> {
  try {
    // Create root LMS folder
    const lmsFolder = await getOrCreateFolder('LMS-Community');

    // Create Courses folder
    const coursesFolder = await getOrCreateFolder('Courses', lmsFolder);

    // Create course-specific folder
    const courseFolder = await getOrCreateFolder(courseId, coursesFolder);

    // Create material type folder
    const materialFolder = await getOrCreateFolder(materialType, courseFolder);

    return materialFolder;
  } catch (error) {
    console.error('Error creating folder structure:', error);
    throw error;
  }
}

/**
 * Create folder for payment proofs
 */
export async function getPaymentProofFolder(): Promise<string> {
  const lmsFolder = await getOrCreateFolder('LMS-Community');
  const paymentsFolder = await getOrCreateFolder('Payments', lmsFolder);
  return paymentsFolder;
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
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file from Google Drive');
  }
}

/**
 * Check if user has valid Google Drive access
 */
export async function hasGoogleDriveAccess(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      googleAccessToken: true,
      googleRefreshToken: true,
    },
  });

  return !!(user?.googleAccessToken && user?.googleRefreshToken);
}
