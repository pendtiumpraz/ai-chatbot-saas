'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireRole } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';
import type { CourseStatus } from '@prisma/client';

export async function getTeacherCourses() {
  await requireRole(['SUPER_ADMIN', 'TEACHER']);
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  const courses = await prisma.course.findMany({
    where: {
      creatorId: currentUser.id,
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

  return courses;
}

export async function createCourse(data: {
  title: string;
  description: string;
  shortDescription?: string;
  categoryId?: string;
  price?: number;
  duration?: number;
  level?: string;
}) {
  await requireRole(['SUPER_ADMIN', 'TEACHER']);
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  // Generate slug from title
  const slug =
    data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') +
    '-' +
    Date.now();

  const course = await prisma.course.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      shortDescription: data.shortDescription || null,
      categoryId: data.categoryId || null,
      price: data.price || 0,
      duration: data.duration || null,
      level: data.level || null,
      status: 'DRAFT',
      creatorId: currentUser.id,
    },
  });

  revalidatePath('/dashboard/teacher/courses');
  return course;
}

export async function updateCourse(
  courseId: string,
  data: {
    title?: string;
    description?: string;
    shortDescription?: string;
    categoryId?: string;
    price?: number;
    duration?: number;
    level?: string;
    status?: CourseStatus;
  }
) {
  await requireRole(['SUPER_ADMIN', 'TEACHER']);
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  // Verify ownership
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { creatorId: true },
  });

  if (!course) {
    throw new Error('Course not found');
  }

  if (course.creatorId !== currentUser.id && currentUser.role !== 'SUPER_ADMIN') {
    throw new Error('Not authorized to update this course');
  }

  const updated = await prisma.course.update({
    where: { id: courseId },
    data: {
      title: data.title,
      description: data.description,
      shortDescription: data.shortDescription,
      categoryId: data.categoryId,
      price: data.price,
      duration: data.duration,
      level: data.level,
      status: data.status,
    },
  });

  revalidatePath('/dashboard/teacher/courses');
  return updated;
}

export async function deleteCourse(courseId: string) {
  await requireRole(['SUPER_ADMIN', 'TEACHER']);
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  // Verify ownership
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { creatorId: true },
  });

  if (!course) {
    throw new Error('Course not found');
  }

  if (course.creatorId !== currentUser.id && currentUser.role !== 'SUPER_ADMIN') {
    throw new Error('Not authorized to delete this course');
  }

  // Soft delete
  await prisma.course.update({
    where: { id: courseId },
    data: { deletedAt: new Date() },
  });

  revalidatePath('/dashboard/teacher/courses');
  return { success: true };
}

export async function publishCourse(courseId: string) {
  await requireRole(['SUPER_ADMIN', 'TEACHER']);
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  const course = await prisma.course.update({
    where: { id: courseId },
    data: {
      status: 'PUBLISHED',
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  revalidatePath('/dashboard/teacher/courses');
  return course;
}

export async function getStudentCourses() {
  await requireRole(['SUPER_ADMIN', 'STUDENT']);
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  const enrollments = await prisma.enrollment.findMany({
    where: {
      studentId: currentUser.id,
    },
    include: {
      course: {
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: { enrolledAt: 'desc' },
  });

  return enrollments;
}

export async function getBrowseCourses() {
  const courses = await prisma.course.findMany({
    where: {
      status: 'PUBLISHED',
      isPublished: true,
      deletedAt: null,
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          image: true,
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
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return courses;
}
