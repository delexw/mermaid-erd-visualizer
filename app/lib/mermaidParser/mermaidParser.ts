import type { ParsedERD, ParseError, ParseResult } from '~/types/erd';

import { ERDValidator } from './erdValidator';
import { parseMermaidERDWithJS } from './mermaidJsParser';

/**
 * Parses Mermaid ERD diagram text and returns the parsed data.
 * Uses the Mermaid.js API for parsing.
 */
export async function parseMermaidERD(diagramText: string): Promise<ParseResult> {
  return await parseMermaidERDWithJS(diagramText);
}

// Update validateParsedERD to return warnings instead of errors
export const validateParsedERD = (data: ParsedERD): ParseError[] => {
  const validator = new ERDValidator();
  return validator.validate(data);
};

// Re-export types for convenience
export type { ParsedERD, ParseError, ParseResult };
