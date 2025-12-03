'use client';

import { useInView, getAnimationClasses } from '@/lib/animations';
import { useEffect, useRef } from 'react';

interface LogoLineProps {
  variant?: 'solid' | 'gradient' | 'dotted' | 'double' | 'curve';
  className?: string;
}

export default function LogoLine({
  variant = 'gradient',
  className = ''
}: LogoLineProps) {
  const { ref, isInView } = useInView();
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return;
      const scrollY = window.scrollY;
      const elements = parallaxRef.current.querySelectorAll('[data-parallax]');

      elements.forEach((element) => {
        const speed = parseFloat(element.getAttribute('data-parallax') || '0');
        const yPos = -(scrollY * speed);
        (element as HTMLElement).style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderDivider = () => {
    switch (variant) {
      case 'solid':
        return (
          <div className="relative h-32 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div data-parallax="0.1" className="absolute w-64 h-64 bg-blue-400/30 rounded-full blur-3xl animate-float-slow"></div>
              <div data-parallax="0.15" className="absolute w-48 h-48 bg-cyan-400/40 rounded-full blur-3xl animate-float-gentle" style={{ left: '60%' }}></div>
              <div data-parallax="0.05" className="absolute w-56 h-56 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ left: '20%' }}></div>
            </div>
          </div>
        );

      case 'gradient':
        return (
          <div className="relative h-40 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center gap-12">
              <div data-parallax="0.08" className="absolute w-72 h-72 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-float-slow"></div>
              <div data-parallax="0.12" className="absolute w-56 h-56 bg-gradient-to-br from-cyan-400/40 to-blue-500/40 rounded-full blur-3xl animate-float-gentle" style={{ left: '55%', top: '20%' }}></div>
              <div data-parallax="0.06" className="absolute w-64 h-64 bg-blue-500/25 rounded-full blur-3xl animate-pulse" style={{ left: '25%', top: '30%' }}></div>
              <div data-parallax="0.1" className="absolute w-48 h-48 bg-cyan-500/35 rounded-full blur-3xl animate-float-gentle" style={{ left: '75%', top: '40%' }}></div>
            </div>
          </div>
        );

      case 'dotted':
        return (
          <div className="relative h-36 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Center cluster */}
              <div data-parallax="0.1" className="absolute w-40 h-40 bg-blue-500/40 rounded-full blur-2xl animate-pulse"></div>
              <div data-parallax="0.12" className="absolute w-32 h-32 bg-cyan-400/50 rounded-full blur-2xl animate-float-slow" style={{ left: 'calc(50% - 80px)' }}></div>
              <div data-parallax="0.08" className="absolute w-36 h-36 bg-blue-400/35 rounded-full blur-2xl animate-float-gentle" style={{ left: 'calc(50% + 40px)' }}></div>

              {/* Side elements */}
              <div data-parallax="0.15" className="absolute w-24 h-24 bg-cyan-500/30 rounded-full blur-xl animate-float-gentle" style={{ left: '15%' }}></div>
              <div data-parallax="0.07" className="absolute w-28 h-28 bg-blue-500/25 rounded-full blur-xl animate-float-slow" style={{ left: '80%' }}></div>
            </div>
          </div>
        );

      case 'double':
        return (
          <div className="relative h-44 overflow-hidden">
            <div className="absolute inset-0">
              {/* Top layer */}
              <div data-parallax="0.14" className="absolute w-60 h-60 bg-blue-400/35 rounded-full blur-3xl animate-float-slow" style={{ top: '10%', left: '20%' }}></div>
              <div data-parallax="0.1" className="absolute w-52 h-52 bg-cyan-500/40 rounded-full blur-3xl animate-float-gentle" style={{ top: '15%', left: '60%' }}></div>

              {/* Bottom layer */}
              <div data-parallax="0.08" className="absolute w-56 h-56 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ top: '50%', left: '40%' }}></div>
              <div data-parallax="0.12" className="absolute w-48 h-48 bg-cyan-400/35 rounded-full blur-3xl animate-float-slow" style={{ top: '55%', left: '70%' }}></div>
              <div data-parallax="0.06" className="absolute w-44 h-44 bg-blue-400/25 rounded-full blur-2xl animate-float-gentle" style={{ top: '60%', left: '10%' }}></div>
            </div>
          </div>
        );

      case 'curve':
        return (
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0">
              {/* Flowing curve pattern with parallax */}
              <div data-parallax="0.1" className="absolute w-80 h-80 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-float-slow" style={{ left: '10%', top: '20%' }}></div>
              <div data-parallax="0.15" className="absolute w-64 h-64 bg-gradient-to-br from-cyan-500/40 to-blue-400/35 rounded-full blur-3xl animate-float-gentle" style={{ left: '30%', top: '40%' }}></div>
              <div data-parallax="0.08" className="absolute w-72 h-72 bg-blue-500/25 rounded-full blur-3xl animate-pulse" style={{ left: '50%', top: '15%' }}></div>
              <div data-parallax="0.12" className="absolute w-60 h-60 bg-gradient-to-br from-blue-400/35 to-cyan-500/30 rounded-full blur-3xl animate-float-slow" style={{ left: '70%', top: '35%' }}></div>
              <div data-parallax="0.06" className="absolute w-52 h-52 bg-cyan-400/30 rounded-full blur-2xl animate-float-gentle" style={{ left: '85%', top: '20%' }}></div>

              {/* Additional depth elements */}
              <div data-parallax="0.18" className="absolute w-44 h-44 bg-blue-500/20 rounded-full blur-2xl animate-pulse" style={{ left: '40%', top: '60%' }}></div>
              <div data-parallax="0.05" className="absolute w-48 h-48 bg-cyan-500/25 rounded-full blur-2xl animate-float-gentle" style={{ left: '60%', top: '55%' }}></div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={parallaxRef}
      className={`logoline py-8 md:py-12 relative overflow-hidden ${className} ${getAnimationClasses('fadeIn', isInView)}`}
    >
      {renderDivider()}
    </div>
  );
}
