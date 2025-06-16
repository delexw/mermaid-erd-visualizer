import React, { useEffect, useState } from 'react';

import { CardinalityIcon, RelationshipIcon } from './CardinalityIcons';

export interface LegendProps {
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

export function Legend({
  position = 'bottom-right',
  padding = 16,
  backgroundColor = '#ffffff',
  borderColor = '#e5e7eb',
  textColor = '#374151',
  show = true,
  responsive = true,
  className = '',
}: LegendProps) {
  const [isVisible, setIsVisible] = useState(show);

  // Update visibility when show prop changes
  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  if (!isVisible) {
    return null;
  }

  // Generate position classes based on the position prop
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 lg:top-6 lg:left-6';
      case 'top-right':
        return 'top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 lg:top-6 lg:right-6';
      case 'bottom-left':
        return 'bottom-2 left-2 sm:bottom-3 sm:left-3 md:bottom-4 md:left-4 lg:bottom-6 lg:left-6';
      case 'bottom-right':
        return 'bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4 lg:bottom-6 lg:right-6';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return 'bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4 lg:bottom-6 lg:right-6';
    }
  };

  // Generate padding class based on the padding prop
  const getPaddingClass = () => {
    if (padding <= 8) return 'p-2';
    if (padding <= 12) return 'p-3';
    if (padding <= 16) return 'p-4';
    if (padding <= 20) return 'p-5';
    return 'p-6';
  };

  // Generate responsive classes
  const getResponsiveClasses = () => {
    if (!responsive) return '';

    return `
      sm:text-sm sm:min-w-72 sm:max-w-80 sm:p-4
      md:text-base md:min-w-80 md:max-w-96 md:p-5
      max-sm:fixed max-sm:bottom-2 max-sm:left-2 max-sm:right-2 
      max-sm:max-w-none max-sm:transform-none max-sm:translate-x-0 max-sm:translate-y-0
      max-sm:!bottom-2 max-sm:!left-2 max-sm:!right-2
    `;
  };

  // Data for the legend items
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

  // Base styles for the legend container
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

  return (
    <div
      className={`erd-legend ${className} ${baseClasses.join(' ')} ${getPositionClasses()} ${getPaddingClass()} ${getResponsiveClasses()}`}
      style={{
        backgroundColor,
        borderColor,
        color: textColor,
      }}
    >
      <div className="legend-title font-semibold text-sm mb-3 text-center">ERD Notation</div>

      <div className="legend-columns flex gap-4 justify-between max-sm:flex-col max-sm:gap-3">
        <div className="legend-column flex-1 min-w-32">
          <div className="legend-section-header font-semibold text-xs text-blue-700 mb-2 px-2 py-1 bg-blue-50 rounded border border-blue-200">
            CARDINALITY
          </div>
          {cardinalityItems.map(item => (
            <LegendItemComponent key={item.type} item={item} />
          ))}
        </div>

        <div className="legend-column flex-1 min-w-32">
          <div className="legend-section-header font-semibold text-xs text-green-700 mb-2 px-2 py-1 bg-green-50 rounded border border-green-200">
            RELATIONSHIP
          </div>
          {relationshipItems.map(item => (
            <LegendItemComponent key={item.type} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Component for each legend item
function LegendItemComponent({ item }: { item: LegendItem }) {
  return (
    <div className="legend-item flex items-center mb-2 gap-2 max-sm:mb-1 max-sm:gap-1">
      <div className="legend-icon w-6 h-4 flex items-center justify-center">
        {item.category === 'cardinality' ? (
          <CardinalityIcon type={item.type} />
        ) : (
          <RelationshipIcon type={item.type} />
        )}
      </div>
      <span className="legend-label flex-1 font-medium text-xs">{item.label}</span>
      <span className="legend-symbol font-mono text-xs text-gray-400">{item.symbol}</span>
    </div>
  );
}
