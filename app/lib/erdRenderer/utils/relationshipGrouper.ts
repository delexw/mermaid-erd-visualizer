import type { RelationshipComponent } from '../components/relationshipComponent';
import type {
  IRelationshipGrouper,
  RelationshipComponentInfo,
} from '../types/relationshipPositioning';

/**
 * Responsible for grouping relationships by table pairs
 * Follows Single Responsibility Principle
 */
export class RelationshipGrouper implements IRelationshipGrouper {
  constructor(private readonly relationshipComponents: Map<string, RelationshipComponent>) {}

  public groupByTablePairs(): Map<string, RelationshipComponentInfo[]> {
    return Array.from(this.relationshipComponents.entries()).reduce(
      (groups, [relationshipId, component]) => {
        const model = component.getModel();
        const tableKey = this.createTablePairKey(model.fromTable, model.toTable);

        const existingGroup = groups.get(tableKey) ?? [];
        existingGroup.push({
          id: relationshipId,
          component,
          model,
        });

        groups.set(tableKey, existingGroup);
        return groups;
      },
      new Map<string, RelationshipComponentInfo[]>()
    );
  }

  private createTablePairKey(fromTable: string, toTable: string): string {
    return `${fromTable}_${toTable}`;
  }
}
