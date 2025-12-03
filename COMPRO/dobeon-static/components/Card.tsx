'use client';

import { ReactNode } from 'react';
import { useInView, getAnimationClasses } from '@/lib/animations';

interface CardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  gradient?: boolean | 'blue';
  hover?: boolean;
  className?: string;
  animationVariant?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleIn';
  delay?: number;
  image?: string;
}

export default function Card({
  title,
  description,
  icon,
  gradient = false,
  hover = true,
  className = '',
  animationVariant = 'slideUp',
  delay = 0,
  image,
}: CardProps) {
  const { ref, isInView } = useInView();

  const getGradientClass = () => {
    if (gradient === 'blue') {
      return 'bg-gradient-to-br from-primary via-blue-600 to-cyan-500 text-white shadow-xl shadow-primary/20';
    }
    if (gradient === true) {
      return 'bg-gradient-to-br from-primary to-blue-700 text-white shadow-xl shadow-primary/20';
    }
    return 'bg-white border-2 border-gray-100 hover:border-primary/30';
  };

  const isGradient = gradient !== false;

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`
        relative overflow-hidden rounded-2xl transition-all duration-500 group
        ${getGradientClass()}
        ${hover ? 'hover:shadow-2xl hover:-translate-y-2 cursor-pointer' : ''}
        ${getAnimationClasses(animationVariant, isInView)}
        ${className}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Background Pattern for gradient cards */}
      {isGradient && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
      )}

      <div className="relative p-6 md:p-8">
        {icon && (
          <div className={`mb-5 inline-flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 ${
            hover ? 'group-hover:scale-110 group-hover:rotate-3' : ''
          } ${
            isGradient 
              ? 'bg-white/20 backdrop-blur-sm' 
              : 'bg-gradient-to-br from-primary/10 to-cyan-500/10 group-hover:from-primary/20 group-hover:to-cyan-500/20'
          }`}>
            <div className={isGradient ? 'text-white' : 'text-primary'}>
              {icon}
            </div>
          </div>
        )}
        
        <h3 className={`text-xl md:text-2xl font-bold transition-colors ${description ? 'mb-3' : ''} ${
          isGradient ? 'text-white' : 'text-gray-900 group-hover:text-primary'
        }`}>
          {title}
        </h3>
        
        {description && (
          <p className={`leading-relaxed text-base ${isGradient ? 'text-white/90' : 'text-gray-600'}`}>
            {description}
          </p>
        )}

        {/* Arrow indicator on hover */}
        {hover && (
          <div className={`mt-6 flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2 ${
            isGradient ? 'text-white' : 'text-primary'
          }`}>
            <span>Learn more</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </div>
        )}
      </div>

      {/* Shine effect on hover */}
      {hover && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      )}
    </div>
  );
}
