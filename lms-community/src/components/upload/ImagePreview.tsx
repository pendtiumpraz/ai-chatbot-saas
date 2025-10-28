'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiX, FiZoomIn, FiDownload } from 'react-icons/fi';

export interface ImagePreviewProps {
  src: string;
  alt: string;
  onClose?: () => void;
  onDownload?: () => void;
  className?: string;
}

export function ImagePreview({
  src,
  alt,
  onClose,
  onDownload,
  className = '',
}: ImagePreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      {/* Thumbnail/Preview */}
      <div className={`relative group ${className}`}>
        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
            title="View full size"
          >
            <FiZoomIn className="w-5 h-5 text-gray-700" />
          </button>

          {onDownload && (
            <button
              onClick={onDownload}
              className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
              title="Download"
            >
              <FiDownload className="w-5 h-5 text-gray-700" />
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
              title="Remove"
            >
              <FiX className="w-5 h-5 text-gray-700" />
            </button>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 p-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-colors"
            >
              <FiX className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
