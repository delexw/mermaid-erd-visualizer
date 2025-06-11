import { select, type Selection } from 'd3-selection';
import type { TableModel, Position } from '../models/tableModel';

export class TableComponent {
  private model: TableModel;
  private svgGroup: Selection<SVGGElement, unknown, null, undefined>;
  private onTableClick?: (tableId: string) => void;
  private onTableDragStart?: (tableId: string, position: Position) => void;
  private onTableDrag?: (tableId: string, position: Position) => void;
  private onTableDragEnd?: (tableId: string) => void;

  constructor(
    parentSvg: Selection<SVGGElement, unknown, null, undefined>,
    model: TableModel,
    callbacks?: {
      onTableClick?: (tableId: string) => void;
      onTableDragStart?: (tableId: string, position: Position) => void;
      onTableDrag?: (tableId: string, position: Position) => void;
      onTableDragEnd?: (tableId: string) => void;
    }
  ) {
    this.model = model;
    this.onTableClick = callbacks?.onTableClick;
    this.onTableDragStart = callbacks?.onTableDragStart;
    this.onTableDrag = callbacks?.onTableDrag;
    this.onTableDragEnd = callbacks?.onTableDragEnd;

    // Create the main group for this table
    this.svgGroup = parentSvg
      .append('g')
      .attr('class', 'table-component')
      .attr('data-table-id', model.id);

    this.render();
    this.setupInteractions();
  }

  private render(): void {
    const bounds = this.model.getBounds();

    // Clear existing content
    this.svgGroup.selectAll('*').remove();

    // Position the group
    this.svgGroup.attr('transform', `translate(${bounds.x}, ${bounds.y})`);

    // Create table background
    this.svgGroup
      .append('rect')
      .attr('class', 'table-bg')
      .attr('width', bounds.width)
      .attr('height', bounds.height)
      .attr('rx', 8)
      .attr('fill', this.model.isSelected ? '#dbeafe' : '#ffffff')
      .attr('stroke', this.model.isSelected ? '#3b82f6' : '#d1d5db')
      .attr('stroke-width', this.model.isSelected ? 2 : 1)
      .attr('filter', this.model.isDragging ? 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' : 'none');

    // Create header background
    this.svgGroup
      .append('rect')
      .attr('class', 'table-header')
      .attr('width', bounds.width)
      .attr('height', 40)
      .attr('rx', 8)
      .attr('fill', this.model.isSelected ? '#3b82f6' : '#f3f4f6')
      .attr('stroke', 'none');

    // Add table name
    this.svgGroup
      .append('text')
      .attr('class', 'table-name')
      .attr('x', bounds.width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('fill', this.model.isSelected ? '#ffffff' : '#1f2937')
      .text(this.model.name);

    // Add fields using HTML foreign object for better text alignment
    const fieldsContainer = this.svgGroup
      .append('foreignObject')
      .attr('x', 0)
      .attr('y', 40)
      .attr('width', bounds.width)
      .attr('height', this.model.fields.length * 24);

    const fieldsDiv = fieldsContainer
      .append('xhtml:div')
      .style('width', '100%')
      .style('height', '100%')
      .style('font-family', 'Inter, sans-serif');

    this.model.fields.forEach((field, index) => {
      const fieldRow = fieldsDiv
        .append('xhtml:div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('gap', '8px')
        .style('height', '24px')
        .style('padding', '0 8px')
        .style('background-color', index % 2 === 1 ? '#f9fafb' : 'transparent');

      // Icons container with fixed width same as icon width
      const iconsContainer = fieldRow
        .append('xhtml:div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('gap', '4px')
        .style('width', '8px') // Fixed width same as icon size
        .style('flex-shrink', '0');

      // Primary key indicator
      if (field.isPrimaryKey) {
        iconsContainer
          .append('xhtml:div')
          .style('width', '8px')
          .style('height', '8px')
          .style('border-radius', '50%')
          .style('background-color', '#fbbf24')
          .style('border', '1px solid #f59e0b')
          .style('flex-shrink', '0');
      }

      // Foreign key indicator
      if (field.isForeignKey) {
        iconsContainer
          .append('xhtml:div')
          .style('width', '8px')
          .style('height', '8px')
          .style('background-color', '#10b981')
          .style('border', '1px solid #059669')
          .style('flex-shrink', '0');
      }

      // Field name
      fieldRow
        .append('xhtml:div')
        .style('flex', '1')
        .style('font-size', '12px')
        .style('font-weight', field.isPrimaryKey ? '600' : '400')
        .style('color', '#374151')
        .style('min-width', '0') // Allow text to shrink
        .style('white-space', 'nowrap')
        .style('overflow', 'hidden')
        .style('text-overflow', 'ellipsis')
        .text(field.name);

      // Field type
      fieldRow
        .append('xhtml:div')
        .style('font-size', '11px')
        .style('color', '#6b7280')
        .style('flex-shrink', '0')
        .text(field.type);
    });
  }

  private setupInteractions(): void {
    // Make the entire table clickable and draggable
    this.svgGroup
      .style('cursor', 'pointer')
      .on('click', (event) => {
        event.stopPropagation();
        this.onTableClick?.(this.model.id);
      });

    // Add drag behavior
    let dragStartPos: Position | null = null;
    let initialMousePos: Position | null = null;

    this.svgGroup
      .on('mousedown', (event) => {
        event.preventDefault();
        dragStartPos = { ...this.model.position };
        initialMousePos = { x: event.clientX, y: event.clientY };
        this.model.setDragging(true);
        this.onTableDragStart?.(this.model.id, this.model.position);
        this.update(); // Re-render with dragging state
      });

    // Global mouse events for dragging
    if (typeof window !== 'undefined') {
      const handleMouseMove = (event: MouseEvent) => {
        if (dragStartPos && initialMousePos && this.model.isDragging) {
          const deltaX = event.clientX - initialMousePos.x;
          const deltaY = event.clientY - initialMousePos.y;

          const newPosition: Position = {
            x: dragStartPos.x + deltaX,
            y: dragStartPos.y + deltaY
          };

          this.model.setPosition(newPosition);
          this.onTableDrag?.(this.model.id, newPosition);
          this.update();
        }
      };

      const handleMouseUp = () => {
        if (this.model.isDragging) {
          this.model.setDragging(false);
          this.onTableDragEnd?.(this.model.id);
          this.update();
          dragStartPos = null;
          initialMousePos = null;
        }
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  }

  public update(): void {
    this.render();
  }

  public destroy(): void {
    this.svgGroup.remove();
  }

  public getModel(): TableModel {
    return this.model;
  }
} 