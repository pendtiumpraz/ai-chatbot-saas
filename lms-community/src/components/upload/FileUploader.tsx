'use client';

import { useRef, ChangeEvent } from 'react';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { FiUploadCloud, FiFile } from 'react-icons/fi';

export interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string[];
  maxFiles?: number;
  maxSize?: number; // in MB
  disabled?: boolean;
  className?: string;
  label?: string;
  description?: string;
}

export function FileUploader({
  onFilesSelected,
  accept,
  maxFiles = 1,
  maxSize = 100,
  disabled = false,
  className = '',
  label = 'Upload Files',
  description = `Drag and drop files here, or click to browse (Max ${maxSize}MB)`,
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isDragging, dragHandlers } = useDragAndDrop({
    onDrop: onFilesSelected,
    maxFiles,
    accept,
  });

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const acceptString = accept?.join(',');

  return (
    <div className={className}>
      <div
        {...dragHandlers}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-8
          transition-all duration-200 cursor-pointer
          ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInputChange}
          accept={acceptString}
          multiple={maxFiles > 1}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-gray-100 rounded-full">
            <FiUploadCloud className="w-12 h-12 text-gray-600" />
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{label}</p>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>

          {accept && accept.length > 0 && (
            <div className="text-xs text-gray-400">
              Accepted formats:{' '}
              {accept
                .map((type) => {
                  const ext = type.split('/')[1];
                  return ext.toUpperCase();
                })
                .join(', ')}
            </div>
          )}
        </div>

        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-90 rounded-lg">
            <p className="text-blue-600 font-semibold">Drop files here</p>
          </div>
        )}
      </div>
    </div>
  );
}
