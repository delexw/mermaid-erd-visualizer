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

export interface Relationship {
  id: string;
  fromTable: string;
  toTable: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  fromField?: string;
  toField?: string;
  description?: string;
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