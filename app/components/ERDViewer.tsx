import { useCallback, useEffect, useRef, useState } from "react";
import { select } from "d3-selection";
import { zoom, zoomIdentity, zoomTransform } from "d3-zoom";
import { easeCubicInOut } from "d3-ease";
import type { ZoomBehavior } from "d3-zoom";
import mermaid from "mermaid";
import { mermaidDiagram } from "~/data/erd-data";
import {
  calculateOptimalScale,
  getTableInfo,
  calculateCenterTransform,
  MIN_ZOOM_LEVEL,
  MAX_ZOOM_LEVEL,
  type Point2D,
  type ViewBox,
  type TableInfoResult
} from "~/lib/erd-focus-utils";

interface ERDViewerProps {
  selectedTable: string | null;
}

// Component-specific types
interface TransformResult {
  success: boolean;
  element?: Element;
  position?: Point2D;
  error?: string;
}

// Constants
const FOCUS_ANIMATION_DURATION = 800;

export default function ERDViewer({
  selectedTable,
}: ERDViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGElement | null>(null);
  const zoomBehavior = useRef<ZoomBehavior<Element, unknown> | null>(null);
  const [currentZoom, setCurrentZoom] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const mountedRef = useRef(false);

  // Set mounted flag
  useEffect(() => {
    mountedRef.current = true;
    console.log('Component mounted, mountedRef set to true');
    return () => {
      mountedRef.current = false;
      console.log('Component unmounting, mountedRef set to false');
    };
  }, []);

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      er: {
        entityPadding: 15,
        stroke: '#333',
        fill: '#ECECFF',
        fontSize: 12,
      },
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up D3 zoom behavior
      if (zoomBehavior.current && svgRef.current) {
        try {
          select(svgRef.current as Element).on('.zoom', null);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      // Clear refs
      svgRef.current = null;
      zoomBehavior.current = null;
    };
  }, []);

  // Render diagram
  useEffect(() => {
    const renderDiagram = async () => {
      // Small delay to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      if (!containerRef.current || !mountedRef.current) {
        console.log('Skipping render: container or mount ref not available');
        console.log('containerRef.current:', !!containerRef.current);
        console.log('mountedRef.current:', mountedRef.current);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('Starting diagram render...');
        console.log('Mermaid diagram length:', mermaidDiagram.length);
        console.log('Mermaid diagram preview:', mermaidDiagram.substring(0, 100) + '...');

        // Clean up previous D3 event listeners
        if (svgRef.current) {
          try {
            select(svgRef.current as Element).on('.zoom', null);
          } catch (e) {
            console.log('Cleanup error (ignored):', e);
          }
        }

        // Reset refs
        svgRef.current = null;
        zoomBehavior.current = null;

        if (!mountedRef.current) {
          console.log('Component unmounted during cleanup');
          return;
        }

        // Create a unique ID for this render
        const id = `mermaid-${Date.now()}`;

        console.log('Rendering mermaid diagram with ID:', id);

        // Render the diagram
        const { svg } = await mermaid.render(id, mermaidDiagram);

        console.log('Mermaid render complete, SVG length:', svg.length);

        if (!mountedRef.current) {
          console.log('Component unmounted during render');
          return;
        }

        // Set the SVG content using React state
        setSvgContent(svg);

        console.log('SVG content set in state');

        if (mountedRef.current) {
          setLoading(false);
          console.log('Diagram loading complete');
        }
      } catch (err) {
        console.error('Error rendering Mermaid diagram:', err);
        if (mountedRef.current) {
          setError(`Failed to render diagram: ${err instanceof Error ? err.message : 'Unknown error'}`);
          setLoading(false);
        }
      }
    };

    renderDiagram();
  }, []);



  // Clear any existing highlighting (in case there was any)
  const clearHighlighting = useCallback(() => {
    if (!svgRef.current) return;

    try {
      svgRef.current.querySelectorAll('.table-highlighted, .table-dimmed').forEach(el => {
        el.classList.remove('table-highlighted', 'table-dimmed');
      });
    } catch (e) {
      console.error('Error clearing highlighting:', e);
    }
  }, []);

  // Simplified table transform calculation using utilities
  const getTableTransform = (tableName: string): TransformResult => {
    if (!svgRef.current) {
      return { success: false, error: 'SVG reference not available' };
    }

    const centerTransform = calculateCenterTransform(svgRef.current, tableName);
    if (!centerTransform.success) {
      return { success: false, error: centerTransform.error };
    }

    return {
      success: true,
      position: centerTransform.position
    };
  };

  // Focus on a specific table with smooth animation
  const focusOnTable = useCallback((tableName: string): void => {
    // Guard clauses with proper typing
    const refs = {
      mounted: mountedRef.current,
      zoom: zoomBehavior.current,
      svg: svgRef.current,
      container: containerRef.current
    } as const;

    if (!refs.mounted || !refs.zoom || !refs.svg || !refs.container) {
      return;
    }

    try {
      const transformResult = getTableTransform(tableName);

      if (!transformResult.success || !transformResult.position) {
        console.warn(transformResult.error);
        return;
      }

      // Step 1: Center the table (translate only)
      const centerTransform = zoomIdentity
        .translate(transformResult.position.x, transformResult.position.y);

      // Step 2: Apply centering first, then calculate and apply zoom
      const svgSelection = select(refs.svg as Element);

      svgSelection
        .transition()
        .duration(FOCUS_ANIMATION_DURATION / 2) // Half duration for centering
        .ease(easeCubicInOut)
        .call(refs.zoom.transform, centerTransform)
        .on('end', () => {
          // Check refs are still available
          if (!refs.svg || !refs.container || !refs.zoom || !mountedRef.current) {
            return;
          }

          // Calculate optimal scale after transform is complete
          const tableInfo = getTableInfo(refs.svg, tableName);
          if (!tableInfo.success) {
            console.error('Could not get table info for scale calculation');
            return;
          }

          const targetScale = calculateOptimalScale(
            tableInfo.element,
            {
              width: refs.container.clientWidth,
              height: refs.container.clientHeight
            },
            tableInfo.viewBox
          );

          // Chain second transition for scaling
          svgSelection
            .transition()
            .duration(FOCUS_ANIMATION_DURATION / 2) // Half duration for zooming
            .ease(easeCubicInOut)
            .call(refs.zoom.scaleTo, targetScale);
        });

    } catch (error) {
      console.error('Error focusing on table:', error);
    }
  }, []);

  // Set up zoom when SVG content changes
  useEffect(() => {
    if (svgContent && containerRef.current && mountedRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        if (!mountedRef.current || !containerRef.current) return;

        const svgElement = containerRef.current.querySelector('svg');
        if (svgElement) {
          svgRef.current = svgElement;
          setupZoom(svgElement);
        } else {
          console.error('SVG element not found in container');
        }
      }, 50);
    }
  }, [svgContent]);

  // Focus on selected table with animation
  useEffect(() => {
    if (selectedTable && svgRef.current && zoomBehavior.current && mountedRef.current) {
      // Add a small delay to ensure SVG is fully rendered and interactive
      setTimeout(() => {
        if (mountedRef.current) {
          focusOnTable(selectedTable);
        }
      }, 200);
    } else if (!selectedTable && svgRef.current) {
      // Clear highlighting when no table is selected
      clearHighlighting();
    }
  }, [selectedTable, focusOnTable, clearHighlighting]);

  // Setup zoom behavior
  const setupZoom = (svg: SVGElement) => {
    if (!mountedRef.current) return;

    try {
      const zoomBehaviorInstance = zoom<Element, unknown>()
        .scaleExtent([MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL])
        .on('zoom', (event) => {
          if (!mountedRef.current) return;

          const { transform } = event;
          setCurrentZoom(transform.k);

          const g = svg.querySelector('g');
          if (g) {
            g.setAttribute('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`);
          }
        });

      select(svg as Element).call(zoomBehaviorInstance);
      zoomBehavior.current = zoomBehaviorInstance;
    } catch (e) {
      console.error('Error setting up zoom:', e);
    }
  };

  // Zoom handlers with safety checks
  const handleZoom = (delta: number) => {
    if (!mountedRef.current || !zoomBehavior.current || !svgRef.current) return;

    try {
      const newZoom = Math.max(MIN_ZOOM_LEVEL, Math.min(MAX_ZOOM_LEVEL, currentZoom + delta));
      select(svgRef.current as Element).transition().call(
        zoomBehavior.current.scaleTo,
        newZoom
      );
    } catch (e) {
      console.error('Error during zoom:', e);
    }
  };

  const handleResetZoom = () => {
    if (!mountedRef.current || !zoomBehavior.current || !svgRef.current) return;

    try {
      select(svgRef.current as Element).transition().call(
        zoomBehavior.current.transform,
        zoomIdentity
      );
    } catch (e) {
      console.error('Error during zoom reset:', e);
    }
  };

  const handleFitToScreen = () => {
    if (!mountedRef.current || !zoomBehavior.current || !svgRef.current || !containerRef.current) return;

    try {
      const svg = svgRef.current;
      const container = containerRef.current;

      const svgRect = svg.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const scaleX = containerRect.width / svgRect.width;
      const scaleY = containerRect.height / svgRect.height;
      const scale = Math.min(scaleX, scaleY) * 0.9; // 90% to add some padding

      select(svg as Element).transition().call(
        zoomBehavior.current.scaleTo,
        scale
      );
    } catch (e) {
      console.error('Error during fit to screen:', e);
    }
  };

  const handleZoomToLevel = (zoomLevel: number) => {
    if (!mountedRef.current || !zoomBehavior.current || !svgRef.current) return;

    try {
      select(svgRef.current as Element).transition().call(
        zoomBehavior.current.scaleTo,
        zoomLevel
      );
    } catch (e) {
      console.error('Error during zoom to level:', e);
    }
  };



  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white rounded-lg shadow-sm border border-secondary-200">
        <div className="text-center">
          <div className="text-red-500 text-lg font-medium mb-2">Error</div>
          <div className="text-secondary-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="erd-viewer-container">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg border border-secondary-200 p-2">
        <div className="flex items-center gap-2">
          {/* Zoom Out */}
          <button
            onClick={() => handleZoom(-0.2)}
            className="p-2 rounded-md hover:bg-secondary-100 transition-colors focus-ring"
            aria-label="Zoom out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          {/* Zoom Level Display */}
          <span className="text-sm font-medium text-secondary-700 min-w-[3rem] text-center">
            {Math.round(currentZoom * 100)}%
          </span>

          {/* Zoom In */}
          <button
            onClick={() => handleZoom(0.2)}
            className="p-2 rounded-md hover:bg-secondary-100 transition-colors focus-ring"
            aria-label="Zoom in"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-secondary-300 mx-1"></div>

          {/* Fit to Screen */}
          <button
            onClick={handleFitToScreen}
            className="p-2 rounded-md hover:bg-secondary-100 transition-colors focus-ring"
            aria-label="Fit to screen"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>

          {/* Reset Zoom */}
          <button
            onClick={handleResetZoom}
            className="p-2 rounded-md hover:bg-secondary-100 transition-colors focus-ring"
            aria-label="Reset zoom"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Zoom Presets */}
        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-secondary-200">
          {[0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5].map((preset) => (
            <button
              key={preset}
              onClick={() => handleZoomToLevel(preset)}
              className={`px-2 py-1 text-xs rounded transition-all duration-200 zoom-preset-btn ${Math.abs(currentZoom - preset) < 0.05 ? 'active' : 'hover:bg-secondary-100'
                }`}
            >
              {preset < 1 ? `${preset * 100}%` : `${preset}x`}
            </button>
          ))}
        </div>
      </div>

      {/* Mermaid Diagram Container */}
      <div
        ref={containerRef}
        className="mermaid-container"
        id="mermaid-container"
      >
        {svgContent ? (
          <div dangerouslySetInnerHTML={{ __html: svgContent }} />
        ) : loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-20">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-secondary-600">Loading diagram...</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
} 