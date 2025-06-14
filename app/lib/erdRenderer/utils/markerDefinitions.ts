import type { Selection } from 'd3-selection';

export interface MarkerConfig {
  size: 'small' | 'normal';
  highlighted?: boolean;
  prefix?: string;
}

export class MarkerDefinitions {
  private static instance: MarkerDefinitions;

  static getInstance(): MarkerDefinitions {
    if (!MarkerDefinitions.instance) {
      MarkerDefinitions.instance = new MarkerDefinitions();
    }
    return MarkerDefinitions.instance;
  }

  public createAllMarkers(
    svg: Selection<SVGSVGElement, unknown, null, undefined>,
    config: MarkerConfig = { size: 'normal' }
  ): void {
    // Get or create defs element
    let defs = svg.select<SVGDefsElement>('defs');
    if (defs.empty()) {
      defs = svg.append('defs');
    }

    const prefix = config.prefix || '';
    const highlighted = config.highlighted || false;

    // Use EXACT RelationshipComponent specifications
    const color = highlighted ? '#7c3aed' : '#6b7280';
    const strokeColor = highlighted ? '#7c3aed' : '#6b7280';

    // One marker (circle) - EXACT copy from RelationshipComponent
    this.createMarkerIfNotExists(defs, `${prefix}marker-one${highlighted ? '-highlighted' : ''}`, {
      viewBox: '0 0 12 12',
      refX: 6,
      refY: 6,
      markerWidth: 10,
      markerHeight: 10,
      content: marker => {
        marker
          .append('circle')
          .attr('cx', 6)
          .attr('cy', 6)
          .attr('r', 4)
          .attr('fill', 'none')
          .attr('stroke', strokeColor)
          .attr('stroke-width', highlighted ? 2.5 : 1.5);
      },
    });

    // Many marker (arrow) - EXACT copy from RelationshipComponent
    this.createMarkerIfNotExists(defs, `${prefix}marker-many${highlighted ? '-highlighted' : ''}`, {
      viewBox: '0 0 12 12',
      refX: 10,
      refY: 6,
      markerWidth: 10,
      markerHeight: 10,
      content: marker => {
        marker.append('path').attr('d', 'M2,2 L10,6 L2,10 z').attr('fill', color);
      },
    });

    // Many start marker - EXACT copy from RelationshipComponent
    this.createMarkerIfNotExists(
      defs,
      `${prefix}marker-many-start${highlighted ? '-highlighted' : ''}`,
      {
        viewBox: '0 0 12 12',
        refX: 2,
        refY: 6,
        markerWidth: 10,
        markerHeight: 10,
        content: marker => {
          marker.append('path').attr('d', 'M10,2 L2,6 L10,10 z').attr('fill', color);
        },
      }
    );

    // Zero or one marker (circle + line) - EXACT copy from RelationshipComponent
    this.createMarkerIfNotExists(
      defs,
      `${prefix}marker-zero-or-one${highlighted ? '-highlighted' : ''}`,
      {
        viewBox: '0 0 16 12',
        refX: 14,
        refY: 6,
        markerWidth: 12,
        markerHeight: 10,
        content: marker => {
          marker
            .append('circle')
            .attr('cx', 4)
            .attr('cy', 6)
            .attr('r', 3.5)
            .attr('fill', 'none')
            .attr('stroke', strokeColor)
            .attr('stroke-width', highlighted ? 2.5 : 1.5);

          marker
            .append('line')
            .attr('x1', 11)
            .attr('y1', 2)
            .attr('x2', 11)
            .attr('y2', 10)
            .attr('stroke', strokeColor)
            .attr('stroke-width', highlighted ? 2.5 : 2);
        },
      }
    );

    // Zero or one start marker - EXACT copy from RelationshipComponent
    this.createMarkerIfNotExists(
      defs,
      `${prefix}marker-zero-or-one-start${highlighted ? '-highlighted' : ''}`,
      {
        viewBox: '0 0 16 12',
        refX: 2,
        refY: 6,
        markerWidth: 12,
        markerHeight: 10,
        content: marker => {
          marker
            .append('line')
            .attr('x1', 5)
            .attr('y1', 2)
            .attr('x2', 5)
            .attr('y2', 10)
            .attr('stroke', strokeColor)
            .attr('stroke-width', highlighted ? 2.5 : 2);

          marker
            .append('circle')
            .attr('cx', 12)
            .attr('cy', 6)
            .attr('r', 3.5)
            .attr('fill', 'none')
            .attr('stroke', strokeColor)
            .attr('stroke-width', highlighted ? 2.5 : 1.5);
        },
      }
    );

    // Zero or more marker (circle + arrow) - EXACT copy from RelationshipComponent
    this.createMarkerIfNotExists(
      defs,
      `${prefix}marker-zero-or-more${highlighted ? '-highlighted' : ''}`,
      {
        viewBox: '0 0 18 12',
        refX: 16,
        refY: 6,
        markerWidth: 14,
        markerHeight: 10,
        content: marker => {
          marker
            .append('circle')
            .attr('cx', 4)
            .attr('cy', 6)
            .attr('r', 3.5)
            .attr('fill', 'none')
            .attr('stroke', strokeColor)
            .attr('stroke-width', highlighted ? 2.5 : 1.5);

          marker.append('path').attr('d', 'M9,2 L16,6 L9,10 z').attr('fill', color);
        },
      }
    );

    // Zero or more start marker - EXACT copy from RelationshipComponent
    this.createMarkerIfNotExists(
      defs,
      `${prefix}marker-zero-or-more-start${highlighted ? '-highlighted' : ''}`,
      {
        viewBox: '0 0 18 12',
        refX: 2,
        refY: 6,
        markerWidth: 14,
        markerHeight: 10,
        content: marker => {
          marker.append('path').attr('d', 'M9,2 L2,6 L9,10 z').attr('fill', color);

          marker
            .append('circle')
            .attr('cx', 14)
            .attr('cy', 6)
            .attr('r', 3.5)
            .attr('fill', 'none')
            .attr('stroke', strokeColor)
            .attr('stroke-width', highlighted ? 2.5 : 1.5);
        },
      }
    );

    // One or more marker (line + arrow) - EXACT copy from RelationshipComponent
    this.createMarkerIfNotExists(
      defs,
      `${prefix}marker-one-or-more${highlighted ? '-highlighted' : ''}`,
      {
        viewBox: '0 0 18 12',
        refX: 16,
        refY: 6,
        markerWidth: 14,
        markerHeight: 10,
        content: marker => {
          marker
            .append('line')
            .attr('x1', 4)
            .attr('y1', 2)
            .attr('x2', 4)
            .attr('y2', 10)
            .attr('stroke', strokeColor)
            .attr('stroke-width', highlighted ? 2.5 : 2);

          marker.append('path').attr('d', 'M9,2 L16,6 L9,10 z').attr('fill', color);
        },
      }
    );

    // One or more start marker - EXACT copy from RelationshipComponent
    this.createMarkerIfNotExists(
      defs,
      `${prefix}marker-one-or-more-start${highlighted ? '-highlighted' : ''}`,
      {
        viewBox: '0 0 18 12',
        refX: 2,
        refY: 6,
        markerWidth: 14,
        markerHeight: 10,
        content: marker => {
          marker.append('path').attr('d', 'M9,2 L2,6 L9,10 z').attr('fill', color);

          marker
            .append('line')
            .attr('x1', 14)
            .attr('y1', 2)
            .attr('x2', 14)
            .attr('y2', 10)
            .attr('stroke', strokeColor)
            .attr('stroke-width', highlighted ? 2.5 : 2);
        },
      }
    );
  }

  private createMarkerIfNotExists(
    defs: Selection<SVGDefsElement, unknown, null, undefined>,
    id: string,
    config: {
      viewBox: string;
      refX: number;
      refY: number;
      markerWidth: number;
      markerHeight: number;
      content: (marker: Selection<SVGMarkerElement, unknown, null, undefined>) => void;
    }
  ): void {
    // Only check if marker exists in DOM, don't rely on singleton state
    if (!defs.select(`#${id}`).empty()) {
      return;
    }

    const marker = defs
      .append('marker')
      .attr('id', id)
      .attr('viewBox', config.viewBox)
      .attr('refX', config.refX)
      .attr('refY', config.refY)
      .attr('markerWidth', config.markerWidth)
      .attr('markerHeight', config.markerHeight)
      .attr('orient', 'auto');

    config.content(marker);
  }

  public drawCardinalityInline(
    group: Selection<SVGGElement, unknown, null, undefined>,
    x: number,
    y: number,
    type: string
  ): void {
    // For legend drawing, use smaller versions of the RelationshipComponent markers
    const strokeColor = '#6b7280';
    const circleSize = 2.5;

    switch (type) {
      case 'one':
        // Draw circle
        group
          .append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', circleSize)
          .attr('fill', 'none')
          .attr('stroke', strokeColor)
          .attr('stroke-width', 1.2);
        break;

      case 'many':
        // Draw arrow
        group
          .append('path')
          .attr('d', `M${x - 6},${y - 3} L${x + 3},${y} L${x - 6},${y + 3} z`)
          .attr('fill', strokeColor);
        break;

      case 'zero-or-one':
        // Draw circle + line (scaled down from RelationshipComponent)
        group
          .append('circle')
          .attr('cx', x - 4)
          .attr('cy', y)
          .attr('r', circleSize)
          .attr('fill', 'none')
          .attr('stroke', strokeColor)
          .attr('stroke-width', 1.2);

        group
          .append('line')
          .attr('x1', x + 2)
          .attr('y1', y - 4)
          .attr('x2', x + 2)
          .attr('y2', y + 4)
          .attr('stroke', strokeColor)
          .attr('stroke-width', 1.5);
        break;

      case 'zero-or-more':
        // Draw circle + arrow (scaled down from RelationshipComponent)
        group
          .append('circle')
          .attr('cx', x - 6)
          .attr('cy', y)
          .attr('r', circleSize)
          .attr('fill', 'none')
          .attr('stroke', strokeColor)
          .attr('stroke-width', 1.2);

        group
          .append('path')
          .attr('d', `M${x - 1},${y - 3} L${x + 6},${y} L${x - 1},${y + 3} z`)
          .attr('fill', strokeColor);
        break;

      case 'one-or-more':
        // Draw line + arrow (scaled down from RelationshipComponent)
        group
          .append('line')
          .attr('x1', x - 6)
          .attr('y1', y - 4)
          .attr('x2', x - 6)
          .attr('y2', y + 4)
          .attr('stroke', strokeColor)
          .attr('stroke-width', 1.5);

        group
          .append('path')
          .attr('d', `M${x - 1},${y - 3} L${x + 6},${y} L${x - 1},${y + 3} z`)
          .attr('fill', strokeColor);
        break;
    }
  }
}
