import type { TableField } from '~/types/erd';

export interface IFieldParser {
  parseField(line: string): TableField | null;
}

export class FieldParser implements IFieldParser {
  private cleanString(str: string): string {
    return str.replace(/['"]/g, '').trim();
  }

  parseField(line: string): TableField | null {
    // Remove leading/trailing whitespace and comments
    const cleanLine = line.trim();
    if (!cleanLine || cleanLine.startsWith('//')) return null;

    // Parse field definition: type name [annotations]
    const parts = cleanLine.split(/\s+/);
    if (parts.length < 2) return null;

    const type = this.cleanString(parts[0]);
    const name = this.cleanString(parts[1]);

    // Check for annotations
    const restOfLine = parts.slice(2).join(' ');

    // Parse PK annotations: simple "PK" (standalone) or quoted "PK"
    const simplePkMatch = restOfLine.match(/\bPK\b/i);
    const quotedPkMatch = restOfLine.match(/["']PK["']/i);
    const isPrimaryKey = !!(simplePkMatch || quotedPkMatch);

    let isForeignKey = false;
    let foreignKeyTarget = '';

    // Parse FK annotations: simple "FK" (standalone) or quoted "FK"
    const simpleFkMatch = restOfLine.match(/\bFK\b/i);
    const quotedFkMatch = restOfLine.match(/["']FK["']/i);

    if (simpleFkMatch || quotedFkMatch) {
      // Handle FK annotation
      isForeignKey = true;
    }

    return {
      name,
      type,
      isPrimaryKey,
      isForeignKey,
      foreignKeyTarget: isForeignKey ? foreignKeyTarget : undefined,
    };
  }
}
