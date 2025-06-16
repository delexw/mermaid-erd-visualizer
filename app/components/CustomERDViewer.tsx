import { useEffect, useRef, useState, useCallback } from 'react';

import { useERD } from '~/contexts/ERDContext';
import type { Relationship, Table } from '~/types/erd.js';

import { ERDRenderer, type ERDRendererConfig } from '../lib/erdRenderer/erdRenderer.js';
import type {
  LayoutAlgorithm,
  LayoutDirection,
  HierarchyHandling,
  NodePlacement,
} from '../lib/erdRenderer/types/layout';

import { LayoutControls } from './LayoutControls';
import { Legend } from './Legend';
import { LoadingOverlay } from './LoadingOverlay';

interface CustomERDViewerProps {
  selectedTable: string | null;
  onTableSelect: (tableId: string | null) => void;
}

// Custom hook to manage the ERD renderer
function useERDRenderer(
  onTableSelect: (tableId: string | null) => void,
  tables: Table[],
  relationships: Relationship[]
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<ERDRenderer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);

  // Create renderer instance
  useEffect(() => {
    if (!containerRef.current) return;

    const config: ERDRendererConfig = {
      container: containerRef.current,
      onTableSelect,
      onLayoutChange: () => {
        // Handle layout changes if needed
      },
      onRenderingProgress: (progress, stage) => {
        setLoadingProgress(progress);
        setLoadingStage(stage);
      },
    };

    rendererRef.current = new ERDRenderer(config);

    return () => {
      rendererRef.current?.destroy();
      rendererRef.current = null;
    };
  }, [onTableSelect]); // Include onTableSelect properly

  // Load data when tables/relationships change
  useEffect(() => {
    if (rendererRef.current && tables.length > 0) {
      setIsLoading(true);
      setDataLoaded(false);
      setLoadingProgress(0);
      setLoadingStage('Preparing...');

      rendererRef.current.loadData(tables, relationships).catch((error: Error) => {
        console.error('Error loading ERD data:', error);
        setIsLoading(false);
        setDataLoaded(false);
        setLoadingProgress(0);
        setLoadingStage('');
      });
    } else {
      setDataLoaded(false);
    }
  }, [tables, relationships]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setDataLoaded(true);
    setLoadingProgress(0);
    setLoadingStage('');
  };

  return {
    containerRef,
    renderer: rendererRef.current,
    isLoading,
    loadingProgress,
    loadingStage,
    dataLoaded,
    setIsLoading,
    setDataLoaded,
    setLoadingProgress,
    setLoadingStage,
    handleLoadingComplete,
  };
}

export default function CustomERDViewer({ selectedTable, onTableSelect }: CustomERDViewerProps) {
  const { tables, relationships } = useERD();
  const [showRelationships, setShowRelationships] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [legendPosition] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>(
    'bottom-right'
  );
  const [showLayoutControls, setShowLayoutControls] = useState(false);

  // Use our custom hook
  const {
    containerRef,
    renderer,
    isLoading,
    loadingProgress,
    loadingStage,
    dataLoaded,
    setIsLoading,
    setDataLoaded,
    setLoadingProgress,
    setLoadingStage,
    handleLoadingComplete,
  } = useERDRenderer(onTableSelect, tables, relationships);

  // Handle table selection from external source
  useEffect(() => {
    if (renderer && dataLoaded) {
      // Update renderer selection state to match external selection
      renderer.selectTable(selectedTable);

      // If a table is selected, also focus on it
      if (selectedTable) {
        renderer.focusOnTable(selectedTable);
      }
    }
  }, [selectedTable, dataLoaded, renderer]);

  // Memoize handlers
  const handleToggleRelationships = useCallback(() => {
    setShowRelationships(prev => {
      const newVisibility = !prev;
      renderer?.toggleRelationshipVisibility(newVisibility);
      return newVisibility;
    });
  }, [renderer]);

  const handleFitToScreen = useCallback(() => {
    renderer?.fitToScreen();
  }, [renderer]);

  const handleFocusOnSelected = useCallback(() => {
    const currentSelected = renderer?.getSelectedTables()?.[0];
    if (currentSelected) {
      renderer?.focusOnTable(currentSelected);
    }
  }, [renderer]);

  const handleToggleLegend = useCallback(() => {
    setShowLegend(prev => !prev);
  }, []);

  const handleLayoutChange = useCallback(
    async (config: {
      algorithm?: LayoutAlgorithm;
      direction?: LayoutDirection;
      hierarchyHandling?: HierarchyHandling;
      nodePlacement?: NodePlacement;
    }) => {
      if (!renderer) return;

      setIsLoading(true);
      setDataLoaded(false);
      setLoadingProgress(0);
      setLoadingStage('Updating layout...');

      try {
        await renderer.updateLayoutConfig(config);
        await renderer.loadData(tables, relationships);
      } catch (error) {
        console.error('Error updating layout:', error);
        setIsLoading(false);
        setDataLoaded(false);
        setLoadingProgress(0);
        setLoadingStage('');
      }
    },
    [
      renderer,
      tables,
      relationships,
      setIsLoading,
      setDataLoaded,
      setLoadingProgress,
      setLoadingStage,
    ]
  );

  if (tables.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white rounded-lg shadow-sm border border-secondary-200">
        <div className="text-center">
          <div className="text-secondary-500 text-lg font-medium mb-2">No Data</div>
          <div className="text-secondary-600">Upload a Mermaid ERD to get started</div>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-erd-viewer-container relative flex-1">
      {/* Loading Overlay */}
      <LoadingOverlay
        isLoading={isLoading}
        progress={loadingProgress}
        stage={loadingStage}
        onLoadingComplete={handleLoadingComplete}
      />

      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg border border-secondary-200 p-2">
        <div className="flex flex-col gap-2">
          {/* Layout Controls Toggle */}
          <button
            onClick={() => setShowLayoutControls(!showLayoutControls)}
            disabled={isLoading}
            className={`p-2 rounded-md transition-colors focus-ring ${
              showLayoutControls
                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Layout options"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              />
            </svg>
          </button>

          {/* Relationship Toggle */}
          <button
            onClick={handleToggleRelationships}
            disabled={isLoading}
            className={`p-2 rounded-md transition-colors focus-ring ${
              showRelationships
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={showRelationships ? 'Hide relationships' : 'Show relationships'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </button>

          {/* Fit to Screen */}
          <button
            onClick={handleFitToScreen}
            disabled={isLoading}
            className={`p-2 rounded-md hover:bg-secondary-100 transition-colors focus-ring ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Fit to screen"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>

          {/* Focus on Selected */}
          {selectedTable && (
            <button
              onClick={handleFocusOnSelected}
              disabled={isLoading}
              className={`p-2 rounded-md hover:bg-secondary-100 transition-colors focus-ring ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Focus on selected table"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          )}

          {/* Toggle Legend */}
          <button
            onClick={handleToggleLegend}
            disabled={isLoading}
            className={`p-2 rounded-md transition-colors focus-ring ${
              showLegend
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={showLegend ? 'Hide legend' : 'Show legend'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Layout Controls Panel */}
      <LayoutControls
        isVisible={showLayoutControls}
        isLoading={isLoading}
        onLayoutChange={handleLayoutChange}
      />

      {/* Renderer Container */}
      <div
        ref={containerRef}
        className="w-full h-full bg-white rounded-lg shadow-sm border border-secondary-200 relative"
        style={{ minHeight: '400px' }}
      />

      {/* Legend Component - Render it directly here */}
      {renderer && <Legend position={legendPosition} show={showLegend} responsive={true} />}

      {/* Info Panel */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-secondary-200 p-3">
        <div className="text-sm text-secondary-600">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Drag tables to reposition</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Click to select tables</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Scroll to zoom, drag to pan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>Powered by ELK.js layout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
