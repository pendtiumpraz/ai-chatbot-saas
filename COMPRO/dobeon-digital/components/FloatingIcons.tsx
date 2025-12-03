'use client';

import { useMemo, useEffect, useState } from 'react';

interface Icon {
  id: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  type: 'health' | 'tech';
  iconName: string;
}

interface FloatingIconsProps {
  count?: number;
}

export default function FloatingIcons({ count = 12 }: FloatingIconsProps) {
  // Detect if mobile for performance optimization
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use useMemo to prevent re-generation of icons
  const icons = useMemo(() => {
    const healthIcons = [
      'stethoscope',
      'heartbeat',
      'dna',
      'medical-cross',
      'pill',
      'microscope',
    ];

    const techIcons = [
      'circuit',
      'cloud-data',
      'shield',
      'network',
      'code',
      'cpu',
    ];

    // Reduce count on mobile for better performance
    const actualCount = isMobile ? Math.floor(count / 2) : count;
    const generatedIcons: Icon[] = [];

    for (let i = 0; i < actualCount; i++) {
      const isHealth = i % 2 === 0;
      const iconList = isHealth ? healthIcons : techIcons;

      generatedIcons.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 10 + 20, // 20-30s
        delay: Math.random() * 8,
        type: isHealth ? 'health' : 'tech',
        iconName: iconList[Math.floor(Math.random() * iconList.length)],
      });
    }

    return generatedIcons;
  }, [count, isMobile]);

  const renderIcon = (icon: Icon) => {
    let svgPath = '';

    // Health Icons - outline style
    switch (icon.iconName) {
      case 'stethoscope':
        svgPath = 'M19 14.5v-9a4.5 4.5 0 10-9 0v9a4.5 4.5 0 109 0zM14.5 3.5v3M9.5 3.5v3M12 10.5h-1.5M12 13h-1.5';
        break;
      case 'heartbeat':
        svgPath = 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z';
        break;
      case 'dna':
        svgPath = 'M12 3c-1.5 0-2.7 1.3-2.7 2.8 0 .8.3 1.5.8 2.1-.5.5-.8 1.3-.8 2.1 0 1.5 1.2 2.8 2.7 2.8s2.7-1.3 2.7-2.8c0-.8-.3-1.6-.8-2.1.5-.5.8-1.3.8-2.1C14.7 4.3 13.5 3 12 3z M9 9l6 6m-6 0l6-6';
        break;
      case 'medical-cross':
        svgPath = 'M12 4v16m8-8H4';
        break;
      case 'pill':
        svgPath = 'M10.5 13.5L4 20M8.5 8.5l11 11a4 4 0 01-5.66 5.66l-11-11a4 4 0 015.66-5.66z';
        break;
      case 'microscope':
        svgPath = 'M9 3L5 7l4 4m8 0v7a2 2 0 11-4 0v-7m8 7h-7m-4-4a4 4 0 108 0';
        break;
      // Tech Icons - outline style
      case 'circuit':
        svgPath = 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z';
        break;
      case 'cloud-data':
        svgPath = 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z M12 9v6m-3-3l3 3 3-3';
        break;
      case 'shield':
        svgPath = 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z';
        break;
      case 'network':
        svgPath = 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9';
        break;
      case 'code':
        svgPath = 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4';
        break;
      case 'cpu':
        svgPath = 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zm2-9h6v4H9v-4z';
        break;
      default:
        svgPath = 'M12 2a10 10 0 100 20 10 10 0 000-20z';
    }

    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${icon.x}%`,
      top: `${icon.y}%`,
      opacity: 0.06,
      animation: `floatGentle ${icon.duration}s ease-in-out infinite`,
      animationDelay: `${icon.delay}s`,
      pointerEvents: 'none',
      // Performance optimization: hint browser which properties will change
      willChange: 'transform',
    };

    return (
      <div key={icon.id} style={baseStyle}>
        <svg
          className={icon.type === 'health' ? 'text-primary' : 'text-purple-600'}
          width={isMobile ? '36' : '50'} // Smaller icons on mobile
          height={isMobile ? '36' : '50'}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={svgPath} />
        </svg>
      </div>
    );
  };

  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Don't render if user prefers reduced motion
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((icon) => renderIcon(icon))}
    </div>
  );
}
