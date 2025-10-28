import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth-helpers';
import { uploadAssignmentFile, fileToBuffer, validateFileSize, validateFileType } from '@/lib/google-drive';
import { prisma } from '@/lib/prisma';

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip',
  'text/plain',
];

const MAX_FILE_SIZE_MB = 50;

export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization (TEACHER or SUPER_ADMIN)
    await requireRole(['TEACHER', 'SUPER_ADMIN']);

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const assignmentId = formData.get('assignmentId') as string;
    const courseId = formData.get('courseId') as string;

    // Validate required fields
    if (!file || !assignmentId || !courseId) {
      return NextResponse.json(
        { error: 'Missing required fields: file, assignmentId, courseId' },
        { status: 400 }
      );
    }

    // Validate file size
    if (!validateFileSize(file, MAX_FILE_SIZE_MB)) {
      return NextResponse.json(
        { error: `File size must be less than ${MAX_FILE_SIZE_MB}MB` },
        { status: 400 }
      );
    }

    // Validate file type
    if (!validateFileType(file, ALLOWED_TYPES)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      );
    }

    // Verify assignment exists and user has access
    const session = await requireAuth();
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        course: true,
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Check if user is the course creator or super admin
    if (assignment.course.creatorId !== session.user.id && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'You do not have permission to upload files to this assignment' },
        { status: 403 }
      );
    }

    // Convert file to buffer and upload to Google Drive
    const buffer = await fileToBuffer(file);
    const uploadResult = await uploadAssignmentFile(
      buffer,
      file.name,
      file.type,
      courseId,
      assignmentId
    );

    // Update assignment with attachment
    const updatedAssignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        attachmentUrls: {
          push: uploadResult.webViewLink,
        },
        attachmentIds: {
          push: uploadResult.fileId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Assignment file uploaded successfully',
      data: {
        assignment: updatedAssignment,
        uploadResult,
      },
    });
  } catch (error: any) {
    console.error('Error uploading assignment file:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload assignment file' },
      { status: 500 }
    );
  }
}
