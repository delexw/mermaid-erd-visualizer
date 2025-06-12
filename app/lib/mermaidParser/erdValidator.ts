import type { ParsedERD, ParseError } from '~/types/erd';

export interface IValidator {
  validate(data: ParsedERD): ParseError[];
}

export class ERDValidator implements IValidator {
  validate(data: ParsedERD): ParseError[] {
    const warnings: ParseError[] = [];
    const tableNames = new Set(data.tables.map(t => t.name));

    // Check for duplicate table names
    const duplicateCheck = new Set();
    for (const table of data.tables) {
      if (duplicateCheck.has(table.name)) {
        warnings.push({
          line: 0,
          message: `Duplicate table name: ${table.name}`,
          type: 'warning',
        });
      }
      duplicateCheck.add(table.name);
    }

    // Validate foreign key references
    for (const table of data.tables) {
      for (const field of table.fields) {
        if (field.isForeignKey && field.foreignKeyTarget) {
          if (!tableNames.has(field.foreignKeyTarget)) {
            warnings.push({
              line: 0,
              message: `Foreign key reference to non-existent table: ${field.foreignKeyTarget} in table ${table.name}.${field.name}`,
              type: 'warning',
            });
          }
        }
      }
    }

    // Validate relationships
    for (const relationship of data.relationships) {
      if (!tableNames.has(relationship.fromTable)) {
        warnings.push({
          line: 0,
          message: `Relationship references non-existent table: ${relationship.fromTable}`,
          type: 'warning',
        });
      }
      if (!tableNames.has(relationship.toTable)) {
        warnings.push({
          line: 0,
          message: `Relationship references non-existent table: ${relationship.toTable}`,
          type: 'warning',
        });
      }
    }

    return warnings;
  }
}
