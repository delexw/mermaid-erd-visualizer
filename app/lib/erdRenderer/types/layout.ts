// Define arrays as single source of truth
const ALGORITHMS = ['layered', 'stress', 'force', 'radial', 'mrtree'] as const;
const DIRECTIONS = ['UP', 'DOWN', 'LEFT', 'RIGHT'] as const;
const HIERARCHY_HANDLING = ['INCLUDE_CHILDREN', 'INHERIT', 'SEPARATE_CHILDREN'] as const;
const NODE_PLACEMENT = ['BRANDES_KOEPF', 'LINEAR_SEGMENTS', 'NETWORK_SIMPLEX'] as const;

// Derive types from arrays - no duplication!
export type LayoutAlgorithm = (typeof ALGORITHMS)[number];
export type LayoutDirection = (typeof DIRECTIONS)[number];
export type HierarchyHandling = (typeof HIERARCHY_HANDLING)[number];
export type NodePlacement = (typeof NODE_PLACEMENT)[number];

export interface LayoutConfig {
  algorithm: LayoutAlgorithm;
  direction: LayoutDirection;
  nodeSpacing: number;
  layerSpacing: number;
  marginX: number;
  marginY: number;
  centerHighConnectivityNodes?: boolean;
  hierarchyHandling?: HierarchyHandling;
  nodePlacement?: NodePlacement;
}

export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  algorithm: 'layered',
  direction: 'UP',
  nodeSpacing: 50,
  layerSpacing: 100,
  marginX: 50,
  marginY: 50,
  centerHighConnectivityNodes: true,
  hierarchyHandling: 'SEPARATE_CHILDREN',
  nodePlacement: 'NETWORK_SIMPLEX',
};

// Export arrays directly for UI rendering - ultimate DRY!
export const LAYOUT_OPTIONS = {
  algorithms: ALGORITHMS,
  directions: DIRECTIONS,
  hierarchyHandling: HIERARCHY_HANDLING,
  nodePlacement: NODE_PLACEMENT,
} as const;
