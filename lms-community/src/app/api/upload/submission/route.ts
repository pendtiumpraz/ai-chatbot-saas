import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { uploadSubmission, fileToBuffer, validateFileSize, validateFileType } from '@/lib/google-drive';
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
    const session = await requireAuth();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const submissionId = formData.get('submissionId') as string;
    const assignmentId = formData.get('assignmentId') as string;
    const courseId = formData.get('courseId') as string;
    const content = formData.get('content') as string | null;

    // Validate required fields
    if (!file || !submissionId || !assignmentId || !courseId) {
      return NextResponse.json(
        { error: 'Missing required fields: file, submissionId, assignmentId, courseId' },
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

    // Verify submission exists and belongs to the user
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: true,
      },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Check if user owns this submission
    if (submission.studentId !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to upload files to this submission' },
        { status: 403 }
      );
    }

    // Check if assignment is still accepting submissions
    if (submission.assignment.status === 'CLOSED') {
      return NextResponse.json(
        { error: 'This assignment is no longer accepting submissions' },
        { status: 400 }
      );
    }

    // Check deadline
    const now = new Date();
    if (submission.assignment.dueDate && now > submission.assignment.dueDate) {
      if (!submission.assignment.lateSubmissionAllowed) {
        return NextResponse.json(
          { error: 'Submission deadline has passed' },
          { status: 400 }
        );
      }
      // Check late deadline
      if (submission.assignment.lateDeadline && now > submission.assignment.lateDeadline) {
        return NextResponse.json(
          { error: 'Late submission deadline has passed' },
          { status: 400 }
        );
      }
    }

    // Convert file to buffer and upload to Google Drive
    const buffer = await fileToBuffer(file);
    const uploadResult = await uploadSubmission(
      buffer,
      file.name,
      file.type,
      courseId,
      assignmentId,
      session.user.id
    );

    // Update submission with attachment
    const isLate = submission.assignment.dueDate ? now > submission.assignment.dueDate : false;

    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        content: content || submission.content,
        attachmentUrls: {
          push: uploadResult.webViewLink,
        },
        attachmentIds: {
          push: uploadResult.fileId,
        },
        status: 'SUBMITTED',
        submittedAt: submission.submittedAt || now,
        isLate: isLate,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Submission uploaded successfully',
      data: {
        submission: updatedSubmission,
        uploadResult,
      },
    });
  } catch (error: any) {
    console.error('Error uploading submission:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload submission' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const assignmentId = searchParams.get('assignmentId');
    const studentId = searchParams.get('studentId');

    if (!assignmentId) {
      return NextResponse.json(
        { error: 'assignmentId is required' },
        { status: 400 }
      );
    }

    // Build query based on role
    const where: any = {
      assignmentId,
    };

    // Students can only see their own submissions
    if (session.user.role === 'STUDENT') {
      where.studentId = session.user.id;
    } else if (studentId) {
      // Teachers/admins can filter by student
      where.studentId = studentId;
    }

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        grade: true,
      },
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: submissions,
    });
  } catch (error: any) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
