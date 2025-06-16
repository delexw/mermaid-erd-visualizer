import type { Table, TableField } from '~/types/erd';

export interface Position {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface TableBounds extends Position, Dimensions {}

export class TableModel {
  public id: string;
  public name: string;
  public modelPath: string;
  public fields: TableField[];
  public position: Position;
  public dimensions: Dimensions;
  public isSelected: boolean = false;
  public isDragging: boolean = false;
  public isGreyedOut: boolean = false;

  constructor(table: Table, position: Position = { x: 0, y: 0 }) {
    this.id = table.id;
    this.name = table.name;
    this.modelPath = table.modelPath;
    this.fields = table.fields;
    this.position = position;
    this.dimensions = this.calculateDimensions();
  }

  private calculateDimensions(): Dimensions {
    // Base dimensions
    const headerHeight = 40;
    const fieldHeight = 24;
    const padding = 16;
    const minWidth = 200;

    // Calculate width based on longest text
    const maxTextLength = Math.max(
      this.name.length,
      ...this.fields.map(f => `${f.type} ${f.name}`.length)
    );
    const width = Math.max(minWidth, maxTextLength * 8 + padding * 2);

    // Calculate height based on fields
    const height = headerHeight + this.fields.length * fieldHeight + padding;

    return { width, height };
  }

  public getBounds(): TableBounds {
    return {
      ...this.position,
      ...this.dimensions,
    };
  }

  public setPosition(position: Position): void {
    this.position = position;
  }

  public setSelected(selected: boolean): void {
    this.isSelected = selected;
  }

  public setDragging(dragging: boolean): void {
    this.isDragging = dragging;
  }

  public setGreyedOut(greyedOut: boolean): void {
    this.isGreyedOut = greyedOut;
  }

  // Check if a point is within the table bounds
  public containsPoint(point: Position): boolean {
    const bounds = this.getBounds();
    return (
      point.x >= bounds.x &&
      point.x <= bounds.x + bounds.width &&
      point.y >= bounds.y &&
      point.y <= bounds.y + bounds.height
    );
  }

  // Get connection points for relationships
  public getConnectionPoints(): {
    top: Position;
    bottom: Position;
    left: Position;
    right: Position;
  } {
    const bounds = this.getBounds();
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;

    return {
      top: { x: centerX, y: bounds.y },
      right: { x: bounds.x + bounds.width, y: centerY },
      bottom: { x: centerX, y: bounds.y + bounds.height },
      left: { x: bounds.x, y: centerY },
    };
  }
}
