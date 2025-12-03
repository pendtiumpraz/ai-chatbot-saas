'use client';

import Image from 'next/image';
import { useState } from 'react';

interface UnsplashImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  overlay?: boolean;
  overlayColor?: string;
}

export default function UnsplashImage({
  src,
  alt,
  className = '',
  priority = false,
  overlay = false,
  overlayColor = 'from-black/60 via-black/30 to-transparent',
}: UnsplashImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={`object-cover transition-all duration-700 ${
          isLoading ? 'scale-110 blur-lg' : 'scale-100 blur-0'
        }`}
        onLoad={() => setIsLoading(false)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {overlay && (
        <div className={`absolute inset-0 bg-gradient-to-t ${overlayColor}`} />
      )}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 animate-pulse" />
      )}
    </div>
  );
}
