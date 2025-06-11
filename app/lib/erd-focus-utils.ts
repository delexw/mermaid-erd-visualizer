// Types for ERD focusing utilities
export interface Point2D {
  x: number;
  y: number;
}

export interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TableInfo {
  success: true;
  element: SVGGraphicsElement;
  position: Point2D;
  viewBox: ViewBox;
  centerPosition: Point2D;
}

export interface TableInfoError {
  success: false;
  error: string;
}

export type TableInfoResult = TableInfo | TableInfoError;

// Constants
export const MIN_ZOOM_LEVEL = 0.01;
export const MAX_ZOOM_LEVEL = 5;

// Parse SVG viewBox string into structured data
export const parseViewBox = (viewBoxString: string | null): ViewBox | null => {
  if (!viewBoxString) return null;

  const match = viewBoxString.match(/^(\S+)\s+(\S+)\s+(\S+)\s+(\S+)$/);
  if (!match) return null;

  return {
    x: parseFloat(match[1]),
    y: parseFloat(match[2]),
    width: parseFloat(match[3]),
    height: parseFloat(match[4])
  };
};

// Parse element transform attribute to get translation values
export const parseElementTransform = (transformAttr: string | null): Point2D => {
  if (!transformAttr) return { x: 0, y: 0 };

  // Handle both D3-style and SVG-style transform strings
  const translateMatch = transformAttr.match(/translate\(([^,]+)(?:,\s*([^)]+))?\)/);
  if (!translateMatch) return { x: 0, y: 0 };

  return {
    x: parseFloat(translateMatch[1]) || 0,
    y: parseFloat(translateMatch[2]) || 0
  };
};

// Find table element by name in custom renderer SVG structure
export const findTableElement = (svgElement: SVGElement, tableName: string): Element | null => {
  // In the custom renderer, tables are stored in g elements with data-table-id attribute
  // Since table ID is the same as table name, we can find it directly
  return svgElement.querySelector(`g[data-table-id="${tableName}"]`);
};

// Calculate optimal zoom scale for a table element
export const calculateOptimalScale = (
  tableElement: SVGGraphicsElement,
  containerDimensions: { width: number; height: number },
  viewBox: ViewBox,
  paddingFactor: number = 0.8,
  defaultScale: number = 1,
): number => {
  const tableBBox = tableElement.getBoundingClientRect();

  // Calculate scale to fit table with padding
  const scaleX = (containerDimensions.width * paddingFactor) / tableBBox.width;
  const scaleY = (containerDimensions.height * paddingFactor) / tableBBox.height;
  const optimalScale = Math.min(scaleX, scaleY);

  // Clamp to zoom limits
  return Math.max(MIN_ZOOM_LEVEL, Math.min(MAX_ZOOM_LEVEL, optimalScale));
};

// Get comprehensive table information including position and dimensions
export const getTableInfo = (svgElement: SVGElement, tableName: string): TableInfoResult => {
  const tableElement = findTableElement(svgElement, tableName);
  if (!tableElement) {
    return { success: false, error: `Table element not found: ${tableName}` };
  }

  const viewBoxString = svgElement.getAttribute('viewBox');
  const viewBox = parseViewBox(viewBoxString);
  if (!viewBox) {
    return { success: false, error: 'Could not parse SVG viewBox' };
  }

  const transformAttr = tableElement.getAttribute('transform');
  const elementPosition = parseElementTransform(transformAttr);

  return {
    success: true,
    element: tableElement as SVGGraphicsElement,
    position: elementPosition,
    viewBox,
    centerPosition: {
      x: viewBox.width / 2 - elementPosition.x,
      y: viewBox.height / 2 - elementPosition.y
    }
  };
};

// Calculate the transform needed to center a table
export const calculateCenterTransform = (svgElement: SVGElement, tableName: string): { success: boolean; position?: Point2D; error?: string } => {
  const tableInfo = getTableInfo(svgElement, tableName);
  if (!tableInfo.success) {
    return { success: false, error: tableInfo.error };
  }

  return {
    success: true,
    position: tableInfo.centerPosition
  };
}; 