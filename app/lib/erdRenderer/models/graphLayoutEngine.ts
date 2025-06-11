import ELK from 'elkjs/lib/elk.bundled.js';
import type { Table, Relationship } from '~/types/erd';
import type { Position } from './tableModel';
import type { LayoutConfig } from '../types/layout';

// Re-export LayoutConfig for external use
export type { LayoutConfig } from '../types/layout';

export class GraphLayoutEngine {
  private config: LayoutConfig;
  private elk: InstanceType<typeof ELK>;

  constructor(config?: Partial<LayoutConfig>) {
    this.config = {
      algorithm: 'layered',
      direction: 'DOWN',
      nodeSpacing: 50,
      layerSpacing: 100,
      marginX: 50,
      marginY: 50,
      centerHighConnectivityNodes: true,
      hierarchyHandling: 'SEPARATE_CHILDREN',
      nodePlacement: 'NETWORK_SIMPLEX',
      ...config
    };

    this.elk = new ELK();
  }

  public async calculateLayout(tables: Table[], relationships: Relationship[]): Promise<Position[]> {
    // Convert data to ELK format
    const elkGraph = this.convertToELKFormat(tables, relationships);

    // Calculate layout using ELK
    const layoutedGraph = await this.elk.layout(elkGraph);

    // Extract positions from layouted graph
    return this.extractPositions(tables, layoutedGraph);
  }

  private convertToELKFormat(tables: Table[], relationships: Relationship[]): any {
    // Calculate connectivity to identify hub nodes
    // Hub nodes (like 'users' table) with many relationships are often positioned
    // at edges by ELK's layered algorithm to minimize edge crossings
    const connectivity = this.calculateConnectivity(tables, relationships);
    const highConnectivityNodes = Array.from(connectivity.entries())
      .filter(([_, degree]) => degree > connectivity.size * 0.1) // Nodes connected to >10% of other nodes
      .map(([nodeId, _]) => nodeId);

    const layoutOptions: any = {
      'elk.algorithm': this.config.algorithm,
      'elk.direction': this.config.direction,
      'elk.spacing.nodeNode': this.config.nodeSpacing.toString(),
      'elk.layered.spacing.nodeNodeBetweenLayers': this.config.layerSpacing.toString(),
      'elk.padding': `[top=${this.config.marginY},left=${this.config.marginX},bottom=${this.config.marginY},right=${this.config.marginX}]`
    };

    // Add layered-specific options for better hub handling
    if (this.config.algorithm === 'layered') {
      layoutOptions['elk.layered.nodePlacement.strategy'] = this.config.nodePlacement;
      layoutOptions['elk.hierarchyHandling'] = this.config.hierarchyHandling;

      // Try to center high-connectivity nodes instead of pushing them to edges
      if (this.config.centerHighConnectivityNodes) {
        layoutOptions['elk.layered.crossingMinimization.strategy'] = 'LAYER_SWEEP';
        layoutOptions['elk.layered.nodePlacement.favorStraightEdges'] = 'false';
      }
    }

    const elkGraph = {
      id: 'root',
      layoutOptions,
      children: tables.map(table => {
        const dimensions = this.calculateTableDimensions(table);
        return {
          id: table.id,
          width: dimensions.width,
          height: dimensions.height,
          labels: [{
            text: table.name,
            width: dimensions.width,
            height: 30
          }]
        };
      }),
      edges: relationships
        .filter(rel => {
          // Only include edges where both tables exist
          const hasFromTable = tables.some(t => t.id === rel.fromTable);
          const hasToTable = tables.some(t => t.id === rel.toTable);
          return hasFromTable && hasToTable;
        })
        .map(rel => ({
          id: rel.id,
          sources: [rel.fromTable],
          targets: [rel.toTable]
        }))
    };

    return elkGraph;
  }

  private extractPositions(tables: Table[], layoutedGraph: any): Position[] {
    const positions: Position[] = [];

    tables.forEach(table => {
      const elkNode = layoutedGraph.children?.find((n: any) => n.id === table.id);
      if (elkNode) {
        positions.push({
          x: elkNode.x || 0,
          y: elkNode.y || 0
        });
      } else {
        // Fallback position if table wasn't processed
        positions.push({ x: 0, y: 0 });
      }
    });

    return positions;
  }

  private calculateConnectivity(tables: Table[], relationships: Relationship[]): Map<string, number> {
    const connectivity = new Map<string, number>();

    // Initialize all tables with 0 connections
    tables.forEach(table => connectivity.set(table.id, 0));

    // Count connections for each table
    relationships.forEach(rel => {
      if (connectivity.has(rel.fromTable)) {
        connectivity.set(rel.fromTable, connectivity.get(rel.fromTable)! + 1);
      }
      if (connectivity.has(rel.toTable)) {
        connectivity.set(rel.toTable, connectivity.get(rel.toTable)! + 1);
      }
    });

    return connectivity;
  }

  private calculateTableDimensions(table: Table): { width: number; height: number } {
    // Base dimensions
    let width = Math.max(200, table.name.length * 12 + 40);
    let height = 60; // Header height

    // Add height for each field
    table.fields.forEach((field) => {
      height += 25; // Row height
      // Adjust width if field name is longer
      const fieldWidth = (field.name + ' ' + field.type).length * 8 + 60;
      width = Math.max(width, fieldWidth);
    });

    // Add some padding
    width += 20;
    height += 20;

    // Cap maximum dimensions to prevent huge tables
    width = Math.min(width, 350);
    height = Math.min(height, 400);

    return { width, height };
  }

  public updateConfig(newConfig: Partial<LayoutConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): LayoutConfig {
    return { ...this.config };
  }

  // Method to get layout statistics for debugging
  public getLayoutStats(tables: Table[], relationships: Relationship[]): {
    nodeCount: number;
    edgeCount: number;
    avgDegree: number;
    maxDegree: number;
    highestConnectedTable: string | null;
  } {
    // Count valid edges
    const validEdges = relationships.filter(rel => {
      const hasFromTable = tables.some(t => t.id === rel.fromTable);
      const hasToTable = tables.some(t => t.id === rel.toTable);
      return hasFromTable && hasToTable;
    });

    // Calculate degree for each table
    const degrees = new Map<string, number>();
    let maxDegree = 0;
    let highestConnectedTable: string | null = null;

    tables.forEach(table => {
      const degree = validEdges.filter(rel =>
        rel.fromTable === table.id || rel.toTable === table.id
      ).length;

      degrees.set(table.id, degree);

      if (degree > maxDegree) {
        maxDegree = degree;
        highestConnectedTable = table.id;
      }
    });

    const avgDegree = Array.from(degrees.values()).reduce((sum, degree) => sum + degree, 0) / tables.length;

    return {
      nodeCount: tables.length,
      edgeCount: validEdges.length,
      avgDegree: Math.round(avgDegree * 100) / 100,
      maxDegree,
      highestConnectedTable
    };
  }
} 