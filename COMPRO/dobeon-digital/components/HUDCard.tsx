'use client';

import { ReactNode } from 'react';

interface HUDCardProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'minimal';
  className?: string;
  glowOnHover?: boolean;
}

export default function HUDCard({
  children,
  variant = 'primary',
  className = '',
  glowOnHover = true,
}: HUDCardProps) {
  const variants = {
    primary: `
      relative group
      bg-white/95 backdrop-blur-md
      border-2 border-blue-400/50
      shadow-[0_0_20px_rgba(59,130,246,0.3)]
      hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]
      transition-all duration-500
      ${glowOnHover ? 'hover:border-blue-500' : ''}
    `,
    secondary: `
      relative group
      bg-white/90 backdrop-blur-sm
      border border-cyan-400/40
      shadow-[0_0_15px_rgba(6,182,212,0.2)]
      hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]
      transition-all duration-500
      ${glowOnHover ? 'hover:border-cyan-500' : ''}
    `,
    minimal: `
      relative group
      bg-white/80 backdrop-blur-sm
      border border-blue-300/30
      hover:border-blue-400/60
      transition-all duration-300
    `,
  };

  return (
    <div className={`${variants[variant]} rounded-lg overflow-hidden ${className}`}>
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>

      {/* Animated scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan-line"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Hover glow effect */}
      {glowOnHover && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      )}
    </div>
  );
}
