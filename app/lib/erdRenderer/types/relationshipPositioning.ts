import type { RelationshipComponent } from '../components/relationshipComponent';
import type { RelationshipModel } from '../models/relationshipModel';
import type { Position } from '../models/tableModel';

export interface RelationshipComponentInfo {
  id: string;
  component: RelationshipComponent;
  model: RelationshipModel;
}

export interface ConnectionPoints {
  top: Position;
  bottom: Position;
  left: Position;
  right: Position;
}

export interface OptimalConnection {
  fromPos: Position;
  toPos: Position;
}

export interface IRelationshipGrouper {
  groupByTablePairs(): Map<string, RelationshipComponentInfo[]>;
}

export interface IRelationshipPositionCalculator {
  updateGroupPositions(relationships: RelationshipComponentInfo[]): void;
  findOptimalConnectionPoints(
    fromPoints: ConnectionPoints,
    toPoints: ConnectionPoints
  ): OptimalConnection;
}

export interface IPositionOffsetCalculator {
  calculateOffset(index: number, totalCount: number, spacing: number): number;
  applyPerpendicularOffset(
    fromPos: Position,
    toPos: Position,
    offset: number
  ): { adjustedFromPos: Position; adjustedToPos: Position };
}
