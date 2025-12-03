'use client';

import { ReactNode } from 'react';
import { useInView, getAnimationClasses } from '@/lib/animations';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'light' | 'dark';
  gradient?: 'blue' | 'purple' | 'orange' | 'pink' | 'cyan';
  hover?: boolean;
  animationVariant?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleIn';
  delay?: number;
}

export default function GlassCard({
  children,
  className = '',
  variant = 'light',
  gradient,
  hover = true,
  animationVariant = 'slideUp',
  delay = 0,
}: GlassCardProps) {
  const { ref, isInView } = useInView();

  const gradientBorders = {
    blue: 'before:bg-gradient-to-br before:from-blue-500 before:to-cyan-500',
    purple: 'before:bg-gradient-to-br before:from-purple-500 before:to-violet-500',
    orange: 'before:bg-gradient-to-br before:from-orange-500 before:to-amber-500',
    pink: 'before:bg-gradient-to-br before:from-pink-500 before:to-rose-500',
    cyan: 'before:bg-gradient-to-br before:from-cyan-500 before:to-teal-500',
  };

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`
        relative p-6 md:p-8 rounded-2xl transition-all duration-500 group
        ${variant === 'light' ? 'glass-card' : 'glass-dark'}
        ${hover ? 'hover:shadow-2xl hover:-translate-y-2 cursor-pointer' : ''}
        ${getAnimationClasses(animationVariant, isInView)}
        ${className}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Gradient border effect */}
      {gradient && (
        <div
          className={`
            absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
            transition-opacity duration-300 pointer-events-none -z-10
            before:content-[''] before:absolute before:inset-0 before:rounded-2xl
            before:p-[2px] before:${gradientBorders[gradient]}
            before:-webkit-mask-image before:mask-image
            before:[mask-image:linear-gradient(white,white)_content-box,linear-gradient(white,white)]
            before:[mask-composite:exclude]
          `}
        />
      )}

      {/* Content */}
      {children}

      {/* Subtle glow effect on hover */}
      {hover && (
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-primary/30 to-transparent" />
      )}
    </div>
  );
}
