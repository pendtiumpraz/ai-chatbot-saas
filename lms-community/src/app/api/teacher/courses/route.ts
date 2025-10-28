import { NextRequest, NextResponse } from 'next/server';
import { requireRole, getCurrentUser } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    await requireRole(['SUPER_ADMIN', 'TEACHER']);
    const currentUser = await getCurrentUser();

    const courses = await prisma.course.findMany({
      where: {
        creatorId: currentUser?.id,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      include: {
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
    });

    return NextResponse.json({ courses });
  } catch (error: any) {
    console.error('GET /api/teacher/courses error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(['SUPER_ADMIN', 'TEACHER']);
    const currentUser = await getCurrentUser();

    const body = await request.json();
    const {
      title,
      description,
      shortDescription,
      categoryId,
      price,
      duration,
      level,
    } = body;

    // Generate slug from title
    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') +
      '-' +
      Date.now();

    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        shortDescription: shortDescription || null,
        categoryId: categoryId || null,
        price: price || 0,
        duration: duration || null,
        level: level || null,
        status: 'DRAFT',
        creatorId: currentUser?.id || '',
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/teacher/courses error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
