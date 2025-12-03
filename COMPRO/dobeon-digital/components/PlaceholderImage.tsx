'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useInView, getAnimationClasses } from '@/lib/animations';

interface PlaceholderImageProps {
  type?: 'healthcare' | 'tech' | 'data' | 'team' | 'service' | 'abstract';
  aspectRatio?: '16/9' | '4/3' | '1/1' | '3/4';
  className?: string;
  showIcon?: boolean;
}

const imageMap = {
  healthcare: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80',
  tech: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
  data: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
  team: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
  service: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&q=80',
  abstract: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80',
};

export default function PlaceholderImage({
  type = 'abstract',
  aspectRatio = '16/9',
  className = '',
}: PlaceholderImageProps) {
  const { ref, isInView } = useInView();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`relative overflow-hidden rounded-2xl shadow-xl ${className} ${getAnimationClasses('scaleIn', isInView)}`}
      style={{ aspectRatio }}
    >
      <Image
        src={imageMap[type]}
        alt={`${type} illustration`}
        fill
        className={`object-cover transition-all duration-700 ${
          isLoading ? 'scale-110 blur-lg' : 'scale-100 blur-0'
        }`}
        onLoad={() => setIsLoading(false)}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-cyan-500 animate-pulse flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
