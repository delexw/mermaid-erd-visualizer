import type { TableModel } from '../models/tableModel';
import type {
  IRelationshipPositionCalculator,
  IPositionOffsetCalculator,
  RelationshipComponentInfo,
  ConnectionPoints,
  OptimalConnection
} from '../types/relationshipPositioning';
import { PositionOffsetCalculator } from './positionOffsetCalculator';

/**
 * Responsible for calculating and updating relationship positions
 * Follows Single Responsibility and Dependency Inversion principles
 */
export class RelationshipPositionCalculator implements IRelationshipPositionCalculator {
  private readonly offsetCalculator: IPositionOffsetCalculator;
  private readonly relationshipSpacing = 15; // pixels

  constructor(
    private readonly tableModels: Map<string, TableModel>,
    offsetCalculator?: IPositionOffsetCalculator
  ) {
    // Dependency injection with default implementation
    this.offsetCalculator = offsetCalculator ?? new PositionOffsetCalculator();
  }

  public updateGroupPositions(relationships: RelationshipComponentInfo[]): void {
    if (relationships.length === 0) return;

    const firstModel = relationships[0].model;
    const fromTable = this.tableModels.get(firstModel.fromTable);
    const toTable = this.tableModels.get(firstModel.toTable);

    if (!fromTable || !toTable) {
      this.logMissingTableWarnings(relationships, fromTable, toTable);
      return;
    }

    const fromPoints = fromTable.getConnectionPoints();
    const toPoints = toTable.getConnectionPoints();
    const { fromPos, toPos } = this.findOptimalConnectionPoints(fromPoints, toPoints);

    this.updateIndividualRelationshipPositions(relationships, fromPos, toPos);
  }

  public findOptimalConnectionPoints(fromPoints: ConnectionPoints, toPoints: ConnectionPoints): OptimalConnection {
    // Calculate distances between all possible connection point pairs
    const connections = [
      { from: fromPoints.top, to: toPoints.bottom, distance: 0 },
      { from: fromPoints.bottom, to: toPoints.top, distance: 0 },
      { from: fromPoints.left, to: toPoints.right, distance: 0 },
      { from: fromPoints.right, to: toPoints.left, distance: 0 },
      { from: fromPoints.top, to: toPoints.top, distance: 0 },
      { from: fromPoints.bottom, to: toPoints.bottom, distance: 0 },
      { from: fromPoints.left, to: toPoints.left, distance: 0 },
      { from: fromPoints.right, to: toPoints.right, distance: 0 }
    ];

    // Calculate actual distances
    connections.forEach(conn => {
      const dx = conn.to.x - conn.from.x;
      const dy = conn.to.y - conn.from.y;
      conn.distance = Math.sqrt(dx * dx + dy * dy);
    });

    // Find the connection with minimum distance
    const optimal = connections.reduce((min, current) =>
      current.distance < min.distance ? current : min
    );

    return {
      fromPos: optimal.from,
      toPos: optimal.to
    };
  }

  private updateIndividualRelationshipPositions(
    relationships: RelationshipComponentInfo[],
    baseFromPos: { x: number; y: number },
    baseToPos: { x: number; y: number }
  ): void {
    relationships.forEach((rel, index) => {
      if (relationships.length === 1) {
        // Single relationship - no offset needed
        console.log(`[ERDRenderer] Updating ${rel.id} (single):`, { baseFromPos, baseToPos });
        rel.component.updatePositions(baseFromPos, baseToPos);
      } else {
        // Multiple relationships - apply offset
        const offset = this.offsetCalculator.calculateOffset(index, relationships.length, this.relationshipSpacing);
        const { adjustedFromPos, adjustedToPos } = this.offsetCalculator.applyPerpendicularOffset(
          baseFromPos,
          baseToPos,
          offset
        );

        console.log(`[ERDRenderer] Updating ${rel.id} (${index + 1}/${relationships.length}):`, { adjustedFromPos, adjustedToPos });
        rel.component.updatePositions(adjustedFromPos, adjustedToPos);
      }
    });
  }

  private logMissingTableWarnings(
    relationships: RelationshipComponentInfo[],
    fromTable: TableModel | undefined,
    toTable: TableModel | undefined
  ): void {
    relationships.forEach(rel => {
      console.warn(`[ERDRenderer] Missing table models for relationship ${rel.id}:`, {
        fromTable: rel.model.fromTable,
        toTable: rel.model.toTable,
        fromTableExists: !!fromTable,
        toTableExists: !!toTable
      });
    });
  }
} 