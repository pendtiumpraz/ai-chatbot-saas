'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import { cn } from '@/utils/cn';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname if items not provided
  const breadcrumbItems = items || generateBreadcrumbs(pathname);

  return (
    <nav className={cn('flex items-center space-x-2 text-sm', className)}>
      <Link
        href="/"
        className="flex items-center text-gray-500 hover:text-primary-600 transition-colors"
      >
        <FiHome size={16} />
      </Link>

      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          <FiChevronRight size={16} className="text-gray-400" />
          {item.href && index < breadcrumbItems.length - 1 ? (
            <Link
              href={item.href}
              className="text-gray-500 hover:text-primary-600 transition-colors capitalize"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium capitalize">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// Helper function to generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Build breadcrumb hierarchy
  let currentPath = '';
  paths.forEach((path, index) => {
    currentPath += `/${path}`;
    
    // Format label: replace hyphens with spaces and handle special cases
    let label = path.replace(/-/g, ' ');
    
    // Special label mappings
    const labelMappings: Record<string, string> = {
      'super admin': 'Super Admin',
      'my courses': 'My Courses',
    };
    
    label = labelMappings[label] || label;

    breadcrumbs.push({
      label,
      href: index < paths.length - 1 ? currentPath : undefined,
    });
  });

  return breadcrumbs;
}

export default Breadcrumb;
