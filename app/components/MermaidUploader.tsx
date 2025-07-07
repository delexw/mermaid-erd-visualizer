import React, { useState, useCallback, useRef } from 'react';

import {
  parseMermaidERD,
  type ParsedERD,
  type ParseError,
} from '~/lib/mermaidParser/mermaidParser';

interface MermaidUploaderProps {
  onDataParsed: (data: ParsedERD) => void;
  onError: (errors: ParseError[]) => void;
}

export function MermaidUploader({ onDataParsed, onError }: MermaidUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const dragCounter = useRef(0);

  const processFile = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      setUploadedFileName(file.name);

      try {
        const text = await file.text();
        const parseResult = await parseMermaidERD(text);

        if (!parseResult.success) {
          onError(parseResult.errors);
          return;
        }

        // Parse was successful - load the data even if there are warnings
        // Warnings will be displayed in the sidebar
        onDataParsed(parseResult.data);
      } catch (error) {
        onError([
          {
            line: 0,
            message: `File processing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ]);
      } finally {
        setIsProcessing(false);
      }
    },
    [onDataParsed, onError]
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    dragCounter.current += 1;
    if (dragCounter.current === 1) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      // Reset drag state
      dragCounter.current = 0;
      setIsDragOver(false);

      const dataTransfer = event.dataTransfer;

      // ✅ UNIVERSAL: Use browser's secure File API (works in all browsers)
      if (dataTransfer.files && dataTransfer.files.length > 0) {
        const file = dataTransfer.files[0];

        // ✅ SECURITY: Validate file type (don't trust extensions in paths)
        const validExtensions = ['.mmd', '.md', '.txt'];
        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

        if (!validExtensions.includes(fileExtension)) {
          onError([
            {
              line: 0,
              message: `Unsupported file type: ${fileExtension}. Please use .mmd, .md, or .txt files.`,
            },
          ]);
          return;
        }

        // ✅ SECURITY: Validate file size (prevent memory exhaustion)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          onError([
            {
              line: 0,
              message: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum size is 10MB.`,
            },
          ]);
          return;
        }

        // ✅ UNIVERSAL: Use FileReader API for client-side processing
        processFile(file);
        return;
      }

      // ✅ UNIVERSAL: Handle text content (but validate it's actual content, not paths)
      if (dataTransfer.types.includes('text/plain')) {
        const text = dataTransfer.getData('text/plain');

        // ✅ SECURITY: Only accept actual Mermaid content, not file paths
        if (text.trim().startsWith('erDiagram')) {
          // Create a virtual file from the content
          const fileName = 'pasted-content.mmd';
          const file = new File([text], fileName, { type: 'text/plain' });
          processFile(file);
          return;
        }

        // 🚫 REJECT: File paths, URLs, or other non-content data
        if (text.includes('/') || text.includes('\\') || text.startsWith('file://')) {
          onError([
            {
              line: 0,
              message:
                'File paths are not supported for security reasons. Please drag the actual file from your file system.',
            },
          ]);
          return;
        }
      }

      // ❌ REJECT: All other drag types with helpful guidance
      onError([
        {
          line: 0,
          message:
            'For security reasons, only direct file system drags are supported. Please drag the file from Finder/Explorer, or use the browse button to select your file.',
        },
      ]);
    },
    [processFile, onError]
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isProcessing ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".mmd,.txt,.md"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="space-y-2">
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600">Processing {uploadedFileName}...</p>
            </>
          ) : (
            <>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900">Upload Mermaid ERD File</p>
                <p className="text-xs text-gray-500 mt-1">
                  Drop a .mmd, .txt, or .md file here, or click to browse
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Supported formats: Mermaid ERD diagrams (.mmd, .txt, .md)</p>
        <p className="mt-1">
          File should start with <code className="bg-gray-100 px-1 rounded">erDiagram</code>
        </p>
      </div>
    </div>
  );
}

// Error display component
interface ParseErrorDisplayProps {
  errors: ParseError[];
  onDismiss: () => void;
}

export function ParseErrorDisplay({ errors, onDismiss }: ParseErrorDisplayProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Parse Errors ({errors.length})</h3>
            <div className="mt-2">
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="flex flex-col">
                    <span>
                      {error.line > 0 && `Line ${error.line}: `}
                      {error.message}
                    </span>
                    {error.context && (
                      <code className="mt-1 text-xs bg-red-100 px-2 py-1 rounded">
                        {error.context}
                      </code>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <button onClick={onDismiss} className="flex-shrink-0 text-red-400 hover:text-red-600">
          <span className="sr-only">Dismiss</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Success display component
interface ParseSuccessDisplayProps {
  data: ParsedERD;
  onDismiss: () => void;
}

export function ParseSuccessDisplay({ data, onDismiss }: ParseSuccessDisplayProps) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Successfully Parsed ERD</h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                Found {data.tables.length} tables and {data.relationships.length} relationships
              </p>
            </div>
          </div>
        </div>
        <button onClick={onDismiss} className="flex-shrink-0 text-green-400 hover:text-green-600">
          <span className="sr-only">Dismiss</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
