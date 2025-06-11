import type { TableField } from "~/types/erd";

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

    // Handle model_path specially
    if (cleanLine.includes('model_path')) {
      return null; // Skip model path lines
    }

    // Parse field definition: type name [annotations]
    const parts = cleanLine.split(/\s+/);
    if (parts.length < 2) return null;

    const type = this.cleanString(parts[0]);
    const name = this.cleanString(parts[1]);

    // Check for annotations
    const restOfLine = parts.slice(2).join(' ');
    const isPrimaryKey = restOfLine.includes('PK');
    let isForeignKey = false;
    let foreignKeyTarget = '';

    // Parse FK annotation: "FK->table" or "FK->table_name"
    const fkMatch = restOfLine.match(/FK->(\w+)/);
    if (fkMatch) {
      isForeignKey = true;
      foreignKeyTarget = fkMatch[1];
    }

    // Alternative FK syntax: "FK" followed by quoted target
    const fkQuotedMatch = restOfLine.match(/FK.*["']([^"']+)["']/);
    if (fkQuotedMatch) {
      isForeignKey = true;
      foreignKeyTarget = fkQuotedMatch[1];
    }

    return {
      name,
      type,
      isPrimaryKey,
      isForeignKey,
      foreignKeyTarget: isForeignKey ? foreignKeyTarget : undefined
    };
  }
} 