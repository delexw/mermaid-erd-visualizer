import type { ParseError } from "~/types/erd";

export interface IWarningCollector {
  addWarning(line: number, message: string, context?: string): void;
  getWarnings(): ParseError[];
  hasWarnings(): boolean;
}

export class WarningCollector implements IWarningCollector {
  private warnings: ParseError[] = [];

  addWarning(line: number, message: string, context?: string): void {
    this.warnings.push({
      line,
      message,
      context,
      type: 'warning'
    });
  }

  getWarnings(): ParseError[] {
    return [...this.warnings];
  }

  hasWarnings(): boolean {
    return this.warnings.length > 0;
  }
} 