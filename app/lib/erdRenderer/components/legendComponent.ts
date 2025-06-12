import { select, type Selection } from 'd3-selection';

import { MarkerDefinitions } from '../utils/markerDefinitions';

export interface LegendConfig {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  padding?: number;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  show?: boolean;
  responsive?: boolean;
  className?: string;
}

interface LegendItem {
  type: string;
  label: string;
  symbol: string;
  category: 'cardinality' | 'relationship';
}

export class LegendComponent {
  private container: HTMLElement;
  private legendElement: HTMLDivElement;
  private config: Required<LegendConfig>;
  private isVisible: boolean = true;
  private svg: Selection<SVGSVGElement, unknown, null, undefined>;

  constructor(svg: Selection<SVGSVGElement, unknown, null, undefined>, config: LegendConfig = {}) {
    this.svg = svg;
    this.config = {
      position: config.position || 'bottom-right',
      padding: config.padding || 16,
      backgroundColor: config.backgroundColor || '#ffffff',
      borderColor: config.borderColor || '#e5e7eb',
      textColor: config.textColor || '#374151',
      show: config.show !== false,
      responsive: config.responsive !== false,
      className: config.className || '',
    };

    // Get the container element (parent of SVG)
    const svgNode = svg.node();
    if (!svgNode?.parentElement) {
      throw new Error('SVG must have a parent element to create legend overlay');
    }

    this.container = svgNode.parentElement;
    this.legendElement = this.createLegendElement();

    if (this.config.show) {
      this.render();
    }
  }

  private createLegendElement(): HTMLDivElement {
    const legend = document.createElement('div');
    legend.className = `erd-legend ${this.config.className}`.trim();

    // Ensure the container has relative positioning
    if (window.getComputedStyle(this.container).position === 'static') {
      this.container.style.position = 'relative';
    }

    this.container.appendChild(legend);
    return legend;
  }

  private render(): void {
    if (!this.config.show) {
      this.legendElement.style.display = 'none';
      return;
    }

    this.legendElement.style.display = 'block';
    this.applyStyles();
    this.renderContent();
  }

  private applyStyles(): void {
    // Base Tailwind classes
    const baseClasses = [
      'absolute',
      'z-50',
      'bg-white',
      'border',
      'border-gray-200',
      'rounded-lg',
      'shadow-lg',
      'font-sans',
      'text-sm',
      'text-gray-700',
      'min-w-72',
      'max-w-80',
      'pointer-events-auto',
    ];

    // Apply custom background and border colors if specified
    if (this.config.backgroundColor !== '#ffffff') {
      this.legendElement.style.backgroundColor = this.config.backgroundColor;
    }
    if (this.config.borderColor !== '#e5e7eb') {
      this.legendElement.style.borderColor = this.config.borderColor;
    }
    if (this.config.textColor !== '#374151') {
      this.legendElement.style.color = this.config.textColor;
    }

    // Apply padding
    const paddingClass = this.getPaddingClass();
    baseClasses.push(paddingClass);

    // Apply positioning classes
    const positionClasses = this.getPositionClasses();
    baseClasses.push(...positionClasses);

    // Apply responsive classes
    if (this.config.responsive) {
      const responsiveClasses = this.getResponsiveClasses();
      baseClasses.push(...responsiveClasses);
    }

    this.legendElement.className =
      `erd-legend ${this.config.className} ${baseClasses.join(' ')}`.trim();
  }

  private getPaddingClass(): string {
    const padding = this.config.padding;
    if (padding <= 8) return 'p-2';
    if (padding <= 12) return 'p-3';
    if (padding <= 16) return 'p-4';
    if (padding <= 20) return 'p-5';
    return 'p-6';
  }

  private getPositionClasses(): string[] {
    switch (this.config.position) {
      case 'top-left':
        return [
          'top-2',
          'left-2',
          'sm:top-3',
          'sm:left-3',
          'md:top-4',
          'md:left-4',
          'lg:top-6',
          'lg:left-6',
        ];
      case 'top-right':
        return [
          'top-2',
          'right-2',
          'sm:top-3',
          'sm:right-3',
          'md:top-4',
          'md:right-4',
          'lg:top-6',
          'lg:right-6',
        ];
      case 'bottom-left':
        return [
          'bottom-2',
          'left-2',
          'sm:bottom-3',
          'sm:left-3',
          'md:bottom-4',
          'md:left-4',
          'lg:bottom-6',
          'lg:left-6',
        ];
      case 'bottom-right':
        return [
          'bottom-2',
          'right-2',
          'sm:bottom-3',
          'sm:right-3',
          'md:bottom-4',
          'md:right-4',
          'lg:bottom-6',
          'lg:right-6',
        ];
      case 'center':
        return ['top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2'];
      default:
        return [
          'bottom-2',
          'right-2',
          'sm:bottom-3',
          'sm:right-3',
          'md:bottom-4',
          'md:right-4',
          'lg:bottom-6',
          'lg:right-6',
        ];
    }
  }

  private getResponsiveClasses(): string[] {
    return [
      // Mobile adjustments
      'sm:text-sm',
      'sm:min-w-72',
      'sm:max-w-80',
      'sm:p-4',
      // Tablet adjustments
      'md:text-base',
      'md:min-w-80',
      'md:max-w-96',
      'md:p-5',
      // Very small screens - full width at bottom with proper gaps
      'max-sm:fixed',
      'max-sm:bottom-2',
      'max-sm:left-2',
      'max-sm:right-2',
      'max-sm:max-w-none',
      'max-sm:transform-none',
      'max-sm:translate-x-0',
      'max-sm:translate-y-0',
      // Ensure gaps are maintained on very small screens
      'max-sm:!bottom-2',
      'max-sm:!left-2',
      'max-sm:!right-2',
    ];
  }

  private renderContent(): void {
    const cardinalityItems: LegendItem[] = [
      { label: '0 or 1', type: 'zero-or-one', symbol: 'o|', category: 'cardinality' },
      { label: 'Exactly 1', type: 'one', symbol: '||', category: 'cardinality' },
      { label: '0 or many', type: 'zero-or-more', symbol: 'o{', category: 'cardinality' },
      { label: '1 or many', type: 'one-or-more', symbol: '}|', category: 'cardinality' },
    ];

    const relationshipItems: LegendItem[] = [
      { label: 'Identifying', type: 'solid-line', symbol: '——', category: 'relationship' },
      { label: 'Non-identifying', type: 'dashed-line', symbol: '••', category: 'relationship' },
    ];

    this.legendElement.innerHTML = `
      <div class="legend-title font-semibold text-sm mb-3 text-center">ERD Notation</div>
      
      <div class="legend-columns flex gap-4 justify-between max-sm:flex-col max-sm:gap-3">
        <div class="legend-column flex-1 min-w-32">
          <div class="legend-section-header font-semibold text-xs text-blue-700 mb-2 px-2 py-1 bg-blue-50 rounded border border-blue-200">
            CARDINALITY
          </div>
          ${cardinalityItems.map(item => this.renderLegendItem(item)).join('')}
        </div>
        
        <div class="legend-column flex-1 min-w-32">
          <div class="legend-section-header font-semibold text-xs text-green-700 mb-2 px-2 py-1 bg-green-50 rounded border border-green-200">
            RELATIONSHIP
          </div>
          ${relationshipItems.map(item => this.renderLegendItem(item)).join('')}
        </div>
      </div>
    `;
  }

  private renderLegendItem(item: LegendItem): string {
    const iconHtml =
      item.category === 'cardinality'
        ? this.renderCardinalityIcon(item.type)
        : this.renderRelationshipIcon(item.type);

    return `
      <div class="legend-item flex items-center mb-2 gap-2 max-sm:mb-1 max-sm:gap-1">
        <div class="legend-icon w-6 h-4 flex items-center justify-center">
          ${iconHtml}
        </div>
        <span class="legend-label flex-1 font-medium text-xs">${item.label}</span>
        <span class="legend-symbol font-mono text-xs text-gray-400">${item.symbol}</span>
      </div>
    `;
  }

  private renderCardinalityIcon(type: string): string {
    // Generate cardinality icons using MarkerDefinitions for consistency with main ERD rendering
    // Create a temporary container div to render the SVG icon
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.visibility = 'hidden';
    document.body.appendChild(tempContainer);

    try {
      // Create a temporary SVG using D3
      const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      tempSvg.setAttribute('width', '24');
      tempSvg.setAttribute('height', '16');
      tempSvg.setAttribute('viewBox', '0 0 24 16');
      tempContainer.appendChild(tempSvg);

      // Use D3 to select and create group
      const svgSelection = select(tempSvg);
      const group = svgSelection.append('g');

      // Use MarkerDefinitions to draw the cardinality marker
      const markerDefs = MarkerDefinitions.getInstance();
      markerDefs.drawCardinalityInline(group, 12, 8, type);

      // Return the SVG HTML
      return tempSvg.outerHTML;
    } finally {
      // Clean up
      document.body.removeChild(tempContainer);
    }
  }

  private renderRelationshipIcon(type: string): string {
    const color = '#6b7280';
    const strokeWidth = '2';

    if (type === 'solid-line') {
      return `
        <svg width="20" height="12" viewBox="0 0 20 12">
          <line x1="2" y1="6" x2="18" y2="6" stroke="${color}" stroke-width="${strokeWidth}"/>
        </svg>
      `;
    } else if (type === 'dashed-line') {
      return `
        <svg width="20" height="12" viewBox="0 0 20 12">
          <line x1="2" y1="6" x2="18" y2="6" stroke="${color}" stroke-width="${strokeWidth}" stroke-dasharray="3,2"/>
        </svg>
      `;
    }
    return '';
  }

  public setVisible(visible: boolean): void {
    this.config.show = visible;
    this.render();
  }

  public setPosition(position: LegendConfig['position']): void {
    if (position) {
      this.config.position = position;
      this.applyPosition();
    }
  }

  public destroy(): void {
    if (this.legendElement && this.legendElement.parentNode) {
      this.legendElement.parentNode.removeChild(this.legendElement);
    }
  }

  public toggle(): void {
    this.setVisible(!this.config.show);
  }

  public updateResponsiveConfig(config: Partial<LegendConfig>): void {
    Object.assign(this.config, config);
    this.render();
  }
}
