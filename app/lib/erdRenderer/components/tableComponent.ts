import { type Selection } from 'd3-selection';

import type { TableModel, Position } from '../models/tableModel';

export class TableComponent {
  private model: TableModel;
  private svgGroup: Selection<SVGGElement, unknown, null, undefined>;
  private onTableClick?: (tableId: string) => void;
  private onTableDragStart?: (tableId: string, position: Position) => void;
  private onTableDrag?: (tableId: string, position: Position) => void;
  private onTableDragEnd?: (tableId: string) => void;

  // Drag state
  private mouseDownPos: { x: number; y: number } | null = null;
  private dragStartPos: Position | null = null;
  private hasMoved = false;

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
  }

  private render(): void {
    // Clear existing content
    this.svgGroup.selectAll('*').remove();

    const bounds = this.model.getBounds();

    // Position the group
    this.svgGroup.attr('transform', `translate(${bounds.x}, ${bounds.y})`);

    // Create a single foreignObject that contains the entire table as HTML
    const foreignObject = this.svgGroup
      .append('foreignObject')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', bounds.width)
      .attr('height', bounds.height);

    // Determine table styling based on selection and greyed out state
    let backgroundColor, borderStyle, headerStyle, textColor;

    if (this.model.isSelected) {
      backgroundColor = '#eef2ff'; // Softer indigo/blue bg for selected
      borderStyle = '2px solid #6366f1'; // Softer indigo border for selected
      headerStyle = '#6366f1'; // Softer indigo header for selected
      textColor = '#1f2937'; // Normal text for selected
    } else if (this.model.isGreyedOut) {
      backgroundColor = '#f9fafb'; // Very light grey bg for greyed out
      borderStyle = '1px solid #9ca3af'; // Darker border for greyed out to improve visibility
      headerStyle = '#e5e7eb'; // Slightly darker grey header for greyed out
      textColor = '#6b7280'; // Darker grey text for greyed out to improve visibility
    } else {
      backgroundColor = '#ffffff'; // Regular white bg
      borderStyle = '1px solid #38bdf8'; // Sky blue border for default tables
      headerStyle = '#bae6fd'; // Light sky blue header background for default tables
      textColor = '#1f2937'; // Regular text
    }

    // Create the main table container div
    const tableDiv = foreignObject
      .append('xhtml:div')
      .style('width', '100%')
      .style('height', '100%')
      .style('font-family', 'Inter, sans-serif')
      .style('cursor', 'pointer')
      .style('user-select', 'none')
      .style('background-color', backgroundColor)
      .style('border', borderStyle)
      .style('border-radius', '8px')
      .style('box-shadow', '0 1px 3px 0 rgba(0, 0, 0, 0.1)')
      .style('overflow', 'hidden')
      .style('display', 'flex')
      .style('flex-direction', 'column')
      .style('box-sizing', 'border-box')
      .style('opacity', this.model.isGreyedOut ? '0.85' : '1');

    // Handle both click and drag on the HTML div to avoid conflicts
    tableDiv.on('mousedown', event => {
      this.mouseDownPos = { x: event.clientX, y: event.clientY };
      this.dragStartPos = { ...this.model.position };
      this.hasMoved = false;
      // Don't set model.isDragging = true here - only when we actually start dragging

      event.preventDefault(); // Prevent text selection
      event.stopPropagation(); // Prevent SVG container from receiving the event

      // Attach global listeners for potential drag operation
      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('mouseup', this.handleMouseUp);
    });

    tableDiv.on('click', event => {
      // Only handle click if we haven't moved (not a drag)
      if (!this.hasMoved) {
        console.log('Table div clicked:', this.model.id);
        event.preventDefault();
        event.stopPropagation(); // Prevent SVG container from receiving the event
        this.onTableClick?.(this.model.id);
      }
    });

    // Create table header
    tableDiv
      .append('xhtml:div')
      .style('background-color', headerStyle)
      .style('color', this.model.isSelected ? '#ffffff' : textColor)
      .style('padding', '12px 16px')
      .style('font-weight', '600')
      .style('font-size', '14px')
      .style('border-bottom', '1px solid #e5e7eb')
      .style('flex-shrink', '0')
      .text(this.model.name);

    // Create fields container
    const fieldsContainer = tableDiv
      .append('xhtml:div')
      .style('flex', '1')
      .style('overflow', 'hidden')
      .style('display', 'flex')
      .style('flex-direction', 'column');

    // Add each field as a div row
    this.model.fields.forEach((field, index) => {
      const fieldDiv = fieldsContainer
        .append('xhtml:div')
        .style('padding', '8px 16px')
        .style('border-bottom', index < this.model.fields.length - 1 ? '1px solid #f3f4f6' : 'none')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('font-size', '12px')
        .style('background-color', index % 2 === 1 ? '#f9fafb' : 'transparent')
        .style('min-height', '24px')
        .style('gap', '8px');

      // Icons container with fixed width
      const iconsContainer = fieldDiv
        .append('xhtml:div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('gap', '4px')
        .style('width', '16px')
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
      fieldDiv
        .append('xhtml:div')
        .style('flex', '1')
        .style('font-weight', field.isPrimaryKey ? '600' : '400')
        .style('color', textColor)
        .style('min-width', '0')
        .style('white-space', 'nowrap')
        .style('overflow', 'hidden')
        .style('text-overflow', 'ellipsis')
        .text(field.name);

      // Field type
      fieldDiv
        .append('xhtml:div')
        .style('color', this.model.isGreyedOut ? '#d1d5db' : '#0284c7')
        .style('font-size', '10px')
        .style('white-space', 'nowrap')
        .text(field.type);
    });
  }

  public update(): void {
    this.render();
  }

  public destroy(): void {
    // Clean up any active drag state and listeners
    if (this.mouseDownPos) {
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mouseup', this.handleMouseUp);
    }

    // Reset all state
    this.model.setDragging(false);
    this.mouseDownPos = null;
    this.dragStartPos = null;
    this.hasMoved = false;

    // Remove the component
    this.svgGroup.remove();
  }

  public getModel(): TableModel {
    return this.model;
  }

  private handleMouseMove = (event: MouseEvent): void => {
    // Only proceed if we have valid mouse down state
    if (!this.mouseDownPos || !this.dragStartPos) {
      return;
    }

    const deltaX = event.clientX - this.mouseDownPos.x;
    const deltaY = event.clientY - this.mouseDownPos.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Only start dragging if we've moved more than 5 pixels
    if (distance > 5) {
      this.hasMoved = true;

      // Start dragging if not already (this is where we actually start dragging)
      if (!this.model.isDragging) {
        this.model.setDragging(true);
        this.onTableDragStart?.(this.model.id, this.model.position);
      }

      // Get the current zoom transform to adjust coordinates
      const svg = this.svgGroup.node()?.ownerSVGElement;
      let scale = 1;
      if (svg) {
        const transform = svg.getAttribute('transform') || '';
        const scaleMatch = transform.match(/scale\(([^)]+)\)/);
        if (scaleMatch) {
          scale = parseFloat(scaleMatch[1]);
        }
      }

      // Apply the delta to the original position
      const newX = this.dragStartPos.x + deltaX / scale;
      const newY = this.dragStartPos.y + deltaY / scale;

      // Update position
      this.model.setPosition({ x: newX, y: newY });

      // Update visual position
      this.svgGroup.attr('transform', `translate(${newX}, ${newY})`);

      // Notify parent about drag
      this.onTableDrag?.(this.model.id, { x: newX, y: newY });
      this.update();
    }
  };

  private handleMouseUp = (): void => {
    // Stop dragging
    if (this.model.isDragging) {
      this.model.setDragging(false);
      this.onTableDragEnd?.(this.model.id);
    }

    // Clean up listeners to prevent memory leaks
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);

    // Reset state
    this.mouseDownPos = null;
    this.dragStartPos = null;
  };

  public bringToFront(): void {
    const parent = this.svgGroup.node()?.parentNode;
    if (parent) {
      // Reattach to parent to bring to front in SVG rendering order
      parent.appendChild(this.svgGroup.node()!);
    }
  }

  // Add setter methods to match the pattern in other components
  public setSelected(selected: boolean): void {
    this.model.setSelected(selected);
    this.render();
  }

  public setGreyedOut(greyedOut: boolean): void {
    this.model.setGreyedOut(greyedOut);
    this.render();
  }

  public setDragging(dragging: boolean): void {
    this.model.setDragging(dragging);
    this.render();
  }

  public setPosition(position: Position): void {
    this.model.setPosition(position);
    this.render();
  }
}
