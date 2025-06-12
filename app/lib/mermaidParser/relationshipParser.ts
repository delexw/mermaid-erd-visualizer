import type { Relationship } from '~/types/erd';

import type { IRelationshipAnalyzer } from './relationshipAnalyzer';
import type { IWarningCollector } from './warningCollector';

export interface IRelationshipParser {
  parseRelationship(line: string, warningCollector: IWarningCollector): Relationship | null;
}

export class RelationshipParser implements IRelationshipParser {
  constructor(private relationshipAnalyzer: IRelationshipAnalyzer) {}

  parseRelationship(line: string): Relationship | null {
    // Enhanced regex to handle more relationship patterns with proper grouping
    const relationshipRegex =
      /^\s*([A-Z0-9_-]+)\s+([|o}{]+[.-]+[|o}{]+)\s+([A-Z0-9_-]+)\s*:\s*(.*)$/i;
    const match = line.match(relationshipRegex);

    if (!match) {
      console.warn(`[Parser] Failed to parse relationship line: ${line}`);
      return null;
    }

    const [, fromTable, relationshipType, toTable, description] = match;

    // Analyze the relationship type using the sophisticated analyzer
    const analysis = this.relationshipAnalyzer.analyzeRelationshipType(relationshipType.trim());

    // Create a unique ID that includes a hash of the description to handle multiple relationships between same tables
    const descriptionHash = description
      .trim()
      .split('')
      .reduce((hash, char) => {
        return ((hash << 5) - hash + char.charCodeAt(0)) & 0xffffffff;
      }, 0);

    return {
      id: `${fromTable}_${toTable}_${Math.abs(descriptionHash)}`,
      fromTable: fromTable,
      toTable: toTable,
      type: analysis.relationshipType,
      description: description.trim(),
      isIdentifying: analysis.isIdentifying,
      leftCardinality: analysis.leftCardinality,
      rightCardinality: analysis.rightCardinality,
    };
  }
}
