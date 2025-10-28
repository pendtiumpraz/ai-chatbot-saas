'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { BreadcrumbItem } from '@/types';
import { FiChevronRight, FiHome } from 'react-icons/fi';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav className={cn('flex items-center space-x-2 text-sm', className)} aria-label="Breadcrumb">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Link
          href="/dashboard"
          className="flex items-center text-gray-500 hover:text-primary-600 transition-colors"
        >
          <FiHome size={16} />
        </Link>
      </motion.div>

      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className="flex items-center space-x-2"
        >
          <FiChevronRight className="text-gray-400" size={16} />
          {item.href && index !== items.length - 1 ? (
            <Link
              href={item.href}
              className="text-gray-500 hover:text-primary-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </motion.div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
