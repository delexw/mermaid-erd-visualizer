import React, { useState, useEffect } from 'react';

import { LAYOUT_OPTIONS } from '../lib/erdRenderer/types/layout';
import type {
  LayoutAlgorithm,
  LayoutDirection,
  HierarchyHandling,
  NodePlacement,
} from '../lib/erdRenderer/types/layout';

export interface LayoutControlsProps {
  isVisible: boolean;
  isLoading: boolean;
  onLayoutChange: (config: {
    algorithm?: LayoutAlgorithm;
    direction?: LayoutDirection;
    hierarchyHandling?: HierarchyHandling;
    nodePlacement?: NodePlacement;
  }) => Promise<void>;
}

export interface LayoutState {
  algorithm: LayoutAlgorithm;
  direction: LayoutDirection;
  hierarchyHandling: HierarchyHandling;
  nodePlacement: NodePlacement;
}

export function LayoutControls({ isVisible, isLoading, onLayoutChange }: LayoutControlsProps) {
  // Track current layout settings to show selected state
  const [currentLayout, setCurrentLayout] = useState<LayoutState>(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('erd-layout-settings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Failed to parse saved layout settings:', e);
        }
      }
    }

    // Default settings
    return {
      algorithm: 'layered' as LayoutAlgorithm,
      direction: 'DOWN' as LayoutDirection,
      hierarchyHandling: 'SEPARATE_CHILDREN' as HierarchyHandling,
      nodePlacement: 'NETWORK_SIMPLEX' as NodePlacement,
    };
  });

  // Save to localStorage when layout changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('erd-layout-settings', JSON.stringify(currentLayout));
    }
  }, [currentLayout]);

  const handleChangeLayoutDirection = async (direction: LayoutDirection) => {
    setCurrentLayout(prev => ({ ...prev, direction }));
    await onLayoutChange({ direction });
  };

  const handleChangeLayoutAlgorithm = async (algorithm: LayoutAlgorithm) => {
    setCurrentLayout(prev => ({ ...prev, algorithm }));
    await onLayoutChange({ algorithm });
  };

  const handleChangeHierarchyHandling = async (hierarchyHandling: HierarchyHandling) => {
    setCurrentLayout(prev => ({ ...prev, hierarchyHandling }));
    await onLayoutChange({ hierarchyHandling });
  };

  const handleChangeNodePlacement = async (nodePlacement: NodePlacement) => {
    setCurrentLayout(prev => ({ ...prev, nodePlacement }));
    await onLayoutChange({ nodePlacement });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute top-4 right-20 z-20 bg-white rounded-lg shadow-lg border border-secondary-200 p-3 w-96">
      {/* Header with Active Settings */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Layout Options</h3>
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Saved</div>
      </div>

      {/* Current Active Settings in Compact Badge Format */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-xs font-medium text-gray-600 mb-2">Active Configuration</div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">
            🔧 {currentLayout.algorithm}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
            📐 {currentLayout.direction}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800 border border-purple-200">
            🌲 {currentLayout.hierarchyHandling.replace('_', ' ')}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-800 border border-orange-200">
            📍 {currentLayout.nodePlacement.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Settings Grid with Clear Boundaries */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column: Core Layout Settings */}
        <div className="space-y-4">
          {/* Algorithm Selection */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-blue-600">🔧</span>
              <label className="text-xs font-semibold text-blue-800">Algorithm</label>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {LAYOUT_OPTIONS.algorithms.slice(0, 4).map(value => (
                <button
                  key={value}
                  onClick={() => handleChangeLayoutAlgorithm(value)}
                  disabled={isLoading}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    currentLayout.algorithm === value
                      ? 'bg-blue-600 text-white shadow-md'
                      : isLoading
                        ? 'opacity-50 cursor-not-allowed'
                        : 'bg-white hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            {/* Extra algorithm if exists */}
            {LAYOUT_OPTIONS.algorithms.length > 4 && (
              <div className="grid grid-cols-1 gap-1 mt-1">
                {LAYOUT_OPTIONS.algorithms.slice(4).map(value => (
                  <button
                    key={value}
                    onClick={() => handleChangeLayoutAlgorithm(value)}
                    disabled={isLoading}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      currentLayout.algorithm === value
                        ? 'bg-blue-600 text-white shadow-md'
                        : isLoading
                          ? 'opacity-50 cursor-not-allowed'
                          : 'bg-white hover:bg-blue-100 border border-blue-200'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Direction Selection */}
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-green-600">📐</span>
              <label className="text-xs font-semibold text-green-800">Direction</label>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {LAYOUT_OPTIONS.directions.map(value => (
                <button
                  key={value}
                  onClick={() => handleChangeLayoutDirection(value)}
                  disabled={isLoading}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    currentLayout.direction === value
                      ? 'bg-green-600 text-white shadow-md'
                      : isLoading
                        ? 'opacity-50 cursor-not-allowed'
                        : 'bg-white hover:bg-green-100 border border-green-200'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Advanced Settings */}
        <div className="space-y-4">
          {/* Hierarchy Handling */}
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-purple-600">🌲</span>
              <label className="text-xs font-semibold text-purple-800">Hierarchy</label>
            </div>
            <div className="space-y-1">
              {LAYOUT_OPTIONS.hierarchyHandling.map(value => (
                <button
                  key={value}
                  onClick={() => handleChangeHierarchyHandling(value)}
                  disabled={isLoading}
                  className={`w-full px-2 py-1 text-xs rounded transition-colors text-left ${
                    currentLayout.hierarchyHandling === value
                      ? 'bg-purple-600 text-white shadow-md'
                      : isLoading
                        ? 'opacity-50 cursor-not-allowed'
                        : 'bg-white hover:bg-purple-100 border border-purple-200'
                  }`}
                >
                  {value.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Node Placement */}
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-orange-600">📍</span>
              <label className="text-xs font-semibold text-orange-800">Placement</label>
            </div>
            <div className="space-y-1">
              {LAYOUT_OPTIONS.nodePlacement.map(value => (
                <button
                  key={value}
                  onClick={() => handleChangeNodePlacement(value)}
                  disabled={isLoading}
                  className={`w-full px-2 py-1 text-xs rounded transition-colors text-left ${
                    currentLayout.nodePlacement === value
                      ? 'bg-orange-600 text-white shadow-md'
                      : isLoading
                        ? 'opacity-50 cursor-not-allowed'
                        : 'bg-white hover:bg-orange-100 border border-orange-200'
                  }`}
                >
                  {value.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
