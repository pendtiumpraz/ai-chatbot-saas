'use client';

import { useEffect, useRef } from 'react';

interface HUDBackgroundProps {
  variant?: 'full' | 'minimal';
}

export default function HUDBackground({ variant = 'full' }: HUDBackgroundProps) {
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

  return (
    <div ref={parallaxRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Blurry floating orbs - parallax */}
      <div data-parallax="0.1" className="absolute top-20 left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-float-slow"></div>
      <div data-parallax="0.15" className="absolute top-40 right-20 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl animate-float-gentle"></div>
      <div data-parallax="0.08" className="absolute bottom-40 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      {variant === 'full' && (
        <>
          <div data-parallax="0.12" className="absolute top-1/2 right-1/4 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl animate-float-gentle"></div>
          <div data-parallax="0.07" className="absolute bottom-20 right-10 w-56 h-56 bg-blue-400/15 rounded-full blur-2xl animate-float-slow"></div>
        </>
      )}

      {/* Sharp geometric elements - animated */}
      <div className="absolute top-32 right-1/4 animate-float-gentle">
        <svg width="40" height="40" viewBox="0 0 40 40" className="text-blue-400/30">
          <rect x="0" y="0" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin-slow" />
          <circle cx="20" cy="20" r="8" fill="currentColor" opacity="0.3" />
        </svg>
      </div>

      <div className="absolute top-1/3 left-1/4 animate-float-slow">
        <svg width="50" height="50" viewBox="0 0 50 50" className="text-cyan-400/25">
          <polygon points="25,5 45,20 35,45 15,45 5,20" fill="none" stroke="currentColor" strokeWidth="2" className="animate-pulse" />
          <circle cx="25" cy="25" r="4" fill="currentColor" />
        </svg>
      </div>

      <div className="absolute bottom-1/4 right-1/3 animate-float-gentle" style={{ animationDelay: '1s' }}>
        <svg width="30" height="30" viewBox="0 0 30 30" className="text-blue-500/30">
          <circle cx="15" cy="15" r="12" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" className="animate-spin-reverse" />
          <circle cx="15" cy="15" r="3" fill="currentColor" />
        </svg>
      </div>

      {variant === 'full' && (
        <>
          <div className="absolute top-2/3 left-1/2 animate-float-slow" style={{ animationDelay: '2s' }}>
            <svg width="35" height="35" viewBox="0 0 35 35" className="text-cyan-500/25">
              <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="17.5" y1="10" x2="17.5" y2="25" stroke="currentColor" strokeWidth="1" />
              <line x1="10" y1="17.5" x2="25" y2="17.5" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          {/* Additional tech elements */}
          <div className="absolute top-1/4 right-10 animate-pulse" style={{ animationDelay: '0.5s' }}>
            <div className="w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
          </div>
          <div className="absolute top-1/2 left-20 animate-pulse" style={{ animationDelay: '1.5s' }}>
            <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
          </div>
          <div className="absolute bottom-1/3 right-1/4 animate-pulse" style={{ animationDelay: '2.5s' }}>
            <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
          </div>
        </>
      )}

      {/* Grid overlay - subtle */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="hud-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#0066ff" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hud-grid)" />
        </svg>
      </div>
    </div>
  );
}
