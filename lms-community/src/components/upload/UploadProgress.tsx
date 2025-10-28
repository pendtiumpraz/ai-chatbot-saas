'use client';

import { UploadProgress as UploadProgressType } from '@/hooks/useFileUpload';
import { FiCheck, FiX, FiLoader } from 'react-icons/fi';

export interface UploadProgressProps {
  progress: UploadProgressType[];
  className?: string;
}

export function UploadProgress({ progress, className = '' }: UploadProgressProps) {
  if (progress.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {progress.map((item, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="flex-shrink-0">
                {item.status === 'uploading' && (
                  <FiLoader className="w-5 h-5 text-blue-600 animate-spin" />
                )}
                {item.status === 'success' && (
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <FiCheck className="w-4 h-4 text-green-600" />
                  </div>
                )}
                {item.status === 'error' && (
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                    <FiX className="w-4 h-4 text-red-600" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.fileName}
                </p>
                {item.status === 'uploading' && (
                  <p className="text-xs text-gray-500">
                    Uploading... {item.progress}%
                  </p>
                )}
                {item.status === 'success' && (
                  <p className="text-xs text-green-600">Upload complete</p>
                )}
                {item.status === 'error' && (
                  <p className="text-xs text-red-600">
                    {item.error || 'Upload failed'}
                  </p>
                )}
              </div>
            </div>

            <div className="text-sm font-semibold ml-4">
              {item.status === 'uploading' && (
                <span className="text-blue-600">{item.progress}%</span>
              )}
              {item.status === 'success' && (
                <span className="text-green-600">✓</span>
              )}
              {item.status === 'error' && (
                <span className="text-red-600">✗</span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          {item.status === 'uploading' && (
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          )}

          {item.status === 'success' && (
            <div className="w-full bg-green-200 rounded-full h-2 overflow-hidden">
              <div className="bg-green-600 h-2 rounded-full w-full" />
            </div>
          )}

          {item.status === 'error' && (
            <div className="w-full bg-red-200 rounded-full h-2 overflow-hidden">
              <div className="bg-red-600 h-2 rounded-full w-full" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
