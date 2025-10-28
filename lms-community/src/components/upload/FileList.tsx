'use client';

import { FiFile, FiTrash2, FiDownload, FiEye } from 'react-icons/fi';
import { formatBytes } from '@/lib/utils/format';

export interface FileItem {
  id?: string;
  name: string;
  size: number;
  url?: string;
  mimeType?: string;
  uploadedAt?: Date | string;
}

export interface FileListProps {
  files: FileItem[];
  onDelete?: (file: FileItem) => void;
  onDownload?: (file: FileItem) => void;
  onView?: (file: FileItem) => void;
  showActions?: boolean;
  className?: string;
}

export function FileList({
  files,
  onDelete,
  onDownload,
  onView,
  showActions = true,
  className = '',
}: FileListProps) {
  if (files.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        No files uploaded yet
      </div>
    );
  }

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return <FiFile className="w-6 h-6" />;

    if (mimeType.startsWith('image/')) {
      return <span className="text-2xl">🖼️</span>;
    }
    if (mimeType.startsWith('video/')) {
      return <span className="text-2xl">🎥</span>;
    }
    if (mimeType === 'application/pdf') {
      return <span className="text-2xl">📄</span>;
    }
    if (
      mimeType.includes('word') ||
      mimeType.includes('document')
    ) {
      return <span className="text-2xl">📝</span>;
    }
    if (mimeType.includes('sheet') || mimeType.includes('excel')) {
      return <span className="text-2xl">📊</span>;
    }
    if (
      mimeType.includes('presentation') ||
      mimeType.includes('powerpoint')
    ) {
      return <span className="text-2xl">📽️</span>;
    }
    if (mimeType === 'application/zip') {
      return <span className="text-2xl">📦</span>;
    }

    return <FiFile className="w-6 h-6" />;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {files.map((file, index) => (
        <div
          key={file.id || index}
          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="flex-shrink-0">
              {getFileIcon(file.mimeType)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{formatBytes(file.size)}</span>
                {file.uploadedAt && (
                  <>
                    <span>•</span>
                    <span>
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {showActions && (
            <div className="flex items-center space-x-2 ml-4">
              {onView && file.url && (
                <button
                  onClick={() => onView(file)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View file"
                >
                  <FiEye className="w-5 h-5" />
                </button>
              )}

              {onDownload && file.url && (
                <button
                  onClick={() => onDownload(file)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Download file"
                >
                  <FiDownload className="w-5 h-5" />
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => onDelete(file)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete file"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
