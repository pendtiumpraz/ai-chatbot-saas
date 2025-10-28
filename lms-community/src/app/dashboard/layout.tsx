'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import TopNavigation from '@/components/dashboard/TopNavigation';
import { UserRole } from '@/types';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    redirect('/auth/signin');
  }

  const user = {
    id: session.user?.id || '',
    name: session.user?.name || 'User',
    email: session.user?.email || '',
    role: (session.user as any)?.role as UserRole || 'STUDENT',
    avatar: session.user?.image || undefined,
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar role={user.role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation user={user} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
