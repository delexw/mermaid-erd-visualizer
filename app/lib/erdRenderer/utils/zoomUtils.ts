import { type Selection } from 'd3-selection';
import { zoomIdentity, type ZoomBehavior } from 'd3-zoom';

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ContainerDimensions {
  width: number;
  height: number;
}

export interface ZoomOptions {
  padding?: number | { factor?: number; pixels?: number };
  maxZoom?: number;
  minZoom?: number;
  duration?: number;
  ease?: (t: number) => number;
  scaleFactor?: number; // Additional scaling factor (e.g., 0.9 to leave some margin)
}

/**
 * Gets the container dimensions with fallbacks
 * @param containerDimensions Current container dimensions
 * @param svg SVG element
 * @returns Valid container dimensions or null if unable to determine
 */
export function getValidContainerDimensions(
  containerDimensions: ContainerDimensions,
  svg: Selection<SVGSVGElement, unknown, null, undefined>
): ContainerDimensions | null {
  let { width, height } = containerDimensions;

  if (width === 0 || height === 0) {
    try {
      const svgElement = svg.node();
      if (svgElement && svgElement.parentElement) {
        const parentRect = svgElement.parentElement.getBoundingClientRect();
        width = parentRect.width;
        height = parentRect.height;
      }
    } catch (error) {
      console.warn('Error getting container dimensions:', error);
      // Use reasonable defaults
      width = 800;
      height = 600;
    }
  }

  if (width <= 0 || height <= 0) {
    console.warn('Invalid container dimensions:', width, height);
    return null;
  }

  return { width, height };
}

/**
 * Calculates optimal transform to fit bounds in container
 * @param bounds Bounds to fit
 * @param container Container dimensions
 * @param options Zoom options
 * @returns Transform parameters or null if calculation fails
 */
export function calculateZoomTransform(
  bounds: Bounds,
  container: ContainerDimensions,
  options: ZoomOptions = {}
): { translateX: number; translateY: number; scale: number } | null {
  // Default options
  const { minZoom = 0.01, maxZoom = 5, scaleFactor = 1 } = options;

  // Handle padding calculations
  let paddingPixels = 0;
  let paddingFactor = 1;

  if (options.padding) {
    if (typeof options.padding === 'number') {
      paddingPixels = options.padding;
    } else {
      paddingFactor = options.padding.factor ?? 1;
      paddingPixels = options.padding.pixels ?? 0;
    }
  }

  // Calculate effective width and height
  let effectiveWidth = bounds.width + paddingPixels * 2;
  let effectiveHeight = bounds.height + paddingPixels * 2;

  // Apply padding factor if specified
  if (paddingFactor !== 1) {
    // Convert padding factor to effective dimensions
    effectiveWidth = bounds.width / paddingFactor;
    effectiveHeight = bounds.height / paddingFactor;
  }

  // Calculate center of bounds
  const centerX = bounds.x + bounds.width / 2;
  const centerY = bounds.y + bounds.height / 2;

  // Calculate scale to fit bounds
  const scaleX = container.width / effectiveWidth;
  const scaleY = container.height / effectiveHeight;

  // Use the smaller scale to ensure everything fits
  let scale = Math.min(scaleX, scaleY) * scaleFactor;

  // Clamp scale to min/max zoom levels
  scale = Math.max(minZoom, Math.min(maxZoom, scale));

  if (!isFinite(scale) || scale <= 0) {
    console.warn('Invalid scale calculated:', scale);
    return null;
  }

  // Calculate translation to center the content
  const translateX = container.width / 2 - centerX * scale;
  const translateY = container.height / 2 - centerY * scale;

  if (!isFinite(translateX) || !isFinite(translateY)) {
    console.warn('Invalid translation calculated:', translateX, translateY);
    return null;
  }

  return { translateX, translateY, scale };
}

/**
 * Applies a zoom transform to fit the given bounds in the container
 * @param svg SVG element
 * @param zoomBehavior Zoom behavior
 * @param bounds Bounds to fit
 * @param containerDimensions Container dimensions
 * @param options Zoom options
 * @returns True if transform was applied successfully
 */
export function applyZoomToFit(
  svg: Selection<SVGSVGElement, unknown, null, undefined>,
  zoomBehavior: ZoomBehavior<SVGSVGElement, unknown>,
  bounds: Bounds,
  containerDimensions: ContainerDimensions,
  options: ZoomOptions = {}
): boolean {
  // Get valid container dimensions
  const validDimensions = getValidContainerDimensions(containerDimensions, svg);
  if (!validDimensions) return false;

  // Calculate transform
  const transform = calculateZoomTransform(bounds, validDimensions, options);
  if (!transform) return false;

  try {
    // Create and apply the transform
    const { translateX, translateY, scale } = transform;
    const zoomTransform = zoomIdentity.translate(translateX, translateY).scale(scale);

    const transition = svg.transition().duration(options.duration ?? 750);

    // Apply easing if provided
    options.ease = options.ease ?? ((t: number) => t * t * (3 - 2 * t));
    if (options.ease) {
      transition.ease(options.ease);
    }

    transition.call(zoomBehavior.transform, zoomTransform);
    return true;
  } catch (error) {
    console.error('Error applying zoom transform:', error);
    return false;
  }
}

/**
 * Calculates bounding box for a collection of table models
 * @param tableModels Map of table models
 * @returns Bounding box or null if no tables
 */
export function calculateTablesBoundingBox(
  tableModels: Map<string, { getBounds: () => Bounds }>
): Bounds | null {
  if (tableModels.size === 0) return null;

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  tableModels.forEach(model => {
    const bounds = model.getBounds();
    minX = Math.min(minX, bounds.x);
    minY = Math.min(minY, bounds.y);
    maxX = Math.max(maxX, bounds.x + bounds.width);
    maxY = Math.max(maxY, bounds.y + bounds.height);
  });

  if (minX === Infinity) return null;

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
