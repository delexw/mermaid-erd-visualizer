import type { LoaderFunctionArgs } from '@remix-run/node';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const filePath = url.searchParams.get('filePath');
  
  if (!filePath || typeof filePath !== 'string') {
    return Response.json({ error: 'File path is required' }, { status: 400 });
  }

  try {
    // Clean and validate the file path
    let cleanPath = filePath.replace('file://', '');
    
    // Security check - ensure the file exists and is readable
    if (!existsSync(cleanPath)) {
      return Response.json({ error: 'File not found' }, { status: 404 });
    }

    // Additional security check - only allow certain file extensions
    const ext = path.extname(cleanPath).toLowerCase();
    if (!['.mmd', '.md', '.txt'].includes(ext)) {
      return Response.json({ error: 'Unsupported file type. Only .mmd, .md, and .txt files are allowed.' }, { status: 400 });
    }

    // Read the file content
    const content = await readFile(cleanPath, 'utf8');
    const fileName = path.basename(cleanPath);

    return Response.json({
      success: true,
      content,
      fileName,
    });

  } catch (error) {
    console.error('Error reading file:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('ENOENT')) {
        return Response.json({ error: 'File not found' }, { status: 404 });
      }
      if (error.message.includes('EACCES')) {
        return Response.json({ error: 'Permission denied' }, { status: 403 });
      }
    }

    return Response.json({ error: 'Failed to read file' }, { status: 500 });
  }
} 