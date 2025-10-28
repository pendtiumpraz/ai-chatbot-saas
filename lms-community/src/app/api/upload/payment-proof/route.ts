import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { uploadPaymentProof, fileToBuffer, validateFileSize, validateFileType } from '@/lib/google-drive';
import { prisma } from '@/lib/prisma';

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

const MAX_FILE_SIZE_MB = 10;

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const paymentId = formData.get('paymentId') as string;

    // Validate required fields
    if (!file || !paymentId) {
      return NextResponse.json(
        { error: 'Missing required fields: file, paymentId' },
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

    // Validate file type (only images and PDFs)
    if (!validateFileType(file, ALLOWED_TYPES)) {
      return NextResponse.json(
        { error: 'Only images (JPEG, PNG, GIF, WebP) and PDF files are allowed for payment proof' },
        { status: 400 }
      );
    }

    // Verify payment exists and belongs to the user
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Check if user owns this payment or is admin/finance
    if (
      payment.studentId !== session.user.id &&
      session.user.role !== 'SUPER_ADMIN' &&
      session.user.role !== 'FINANCE'
    ) {
      return NextResponse.json(
        { error: 'You do not have permission to upload payment proof for this payment' },
        { status: 403 }
      );
    }

    // Check if payment is in a state that accepts proof upload
    if (payment.status === 'PAID' || payment.status === 'REFUNDED') {
      return NextResponse.json(
        { error: 'Cannot upload payment proof for completed or refunded payments' },
        { status: 400 }
      );
    }

    // Convert file to buffer and upload to Google Drive
    const buffer = await fileToBuffer(file);
    const uploadResult = await uploadPaymentProof(
      buffer,
      file.name,
      file.type,
      paymentId,
      session.user.id
    );

    // Update payment with proof URL
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        proofUrl: uploadResult.webViewLink,
        proofFileId: uploadResult.fileId,
        status: 'PENDING', // Set to pending for verification
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment proof uploaded successfully',
      data: {
        payment: updatedPayment,
        uploadResult,
      },
    });
  } catch (error: any) {
    console.error('Error uploading payment proof:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload payment proof' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const paymentId = searchParams.get('paymentId');
    const studentId = searchParams.get('studentId');

    // Build query based on role
    const where: any = {
      proofUrl: { not: null },
    };

    if (paymentId) {
      where.id = paymentId;
    }

    // Students can only see their own payments
    if (session.user.role === 'STUDENT') {
      where.studentId = session.user.id;
    } else if (studentId) {
      // Finance/admin can filter by student
      where.studentId = studentId;
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        verifiedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: payments,
    });
  } catch (error: any) {
    console.error('Error fetching payment proofs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch payment proofs' },
      { status: 500 }
    );
  }
}
