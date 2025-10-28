'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireRole } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';

export async function createPayment(data: {
  courseId: string;
  amount: number;
  method: string;
  description?: string;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  // Generate invoice number
  const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const payment = await prisma.payment.create({
    data: {
      invoiceNumber,
      studentId: currentUser.id,
      amount: data.amount,
      method: data.method as any,
      description: data.description,
      status: 'PENDING',
    },
  });

  // Create enrollment with pending status
  await prisma.enrollment.create({
    data: {
      studentId: currentUser.id,
      courseId: data.courseId,
      status: 'PENDING',
      paymentId: payment.id,
    },
  });

  revalidatePath('/dashboard/student/payments');
  return payment;
}

export async function uploadPaymentProof(paymentId: string, proofUrl: string, proofFileId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  const payment = await prisma.payment.update({
    where: {
      id: paymentId,
      studentId: currentUser.id,
    },
    data: {
      proofUrl,
      proofFileId,
    },
  });

  revalidatePath('/dashboard/student/payments');
  return payment;
}

export async function getMyPayments() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  const payments = await prisma.payment.findMany({
    where: {
      studentId: currentUser.id,
    },
    include: {
      enrollment: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return payments;
}

export async function approvePayment(paymentId: string) {
  await requireRole(['SUPER_ADMIN', 'FINANCE']);
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { enrollment: true },
  });

  if (!payment) {
    throw new Error('Payment not found');
  }

  if (payment.status !== 'PENDING') {
    throw new Error('Payment is not pending');
  }

  // Update payment
  const updatedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: 'PAID',
      paidAt: new Date(),
      verifiedById: currentUser.id,
      verifiedAt: new Date(),
    },
  });

  // Activate enrollment
  if (payment.enrollment) {
    await prisma.enrollment.update({
      where: { id: payment.enrollment.id },
      data: { status: 'ACTIVE' },
    });
  }

  revalidatePath('/dashboard/finance/payments');
  return updatedPayment;
}

export async function rejectPayment(paymentId: string, reason: string) {
  await requireRole(['SUPER_ADMIN', 'FINANCE']);
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: 'FAILED',
      notes: reason,
      verifiedById: currentUser.id,
      verifiedAt: new Date(),
    },
  });

  revalidatePath('/dashboard/finance/payments');
  return payment;
}
