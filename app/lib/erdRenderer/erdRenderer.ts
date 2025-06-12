import { select, type Selection } from 'd3-selection';
import { zoom, zoomIdentity, zoomTransform, type ZoomBehavior } from 'd3-zoom';

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
// Zoom level constants (should match setupZoom scaleExtent)
const MIN_ZOOM_LEVEL = 0.01;
const MAX_ZOOM_LEVEL = 5;

export interface ERDRendererConfig {
  container: HTMLElement;
  onTableSelect?: (tableId: string | null) => void;
  onLayoutChange?: () => void;
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
    this.instanceId = `ERDRenderer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
      // Default to true
      this.legendComponent = new LegendComponent(this.svg, this.config.legendConfig);
    }
  }

  public async loadData(tables: Table[], relationships: Relationship[]): Promise<void> {
    this.clear();

    // Use GraphLayoutEngine to calculate optimal positions
    const positions = await this.layoutEngine.calculateLayout(tables, relationships);

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
    });
    // Create relationship models and components
    relationships.forEach(relationship => {
      const model = new RelationshipModel(relationship);
      this.relationshipModels.set(relationship.id, model);

      const component = new RelationshipComponent(this.mainGroup, model);
      this.relationshipComponents.set(relationship.id, component);
    });

    // Wait for next frame to ensure table components are fully rendered
    await new Promise(resolve => requestAnimationFrame(resolve));

    this.updateRelationshipPositions();
    this.fitToScreen();
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

    // Get actual container dimensions (fallback if ResizeObserver hasn't fired yet)
    let containerWidth = this.containerDimensions.width;
    let containerHeight = this.containerDimensions.height;

    if (containerWidth === 0 || containerHeight === 0) {
      try {
        const svgElement = this.svg.node();
        if (svgElement && svgElement.parentElement) {
          // Use parent container dimensions instead of SVG getBoundingClientRect
          const parentRect = svgElement.parentElement.getBoundingClientRect();
          containerWidth = parentRect.width;
          containerHeight = parentRect.height;

          // Update containerDimensions for future use
          this.containerDimensions = {
            width: containerWidth,
            height: containerHeight,
          };
        }
      } catch (error) {
        console.warn('Error getting container dimensions:', error);
        // Fallback to reasonable defaults
        containerWidth = 800;
        containerHeight = 600;
      }
    }

    // If we still don't have valid dimensions, exit
    if (containerWidth <= 0 || containerHeight <= 0) return;

    // Calculate bounding box of all tables
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    this.tableModels.forEach(model => {
      const bounds = model.getBounds();
      minX = Math.min(minX, bounds.x);
      minY = Math.min(minY, bounds.y);
      maxX = Math.max(maxX, bounds.x + bounds.width);
      maxY = Math.max(maxY, bounds.y + bounds.height);
    });

    if (minX === Infinity) return;

    const padding = 50;
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const scaleX = containerWidth / width;
    const scaleY = containerHeight / height;
    const scale = Math.min(scaleX, scaleY, 1) * 0.9; // Cap scale at 1 to prevent over-zooming

    // Ensure scale is valid
    if (!isFinite(scale) || scale <= 0) {
      console.warn('Invalid scale calculated:', scale);
      return;
    }

    const translateX = containerWidth / 2 - centerX * scale;
    const translateY = containerHeight / 2 - centerY * scale;

    // Ensure translations are valid
    if (!isFinite(translateX) || !isFinite(translateY)) {
      console.warn('Invalid translation calculated:', translateX, translateY);
      return;
    }

    try {
      const transform = zoomIdentity.translate(translateX, translateY).scale(scale);
      this.svg.transition().duration(750).call(this.zoomBehavior.transform, transform);
    } catch (error) {
      console.error('Error applying zoom transform:', error);
    }
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

    // Get actual container dimensions
    let containerWidth = this.containerDimensions.width;
    let containerHeight = this.containerDimensions.height;

    if (containerWidth === 0 || containerHeight === 0) {
      try {
        const svgElement = this.svg.node();
        if (svgElement?.parentElement) {
          const parentRect = svgElement.parentElement.getBoundingClientRect();
          containerWidth = parentRect.width;
          containerHeight = parentRect.height;
          this.containerDimensions = { width: containerWidth, height: containerHeight };
        }
      } catch (error) {
        console.warn('Error getting container dimensions:', error);
        containerWidth = 800;
        containerHeight = 600;
      }
    }

    if (containerWidth <= 0 || containerHeight <= 0) {
      console.warn('Invalid container dimensions:', containerWidth, containerHeight);
      return;
    }

    // Get table bounds
    const bounds = model.getBounds();
    const tableCenterX = bounds.x + bounds.width / 2;
    const tableCenterY = bounds.y + bounds.height / 2;

    // Calculate optimal scale to fit the table nicely in the viewport
    const paddingFactor = 0.6; // Leave 40% padding around the table for better visual spacing
    const availableWidth = containerWidth * paddingFactor;
    const availableHeight = containerHeight * paddingFactor;

    const scaleX = availableWidth / bounds.width;
    const scaleY = availableHeight / bounds.height;

    // Use the smaller scale to ensure the table fits entirely
    let optimalScale = Math.min(scaleX, scaleY);

    // For table focusing, use a more conservative max zoom to prevent overly large tables
    const focusMaxZoom = Math.min(MAX_ZOOM_LEVEL, 2.5); // Cap focus zoom at 2.5x for better UX

    // Clamp the scale within reasonable limits
    optimalScale = Math.max(MIN_ZOOM_LEVEL, Math.min(focusMaxZoom, optimalScale));

    // Calculate translation to center the table
    const translateX = containerWidth / 2 - tableCenterX * optimalScale;
    const translateY = containerHeight / 2 - tableCenterY * optimalScale;

    // Validate transform values
    if (!isFinite(translateX) || !isFinite(translateY) || !isFinite(optimalScale)) {
      console.warn('Invalid transform values:', { translateX, translateY, optimalScale });
      return;
    }

    try {
      const transform = zoomIdentity.translate(translateX, translateY).scale(optimalScale);
      this.svg
        .transition()
        .duration(750)
        .ease((t: number) => t * t * (3 - 2 * t)) // Smooth ease-in-out
        .call(this.zoomBehavior.transform, transform);
    } catch (error) {
      console.error('Error applying focus transform:', error);
    }
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

    // Clear all content from the main group, including any lingering elements
    this.mainGroup.selectAll('*').remove();
    // Also clear any defs that might have been added (markers, patterns, etc.)
    this.svg.select('defs').selectAll('marker').remove();
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
    if (this.selectedTables.has(tableId)) {
      // Deselect if already selected
      this.selectedTables.delete(tableId);
    } else {
      // Select if not selected (clear others for single selection)
      this.selectedTables.clear();
      this.selectedTables.add(tableId);
    }
    this.updateVisibility();
  }

  private updateVisibility(): void {
    if (this.selectedTables.size === 0) {
      // Show all tables and relationships
      this.tableModels.forEach(model => {
        model.setSelected(false);
      });
      this.tableComponents.forEach(component => component.update());
      this.relationshipComponents.forEach(component => component.setVisible(true));
    } else {
      // Show only selected tables and their relationships
      this.tableModels.forEach((table, id) => {
        const isSelected = this.selectedTables.has(id);
        table.setSelected(isSelected);
        const component = this.tableComponents.get(id);
        component?.update();
      });

      this.relationshipComponents.forEach((relationship, id) => {
        const isVisible =
          this.selectedTables.has(relationship.getModel().fromTable) ||
          this.selectedTables.has(relationship.getModel().toTable);
        const component = this.relationshipComponents.get(id);
        component?.setVisible(isVisible);
      });
    }

    this.updateRelationshipHighlighting();
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
