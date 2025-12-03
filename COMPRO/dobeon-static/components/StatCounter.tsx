'use client';

import { useEffect, useState, useRef, useCallback, memo } from 'react';

interface StatCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description?: string;
  gradient?: 'blue';
  icon?: React.ReactNode;
}

function StatCounter({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  label,
  description,
  gradient = 'blue',
  icon,
}: StatCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const gradientClasses = {
    blue: 'text-gradient-blue',
  };

  // Memoize animation function to prevent re-creation
  const animateCounter = useCallback(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCounter = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);

      setCount(currentCount);

      if (now < endTime) {
        animationFrameRef.current = requestAnimationFrame(updateCounter);
      } else {
        setCount(end);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateCounter);
  }, [duration, end]);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(end);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounter();
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
      observer.disconnect();
      // Cleanup animation frame on unmount
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [hasAnimated, animateCounter, end]);

  return (
    <div
      ref={counterRef}
      className="text-center group hover:transform hover:scale-105 transition-all duration-300"
    >
      {icon && (
        <div className="mb-4 text-primary flex justify-center transform group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      )}
      <div className={`text-5xl md:text-6xl font-bold mb-2 ${gradientClasses[gradient]}`}>
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">{label}</div>
      {description && <p className="text-gray-600 leading-relaxed">{description}</p>}
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(StatCounter);
