import type { Relationship, CardinalityInfo } from "~/types/erd";

export interface RelationshipTypeAnalysis {
  leftCardinality: CardinalityInfo;
  rightCardinality: CardinalityInfo;
  relationshipType: Relationship['type'];
  isIdentifying: boolean; // true for solid lines (--), false for dotted lines (..)
  isValid: boolean;
  error?: string;
}

export interface IRelationshipAnalyzer {
  analyzeRelationshipType(relationshipType: string): RelationshipTypeAnalysis;
}

export class RelationshipAnalyzer implements IRelationshipAnalyzer {
  private readonly CARDINALITY_PATTERNS: Array<{ pattern: RegExp; type: CardinalityInfo['type']; marker: string }> = [
    { pattern: /\|o/, type: 'zero-or-one', marker: '|o' },
    { pattern: /o\|/, type: 'zero-or-one', marker: 'o|' },
    { pattern: /\|\|/, type: 'exactly-one', marker: '||' },
    { pattern: /\}o/, type: 'zero-or-more', marker: '}o' },
    { pattern: /o\{/, type: 'zero-or-more', marker: 'o{' },
    { pattern: /\}\|/, type: 'one-or-more', marker: '}|' },
    { pattern: /\|\{/, type: 'one-or-more', marker: '|{' },
  ];

  private readonly CARDINALITY_TO_RELATIONSHIP: Record<string, Relationship['type']> = {
    'exactly-one:zero-or-one': 'one-to-many',
    'exactly-one:exactly-one': 'one-to-one',
    'exactly-one:zero-or-more': 'one-to-many',
    'exactly-one:one-or-more': 'one-to-many',
    'zero-or-one:exactly-one': 'one-to-many',
    'zero-or-one:zero-or-one': 'one-to-one',
    'zero-or-one:zero-or-more': 'one-to-many',
    'zero-or-one:one-or-more': 'one-to-many',
    'zero-or-more:exactly-one': 'one-to-many',
    'zero-or-more:zero-or-one': 'one-to-many',
    'zero-or-more:zero-or-more': 'many-to-many',
    'zero-or-more:one-or-more': 'many-to-many',
    'one-or-more:exactly-one': 'one-to-many',
    'one-or-more:zero-or-one': 'one-to-many',
    'one-or-more:zero-or-more': 'many-to-many',
    'one-or-more:one-or-more': 'many-to-many',
  };

  analyzeRelationshipType(relationshipType: string): RelationshipTypeAnalysis {
    // Enhanced regex to capture the relationship pattern more precisely
    // Pattern: leftMarker + connectors + rightMarker
    const relationshipRegex = /^([|o}{]+)([\.\-]+)([|o}{]+)$/;
    const match = relationshipType.match(relationshipRegex);

    if (!match) {
      return {
        leftCardinality: { type: 'exactly-one', marker: '||' },
        rightCardinality: { type: 'zero-or-more', marker: 'o{' },
        relationshipType: 'one-to-many',
        isIdentifying: false,
        isValid: false,
        error: `Invalid relationship pattern: ${relationshipType}`
      };
    }

    const [, leftMarker, connector, rightMarker] = match;

    // Analyze connector type to determine if relationship is identifying
    const isIdentifying = connector.includes('-'); // Solid lines use '-', dotted lines use '.'

    // Analyze left cardinality
    const leftCardinality = this.analyzeCardinality(leftMarker, 'left');
    if (!leftCardinality.isValid) {
      return {
        leftCardinality: { type: 'exactly-one', marker: '||' },
        rightCardinality: { type: 'zero-or-more', marker: 'o{' },
        relationshipType: 'one-to-many',
        isIdentifying: isIdentifying,
        isValid: false,
        error: `Invalid left cardinality marker: ${leftMarker}`
      };
    }

    // Analyze right cardinality
    const rightCardinality = this.analyzeCardinality(rightMarker, 'right');
    if (!rightCardinality.isValid) {
      return {
        leftCardinality: leftCardinality.cardinality!,
        rightCardinality: { type: 'zero-or-more', marker: 'o{' },
        relationshipType: 'one-to-many',
        isIdentifying: isIdentifying,
        isValid: false,
        error: `Invalid right cardinality marker: ${rightMarker}`
      };
    }

    // Determine relationship type from cardinality combination
    const cardinalityKey = `${leftCardinality.cardinality!.type}:${rightCardinality.cardinality!.type}`;
    const relationshipTypeResult = this.CARDINALITY_TO_RELATIONSHIP[cardinalityKey];

    if (!relationshipTypeResult) {
      return {
        leftCardinality: leftCardinality.cardinality!,
        rightCardinality: rightCardinality.cardinality!,
        relationshipType: 'one-to-many',
        isIdentifying: isIdentifying,
        isValid: false,
        error: `Unsupported cardinality combination: ${cardinalityKey}`
      };
    }

    return {
      leftCardinality: leftCardinality.cardinality!,
      rightCardinality: rightCardinality.cardinality!,
      relationshipType: relationshipTypeResult,
      isIdentifying: isIdentifying,
      isValid: true
    };
  }

  private analyzeCardinality(marker: string, side: 'left' | 'right'): { isValid: boolean; cardinality?: CardinalityInfo; error?: string } {
    // Find matching cardinality pattern
    for (const pattern of this.CARDINALITY_PATTERNS) {
      if (pattern.pattern.test(marker)) {
        return {
          isValid: true,
          cardinality: {
            type: pattern.type,
            marker: pattern.marker
          }
        };
      }
    }

    return {
      isValid: false,
      error: `Unknown cardinality marker: ${marker} on ${side} side`
    };
  }
} 