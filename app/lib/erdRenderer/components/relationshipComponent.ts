import { type Selection } from 'd3-selection';

import type { RelationshipModel } from '../models/relationshipModel';
import type { Position } from '../models/tableModel';
import { MarkerDefinitions } from '../utils/markerDefinitions';

export class RelationshipComponent {
  private model: RelationshipModel;
  private svgGroup: Selection<SVGGElement, unknown, null, undefined>;
  private fromPosition: Position = { x: 0, y: 0 };
  private toPosition: Position = { x: 0, y: 0 };

  constructor(
    parentGroup: Selection<SVGGElement, unknown, null, undefined>,
    model: RelationshipModel
  ) {
    this.model = model;

    // Create the main group for this relationship
    this.svgGroup = parentGroup
      .append('g')
      .attr('class', 'relationship-component')
      .attr('data-relationship-id', model.id);

    // Get the SVG root element for marker definitions
    const svgRoot = parentGroup.select(function () {
      return this.ownerSVGElement;
    }) as Selection<SVGSVGElement, unknown, null, undefined>;

    this.createMarkerDefinitions(svgRoot);
    this.render();
  }

  private createMarkerDefinitions(svg: Selection<SVGSVGElement, unknown, null, undefined>): void {
    const markerDefs = MarkerDefinitions.getInstance();

    // Create normal size markers using the shared utility with exact RelationshipComponent specs
    markerDefs.createAllMarkers(svg, { size: 'normal', highlighted: false });

    // Create highlighted markers using the shared utility with exact RelationshipComponent specs
    markerDefs.createAllMarkers(svg, { size: 'normal', highlighted: true });
  }

  private render(): void {
    if (!this.model.isVisible) {
      this.svgGroup.style('display', 'none');
      return;
    }

    this.svgGroup.style('display', 'block');

    // Clear existing content
    this.svgGroup.selectAll('*').remove();

    const lineStyle = this.model.getLineStyle();
    const markers = this.model.getMarkers();
    const path = this.model.calculatePath(this.fromPosition, this.toPosition);

    // Create the relationship line
    const line = this.svgGroup
      .append('path')
      .attr('class', 'relationship-line')
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', lineStyle.stroke)
      .attr('stroke-width', lineStyle.strokeWidth);

    if (lineStyle.strokeDasharray) {
      line.attr('stroke-dasharray', lineStyle.strokeDasharray);
    }

    // Add markers
    const markerSuffix = this.model.isHighlighted ? '-highlighted' : '';

    // Choose the correct marker for start and end positions
    let startMarkerId = '';
    let endMarkerId = '';

    if (markers.from !== 'none') {
      // For start positions, use appropriate start-specific marker
      switch (markers.from) {
        case 'many':
          startMarkerId = `marker-many-start${markerSuffix}`;
          break;
        case 'zero-or-one':
          startMarkerId = `marker-zero-or-one-start${markerSuffix}`;
          break;
        case 'zero-or-more':
          startMarkerId = `marker-zero-or-more-start${markerSuffix}`;
          break;
        case 'one-or-more':
          startMarkerId = `marker-one-or-more-start${markerSuffix}`;
          break;
        default:
          startMarkerId = `marker-${markers.from}${markerSuffix}`;
      }
      line.attr('marker-start', `url(#${startMarkerId})`);
    }

    if (markers.to !== 'none') {
      endMarkerId = `marker-${markers.to}${markerSuffix}`;
      line.attr('marker-end', `url(#${endMarkerId})`);
    }

    // Add relationship label if there's a description
    if (this.model.description) {
      // Calculate label position based on relationship type
      let labelX: number, labelY: number;

      const isSelfReference = this.model.fromTable === this.model.toTable;

      if (isSelfReference) {
        // For self-referencing relationships, position label at the peak of the curve
        // This matches the loop created in RelationshipModel.calculatePath()
        const offsetX = 20;
        const offsetY = -20;
        const loopSize = 40;

        labelX = (this.fromPosition.x + this.toPosition.x) / 2 + offsetX;
        labelY = (this.fromPosition.y + this.toPosition.y) / 2 + offsetY - loopSize;
      } else {
        // For regular relationships, use the midpoint
        labelX = (this.fromPosition.x + this.toPosition.x) / 2;
        labelY = (this.fromPosition.y + this.toPosition.y) / 2;
      }

      // Calculate text dimensions using font metrics (more reliable than getBBox)
      const fontSize = 10;
      const estimatedCharWidth = fontSize * 0.6; // Approximate character width for Inter font
      const textWidth = this.model.description.length * estimatedCharWidth;
      const textHeight = fontSize * 1.2; // Line height

      // Create background rectangle first
      this.svgGroup
        .append('rect')
        .attr('x', labelX - textWidth / 2 - 3)
        .attr('y', labelY - textHeight / 2 - 2)
        .attr('width', textWidth + 6)
        .attr('height', textHeight + 4)
        .attr('fill', 'white')
        .attr('stroke', '#e5e7eb')
        .attr('stroke-width', 1)
        .attr('rx', 2);

      // Add text element on top
      this.svgGroup
        .append('text')
        .attr('x', labelX)
        .attr('y', labelY + fontSize / 3) // Adjust for baseline
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Inter, sans-serif')
        .attr('font-size', `${fontSize}px`)
        .attr('fill', '#4b5563')
        .text(this.model.description);
    }
  }

  public updatePositions(fromPos: Position, toPos: Position): void {
    this.fromPosition = fromPos;
    this.toPosition = toPos;
    this.render();
  }

  public update(): void {
    this.render();
  }

  public destroy(): void {
    this.svgGroup.remove();
  }

  public getModel(): RelationshipModel {
    return this.model;
  }

  public setVisible(visible: boolean): void {
    this.model.setVisible(visible);
    this.render();
  }

  public setHighlighted(highlighted: boolean): void {
    this.model.setHighlighted(highlighted);
    this.render();
  }

  // Bring this relationship to the front by moving it to the end of its parent's children
  public bringToFront(): void {
    const parent = this.svgGroup.node()?.parentNode;
    if (parent) {
      // Reattach to parent to bring to front in SVG rendering order
      parent.appendChild(this.svgGroup.node()!);
    }
  }
}
