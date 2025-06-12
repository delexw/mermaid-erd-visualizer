import type { ParsedERD, ParseError, ParseResult } from '~/types/erd';

import { MermaidERDParser, type IDiagramParser } from './diagramParser';
import { ERDValidator } from './erdValidator';
import { FieldParser } from './fieldParser';
import { RelationshipAnalyzer } from './relationshipAnalyzer';
import { RelationshipParser } from './relationshipParser';
import { TableParser } from './tableParser';

// Factory function to create the parser with all dependencies
export const createMermaidERDParser = (): IDiagramParser => {
  const fieldParser = new FieldParser();
  const tableParser = new TableParser(fieldParser);
  const relationshipAnalyzer = new RelationshipAnalyzer();
  const relationshipParser = new RelationshipParser(relationshipAnalyzer);
  const validator = new ERDValidator();

  return new MermaidERDParser(tableParser, relationshipParser, validator);
};

// Main parser function - maintains backward compatibility
export const parseMermaidERD = (diagramText: string): ParseResult => {
  const parser = createMermaidERDParser();
  return parser.parse(diagramText);
};

// Update validateParsedERD to return warnings instead of errors
export const validateParsedERD = (data: ParsedERD): ParseError[] => {
  const validator = new ERDValidator();
  return validator.validate(data);
};

// Re-export types for convenience
export type { ParsedERD, ParseError, ParseResult };
