import type { ParseResult, Table, Relationship } from '~/types/erd';

import type { IValidator } from './erdValidator';
import type { IRelationshipParser } from './relationshipParser';
import type { ITableParser } from './tableParser';
import { WarningCollector, type IWarningCollector } from './warningCollector';

export interface IDiagramParser {
  parse(diagramText: string): ParseResult;
}

export class MermaidERDParser implements IDiagramParser {
  constructor(
    private tableParser: ITableParser,
    private relationshipParser: IRelationshipParser,
    private validator: IValidator
  ) {}

  parse(diagramText: string): ParseResult {
    const warningCollector = new WarningCollector();
    const tables: Table[] = [];
    const relationships: Relationship[] = [];

    try {
      // Check if it's an ER diagram
      if (!diagramText.includes('erDiagram')) {
        warningCollector.addWarning(1, 'Not a valid Mermaid ER diagram. Must contain "erDiagram"');
      }

      // Two-pass parsing approach for better robustness
      this.extractAndParseTables(diagramText, tables, warningCollector);
      this.extractAndParseRelationships(diagramText, relationships, warningCollector);
      this.createImplicitTables(tables, relationships);

      // After parsing, validate and collect additional warnings
      const validationWarnings = this.validator.validate({
        tables,
        relationships,
        originalDiagram: diagramText,
      });

      // Combine parsing warnings with validation warnings
      const allWarnings = [...warningCollector.getWarnings(), ...validationWarnings];

      // Debug logging for final results
      console.log(
        `[Parser] Parsed ${tables.length} tables and ${relationships.length} relationships`
      );
      if (allWarnings.length > 0) {
        console.log(`[Parser] Generated ${allWarnings.length} warnings`);
      }

      // Always return success, with warnings included in the data
      return {
        success: true,
        data: {
          tables,
          relationships,
          originalDiagram: diagramText,
          warnings: allWarnings,
        },
      };
    } catch (error) {
      // Even catch blocks should return success with warnings
      console.error('[Parser] Unexpected error:', error);

      return {
        success: true,
        data: {
          tables,
          relationships,
          originalDiagram: diagramText,
          warnings: [
            {
              line: 0,
              message: `Parser error: ${error instanceof Error ? error.message : 'Unknown error'}`,
              type: 'warning',
            },
          ],
        },
      };
    }
  }

  /**
   * Extract and parse table blocks using regex-based approach
   * This is much more robust than line-by-line state management
   */
  private extractAndParseTables(
    diagramText: string,
    tables: Table[],
    warningCollector: IWarningCollector
  ): void {
    // Extract all table blocks using regex
    // This pattern matches: tableName { ... content ... }
    // It handles nested braces and multiline content properly
    const tableBlocks = this.extractTableBlocks(diagramText);

    console.log(`[Parser] Found ${tableBlocks.length} table blocks`);

    tableBlocks.forEach(block => {
      try {
        const table = this.tableParser.parseTable(block.content, warningCollector);
        if (table) {
          // Check for duplicates
          if (tables.some(t => t.id === table.id)) {
            warningCollector.addWarning(
              block.lineNumber,
              `Duplicate table definition: ${table.id}`,
              block.content
            );
            return;
          }
          tables.push(table);
          console.log(
            `[Parser] Successfully parsed table: ${table.name} with ${table.fields.length} fields`
          );
        } else {
          warningCollector.addWarning(
            block.lineNumber,
            'Failed to parse table block',
            block.content
          );
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        warningCollector.addWarning(
          block.lineNumber,
          `Error parsing table: ${errorMessage}`,
          block.content
        );
      }
    });
  }

  /**
   * Extract table blocks using a robust regex-based approach
   */
  private extractTableBlocks(diagramText: string): Array<{ content: string; lineNumber: number }> {
    const blocks: Array<{ content: string; lineNumber: number }> = [];

    // First, try to extract single-line tables using regex
    const singleLineTableRegex = /(\w+)\s*\{\s*([^}]*)\s*\}/g;
    const lines = diagramText.split('\n');

    // Track which lines have been processed as single-line tables
    const processedLines = new Set<number>();

    // Extract single-line tables first
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('%%') || trimmedLine.startsWith('erDiagram')) {
        return;
      }

      // Check for single-line tables
      let match;
      singleLineTableRegex.lastIndex = 0; // Reset regex
      while ((match = singleLineTableRegex.exec(trimmedLine)) !== null) {
        const tableName = match[1];
        const tableContent = match[2].trim();

        // Reconstruct the complete table block
        const completeBlock = `${tableName} {\n${tableContent ? '    ' + tableContent : ''}\n}`;

        blocks.push({
          content: completeBlock,
          lineNumber: index + 1,
        });

        processedLines.add(index);
      }
    });

    // Then extract multi-line tables
    let i = 0;
    while (i < lines.length) {
      // Skip lines already processed as single-line tables
      if (processedLines.has(i)) {
        i++;
        continue;
      }

      const line = lines[i].trim();

      // Skip empty lines, comments, and erDiagram declaration
      if (!line || line.startsWith('%%') || line.startsWith('erDiagram')) {
        i++;
        continue;
      }

      // Check if this line starts a multi-line table definition
      const tableStartMatch = line.match(/^(\w+)\s*\{\s*$/);
      if (tableStartMatch) {
        const startLineNumber = i + 1;
        const tableBlock = this.extractCompleteTableBlock(lines, i);

        if (tableBlock) {
          blocks.push({
            content: tableBlock.content,
            lineNumber: startLineNumber,
          });

          // Mark all lines in this block as processed
          for (let j = i; j <= tableBlock.endIndex; j++) {
            processedLines.add(j);
          }

          i = tableBlock.endIndex + 1; // Move past this block
        } else {
          // Malformed table block
          i++;
        }
      } else {
        i++;
      }
    }

    return blocks;
  }

  /**
   * Extract a complete table block starting from a given line index
   */
  private extractCompleteTableBlock(
    lines: string[],
    startIndex: number
  ): { content: string; endIndex: number } | null {
    const tableLines: string[] = [];
    let braceCount = 0;
    let i = startIndex;

    while (i < lines.length) {
      const line = lines[i];
      tableLines.push(line);

      // Count braces to determine when the table block ends
      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;
      braceCount += openBraces - closeBraces;

      // If braces are balanced, we've found the complete block
      if (braceCount === 0) {
        return {
          content: tableLines.join('\n'),
          endIndex: i,
        };
      }

      // Safety check to prevent infinite loops
      if (braceCount < 0) {
        // Malformed block - too many closing braces
        return null;
      }

      i++;
    }

    // Reached end of input without closing the block
    return null;
  }

  /**
   * Extract and parse relationship definitions
   */
  private extractAndParseRelationships(
    diagramText: string,
    relationships: Relationship[],
    warningCollector: IWarningCollector
  ): void {
    const lines = diagramText.split('\n');

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      const lineNumber = index + 1;

      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('%%')) return;

      // Check for relationship definitions using the existing pattern
      if (trimmedLine.match(/[A-Z0-9_-]+\s+[|o}{]+[.-]+[|o}{]+\s+[A-Z0-9_-]+\s*:/i)) {
        try {
          const relationship = this.relationshipParser.parseRelationship(
            trimmedLine,
            warningCollector
          );
          if (relationship) {
            // Check for duplicates
            if (relationships.some(r => r.id === relationship.id)) {
              warningCollector.addWarning(
                lineNumber,
                'Duplicate relationship definition',
                trimmedLine
              );
              return;
            }
            relationships.push(relationship);
            console.log(`[Parser] Successfully parsed relationship: ${relationship.id}`);
          } else {
            warningCollector.addWarning(lineNumber, 'Failed to parse relationship', trimmedLine);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          warningCollector.addWarning(
            lineNumber,
            `Error parsing relationship: ${errorMessage}`,
            trimmedLine
          );
        }
      }
    });
  }

  private createImplicitTables(tables: Table[], relationships: Relationship[]): void {
    // If no explicit tables were found but we have relationships, create implicit tables
    if (tables.length === 0 && relationships.length > 0) {
      const implicitTableNames = new Set<string>();

      // Collect all table names from relationships
      relationships.forEach(rel => {
        implicitTableNames.add(rel.fromTable);
        implicitTableNames.add(rel.toTable);
      });

      // Create implicit tables with basic structure
      implicitTableNames.forEach(tableName => {
        tables.push({
          id: tableName,
          name: tableName,
          modelPath: '', // Empty model path for implicit tables
          fields: [], // Empty fields for implicit tables
        });
      });
    }
  }
}
