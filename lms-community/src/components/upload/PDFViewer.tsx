'use client';

import { FiDownload, FiExternalLink } from 'react-icons/fi';

export interface PDFViewerProps {
  src: string;
  title?: string;
  onDownload?: () => void;
  className?: string;
  height?: string;
}

export function PDFViewer({
  src,
  title = 'PDF Document',
  onDownload,
  className = '',
  height = '600px',
}: PDFViewerProps) {
  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>

        <div className="flex items-center space-x-2">
          {onDownload && (
            <button
              onClick={onDownload}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              title="Download PDF"
            >
              <FiDownload className="w-5 h-5" />
            </button>
          )}

          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            title="Open in new tab"
          >
            <FiExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* PDF Viewer */}
      <div style={{ height }}>
        <iframe
          src={`${src}#view=FitH`}
          className="w-full h-full"
          title={title}
        />
      </div>

      {/* Fallback message */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
        <p className="text-xs text-gray-500 text-center">
          Can't see the PDF?{' '}
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Open in new tab
          </a>
          {onDownload && (
            <>
              {' or '}
              <button
                onClick={onDownload}
                className="text-blue-600 hover:text-blue-700 underline"
              >
                download it
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
