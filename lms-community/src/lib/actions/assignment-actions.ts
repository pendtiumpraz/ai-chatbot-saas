'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireRole } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';
import type { AssignmentStatus, SubmissionStatus } from '@prisma/client';

export async function createAssignment(data: {
  courseId: string;
  title: string;
  description: string;
  instructions?: string;
  maxScore?: number;
  passingScore?: number;
  dueDate?: Date;
  lateSubmissionAllowed?: boolean;
}) {
  await requireRole(['SUPER_ADMIN', 'TEACHER']);
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  // Verify course ownership
  const course = await prisma.course.findUnique({
    where: { id: data.courseId },
    select: { creatorId: true },
  });

  if (!course || (course.creatorId !== currentUser.id && currentUser.role !== 'SUPER_ADMIN')) {
    throw new Error('Not authorized');
  }

  const assignment = await prisma.assignment.create({
    data: {
      courseId: data.courseId,
      title: data.title,
      description: data.description,
      instructions: data.instructions || null,
      maxScore: data.maxScore || 100,
      passingScore: data.passingScore || null,
      dueDate: data.dueDate || null,
      lateSubmissionAllowed: data.lateSubmissionAllowed || false,
      status: 'DRAFT',
    },
  });

  revalidatePath('/dashboard/teacher/assignments');
  return assignment;
}

export async function updateAssignment(
  assignmentId: string,
  data: {
    title?: string;
    description?: string;
    instructions?: string;
    maxScore?: number;
    passingScore?: number;
    dueDate?: Date;
    status?: AssignmentStatus;
  }
) {
  await requireRole(['SUPER_ADMIN', 'TEACHER']);
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  const assignment = await prisma.assignment.update({
    where: { id: assignmentId },
    data,
  });

  revalidatePath('/dashboard/teacher/assignments');
  return assignment;
}

export async function getTeacherAssignments(courseId?: string) {
  await requireRole(['SUPER_ADMIN', 'TEACHER']);
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  const where: any = {
    course: {
      creatorId: currentUser.id,
    },
  };

  if (courseId) {
    where.courseId = courseId;
  }

  const assignments = await prisma.assignment.findMany({
    where,
    include: {
      course: {
        select: {
          id: true,
          title: true,
        },
      },
      _count: {
        select: {
          submissions: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return assignments;
}

export async function submitAssignment(data: {
  assignmentId: string;
  enrollmentId: string;
  content?: string;
  attachmentUrls?: string[];
  attachmentIds?: string[];
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  // Check if assignment exists and is published
  const assignment = await prisma.assignment.findUnique({
    where: { id: data.assignmentId },
  });

  if (!assignment || assignment.status !== 'PUBLISHED') {
    throw new Error('Assignment not available');
  }

  // Check if late
  const isLate = assignment.dueDate ? new Date() > assignment.dueDate : false;

  if (isLate && !assignment.lateSubmissionAllowed) {
    throw new Error('Late submission not allowed');
  }

  // Check for existing submission
  const existing = await prisma.submission.findFirst({
    where: {
      assignmentId: data.assignmentId,
      enrollmentId: data.enrollmentId,
      studentId: currentUser.id,
    },
  });

  const submission = existing
    ? await prisma.submission.update({
        where: { id: existing.id },
        data: {
          content: data.content,
          attachmentUrls: data.attachmentUrls || [],
          attachmentIds: data.attachmentIds || [],
          status: 'SUBMITTED',
          submittedAt: new Date(),
          isLate,
        },
      })
    : await prisma.submission.create({
        data: {
          assignmentId: data.assignmentId,
          enrollmentId: data.enrollmentId,
          studentId: currentUser.id,
          content: data.content,
          attachmentUrls: data.attachmentUrls || [],
          attachmentIds: data.attachmentIds || [],
          status: 'SUBMITTED',
          submittedAt: new Date(),
          isLate,
        },
      });

  revalidatePath('/dashboard/student/assignments');
  return submission;
}

export async function gradeSubmission(data: {
  submissionId: string;
  score: number;
  maxScore: number;
  feedback?: string;
  letterGrade?: string;
}) {
  await requireRole(['SUPER_ADMIN', 'TEACHER']);
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  const submission = await prisma.submission.findUnique({
    where: { id: data.submissionId },
    include: {
      assignment: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!submission) {
    throw new Error('Submission not found');
  }

  // Verify teacher owns the course
  if (
    submission.assignment.course.creatorId !== currentUser.id &&
    currentUser.role !== 'SUPER_ADMIN'
  ) {
    throw new Error('Not authorized');
  }

  const percentage = (data.score / data.maxScore) * 100;

  // Create or update grade
  const grade = await prisma.grade.upsert({
    where: { submissionId: data.submissionId },
    create: {
      submissionId: data.submissionId,
      enrollmentId: submission.enrollmentId,
      score: data.score,
      maxScore: data.maxScore,
      percentage,
      letterGrade: data.letterGrade || null,
      feedback: data.feedback || null,
      gradedById: currentUser.id,
    },
    update: {
      score: data.score,
      maxScore: data.maxScore,
      percentage,
      letterGrade: data.letterGrade,
      feedback: data.feedback,
      gradedById: currentUser.id,
      gradedAt: new Date(),
    },
  });

  // Update submission status
  await prisma.submission.update({
    where: { id: data.submissionId },
    data: { status: 'GRADED' },
  });

  revalidatePath('/dashboard/teacher/grading');
  return grade;
}

export async function getStudentSubmissions() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  const submissions = await prisma.submission.findMany({
    where: {
      studentId: currentUser.id,
    },
    include: {
      assignment: {
        select: {
          id: true,
          title: true,
          maxScore: true,
          dueDate: true,
        },
      },
      grade: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return submissions;
}

export async function getPendingSubmissions() {
  await requireRole(['SUPER_ADMIN', 'TEACHER']);
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  const submissions = await prisma.submission.findMany({
    where: {
      status: 'SUBMITTED',
      assignment: {
        course: {
          creatorId: currentUser.id,
        },
      },
    },
    include: {
      assignment: {
        select: {
          id: true,
          title: true,
          maxScore: true,
          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { submittedAt: 'desc' },
  });

  return submissions;
}
