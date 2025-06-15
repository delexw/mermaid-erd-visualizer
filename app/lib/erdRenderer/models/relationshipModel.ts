import type { Relationship, CardinalityInfo } from '~/types/erd';

import type { Position } from './tableModel';

export class RelationshipModel {
  public id: string;
  public fromTable: string;
  public toTable: string;
  public type: Relationship['type'];
  public description?: string;
  public isVisible: boolean = true;
  public isHighlighted: boolean = false;
  public isGreyedOut: boolean = false; // New property for greyed out state
  public leftCardinality?: CardinalityInfo;
  public rightCardinality?: CardinalityInfo;
  public isIdentifying: boolean = true; // Default to identifying (solid line)

  constructor(relationship: Relationship) {
    this.id = relationship.id;
    this.fromTable = relationship.fromTable;
    this.toTable = relationship.toTable;
    this.type = relationship.type;
    this.description = relationship.description;

    // Use the isIdentifying field from the parsed relationship data
    this.isIdentifying = relationship.isIdentifying ?? true; // Default to true if not specified

    // Parse cardinality information from the original relationship if available
    this.parseCardinalityInfo(relationship);
  }

  private parseCardinalityInfo(relationship: Relationship): void {
    // Use parsed cardinality information if available, otherwise fallback to inference
    if (relationship.leftCardinality && relationship.rightCardinality) {
      this.leftCardinality = relationship.leftCardinality;
      this.rightCardinality = relationship.rightCardinality;
      return;
    }

    // Fallback: infer cardinality from relationship type for backwards compatibility
    switch (relationship.type) {
      case 'one-to-one':
        this.leftCardinality = { type: 'exactly-one', marker: '||' };
        this.rightCardinality = { type: 'exactly-one', marker: '||' };
        break;
      case 'one-to-many':
        this.leftCardinality = { type: 'exactly-one', marker: '||' };
        this.rightCardinality = { type: 'one-or-more', marker: '|{' };
        break;
      case 'many-to-many':
        this.leftCardinality = { type: 'one-or-more', marker: '|{' };
        this.rightCardinality = { type: 'one-or-more', marker: '|{' };
        break;
      default:
        this.leftCardinality = { type: 'exactly-one', marker: '||' };
        this.rightCardinality = { type: 'one-or-more', marker: '|{' };
    }
  }

  public setVisible(visible: boolean): void {
    this.isVisible = visible;
  }

  public setHighlighted(highlighted: boolean): void {
    this.isHighlighted = highlighted;
  }

  public setGreyedOut(greyedOut: boolean): void {
    this.isGreyedOut = greyedOut;
  }

  // Calculate the path for the relationship line
  public calculatePath(fromPos: Position, toPos: Position): string {
    // Check if this is a self-referencing relationship (same position)
    const isSelfReference = this.fromTable === this.toTable;

    if (isSelfReference) {
      // Create a curved loop for self-referencing relationships
      const loopSize = 40; // Size of the loop
      const offsetX = 20; // Horizontal offset from connection point
      const offsetY = -20; // Vertical offset (negative to go upward)

      // Create a circular arc path
      const startX = fromPos.x;
      const startY = fromPos.y;
      const endX = toPos.x;
      const endY = toPos.y;

      // Calculate control points for the curve
      const midX = (startX + endX) / 2 + offsetX;
      const midY = (startY + endY) / 2 + offsetY;

      // Create a path that loops out and back
      return `M ${startX} ${startY} 
              Q ${midX - loopSize} ${midY} ${midX} ${midY - loopSize}
              Q ${midX + loopSize} ${midY} ${endX} ${endY}`;
    }

    // Simple straight line for regular relationships
    return `M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`;
  }

  // Get relationship line style based on connector type (identifying vs non-identifying)
  public getLineStyle(): { stroke: string; strokeWidth: number; strokeDasharray?: string } {
    let baseStyle;

    if (this.isHighlighted) {
      // Use a distinct color for highlighted relationships - different from selected tables
      baseStyle = {
        stroke: '#8b5cf6', // Purple for relationships (different from the indigo used for tables)
        strokeWidth: 2,
      };
    } else if (this.isGreyedOut) {
      baseStyle = {
        stroke: '#9ca3af', // Darker grey for greyed out state to improve visibility
        strokeWidth: 0.75, // Thinner line for greyed out relationships
      };
    } else {
      baseStyle = {
        stroke: '#0ea5e9', // Sky blue for regular relationships - colorful default
        strokeWidth: 1,
      };
    }

    // Use dotted lines for non-identifying relationships, solid for identifying
    if (this.isIdentifying) {
      return baseStyle; // Solid line
    } else {
      return { ...baseStyle, strokeDasharray: '5,5' }; // Dotted line
    }
  }

  // Convert cardinality type to marker name
  private cardinalityToMarker(cardinality: CardinalityInfo): string {
    switch (cardinality.type) {
      case 'exactly-one':
        return 'one';
      case 'zero-or-one':
        return 'zero-or-one';
      case 'zero-or-more':
        return 'zero-or-more';
      case 'one-or-more':
        return 'one-or-more';
      default:
        return 'one';
    }
  }

  // Get relationship markers for the endpoints based on cardinality
  public getMarkers(): { from: string; to: string } {
    const fromMarker = this.leftCardinality
      ? this.cardinalityToMarker(this.leftCardinality)
      : 'one';
    const toMarker = this.rightCardinality
      ? this.cardinalityToMarker(this.rightCardinality)
      : 'many';

    return { from: fromMarker, to: toMarker };
  }
}
