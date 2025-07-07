import { parseMermaidERD } from '~/lib/mermaidParser/mermaidParser';
import type { ParsedERD, ParseError } from '~/types/erd';

export interface FileLoadResult {
  success: boolean;
  data?: ParsedERD;
  errors?: ParseError[];
  fileName?: string;
}

interface FileSystemError extends Error {
  code?: string;
  path?: string;
}

class FileLoaderError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly filePath?: string
  ) {
    super(message);
    this.name = 'FileLoaderError';
  }
}

/**
 * Loads and parses a Mermaid ERD file from the file system.
 * This function is designed to work in both Node.js and browser environments.
 */
export async function loadERDFile(filePath: string): Promise<FileLoadResult> {
  try {
    const text = await loadFileContent(filePath);
    return await parseERDContent(text, filePath);
  } catch (error) {
    return createErrorResult(error, filePath);
  }
}

/**
 * Loads file content from either browser or Node.js environment
 */
async function loadFileContent(filePath: string): Promise<string> {
  if (typeof window !== 'undefined') {
    return await loadFileFromBrowser(filePath);
  } else {
    return await loadFileFromNodeJS(filePath);
  }
}

/**
 * Loads file content using fetch API in browser environment
 */
async function loadFileFromBrowser(filePath: string): Promise<string> {
  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new FileLoaderError(
        `Failed to load file: ${filePath}. Status: ${response.status} ${response.statusText}`,
        'FETCH_ERROR',
        filePath
      );
    }

    return await response.text();
  } catch (error) {
    if (error instanceof FileLoaderError) {
      throw error;
    }

    throw new FileLoaderError(
      `Network error loading file: ${filePath}. ${error instanceof Error ? error.message : 'Unknown error'}`,
      'NETWORK_ERROR',
      filePath
    );
  }
}

/**
 * Loads file content using fs module in Node.js environment
 */
async function loadFileFromNodeJS(filePath: string): Promise<string> {
  try {
    const fs = await import('fs');
    const path = await import('path');

    const resolvedPath = path.resolve(filePath);

    // Use fs.promises for proper async/await
    try {
      await fs.promises.access(resolvedPath, fs.constants.F_OK);
    } catch {
      throw new FileLoaderError(`File not found: ${filePath}`, 'FILE_NOT_FOUND', filePath);
    }

    return await fs.promises.readFile(resolvedPath, 'utf-8');
  } catch (error) {
    if (error instanceof FileLoaderError) {
      throw error;
    }

    const fsError = error as FileSystemError;
    const errorCode = fsError.code || 'FS_ERROR';
    const errorMessage =
      fsError.code === 'ENOENT'
        ? `File not found: ${filePath}`
        : `File system error: ${fsError.message}`;

    throw new FileLoaderError(errorMessage, errorCode, filePath);
  }
}

/**
 * Parses ERD content from text using async/await pattern
 */
async function parseERDContent(text: string, filePath: string): Promise<FileLoadResult> {
  const fileName = extractFileName(filePath);

  try {
    validateERDContent(text);
    const parseResult = await parseMermaidERD(text);

    if (!parseResult.success) {
      return createFailureResult(parseResult.errors, fileName);
    }

    return createSuccessResult(parseResult.data, fileName);
  } catch (error) {
    const parseError: ParseError = {
      line: 0,
      message: error instanceof Error ? error.message : 'Unknown parse error',
    };

    return createFailureResult([parseError], fileName);
  }
}

/**
 * Validates ERD content before parsing
 */
function validateERDContent(text: string): void {
  if (!text || text.trim().length === 0) {
    throw new Error('File is empty or contains only whitespace');
  }

  if (!text.trim().startsWith('erDiagram')) {
    throw new Error('File does not contain valid Mermaid ERD syntax. Must start with "erDiagram"');
  }
}

/**
 * Extracts filename from file path
 */
function extractFileName(filePath: string): string {
  return filePath.split('/').pop() || filePath.split('\\').pop() || filePath;
}

/**
 * Creates a success result object
 */
function createSuccessResult(data: ParsedERD, fileName: string): FileLoadResult {
  return {
    success: true,
    data,
    fileName,
  };
}

/**
 * Creates a failure result object
 */
function createFailureResult(errors: ParseError[], fileName?: string): FileLoadResult {
  return {
    success: false,
    errors,
    fileName,
  };
}

/**
 * Creates an error result from various error types
 */
function createErrorResult(error: unknown, filePath?: string): FileLoadResult {
  const fileName = filePath ? extractFileName(filePath) : undefined;

  if (error instanceof FileLoaderError) {
    const parseError: ParseError = {
      line: 0,
      message: error.message,
    };
    return createFailureResult([parseError], fileName);
  }

  const parseError: ParseError = {
    line: 0,
    message: error instanceof Error ? error.message : 'Unknown error occurred',
  };

  return createFailureResult([parseError], fileName);
}

/**
 * Validates if a file path is safe and supported
 */
export function validateFilePath(filePath: string): { valid: boolean; error?: string } {
  try {
    validateFilePathString(filePath);
    validateFileExtension(filePath);
    validatePathSecurity(filePath);

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid file path',
    };
  }
}

/**
 * Validates file path string format
 */
function validateFilePathString(filePath: string): void {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('File path must be a non-empty string');
  }

  if (filePath.trim().length === 0) {
    throw new Error('File path cannot be empty or whitespace only');
  }
}

/**
 * Validates file extension is supported
 */
function validateFileExtension(filePath: string): void {
  const supportedExtensions = ['.mmd', '.md', '.txt'];
  const hasValidExtension = supportedExtensions.some(ext => filePath.toLowerCase().endsWith(ext));

  if (!hasValidExtension) {
    throw new Error(
      `Unsupported file type. Please use files with extensions: ${supportedExtensions.join(', ')}`
    );
  }
}

/**
 * Validates path security (prevents directory traversal attacks)
 */
function validatePathSecurity(filePath: string): void {
  // Prevent directory traversal
  if (filePath.includes('..')) {
    throw new Error('File path contains directory traversal characters (..)');
  }
}
