import { select, type Selection } from 'd3-selection';
import { zoom, zoomTransform, type ZoomBehavior } from 'd3-zoom';

import 'd3-transition';
import type { Table, Relationship } from '~/types/erd';

import type { LegendConfig } from './components/legendComponent';
import { LegendComponent } from './components/legendComponent';
import { RelationshipComponent } from './components/relationshipComponent';
import { TableComponent } from './components/tableComponent';
import { GraphLayoutEngine, type LayoutConfig } from './models/graphLayoutEngine';
import { RelationshipModel } from './models/relationshipModel';
import { TableModel } from './models/tableModel';
import { RelationshipGrouper } from './utils/relationshipGrouper';
import { RelationshipPositionCalculator } from './utils/relationshipPositionCalculator';
import { applyZoomToFit, calculateTablesBoundingBox } from './utils/zoomUtils';
// Zoom level constants (should match setupZoom scaleExtent)
const MIN_ZOOM_LEVEL = 0.01;
const MAX_ZOOM_LEVEL = 5;

export interface ERDRendererConfig {
  container: HTMLElement;
  onTableSelect?: (tableId: string | null) => void;
  onLayoutChange?: () => void;
  onRenderingProgress?: (progress: number, stage: string) => void;
  layoutConfig?: Partial<LayoutConfig>;
  showLegend?: boolean;
  legendConfig?: LegendConfig;
}

export interface ERDData {
  tables: Array<{
    id: string;
    name: string;
    columns: Array<{
      name: string;
      type: string;
      nullable?: boolean;
      primaryKey?: boolean;
      foreignKey?: boolean;
    }>;
  }>;
  relationships: Array<{
    id: string;
    from: { table: string; column: string };
    to: { table: string; column: string };
    type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  }>;
}

export class ERDRenderer {
  public config: ERDRendererConfig;
  private svg!: Selection<SVGSVGElement, unknown, null, undefined>;
  private mainGroup!: Selection<SVGGElement, unknown, null, undefined>;
  private zoomBehavior!: ZoomBehavior<SVGSVGElement, unknown>;
  private legendComponent?: LegendComponent;

  private tableModels: Map<string, TableModel> = new Map();
  private relationshipModels: Map<string, RelationshipModel> = new Map();
  private tableComponents: Map<string, TableComponent> = new Map();
  private relationshipComponents: Map<string, RelationshipComponent> = new Map();

  private selectedTables: Set<string> = new Set();
  private containerDimensions = { width: 0, height: 0 };
  private layoutEngine: GraphLayoutEngine;
  private instanceId: string;

  constructor(config: ERDRendererConfig) {
    this.instanceId = `ERDRenderer-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    this.config = config;
    this.layoutEngine = new GraphLayoutEngine(config.layoutConfig);
    this.initializeSVG();
    this.createGridPattern();
    this.setupZoom();
    this.setupResizeObserver();
    this.setupLegend();
  }

  private initializeSVG(): void {
    // Clear container
    this.config.container.innerHTML = '';

    // Create SVG
    this.svg = select(this.config.container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .style('background-color', '#fafafa')
      .style('cursor', 'grab');

    // Main group for all content (affected by zoom/pan)
    this.mainGroup = this.svg.append('g').attr('class', 'main-group');
  }

  private createGridPattern(): void {
    const defs = this.svg.append('defs');

    const pattern = defs
      .append('pattern')
      .attr('id', 'grid')
      .attr('width', 20)
      .attr('height', 20)
      .attr('patternUnits', 'userSpaceOnUse');

    pattern
      .append('path')
      .attr('d', 'M 20 0 L 0 0 0 20')
      .attr('fill', 'none')
      .attr('stroke', '#e5e5e5')
      .attr('stroke-width', 0.5);

    // Create background rectangle to show grid
    this.svg
      .insert('rect', ':first-child')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', 'url(#grid)');
  }

  private setupZoom(): void {
    this.zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL])
      .on('zoom', event => {
        this.mainGroup.attr('transform', event.transform);
      })
      .on('start', () => {
        this.svg.style('cursor', 'grabbing');
      })
      .on('end', () => {
        this.svg.style('cursor', 'grab');
      });

    this.svg.call(this.zoomBehavior);

    // Handle background clicks to deselect tables
    this.svg.on('click', event => {
      if (event.target === this.svg.node()) {
        this.selectTable(null);
      }
    });
  }

  private setupResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          this.containerDimensions = {
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          };
        }
      });
      resizeObserver.observe(this.config.container);
    }
  }

  private setupLegend(): void {
    if (this.config.showLegend !== false) {
      // Default to responsive positioning
      const legendConfig = {
        responsive: true,
        position: 'bottom-right' as const,
        ...this.config.legendConfig,
      };
      this.legendComponent = new LegendComponent(this.svg, legendConfig);
    }
  }

  public async loadData(tables: Table[], relationships: Relationship[]): Promise<void> {
    this.clear();

    // Report starting layout calculation
    this.config.onRenderingProgress?.(5, 'Analyzing table structure...');

    // Use GraphLayoutEngine to calculate optimal positions
    const positions = await this.layoutEngine.calculateLayout(tables, relationships);

    // Report layout calculation complete
    this.config.onRenderingProgress?.(30, 'Calculating optimal positions...');

    // Track progress through table creation
    const totalItems = tables.length + relationships.length;
    let processedItems = 0;

    tables.forEach((table, index) => {
      const model = new TableModel(table, positions[index]);
      this.tableModels.set(table.id, model);

      const component = new TableComponent(this.mainGroup, model, {
        onTableClick: tableId => this.toggleTable(tableId),
        onTableDragStart: () => this.onTableDragStart(),
        onTableDrag: () => this.onTableDrag(),
        onTableDragEnd: () => this.onTableDragEnd(),
      });

      this.tableComponents.set(table.id, component);

      // Report progress after each table
      processedItems++;
      const progress = 30 + Math.floor((processedItems / totalItems) * 50);
      this.config.onRenderingProgress?.(progress, 'Positioning tables...');
    });

    // Report starting relationship creation
    this.config.onRenderingProgress?.(80, 'Positioning relationships...');

    // Create relationship models and components
    relationships.forEach((relationship, idx) => {
      const model = new RelationshipModel(relationship);
      this.relationshipModels.set(relationship.id, model);

      const component = new RelationshipComponent(this.mainGroup, model);
      this.relationshipComponents.set(relationship.id, component);

      // Report progress after each relationship
      processedItems++;
      const progress = 80 + Math.floor(((idx + 1) / relationships.length) * 15);
      this.config.onRenderingProgress?.(progress, 'Positioning relationships...');
    });

    // Wait for next frame to ensure table components are fully rendered
    await new Promise(resolve => requestAnimationFrame(resolve));

    this.updateRelationshipPositions();
    this.config.onRenderingProgress?.(95, 'Finalizing layout...');

    this.fitToScreen();
    this.config.onRenderingProgress?.(100, 'Complete');
  }

  private updateRelationshipHighlighting(): void {
    this.relationshipComponents.forEach(component => {
      const model = component.getModel();
      const shouldHighlight =
        this.selectedTables.size > 0 &&
        (this.selectedTables.has(model.fromTable) || this.selectedTables.has(model.toTable));

      component.setHighlighted(!!shouldHighlight);
    });
  }

  private onTableDragStart(): void {
    // Disable zoom during drag
    this.svg.on('.zoom', null);
  }

  private onTableDrag(): void {
    // Update relationship positions in real-time
    this.updateRelationshipPositions();
  }

  private onTableDragEnd(): void {
    // Re-enable zoom
    this.svg.call(this.zoomBehavior);
    this.config.onLayoutChange?.();
  }

  private updateRelationshipPositions(): void {
    const positionCalculator = new RelationshipPositionCalculator(this.tableModels);
    const relationshipGrouper = new RelationshipGrouper(this.relationshipComponents);

    const relationshipGroups = relationshipGrouper.groupByTablePairs();

    relationshipGroups.forEach(relationships => {
      positionCalculator.updateGroupPositions(relationships);
    });
  }

  public fitToScreen(): void {
    if (this.tableModels.size === 0) return;

    // Calculate bounding box for all tables
    const boundingBox = calculateTablesBoundingBox(this.tableModels);
    if (!boundingBox) return;

    // Add padding to the bounding box
    const paddedBoundingBox = {
      ...boundingBox,
      x: boundingBox.x - 50,
      y: boundingBox.y - 50,
      width: boundingBox.width + 100, // 50px padding on each side
      height: boundingBox.height + 100, // 50px padding on each side
    };

    // Apply zoom to fit all tables
    applyZoomToFit(this.svg, this.zoomBehavior, paddedBoundingBox, this.containerDimensions, {
      minZoom: MIN_ZOOM_LEVEL,
      maxZoom: MAX_ZOOM_LEVEL,
      scaleFactor: 0.9, // Leave some margin
      duration: 750,
    });
  }

  public focusOnTable(tableId: string): void {
    // Check if we have any table models at all
    if (this.tableModels.size === 0) {
      console.warn(
        `[${this.instanceId}] No table models loaded. Make sure loadData() has been called.`
      );
      return;
    }

    const model = this.tableModels.get(tableId);
    if (!model) {
      console.warn(`[${this.instanceId}] Table model not found: ${tableId}`);
      console.warn(
        `[${this.instanceId}] Available table IDs:`,
        Array.from(this.tableModels.keys())
      );
      return;
    }

    // Get the bounds of the table to focus on
    const bounds = model.getBounds();

    // For table focusing, use a more conservative max zoom
    const focusMaxZoom = Math.min(MAX_ZOOM_LEVEL, 2.5); // Cap focus zoom at 2.5x for better UX

    // Apply zoom to fit the table with appropriate padding
    applyZoomToFit(this.svg, this.zoomBehavior, bounds, this.containerDimensions, {
      minZoom: MIN_ZOOM_LEVEL,
      maxZoom: focusMaxZoom,
      padding: { factor: 0.6 }, // Leave 40% of the screen as padding around the table
      duration: 750,
    });
  }

  public toggleRelationshipVisibility(visible: boolean): void {
    this.relationshipComponents.forEach(component => {
      component.setVisible(visible);
    });
  }

  public clear(): void {
    this.tableComponents.forEach(component => component.destroy());
    this.relationshipComponents.forEach(component => component.destroy());

    this.tableModels.clear();
    this.relationshipModels.clear();
    this.tableComponents.clear();
    this.relationshipComponents.clear();

    this.selectedTables.clear();
  }

  public destroy(): void {
    this.tableComponents.forEach(component => component.destroy());
    this.relationshipComponents.forEach(component => component.destroy());
    this.legendComponent?.destroy();
    this.config.container.innerHTML = '';
  }

  public getSelectedTables(): string[] {
    return Array.from(this.selectedTables);
  }

  public selectTable(tableId: string | null): void {
    if (tableId === null) {
      // Clear selection
      this.selectedTables.clear();
    } else {
      // Always select the table (clear others for single selection)
      this.selectedTables.clear();
      this.selectedTables.add(tableId);
    }

    this.updateVisibility();
  }

  public toggleTable(tableId: string): void {
    let newSelectedTable: string | null = null;

    if (this.selectedTables.has(tableId)) {
      // Deselect if already selected
      this.selectedTables.delete(tableId);
      newSelectedTable = null;
    } else {
      // Select if not selected (clear others for single selection)
      this.selectedTables.clear();
      this.selectedTables.add(tableId);
      newSelectedTable = tableId;
    }

    this.updateVisibility();

    // Notify the parent component about the selection change
    this.config.onTableSelect?.(newSelectedTable);
  }

  private updateVisibility(): void {
    if (this.selectedTables.size === 0) {
      // Show all tables and relationships
      this.tableComponents.forEach(component => {
        component.setSelected(false);
        component.setGreyedOut(false);
      });
      this.relationshipComponents.forEach(component => {
        component.setVisible(true);
        component.setGreyedOut(false);
      });
    } else {
      // When tables are selected, grey out unrelated tables and relationships
      this.tableComponents.forEach((component, id) => {
        const isSelected = this.selectedTables.has(id);
        component.setSelected(isSelected);
        component.setGreyedOut(!isSelected); // Grey out non-selected tables
      });

      this.relationshipComponents.forEach(component => {
        const model = component.getModel();
        const isRelated =
          this.selectedTables.has(model.fromTable) || this.selectedTables.has(model.toTable);

        // Always keep relationships visible but grey out unrelated ones
        component.setVisible(true);
        component.setGreyedOut(!isRelated);
      });
    }

    this.updateRelationshipHighlighting();

    // Bring selected tables and their relationships to the front
    this.bringSelectedElementsToFront();
  }

  private bringSelectedElementsToFront(): void {
    if (this.selectedTables.size === 0) {
      // When nothing is selected, restore original rendering order
      this.restoreOriginalRenderOrder();
      return;
    }

    // First, collect all elements that should be moved to front
    const selectedTableIds = Array.from(this.selectedTables);
    const relatedRelationshipIds: string[] = [];

    // Find relationships connected to selected tables
    this.relationshipModels.forEach((model, id) => {
      if (this.selectedTables.has(model.fromTable) || this.selectedTables.has(model.toTable)) {
        relatedRelationshipIds.push(id);
      }
    });

    // Then bring tables to front (so they appear on top of relationships)
    selectedTableIds.forEach(id => {
      const component = this.tableComponents.get(id);
      if (component) {
        component.bringToFront();
      }
    });

    // Bring relationships to front first
    relatedRelationshipIds.forEach(id => {
      const component = this.relationshipComponents.get(id);
      if (component) {
        component.bringToFront();
      }
    });
  }

  // Restore the original rendering order: relationships in back, tables in front
  private restoreOriginalRenderOrder(): void {
    // Then place all tables on top
    this.tableComponents.forEach(component => {
      component.bringToFront();
    });

    // First place all relationships
    this.relationshipComponents.forEach(component => {
      component.bringToFront();
    });
  }

  public getCurrentZoomScale(): number {
    const transform = zoomTransform(this.svg.node()!);
    return transform.k;
  }

  public updateLayoutConfig(newConfig: Partial<LayoutConfig>): void {
    this.layoutEngine.updateConfig(newConfig);
  }

  public getLayoutConfig(): LayoutConfig {
    return this.layoutEngine.getConfig();
  }

  // Legend control methods
  public toggleLegend(): void {
    this.legendComponent?.toggle();
  }

  public setLegendVisible(visible: boolean): void {
    this.legendComponent?.setVisible(visible);
  }

  public setLegendPosition(position: LegendConfig['position']): void {
    this.legendComponent?.setPosition(position);
  }
}
