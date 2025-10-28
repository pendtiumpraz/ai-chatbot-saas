'use client';

import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface UseFileUploadOptions {
  endpoint: string;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useFileUpload(options: UseFileUploadOptions) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    endpoint,
    maxSize = 100,
    allowedTypes,
    onSuccess,
    onError,
  } = options;

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file size
      const maxSizeInBytes = maxSize * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        return `File size must be less than ${maxSize}MB`;
      }

      // Check file type
      if (allowedTypes && !allowedTypes.includes(file.type)) {
        return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
      }

      return null;
    },
    [maxSize, allowedTypes]
  );

  const uploadFile = useCallback(
    async (file: File, additionalData?: Record<string, any>) => {
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        const errorMsg = validationError;
        setError(errorMsg);
        toast.error(errorMsg);
        onError?.(errorMsg);
        return null;
      }

      setUploading(true);
      setError(null);

      // Add to progress tracker
      setProgress((prev) => [
        ...prev,
        {
          fileName: file.name,
          progress: 0,
          status: 'uploading',
        },
      ]);

      try {
        const formData = new FormData();
        formData.append('file', file);

        // Add additional data to form
        if (additionalData) {
          Object.entries(additionalData).forEach(([key, value]) => {
            formData.append(key, String(value));
          });
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        // Update progress to success
        setProgress((prev) =>
          prev.map((p) =>
            p.fileName === file.name
              ? { ...p, progress: 100, status: 'success' }
              : p
          )
        );

        toast.success(`${file.name} uploaded successfully`);
        onSuccess?.(data);

        return data;
      } catch (err: any) {
        const errorMsg = err.message || 'Upload failed';
        setError(errorMsg);

        // Update progress to error
        setProgress((prev) =>
          prev.map((p) =>
            p.fileName === file.name
              ? { ...p, status: 'error', error: errorMsg }
              : p
          )
        );

        toast.error(errorMsg);
        onError?.(errorMsg);

        return null;
      } finally {
        setUploading(false);
      }
    },
    [endpoint, validateFile, onSuccess, onError]
  );

  const uploadMultiple = useCallback(
    async (files: File[], additionalData?: Record<string, any>) => {
      const results = [];

      for (const file of files) {
        const result = await uploadFile(file, additionalData);
        results.push(result);
      }

      return results;
    },
    [uploadFile]
  );

  const resetProgress = useCallback(() => {
    setProgress([]);
    setError(null);
  }, []);

  return {
    uploadFile,
    uploadMultiple,
    uploading,
    progress,
    error,
    resetProgress,
  };
}

// Hook for uploading course materials
export function useCourseMaterialUpload(courseId: string) {
  return useFileUpload({
    endpoint: '/api/upload/material',
    maxSize: 100,
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
    ],
  });
}

// Hook for uploading assignment files
export function useAssignmentUpload(courseId: string, assignmentId: string) {
  return useFileUpload({
    endpoint: '/api/upload/assignment',
    maxSize: 50,
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'text/plain',
    ],
  });
}

// Hook for uploading submissions
export function useSubmissionUpload(
  courseId: string,
  assignmentId: string,
  submissionId: string
) {
  return useFileUpload({
    endpoint: '/api/upload/submission',
    maxSize: 50,
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'text/plain',
    ],
  });
}

// Hook for uploading payment proofs
export function usePaymentProofUpload(paymentId: string) {
  return useFileUpload({
    endpoint: '/api/upload/payment-proof',
    maxSize: 10,
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ],
  });
}
