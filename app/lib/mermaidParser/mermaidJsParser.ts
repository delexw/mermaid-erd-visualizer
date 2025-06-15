import mermaid from 'mermaid';
import type { Table, TableField, Relationship as AppRelationship, CardinalityInfo, ParseResult, ParseError } from '~/types/erd';

// Define types based on the actual output from Mermaid.js API
interface MermaidAttribute {
  type: string;
  name: string;
  keys: string[];
  comment: string;
}

// The actual entity structure in Mermaid.js output
interface MermaidEntity {
  id: string;
  label: string;
  attributes: MermaidAttribute[];
  alias: string;
  shape: string;
  look: string;
  cssClasses: string;
  cssStyles: string[];
}

interface MermaidRelSpec {
  cardA: 'ZERO_OR_MORE' | 'ONLY_ONE' | 'ONE_OR_MORE' | 'ZERO_OR_ONE';
  relType: 'IDENTIFYING' | 'NON_IDENTIFYING';
  cardB: 'ZERO_OR_MORE' | 'ONLY_ONE' | 'ONE_OR_MORE' | 'ZERO_OR_ONE';
}

interface MermaidRelationship {
  entityA: string;
  roleA?: string;
  entityB: string;
  relSpec: MermaidRelSpec;
}

// Mermaid's ER Database structure
interface MermaidErDb {
  entities: Map<string, MermaidEntity>;
  relationships: MermaidRelationship[];
  Cardinality: Record<string, string>;
  Identification: Record<string, string>;
}

// Types for the Mermaid parser object
interface MermaidErParser {
  yy: MermaidErDb & {
    getEntities: () => Map<string, MermaidEntity>;
    getRelationships: () => MermaidRelationship[];
  };
}

/**
 * Maps Mermaid cardinality to our application's CardinalityInfo type
 */
function mapCardinality(cardType: string): CardinalityInfo {
  switch (cardType) {
    case 'ZERO_OR_MORE':
      return { type: 'zero-or-more', marker: 'o{' };
    case 'ONLY_ONE':
      return { type: 'exactly-one', marker: '||' };
    case 'ONE_OR_MORE':
      return { type: 'one-or-more', marker: '|{' };
    case 'ZERO_OR_ONE':
      return { type: 'zero-or-one', marker: '|o' };
    default:
      // Default to "zero-or-more" for unknown cases
      return { type: 'zero-or-more', marker: 'o{' };
  }
}

/**
 * Maps Mermaid relationship cardinality combinations to our application's relationship types
 */
function determineRelationshipType(leftCard: string, rightCard: string): AppRelationship['type'] {
  if (
    leftCard === 'ZERO_OR_MORE' ||
    leftCard === 'ONE_OR_MORE'
  ) {
    if (rightCard === 'ZERO_OR_MORE' || rightCard === 'ONE_OR_MORE') {
      return 'many-to-many';
    }
    return 'one-to-many'; // Inverted because of the mapping in the task description
  }

  if (
    rightCard === 'ZERO_OR_MORE' ||
    rightCard === 'ONE_OR_MORE'
  ) {
    return 'one-to-many';
  }

  return 'one-to-one';
}

/**
 * Extract table name from entity ID (e.g., 'entity-User-0' → 'User')
 */
function extractTableName(entityId: string): string {
  // Remove any prefix like 'entity-' and suffix like '-0'
  const match = entityId.match(/^entity-([^-]+)/);
  return match ? match[1] : entityId;
}

/**
 * Parses Mermaid ERD diagram text using official Mermaid.js interfaces
 */
export async function parseMermaidERDWithJS(diagramText: string): Promise<ParseResult> {
  // Configure Mermaid
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    er: { useMaxWidth: false }
  });

  try {
    // Get diagram from text using mermaid API
    const diagram = await mermaid.mermaidAPI.getDiagramFromText(diagramText);
    // Cast the parser to the correct type
    const parser = diagram.getParser() as unknown as MermaidErParser;

    // Extract tables/entities and relationships
    const entitiesMap = parser.yy.getEntities();
    const relationships: MermaidRelationship[] = parser.yy.getRelationships();

    // Convert entitiesMap to array of tables
    const tables: Table[] = Array.from(entitiesMap.entries()).map(([_, entity]) => {
      const tableName = extractTableName(entity.id);

      // First filter out 'NOT NULL' attributes that get parsed as separate entries
      const filteredAttributes = (entity.attributes || []).filter(
        attr => !(attr.type === 'NOT' && attr.name === 'NULL')
      );

      // Then map the filtered attributes to fields
      const fields: TableField[] = filteredAttributes.map(attr => {
        const isPrimaryKey = attr.keys?.includes('PK') || false;
        const isForeignKey = attr.keys?.includes('FK') || false;

        return {
          name: attr.name,
          type: attr.type,
          isPrimaryKey,
          isForeignKey,
        } as TableField;
      });

      return {
        id: tableName,
        name: tableName,
        modelPath: '', // Can be enriched if needed
        fields,
      };
    });

    // Map relationships
    const parsedRelationships: AppRelationship[] = relationships.map((rel, index) => {
      // Map the cardinality
      const leftCardinality = mapCardinality(rel.relSpec.cardB); // Note the swap based on the task description
      const rightCardinality = mapCardinality(rel.relSpec.cardA);

      // Determine relationship type
      const type = determineRelationshipType(rel.relSpec.cardB, rel.relSpec.cardA);

      // Extract table names from entity IDs
      const fromTable = extractTableName(rel.entityA);
      const toTable = extractTableName(rel.entityB);

      // Create a unique ID
      const id = `${fromTable}_${toTable}_${index}`;

      return {
        id,
        fromTable,
        toTable,
        type,
        description: rel.roleA || '',
        isIdentifying: rel.relSpec.relType === 'IDENTIFYING',
        leftCardinality,
        rightCardinality,
      };
    });

    // Enhance tables with foreign key information based on relationships
    tables.forEach(table => {
      // Find relationships where this table is the target (toTable)
      const incomingRelationships = parsedRelationships.filter(rel => rel.toTable === table.name);

      // For each foreign key field, try to determine the target
      table.fields.forEach(field => {
        if (field.isForeignKey) {
          // Find a relationship where this table is the target
          const relationship = incomingRelationships.find(rel => {
            // This is a simple heuristic - we assume the field name contains the source table name or 'id'
            return field.name.toLowerCase().includes(rel.fromTable.toLowerCase()) ||
              field.name.toLowerCase().includes('id');
          });

          if (relationship) {
            field.foreignKeyTarget = relationship.fromTable;
          }
        }
      });
    });

    return {
      success: true,
      data: {
        tables,
        relationships: parsedRelationships,
        originalDiagram: diagramText,
      },
    };
  } catch (error) {
    console.error('Error parsing Mermaid ERD:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const parseError: ParseError = {
      line: 0,
      message: `Failed to parse Mermaid ERD: ${errorMessage}`,
      type: 'error',
    };

    return {
      success: false,
      errors: [parseError],
    };
  }
} 