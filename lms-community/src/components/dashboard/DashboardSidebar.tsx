'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { MenuItem, UserRole } from '@/types';
import {
  FiHome,
  FiBook,
  FiUsers,
  FiSettings,
  FiBarChart,
  FiCalendar,
  FiMessageSquare,
  FiFileText,
  FiAward,
  FiChevronDown,
  FiChevronRight,
  FiMenu,
  FiX,
} from 'react-icons/fi';

interface DashboardSidebarProps {
  role: UserRole;
  isCollapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
  className?: string;
}

// Menu items for different roles
const menuItems: Record<UserRole, MenuItem[]> = {
  STUDENT: [
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard/student', icon: <FiHome /> },
    { id: 'courses', label: 'Browse Courses', href: '/dashboard/student/courses', icon: <FiBook /> },
    { id: 'my-courses', label: 'My Courses', href: '/dashboard/student/my-courses', icon: <FiBook /> },
    { id: 'materials', label: 'Materials', href: '/dashboard/student/materials', icon: <FiFileText /> },
    { id: 'assignments', label: 'Assignments', href: '/dashboard/student/assignments', icon: <FiFileText /> },
    { id: 'submissions', label: 'Submissions', href: '/dashboard/student/submissions', icon: <FiFileText /> },
    { id: 'grades', label: 'Grades', href: '/dashboard/student/grades', icon: <FiAward /> },
    { id: 'payments', label: 'Payments', href: '/dashboard/student/payments', icon: <FiBarChart /> },
    { id: 'certificates', label: 'Certificates', href: '/dashboard/student/certificates', icon: <FiAward /> },
  ],
  TEACHER: [
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard/teacher', icon: <FiHome /> },
    { id: 'courses', label: 'My Courses', href: '/dashboard/teacher/courses', icon: <FiBook /> },
    { id: 'materials', label: 'Materials', href: '/dashboard/teacher/materials', icon: <FiFileText /> },
    { id: 'assignments', label: 'Assignments', href: '/dashboard/teacher/assignments', icon: <FiFileText /> },
    { id: 'submissions', label: 'Submissions', href: '/dashboard/teacher/submissions', icon: <FiFileText /> },
    { id: 'grading', label: 'Grading', href: '/dashboard/teacher/grading', icon: <FiAward />, badge: '5' },
    { id: 'students', label: 'Students', href: '/dashboard/teacher/students', icon: <FiUsers /> },
    { id: 'announcements', label: 'Announcements', href: '/dashboard/teacher/announcements', icon: <FiMessageSquare /> },
  ],
  FINANCE: [
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard/finance', icon: <FiHome /> },
    { id: 'payments', label: 'Payments', href: '/dashboard/finance/payments', icon: <FiBarChart /> },
    { id: 'invoices', label: 'Invoices', href: '/dashboard/finance/invoices', icon: <FiFileText /> },
    { id: 'pending', label: 'Pending Approvals', href: '/dashboard/finance/pending', icon: <FiCalendar />, badge: '3' },
    { id: 'reports', label: 'Reports', href: '/dashboard/finance/reports', icon: <FiBarChart /> },
  ],
  SUPER_ADMIN: [
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard/super-admin', icon: <FiHome /> },
    {
      id: 'management',
      label: 'Management',
      href: '#',
      icon: <FiUsers />,
      children: [
        { id: 'users', label: 'Users', href: '/dashboard/super-admin/users', icon: <FiUsers /> },
        { id: 'roles', label: 'Roles', href: '/dashboard/super-admin/roles', icon: <FiSettings /> },
        { id: 'courses', label: 'Courses', href: '/dashboard/super-admin/courses', icon: <FiBook /> },
        { id: 'categories', label: 'Categories', href: '/dashboard/super-admin/categories', icon: <FiBook /> },
      ],
    },
    { id: 'payments', label: 'Payments', href: '/dashboard/super-admin/payments', icon: <FiBarChart /> },
    { id: 'reports', label: 'Reports', href: '/dashboard/super-admin/reports', icon: <FiBarChart /> },
    { id: 'settings', label: 'Settings', href: '/dashboard/super-admin/settings', icon: <FiSettings /> },
  ],
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  role,
  isCollapsed: controlledCollapsed,
  onToggle,
  className,
}) => {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const isCollapsed = controlledCollapsed ?? internalCollapsed;

  const handleToggle = () => {
    const newCollapsed = !isCollapsed;
    if (onToggle) {
      onToggle(newCollapsed);
    } else {
      setInternalCollapsed(newCollapsed);
    }
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isExpanded = (itemId: string) => expandedItems.includes(itemId);

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const active = isActive(item.href);
    const expanded = isExpanded(item.id);

    return (
      <div key={item.id}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.id)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200',
              'hover:bg-primary-50 group',
              active && 'bg-primary-100 text-primary-600',
              depth > 0 && 'ml-4'
            )}
          >
            <div className="flex items-center space-x-3">
              <span className={cn('text-gray-500 group-hover:text-primary-600', active && 'text-primary-600')}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className={cn('font-medium text-gray-700 group-hover:text-primary-600', active && 'text-primary-600')}>
                  {item.label}
                </span>
              )}
            </div>
            {!isCollapsed && (
              <motion.div
                animate={{ rotate: expanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FiChevronRight className="text-gray-400" />
              </motion.div>
            )}
          </button>
        ) : (
          <Link
            href={item.href}
            className={cn(
              'flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200',
              'hover:bg-primary-50 group',
              active && 'bg-primary-100 text-primary-600',
              depth > 0 && 'ml-4'
            )}
          >
            <div className="flex items-center space-x-3">
              <span className={cn('text-gray-500 group-hover:text-primary-600', active && 'text-primary-600')}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className={cn('font-medium text-gray-700 group-hover:text-primary-600', active && 'text-primary-600')}>
                  {item.label}
                </span>
              )}
            </div>
            {!isCollapsed && item.badge && (
              <span className="px-2 py-1 text-xs font-semibold bg-danger-500 text-white rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        )}

        <AnimatePresence>
          {hasChildren && expanded && !isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-1 space-y-1">
                {item.children!.map((child) => renderMenuItem(child, depth + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <aside
      className={cn(
        'bg-white border-r border-gray-200 flex flex-col transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <span className="text-lg font-bold text-gray-900">LMS</span>
            </Link>
          )}
          <button
            onClick={handleToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <div className="space-y-1">
          {menuItems[role].map((item) => renderMenuItem(item))}
        </div>
      </nav>

      {/* Role Badge */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="px-4 py-2 bg-primary-50 rounded-lg">
            <p className="text-xs text-gray-600 uppercase tracking-wide">Role</p>
            <p className="text-sm font-semibold text-primary-600 capitalize">
              {role}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default DashboardSidebar;
