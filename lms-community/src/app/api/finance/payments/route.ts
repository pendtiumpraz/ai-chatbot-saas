import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    await requireRole(['SUPER_ADMIN', 'FINANCE']);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    const [payments, total, stats] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.payment.count({ where }),
      prisma.payment.groupBy({
        by: ['status'],
        _sum: {
          amount: true,
        },
        _count: true,
      }),
    ]);

    const statsObj = {
      total: total,
      paid: stats.find((s) => s.status === 'PAID')?._count || 0,
      pending: stats.find((s) => s.status === 'PENDING')?._count || 0,
      refunded: stats.find((s) => s.status === 'REFUNDED')?._count || 0,
      totalRevenue: Number(
        stats.find((s) => s.status === 'PAID')?._sum.amount || 0
      ),
    };

    return NextResponse.json({
      payments,
      stats: statsObj,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('GET /api/finance/payments error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
