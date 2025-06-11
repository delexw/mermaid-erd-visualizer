import type { Table } from "~/types/erd";
import type { IFieldParser } from "./fieldParser";
import type { IWarningCollector } from "./warningCollector";

export interface ITableParser {
  parseTable(tableBlock: string, warningCollector: IWarningCollector): Table | null;
}

export class TableParser implements ITableParser {
  constructor(private fieldParser: IFieldParser) { }

  parseTable(tableBlock: string, warningCollector: IWarningCollector): Table | null {
    const lines = tableBlock.split('\n');
    if (lines.length < 2) return null;

    // First line should be table name with opening brace
    const headerMatch = lines[0].match(/(\w+)\s*\{/);
    if (!headerMatch) return null;

    const tableName = headerMatch[1].trim();

    // Extract model path if present
    let modelPath = '';
    const modelPathLine = lines.find(line => line.includes('model_path'));
    if (modelPathLine) {
      const pathMatch = modelPathLine.match(/model_path\s+["']([^"']+)["']/);
      if (pathMatch) {
        modelPath = pathMatch[1];
      }
    }

    // Parse fields
    const fields = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('}')) break; // End of table

      const field = this.fieldParser.parseField(line);
      if (field) {
        fields.push(field);
      }
    }

    return {
      id: tableName,
      name: tableName,
      modelPath,
      fields
    };
  }
} 