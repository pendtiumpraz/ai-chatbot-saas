'use client';

import { useMemo, useEffect, useState } from 'react';

interface Shape {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  type: 'circle';
  color: string;
}

interface FloatingShapesProps {
  count?: number;
  colors?: string[];
}

export default function FloatingShapes({
  count = 3,
  colors = ['#0066ff', '#00D9FF', '#7C3AED', '#F59E0B', '#EC4899']
}: FloatingShapesProps) {
  // Detect mobile for performance optimization
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Use useMemo to prevent re-renders and compute shapes only once
  const shapes = useMemo(() => {
    // Reduce count on mobile (max 2 shapes)
    const actualCount = isMobile ? Math.min(count, 2) : count;
    const generatedShapes: Shape[] = [];

    for (let i = 0; i < actualCount; i++) {
      generatedShapes.push({
        id: i,
        size: Math.random() * 80 + 60,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 10 + 20,
        delay: Math.random() * 8,
        type: 'circle',
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    return generatedShapes;
  }, [count, colors, isMobile]);

  // Don't render if user prefers reduced motion
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape) => (
        <div
          key={shape.id}
          style={{
            position: 'absolute',
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            opacity: 0.08,
            background: shape.color,
            borderRadius: '50%',
            filter: 'blur(50px)',
            animation: `floatGentle ${shape.duration}s ease-in-out infinite`,
            animationDelay: `${shape.delay}s`,
            pointerEvents: 'none',
            // Performance optimization: hint browser which properties will change
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}
