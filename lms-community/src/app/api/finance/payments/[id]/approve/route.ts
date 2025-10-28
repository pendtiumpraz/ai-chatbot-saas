import { NextRequest, NextResponse } from 'next/server';
import { requireRole, getCurrentUser } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(['SUPER_ADMIN', 'FINANCE']);
    const currentUser = await getCurrentUser();

    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: {
        enrollment: true,
      },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    if (payment.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Payment is not pending' },
        { status: 400 }
      );
    }

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: params.id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        verifiedById: currentUser?.id,
        verifiedAt: new Date(),
      },
    });

    // Update enrollment status if exists
    if (payment.enrollment) {
      await prisma.enrollment.update({
        where: { id: payment.enrollment.id },
        data: { status: 'ACTIVE' },
      });
    }

    return NextResponse.json({ payment: updatedPayment });
  } catch (error: any) {
    console.error('POST /api/finance/payments/[id]/approve error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
