import type { Selection } from 'd3-selection';

export interface MarkerConfig {
  size: 'small' | 'normal';
  highlighted?: boolean;
  greyedOut?: boolean;
  prefix?: string;
}

interface MarkerDefinition {
  id: string;
  viewBox: string;
  refX: number;
  refY: number;
  markerWidth: number;
  markerHeight: number;
  renderFn: (
    marker: Selection<SVGMarkerElement, unknown, null, undefined>,
    color: string,
    strokeColor: string,
    highlighted: boolean,
    greyedOut: boolean
  ) => void;
  renderInlineFn: (
    group: Selection<SVGGElement, unknown, null, undefined>,
    x: number,
    y: number,
    color: string,
    strokeColor: string,
    circleSize: number
  ) => void;
}

export class MarkerDefinitions {
  private static instance: MarkerDefinitions;

  static getInstance(): MarkerDefinitions {
    if (!MarkerDefinitions.instance) {
      MarkerDefinitions.instance = new MarkerDefinitions();
    }
    return MarkerDefinitions.instance;
  }

  private markerDefs: Record<string, MarkerDefinition> = {
    one: {
      id: 'marker-one',
      viewBox: '0 0 12 12',
      refX: 6,
      refY: 6,
      markerWidth: 10,
      markerHeight: 10,
      renderFn: (marker, _, strokeColor, highlighted, greyedOut) => {
        marker
          .append('circle')
          .attr('cx', 6)
          .attr('cy', 6)
          .attr('r', 4)
          .attr('fill', 'none')
          .attr('stroke', strokeColor)
          .attr('stroke-width', highlighted ? 2.5 : greyedOut ? 1 : 1.5);
      },
      renderInlineFn: (group, x, y, _, strokeColor, circleSize) => {
        group
          .append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', circleSize)
          .attr('fill', 'none')
          .attr('stroke', strokeColor)
          .attr('stroke-width', 1.2);
      },
    },
    many: {
      id: 'marker-many',
      viewBox: '0 0 12 12',
      refX: 10,
      refY: 6,
      markerWidth: 10,
      markerHeight: 10,
      renderFn: (marker, color) => {
        marker.append('path').attr('d', 'M2,2 L10,6 L2,10 z').attr('fill', color);
      },
      renderInlineFn: (group, x, y, color) => {
        group
          .append('path')
          .attr('d', `M${x - 6},${y - 3} L${x + 3},${y} L${x - 6},${y + 3} z`)
          .attr('fill', color);
      },
    },
    'many-start': {
      id: 'marker-many-start',
      viewBox: '0 0 12 12',
      refX: 2,
      refY: 6,
      markerWidth: 10,
      markerHeight: 10,
      renderFn: (marker, color) => {
        marker.append('path').attr('d', 'M10,2 L2,6 L10,10 z').attr('fill', color);
      },
      renderInlineFn: () => {
        // Not used in inline rendering
      },
    },
    'zero-or-one': {
      id: 'marker-zero-or-one',
      viewBox: '0 0 16 12',
      refX: 14,
      refY: 6,
      markerWidth: 12,
      markerHeight: 10,
      renderFn: (marker, _, strokeColor, highlighted, greyedOut) => {
        marker
          .append('circle')
          .attr('cx', 4)
          .attr('cy', 6)
          .attr('r', 3.5)
          .attr('fill', 'none')
          .attr('stroke', strokeColor)
          .attr('stroke-width', highlighted ? 2.5 : greyedOut ? 1 : 1.5);

        marker
          .append('line')
          .attr('x1', 11)
          .attr('y1', 2)
          .attr('x2', 11)
          .attr('y2', 10)
          .attr('stroke', strokeColor)
          .attr('stroke-width', highlighted ? 2.5 : greyedOut ? 1 : 2);
      },
      renderInlineFn: (group, x, y, _, strokeColor, circleSize) => {
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
      },
    },
    'zero-or-one-start': {
      id: 'marker-zero-or-one-start',
      viewBox: '0 0 16 12',
      refX: 2,
      refY: 6,
      markerWidth: 12,
      markerHeight: 10,
      renderFn: (marker, _, strokeColor, highlighted, greyedOut) => {
        marker
          .append('line')
          .attr('x1', 5)
          .attr('y1', 2)
          .attr('x2', 5)
          .attr('y2', 10)
          .attr('stroke', strokeColor)
          .attr('stroke-width', highlighted ? 2.5 : greyedOut ? 1 : 2);

        marker
          .append('circle')
          .attr('cx', 12)
          .attr('cy', 6)
          .attr('r', 3.5)
          .attr('fill', 'none')
          .attr('stroke', strokeColor)
          .attr('stroke-width', highlighted ? 2.5 : greyedOut ? 1 : 1.5);
      },
      renderInlineFn: () => {
        // Not used in inline rendering
      },
    },
    'zero-or-more': {
      id: 'marker-zero-or-more',
      viewBox: '0 0 18 12',
      refX: 16,
      refY: 6,
      markerWidth: 14,
      markerHeight: 10,
      renderFn: (marker, color, strokeColor, highlighted, greyedOut) => {
        marker
          .append('circle')
          .attr('cx', 4)
          .attr('cy', 6)
          .attr('r', 3.5)
          .attr('fill', 'none')
          .attr('stroke', strokeColor)
          .attr('stroke-width', highlighted ? 2.5 : greyedOut ? 1 : 1.5);

        marker.append('path').attr('d', 'M9,2 L16,6 L9,10 z').attr('fill', color);
      },
      renderInlineFn: (group, x, y, color, strokeColor, circleSize) => {
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
          .attr('fill', color);
      },
    },
    'zero-or-more-start': {
      id: 'marker-zero-or-more-start',
      viewBox: '0 0 18 12',
      refX: 2,
      refY: 6,
      markerWidth: 14,
      markerHeight: 10,
      renderFn: (marker, color, strokeColor, highlighted, greyedOut) => {
        marker.append('path').attr('d', 'M9,2 L2,6 L9,10 z').attr('fill', color);

        marker
          .append('circle')
          .attr('cx', 14)
          .attr('cy', 6)
          .attr('r', 3.5)
          .attr('fill', 'none')
          .attr('stroke', strokeColor)
          .attr('stroke-width', highlighted ? 2.5 : greyedOut ? 1 : 1.5);
      },
      renderInlineFn: () => {
        // Not used in inline rendering
      },
    },
    'one-or-more': {
      id: 'marker-one-or-more',
      viewBox: '0 0 18 12',
      refX: 16,
      refY: 6,
      markerWidth: 14,
      markerHeight: 10,
      renderFn: (marker, color, strokeColor, highlighted, greyedOut) => {
        marker
          .append('line')
          .attr('x1', 4)
          .attr('y1', 2)
          .attr('x2', 4)
          .attr('y2', 10)
          .attr('stroke', strokeColor)
          .attr('stroke-width', highlighted ? 2.5 : greyedOut ? 1 : 2);

        marker.append('path').attr('d', 'M9,2 L16,6 L9,10 z').attr('fill', color);
      },
      renderInlineFn: (group, x, y, color, strokeColor) => {
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
          .attr('fill', color);
      },
    },
    'one-or-more-start': {
      id: 'marker-one-or-more-start',
      viewBox: '0 0 18 12',
      refX: 2,
      refY: 6,
      markerWidth: 14,
      markerHeight: 10,
      renderFn: (marker, color, strokeColor, highlighted, greyedOut) => {
        marker.append('path').attr('d', 'M9,2 L2,6 L9,10 z').attr('fill', color);

        marker
          .append('line')
          .attr('x1', 14)
          .attr('y1', 2)
          .attr('x2', 14)
          .attr('y2', 10)
          .attr('stroke', strokeColor)
          .attr('stroke-width', highlighted ? 2.5 : greyedOut ? 1 : 2);
      },
      renderInlineFn: () => {
        // Not used in inline rendering
      },
    },
  };

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
    const greyedOut = config.greyedOut || false;

    // Set color based on state
    const color = this.getColor(highlighted, greyedOut);
    const strokeColor = color;

    // Determine the marker suffix
    const suffix = this.getSuffix(highlighted, greyedOut);

    // Create all markers
    Object.entries(this.markerDefs).forEach(([_, def]) => {
      const markerId = `${prefix}${def.id}${suffix}`;
      this.createMarkerIfNotExists(defs, markerId, {
        viewBox: def.viewBox,
        refX: def.refX,
        refY: def.refY,
        markerWidth: def.markerWidth,
        markerHeight: def.markerHeight,
        content: marker => def.renderFn(marker, color, strokeColor, highlighted, greyedOut),
      });
    });
  }

  private getColor(highlighted: boolean, greyedOut: boolean): string {
    if (highlighted) {
      return '#8b5cf6'; // Purple for highlighted relationships
    } else if (greyedOut) {
      return '#9ca3af'; // Darker grey for greyed out to improve visibility
    } else {
      return '#0ea5e9'; // Sky blue for default state - colorful default
    }
  }

  private getSuffix(highlighted: boolean, greyedOut: boolean): string {
    if (highlighted) {
      return '-highlighted';
    } else if (greyedOut) {
      return '-greyed';
    }
    return '';
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
    const color = strokeColor;
    const circleSize = 2.5;

    // Get the marker definition by type
    const markerDef = this.markerDefs[type];
    if (markerDef) {
      markerDef.renderInlineFn(group, x, y, color, strokeColor, circleSize);
    }
  }
}
