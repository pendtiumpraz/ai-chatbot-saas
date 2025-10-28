import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth-helpers';
import { uploadCourseMaterial, fileToBuffer, validateFileSize, validateFileType } from '@/lib/google-drive';
import { prisma } from '@/lib/prisma';

// Allowed file types for course materials
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
];

const MAX_FILE_SIZE_MB = 100; // 100MB

export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization (TEACHER or SUPER_ADMIN)
    await requireRole(['TEACHER', 'SUPER_ADMIN']);

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const courseId = formData.get('courseId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string | null;
    const materialType = formData.get('type') as string;
    const isFree = formData.get('isFree') === 'true';
    const isDownloadable = formData.get('isDownloadable') === 'true';
    const order = parseInt(formData.get('order') as string) || 0;

    // Validate required fields
    if (!file || !courseId || !title || !materialType) {
      return NextResponse.json(
        { error: 'Missing required fields: file, courseId, title, type' },
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

    // Verify course exists and user has access
    const session = await requireAuth();
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if user is the course creator or super admin
    if (course.creatorId !== session.user.id && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'You do not have permission to upload materials to this course' },
        { status: 403 }
      );
    }

    // Convert file to buffer and upload to Google Drive
    const buffer = await fileToBuffer(file);
    const uploadResult = await uploadCourseMaterial(
      buffer,
      file.name,
      file.type,
      courseId,
      isFree // Make public if it's a free preview material
    );

    // Save material to database
    const material = await prisma.material.create({
      data: {
        title,
        description,
        type: materialType as any,
        fileUrl: uploadResult.webViewLink,
        fileId: uploadResult.fileId,
        fileName: uploadResult.fileName,
        fileSize: uploadResult.size,
        mimeType: uploadResult.mimeType,
        isFree,
        isDownloadable,
        order,
        courseId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Material uploaded successfully',
      data: {
        material,
        uploadResult,
      },
    });
  } catch (error: any) {
    console.error('Error uploading material:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload material' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId is required' },
        { status: 400 }
      );
    }

    // Get all materials for the course
    const materials = await prisma.material.findMany({
      where: {
        courseId,
        deletedAt: null,
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: materials,
    });
  } catch (error: any) {
    console.error('Error fetching materials:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}
