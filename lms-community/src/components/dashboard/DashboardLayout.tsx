'use client';

import React, { ReactNode, useState } from 'react';
import { cn } from '@/utils/cn';
import { User, BreadcrumbItem } from '@/types';
import DashboardSidebar from './DashboardSidebar';
import TopNavigation from './TopNavigation';
import Breadcrumbs from './Breadcrumbs';

interface DashboardLayoutProps {
  user: User;
  breadcrumbs?: BreadcrumbItem[];
  children: ReactNode;
  onSearch?: (query: string) => void;
  onLogout?: () => void;
  className?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  breadcrumbs,
  children,
  onSearch,
  onLogout,
  className,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar
        role={user.role}
        isCollapsed={isSidebarCollapsed}
        onToggle={setIsSidebarCollapsed}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <TopNavigation user={user} onSearch={onSearch} onLogout={onLogout} />

        {/* Content Area */}
        <main className={cn('flex-1 overflow-x-hidden overflow-y-auto', className)}>
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="mb-6">
                <Breadcrumbs items={breadcrumbs} />
              </div>
            )}

            {/* Page Content */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
