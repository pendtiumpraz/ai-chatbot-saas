'use client';

import { useState, useCallback, DragEvent } from 'react';

export interface UseDragAndDropOptions {
  onDrop: (files: File[]) => void;
  maxFiles?: number;
  accept?: string[];
}

export function useDragAndDrop(options: UseDragAndDropOptions) {
  const { onDrop, maxFiles, accept } = options;
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);

      // Filter by accepted types
      let filteredFiles = droppedFiles;
      if (accept && accept.length > 0) {
        filteredFiles = droppedFiles.filter((file) =>
          accept.some((type) => {
            if (type.endsWith('/*')) {
              const category = type.split('/')[0];
              return file.type.startsWith(category + '/');
            }
            return file.type === type;
          })
        );
      }

      // Limit number of files
      if (maxFiles) {
        filteredFiles = filteredFiles.slice(0, maxFiles);
      }

      if (filteredFiles.length > 0) {
        onDrop(filteredFiles);
      }
    },
    [onDrop, maxFiles, accept]
  );

  return {
    isDragging,
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
  };
}
