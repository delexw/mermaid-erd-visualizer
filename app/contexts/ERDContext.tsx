import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';

import type { ParsedERD, ParseError } from '~/lib/mermaidParser/mermaidParser';
import type { Table, Relationship } from '~/types/erd';

interface ERDContextType {
  // Current data
  tables: Table[];
  relationships: Relationship[];
  mermaidDiagram: string;
  warnings: ParseError[];

  // Data source info
  uploadedFileName?: string;
  hasData: boolean;

  // Actions
  loadData: (data: ParsedERD, fileName?: string) => void;
  clearData: () => void;

  // Statistics
  getStatistics: () => {
    totalTables: number;
    totalRelationships: number;
    totalFields: number;
    tablesWithForeignKeys: number;
    totalWarnings: number;
  };
}

const ERDContext = createContext<ERDContextType | undefined>(undefined);

interface ERDProviderProps {
  children: ReactNode;
}

export function ERDProvider({ children }: ERDProviderProps) {
  // State for current data
  const [tables, setTables] = useState<Table[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [mermaidDiagram, setMermaidDiagram] = useState<string>('');
  const [warnings, setWarnings] = useState<ParseError[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState<string | undefined>();

  const loadData = (data: ParsedERD, fileName?: string) => {
    setTables(data.tables);
    setRelationships(data.relationships);
    setMermaidDiagram(data.originalDiagram);
    setWarnings(data.warnings || []);
    setUploadedFileName(fileName);
  };

  const clearData = () => {
    setTables([]);
    setRelationships([]);
    setMermaidDiagram('');
    setWarnings([]);
    setUploadedFileName(undefined);
  };

  const getStatistics = () => {
    const totalFields = tables.reduce((sum, table) => sum + table.fields.length, 0);
    const tablesWithForeignKeys = tables.filter(table =>
      table.fields.some(field => field.isForeignKey)
    ).length;

    return {
      totalTables: tables.length,
      totalRelationships: relationships.length,
      totalFields,
      tablesWithForeignKeys,
      totalWarnings: warnings.length,
    };
  };

  const value: ERDContextType = {
    tables,
    relationships,
    mermaidDiagram,
    warnings,
    uploadedFileName,
    hasData: tables.length > 0,
    loadData,
    clearData,
    getStatistics,
  };

  return <ERDContext.Provider value={value}>{children}</ERDContext.Provider>;
}

export function useERD() {
  const context = useContext(ERDContext);
  if (context === undefined) {
    throw new Error('useERD must be used within an ERDProvider');
  }
  return context;
}
