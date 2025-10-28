'use client';

import { useState } from 'react';
import { FileUploader, FileList, UploadProgress, ImagePreview, PDFViewer } from '@/components/upload';
import { useFileUpload } from '@/hooks/useFileUpload';

/**
 * Example page demonstrating Google Drive file upload functionality
 * This is a reference implementation showing how to use the upload components
 */
export default function UploadExamplePage() {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  // Example: Custom file upload hook
  const { uploadFile, uploading, progress, error, resetProgress } = useFileUpload({
    endpoint: '/api/upload/material', // Change based on your use case
    maxSize: 100,
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
    ],
    onSuccess: (data) => {
      console.log('Upload successful:', data);
      // Add to uploaded files list
      setUploadedFiles([...uploadedFiles, data.data.uploadResult]);
      resetProgress();
    },
    onError: (error) => {
      console.error('Upload failed:', error);
    },
  });

  const handleFilesSelected = async (files: File[]) => {
    // Example: Upload each file with metadata
    for (const file of files) {
      await uploadFile(file, {
        courseId: 'example-course-id',
        title: file.name,
        description: 'Example upload',
        type: file.type.startsWith('image/') ? 'IMAGE' : 'PDF',
        isFree: false,
        isDownloadable: true,
        order: 0,
      });
    }
  };

  const handleDeleteFile = async (file: any) => {
    const confirmed = confirm(`Delete ${file.name}?`);
    if (confirmed) {
      try {
        const response = await fetch(`/api/upload/${file.fileId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setUploadedFiles(uploadedFiles.filter(f => f.fileId !== file.fileId));
        }
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleDownloadFile = (file: any) => {
    window.open(file.fileUrl, '_blank');
  };

  const handleViewFile = (file: any) => {
    setSelectedFile(file);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Google Drive Upload Example
        </h1>
        <p className="text-gray-600">
          This page demonstrates all the file upload components and features.
        </p>
      </div>

      {/* Upload Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          1. File Upload
        </h2>
        <p className="text-gray-600 mb-4">
          Drag and drop files or click to browse. Supports PDFs, images, and videos.
        </p>

        <FileUploader
          onFilesSelected={handleFilesSelected}
          accept={[
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/gif',
            'video/mp4',
          ]}
          maxFiles={5}
          maxSize={100}
          disabled={uploading}
          label="Upload Files to Google Drive"
          description="Drag and drop files here, or click to browse (Max 100MB)"
        />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </section>

      {/* Progress Section */}
      {progress.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            2. Upload Progress
          </h2>
          <UploadProgress progress={progress} />
        </section>
      )}

      {/* Uploaded Files Section */}
      {uploadedFiles.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            3. Uploaded Files List
          </h2>
          <FileList
            files={uploadedFiles.map(f => ({
              id: f.fileId,
              name: f.fileName,
              size: f.size,
              url: f.fileUrl,
              mimeType: f.mimeType,
              uploadedAt: new Date(),
            }))}
            onDelete={handleDeleteFile}
            onDownload={handleDownloadFile}
            onView={handleViewFile}
            showActions
          />
        </section>
      )}

      {/* File Viewer Section */}
      {selectedFile && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            4. File Preview
          </h2>

          <div className="mb-4 flex items-center justify-between">
            <p className="text-gray-600">
              Viewing: <strong>{selectedFile.fileName}</strong>
            </p>
            <button
              onClick={() => setSelectedFile(null)}
              className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              Close Preview
            </button>
          </div>

          {selectedFile.mimeType.startsWith('image/') && (
            <ImagePreview
              src={selectedFile.fileUrl}
              alt={selectedFile.fileName}
              onDownload={() => handleDownloadFile(selectedFile)}
              onClose={() => setSelectedFile(null)}
            />
          )}

          {selectedFile.mimeType === 'application/pdf' && (
            <PDFViewer
              src={selectedFile.fileUrl}
              title={selectedFile.fileName}
              onDownload={() => handleDownloadFile(selectedFile)}
              height="600px"
            />
          )}
        </section>
      )}

      {/* Code Examples Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          5. Usage Examples
        </h2>

        <div className="space-y-6">
          {/* Example 1 */}
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Example 1: Course Material Upload
            </h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
{`import { useCourseMaterialUpload } from '@/hooks/useFileUpload';

const { uploadFile } = useCourseMaterialUpload(courseId);

await uploadFile(file, {
  courseId,
  title: 'Lecture Notes',
  type: 'PDF',
  isFree: false,
  isDownloadable: true,
});`}
            </pre>
          </div>

          {/* Example 2 */}
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Example 2: Student Submission Upload
            </h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
{`import { useSubmissionUpload } from '@/hooks/useFileUpload';

const { uploadFile } = useSubmissionUpload(
  courseId,
  assignmentId,
  submissionId
);

await uploadFile(file, {
  courseId,
  assignmentId,
  submissionId,
  content: 'My submission text',
});`}
            </pre>
          </div>

          {/* Example 3 */}
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Example 3: Payment Proof Upload
            </h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
{`import { usePaymentProofUpload } from '@/hooks/useFileUpload';

const { uploadFile } = usePaymentProofUpload(paymentId);

await uploadFile(file, { paymentId });`}
            </pre>
          </div>
        </div>
      </section>

      {/* API Endpoints Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          6. Available API Endpoints
        </h2>

        <div className="space-y-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <code className="text-blue-600 font-mono">POST /api/upload/material</code>
            <p className="text-sm text-gray-600 mt-1">Upload course materials</p>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <code className="text-blue-600 font-mono">POST /api/upload/assignment</code>
            <p className="text-sm text-gray-600 mt-1">Upload assignment files</p>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <code className="text-blue-600 font-mono">POST /api/upload/submission</code>
            <p className="text-sm text-gray-600 mt-1">Upload student submissions</p>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <code className="text-blue-600 font-mono">POST /api/upload/payment-proof</code>
            <p className="text-sm text-gray-600 mt-1">Upload payment proofs</p>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <code className="text-blue-600 font-mono">DELETE /api/upload/[fileId]</code>
            <p className="text-sm text-gray-600 mt-1">Delete files</p>
          </div>
        </div>
      </section>

      {/* Documentation Link */}
      <section className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-900 mb-2">
          📚 Complete Documentation
        </h2>
        <p className="text-blue-800">
          See <code>GOOGLE_DRIVE_INTEGRATION.md</code> for complete documentation,
          setup instructions, and advanced usage examples.
        </p>
      </section>
    </div>
  );
}
