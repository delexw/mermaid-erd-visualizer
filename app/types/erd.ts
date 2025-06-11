export interface TableField {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  foreignKeyTarget?: string;
  description?: string;
}

export interface Table {
  id: string;
  name: string;
  modelPath: string;
  fields: TableField[];
  position?: { x: number; y: number };
}

export interface CardinalityInfo {
  type: 'zero-or-one' | 'exactly-one' | 'zero-or-more' | 'one-or-more';
  marker: string;
}

export interface Relationship {
  id: string;
  fromTable: string;
  toTable: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  description?: string;
  isIdentifying?: boolean;
  leftCardinality?: CardinalityInfo;
  rightCardinality?: CardinalityInfo;
}

export interface ERDData {
  tables: Table[];
  relationships: Relationship[];
}

export interface ViewState {
  selectedTable: string | null;
  selectedRelationship: string | null;
  highlightedTables: string[];
  zoom: number;
  pan: { x: number; y: number };
}

export interface NavigationItem {
  id: string;
  name: string;
  type: 'table' | 'relationship';
  category?: string;
}

// Parser-specific types
export interface ParseError {
  line: number;
  message: string;
  context?: string;
  type?: 'error' | 'warning';
}

export interface ParsedERD {
  tables: Table[];
  relationships: Relationship[];
  originalDiagram: string;
  warnings?: ParseError[];
}

export type ParseResult = {
  success: true;
  data: ParsedERD;
} | {
  success: false;
  errors: ParseError[];
} 