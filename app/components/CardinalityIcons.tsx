import { select } from 'd3-selection';
import { useEffect, useRef } from 'react';

import { MarkerDefinitions } from '../lib/erdRenderer/utils/markerDefinitions';

interface CardinalityIconProps {
  type: string;
  width?: number;
  height?: number;
}

/**
 * A React component that renders cardinality icons using the MarkerDefinitions class
 */
export function CardinalityIcon({ type, width = 24, height = 16 }: CardinalityIconProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous contents
    const svg = select(svgRef.current);
    svg.selectAll('*').remove();

    // Create a new group
    const group = svg.append('g');

    // Use MarkerDefinitions to draw the cardinality marker
    const markerDefs = MarkerDefinitions.getInstance();
    markerDefs.drawCardinalityInline(group, width / 2, height / 2, type);
  }, [type, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="cardinality-icon"
    />
  );
}

interface RelationshipIconProps {
  type: string;
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: string | number;
}

/**
 * A React component that renders relationship line icons
 */
export function RelationshipIcon({
  type,
  width = 20,
  height = 12,
  color = '#6b7280',
  strokeWidth = 2,
}: RelationshipIconProps) {
  if (type === 'solid-line') {
    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="relationship-icon"
      >
        <line
          x1={width * 0.1}
          y1={height / 2}
          x2={width * 0.9}
          y2={height / 2}
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </svg>
    );
  } else if (type === 'dashed-line') {
    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="relationship-icon"
      >
        <line
          x1={width * 0.1}
          y1={height / 2}
          x2={width * 0.9}
          y2={height / 2}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray="3,2"
        />
      </svg>
    );
  }

  return null;
}
