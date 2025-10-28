'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  fullScreen = false,
  text,
  className,
}) => {
  const sizeStyles = {
    sm: { spinner: 'w-4 h-4', dots: 'w-2 h-2', text: 'text-sm' },
    md: { spinner: 'w-8 h-8', dots: 'w-3 h-3', text: 'text-base' },
    lg: { spinner: 'w-12 h-12', dots: 'w-4 h-4', text: 'text-lg' },
    xl: { spinner: 'w-16 h-16', dots: 'w-5 h-5', text: 'text-xl' },
  };

  const renderSpinner = () => (
    <svg
      className={cn(
        'animate-spin text-primary-600',
        sizeStyles[size].spinner,
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  const renderDots = () => (
    <div className={cn('flex space-x-2', className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={cn('bg-primary-600 rounded-full', sizeStyles[size].dots)}
          animate={{
            y: ['0%', '-50%', '0%'],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <motion.div
      className={cn(
        'bg-primary-600 rounded-full',
        sizeStyles[size].spinner,
        className
      )}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.5, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
      }}
    />
  );

  const renderSkeleton = () => (
    <div className={cn('space-y-3 w-full', className)}>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
    </div>
  );

  const renderLoading = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'skeleton':
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      {renderLoading()}
      {text && (
        <p className={cn('text-gray-600 font-medium', sizeStyles[size].text)}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;

// Skeleton components for content loading
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('card animate-pulse', className)}>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 rounded"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => (
  <div className="table-container">
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-10 bg-gray-100 rounded flex-1 animate-pulse"
              style={{ animationDelay: `${rowIndex * 0.1}s` }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);
