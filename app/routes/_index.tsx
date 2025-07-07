import type { MetaFunction } from '@remix-run/node';
import { useSearchParams } from '@remix-run/react';
import { useCallback } from 'react';

import MainAppView from '~/components/MainAppView';
import { loadERDFile, validateFilePath } from '~/lib/fileLoader';
import type { ParsedERD, ParseError } from '~/lib/mermaidParser/mermaidParser';

export const meta: MetaFunction = () => {
  return [
    { title: 'ERD Explorer - Marketplace Database Schema' },
    {
      name: 'description',
      content:
        'Interactive Entity Relationship Diagram viewer for the Envato Marketplace database schema',
    },
  ];
};

export default function Index() {
  const [searchParams] = useSearchParams();

  // Auto-load file from URL parameters
  const handleAutoLoad = useCallback(async (): Promise<{ success: boolean; data?: ParsedERD; errors?: ParseError[] }> => {
    const filePath = searchParams.get('file');
    if (!filePath) {
      return {
        success: false,
        errors: [{ line: 0, message: 'No file path provided' }],
      };
    }

    // Validate file path
    const validation = validateFilePath(filePath);
    if (!validation.valid) {
      return {
        success: false,
        errors: [{ line: 0, message: validation.error || 'Invalid file path' }],
      };
    }

    // Load the file
    return loadERDFile(filePath).then(result => {
      if (result.success && result.data) {
        return {
          success: true,
          data: result.data,
        };
      } else {
        return {
          success: false,
          errors: result.errors || [{ line: 0, message: 'Failed to load ERD file' }],
        };
      }
    }).catch(error => {
      return {
        success: false,
        errors: [
          {
            line: 0,
            message: `Error loading file: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
      };
    });
  }, [searchParams]);

  const filePath = searchParams.get('file');
  const autoLoadInfo = filePath ? {
    shouldAutoLoad: true,
    loadingMessage: `Auto-loading diagram from: ${filePath}`,
  } : undefined;

  return (
    <MainAppView 
      onAutoLoad={autoLoadInfo ? handleAutoLoad : undefined}
      autoLoadInfo={autoLoadInfo}
    />
  );
}
