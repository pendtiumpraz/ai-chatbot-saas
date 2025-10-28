import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { deleteFile, getFileInfo } from '@/lib/google-drive';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const session = await requireAuth();
    const { fileId } = params;

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    // Get file info from database
    const fileInfo = await getFileInfo(fileId);

    if (!fileInfo) {
      return NextResponse.json(
        { error: 'File not found in database' },
        { status: 404 }
      );
    }

    // Check if user has permission to delete
    // User can delete if they uploaded it, or if they're super admin
    if (
      fileInfo.uploadedById !== session.user.id &&
      session.user.role !== 'SUPER_ADMIN'
    ) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this file' },
        { status: 403 }
      );
    }

    // Delete from Google Drive
    await deleteFile(fileId);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete file' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    await requireAuth();
    const { fileId } = params;

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    // Get file info from database
    const fileInfo = await getFileInfo(fileId);

    if (!fileInfo) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: fileInfo,
    });
  } catch (error: any) {
    console.error('Error fetching file info:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch file info' },
      { status: 500 }
    );
  }
}
