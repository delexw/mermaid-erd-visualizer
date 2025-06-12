import type { Selection } from 'd3-selection';

import { MarkerDefinitions } from '../utils/markerDefinitions';

export interface LegendConfig {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  padding?: number;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  show?: boolean;
}

interface LegendItem {
  type: string;
  label: string;
  symbol: string;
}

export class LegendComponent {
  private svg: Selection<SVGSVGElement, unknown, null, undefined>;
  private legendGroup: Selection<SVGGElement, unknown, null, undefined>;
  private config: Required<LegendConfig>;
  private isVisible: boolean = true;

  constructor(svg: Selection<SVGSVGElement, unknown, null, undefined>, config: LegendConfig = {}) {
    this.svg = svg;
    this.config = {
      position: config.position || 'bottom-right',
      padding: config.padding || 12,
      backgroundColor: config.backgroundColor || '#ffffff',
      borderColor: config.borderColor || '#e5e7eb',
      textColor: config.textColor || '#374151',
      show: config.show || true,
    };

    this.legendGroup = svg.append('g').attr('class', 'legend-group').style('pointer-events', 'all');

    this.createMarkerDefinitions();
    this.render();
  }

  private createMarkerDefinitions(): void {
    const markerDefs = MarkerDefinitions.getInstance();

    // Create small size markers for legend
    markerDefs.createAllMarkers(this.svg, {
      size: 'small',
      highlighted: false,
      prefix: 'legend-',
    });
  }

  private render(): void {
    if (!this.config.show) {
      this.legendGroup.style('display', 'none');
      return;
    }

    this.legendGroup.style('display', 'block');
    this.legendGroup.selectAll('*').remove();

    // Organize items into two categories with shorter labels for better fit
    const cardinalityItems = [
      { label: '0 or 1', type: 'zero-or-one', symbol: 'o|' },
      { label: 'Exactly 1', type: 'one', symbol: '||' },
      { label: '0 or many', type: 'zero-or-more', symbol: 'o{' },
      { label: '1 or many', type: 'one-or-more', symbol: '}|' },
    ];

    const relationshipItems = [
      { label: 'Identifying', type: 'solid-line', symbol: '——' },
      { label: 'Non-identifying', type: 'dashed-line', symbol: '••' },
    ];

    // Two-column layout dimensions
    const itemHeight = 22;
    const sectionSpacing = 16; // Horizontal spacing between columns
    const titleHeight = 18;
    const padding = 12;
    const columnWidth = 140; // Width of each column
    const sectionHeaderHeight = 16;

    // Calculate total dimensions for two-column layout
    const maxCardinalityItems = cardinalityItems.length;
    const maxRelationshipItems = relationshipItems.length;
    const maxItemsInColumn = Math.max(maxCardinalityItems, maxRelationshipItems);
    const columnHeight = maxItemsInColumn * itemHeight;
    const totalHeight = titleHeight + sectionHeaderHeight + columnHeight + padding * 3;
    const totalWidth = columnWidth * 2 + sectionSpacing + padding * 2; // Two columns + spacing + padding

    // Create enhanced background rectangle with gradient
    this.legendGroup
      .append('rect')
      .attr('class', 'legend-background')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', totalWidth)
      .attr('height', totalHeight)
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('fill', this.config.backgroundColor)
      .attr('stroke', this.config.borderColor)
      .attr('stroke-width', 1.5)
      .style('filter', 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))');

    let currentY = padding;

    // Title with improved sizing
    this.legendGroup
      .append('text')
      .attr('x', totalWidth / 2)
      .attr('y', currentY + 12)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', this.config.textColor)
      .text('ERD Notation');

    currentY += titleHeight + padding;

    // Left Column - Cardinality section with colored background
    const leftColumnX = padding;
    const rightColumnX = padding + columnWidth + sectionSpacing;

    // Cardinality section background
    this.legendGroup
      .append('rect')
      .attr('x', leftColumnX - 4)
      .attr('y', currentY - 4)
      .attr('width', columnWidth + 8)
      .attr('height', sectionHeaderHeight + cardinalityItems.length * itemHeight + 8)
      .attr('rx', 4)
      .attr('fill', '#eff6ff') // Light blue background
      .attr('stroke', '#dbeafe')
      .attr('stroke-width', 1);

    // Cardinality section header
    this.legendGroup
      .append('text')
      .attr('x', leftColumnX + 4)
      .attr('y', currentY + 12)
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', '#1e40af')
      .text('CARDINALITY');

    // Render cardinality items
    cardinalityItems.forEach((item, index) => {
      const yPos = currentY + sectionHeaderHeight + index * itemHeight;
      this.drawCompactItem(item, leftColumnX + 4, yPos, 'cardinality', columnWidth - 8);
    });

    // Right Column - Relationship section with colored background
    this.legendGroup
      .append('rect')
      .attr('x', rightColumnX - 4)
      .attr('y', currentY - 4)
      .attr('width', columnWidth + 8)
      .attr('height', sectionHeaderHeight + relationshipItems.length * itemHeight + 8)
      .attr('rx', 4)
      .attr('fill', '#f0fdf4') // Light green background
      .attr('stroke', '#dcfce7')
      .attr('stroke-width', 1);

    // Relationship section header
    this.legendGroup
      .append('text')
      .attr('x', rightColumnX + 4)
      .attr('y', currentY + 12)
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', '#166534')
      .text('RELATIONSHIP');

    // Render relationship items
    relationshipItems.forEach((item, index) => {
      const yPos = currentY + sectionHeaderHeight + index * itemHeight;
      this.drawCompactItem(item, rightColumnX + 4, yPos, 'relationship', columnWidth - 8);
    });

    // Position the legend
    this.positionLegend(totalWidth, totalHeight);
  }

  private drawCompactItem(
    item: LegendItem,
    x: number,
    y: number,
    category: string,
    columnWidth: number = 140
  ): void {
    const iconX = x;
    const textX = x + 26; // Icon to text spacing
    const centerY = y + 11; // Adjusted for new item height
    const symbolX = x + columnWidth - 8; // Position symbol relative to column width

    if (category === 'cardinality') {
      // Draw cardinality marker
      this.drawCardinalityMarker(iconX + 10, centerY, item.type);
    } else {
      // Draw relationship line
      this.drawRelationshipLine(iconX, centerY, item.type);
    }

    // Add label text with better truncation handling
    this.legendGroup
      .append('text')
      .attr('x', textX)
      .attr('y', centerY + 3)
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '11px') // Slightly smaller for better fit
      .attr('font-weight', '500')
      .attr('fill', this.config.textColor)
      .text(item.label);

    // Add symbol text with better positioning
    this.legendGroup
      .append('text')
      .attr('x', symbolX)
      .attr('y', centerY + 3)
      .attr('text-anchor', 'end')
      .attr('font-family', 'JetBrains Mono, Monaco, monospace')
      .attr('font-size', '9px') // Smaller for compact display
      .attr('fill', '#9ca3af')
      .text(item.symbol);
  }

  private drawCardinalityMarker(x: number, y: number, type: string): void {
    const markerDefs = MarkerDefinitions.getInstance();
    markerDefs.drawCardinalityInline(this.legendGroup, x, y, type);
  }

  private drawRelationshipLine(x: number, y: number, type: string): void {
    const lineLength = 24; // Increased from default
    const strokeWidth = 2; // Increased thickness

    if (type === 'solid-line') {
      // Solid line
      this.legendGroup
        .append('line')
        .attr('x1', x)
        .attr('y1', y)
        .attr('x2', x + lineLength)
        .attr('y2', y)
        .attr('stroke', '#6b7280')
        .attr('stroke-width', strokeWidth);
    } else if (type === 'dashed-line') {
      // Dotted line
      this.legendGroup
        .append('line')
        .attr('x1', x)
        .attr('y1', y)
        .attr('x2', x + lineLength)
        .attr('y2', y)
        .attr('stroke', '#6b7280')
        .attr('stroke-width', strokeWidth)
        .attr('stroke-dasharray', '4,3'); // Slightly larger dashes for visibility
    }
  }

  private positionLegend(width: number, height: number): void {
    const svgNode = this.svg.node();
    if (!svgNode) return;

    // Use viewBox or fallback to reasonable defaults
    const viewBox = this.svg.attr('viewBox');
    let svgWidth = 800;
    let svgHeight = 600;

    if (viewBox) {
      const [, , w, h] = viewBox.split(' ').map(Number);
      svgWidth = w;
      svgHeight = h;
    } else {
      // Try to get actual dimensions
      const svgRect = svgNode.getBoundingClientRect();
      if (svgRect.width > 0) svgWidth = svgRect.width;
      if (svgRect.height > 0) svgHeight = svgRect.height;
    }

    const margin = 16;
    let x: number, y: number;

    switch (this.config.position) {
      case 'top-left':
        x = margin;
        y = margin;
        break;
      case 'top-right':
        x = svgWidth - width - margin;
        y = margin;
        break;
      case 'bottom-left':
        x = margin;
        y = svgHeight - height - margin;
        break;
      case 'bottom-right':
      default:
        x = svgWidth - width - margin;
        y = svgHeight - height - margin;
        break;
    }

    // Ensure legend stays within bounds
    x = Math.max(margin, Math.min(x, svgWidth - width - margin));
    y = Math.max(margin, Math.min(y, svgHeight - height - margin));

    this.legendGroup.attr('transform', `translate(${x}, ${y})`);
  }

  public setVisible(visible: boolean): void {
    this.config.show = visible;
    this.render();
  }

  public setPosition(position: LegendConfig['position']): void {
    if (position) {
      this.config.position = position;
      this.render();
    }
  }

  public destroy(): void {
    this.legendGroup.remove();
  }

  public toggle(): void {
    this.setVisible(!this.config.show);
  }
}
