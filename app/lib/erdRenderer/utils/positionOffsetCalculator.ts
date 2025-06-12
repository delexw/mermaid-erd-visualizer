import type { Position } from '../models/tableModel';
import type { IPositionOffsetCalculator } from '../types/relationshipPositioning';

/**
 * Responsible for calculating position offsets for multiple relationships
 * Follows Single Responsibility Principle
 */
export class PositionOffsetCalculator implements IPositionOffsetCalculator {
  public calculateOffset(index: number, totalCount: number, spacing: number): number {
    // Center the relationships around the main connection line
    return (index - (totalCount - 1) / 2) * spacing;
  }

  public applyPerpendicularOffset(
    fromPos: Position,
    toPos: Position,
    offset: number
  ): { adjustedFromPos: Position; adjustedToPos: Position } {
    const adjustedFromPos = { ...fromPos };
    const adjustedToPos = { ...toPos };

    // Calculate line direction
    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length > 0) {
      // Calculate perpendicular vector (rotated 90 degrees)
      const perpX = -dy / length;
      const perpY = dx / length;

      // Apply offset perpendicular to the line direction
      adjustedFromPos.x += perpX * offset;
      adjustedFromPos.y += perpY * offset;
      adjustedToPos.x += perpX * offset;
      adjustedToPos.y += perpY * offset;
    }

    return { adjustedFromPos, adjustedToPos };
  }
}
