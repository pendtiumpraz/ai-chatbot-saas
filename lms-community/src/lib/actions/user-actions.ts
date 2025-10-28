'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireRole } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function getUserProfile() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      address: true,
      bio: true,
      role: true,
      isActive: true,
      isVerified: true,
      createdAt: true,
    },
  });

  return user;
}

export async function updateUserProfile(data: {
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data: {
      name: data.name,
      phone: data.phone,
      address: data.address,
      bio: data.bio,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      bio: true,
    },
  });

  revalidatePath('/dashboard');
  return user;
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: { password: true },
  });

  if (!user?.password) {
    throw new Error('No password set');
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);

  if (!isValid) {
    throw new Error('Invalid current password');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: currentUser.id },
    data: { password: hashedPassword },
  });

  return { success: true };
}
