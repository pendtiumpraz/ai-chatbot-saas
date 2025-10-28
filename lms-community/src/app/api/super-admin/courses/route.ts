import { NextRequest, NextResponse } from 'next/server';
import { requireRole, getCurrentUser } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    await requireRole(['SUPER_ADMIN']);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              enrollments: true,
              materials: true,
              assignments: true,
            },
          },
        },
      }),
      prisma.course.count({ where }),
    ]);

    return NextResponse.json({
      courses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('GET /api/super-admin/courses error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(['SUPER_ADMIN']);
    const currentUser = await getCurrentUser();

    const body = await request.json();
    const { title, description, categoryId, price, status } = body;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        categoryId: categoryId || null,
        price: price || 0,
        status: status || 'DRAFT',
        creatorId: currentUser?.id || '',
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/super-admin/courses error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireRole(['SUPER_ADMIN']);

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Invalid course IDs' }, { status: 400 });
    }

    // Soft delete courses
    await prisma.course.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true, deletedCount: ids.length });
  } catch (error: any) {
    console.error('DELETE /api/super-admin/courses error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
