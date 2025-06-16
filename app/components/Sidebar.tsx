import { useState, useRef, useEffect, useCallback } from 'react';

import { useERD } from '~/contexts/ERDContext';

interface SidebarProps {
  selectedTable: string | null;
  selectedRelationship: string | null;
  onTableSelect: (tableId: string) => void;
  onRelationshipSelect: (relationshipId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'tables' | 'relationships' | 'warnings';

export default function Sidebar({
  selectedTable,
  selectedRelationship,
  onTableSelect,
  onRelationshipSelect,
  isOpen,
  onClose,
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('tables');

  // Refs for scrolling to selected table
  const tableRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const tablesContainerRef = useRef<HTMLDivElement>(null);
  const hasScrolledToSelectedTableRef = useRef(false);

  const { tables, relationships, warnings } = useERD();

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  }, []);

  // Scroll to selected table when selection changes
  useEffect(() => {
    if (
      selectedTable &&
      isOpen &&
      activeTab === 'tables' &&
      !hasScrolledToSelectedTableRef.current
    ) {
      const tableElement = tableRefs.current.get(selectedTable);
      if (tableElement && tablesContainerRef.current) {
        if (tableElement && tablesContainerRef.current && !hasScrolledToSelectedTableRef.current) {
          requestAnimationFrame(() => {
            tableElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest',
            });
            hasScrolledToSelectedTableRef.current = true;
          });
        }
      }
    }
  }, [selectedTable, activeTab, isOpen]);

  // Clear refs when tables change
  useEffect(() => {
    tableRefs.current.clear();
  }, [tables]);

  const filteredTables = tables
    .filter(
      table =>
        table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        table.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const filteredRelationships = relationships
    .filter(
      rel =>
        rel.fromTable.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rel.toTable.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rel.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rel.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.fromTable.localeCompare(b.fromTable));

  const filteredWarnings = warnings.filter(warning =>
    warning.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTableClick = useCallback(
    (tableId: string) => {
      onTableSelect(tableId);
      // Auto-close on mobile using CSS media queries
    },
    [onTableSelect]
  );

  const handleRelationshipClick = useCallback(
    (relationshipId: string) => {
      onRelationshipSelect(relationshipId);
      // Auto-close on mobile using CSS media queries
    },
    [onRelationshipSelect]
  );

  return (
    <>
      {/* Mobile Overlay - CSS-driven */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`
        fixed md:relative
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isOpen ? 'w-80' : 'w-0'}
        h-full z-50 md:z-10
        transition-all duration-300 ease-in-out
        bg-white border-r border-secondary-200
        flex flex-col
        overflow-hidden
      `}
      >
        {/* Header */}
        <div className="p-4 border-b border-secondary-200 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900">Database Explorer</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-secondary-100 transition-colors focus-ring"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search tables and relationships..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-secondary-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Tabs */}
          <div className="flex mt-4 bg-secondary-100 rounded-lg p-1">
            <button
              onClick={() => handleTabChange('tables')}
              className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-colors ${activeTab === 'tables'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-secondary-600 hover:text-secondary-900'
                }`}
            >
              Tables ({filteredTables.length})
            </button>
            <button
              onClick={() => handleTabChange('relationships')}
              className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-colors ${activeTab === 'relationships'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-secondary-600 hover:text-secondary-900'
                }`}
            >
              Relations ({filteredRelationships.length})
            </button>
            <button
              onClick={() => handleTabChange('warnings')}
              className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-colors relative ${activeTab === 'warnings'
                ? 'bg-white text-red-700 shadow-sm'
                : filteredWarnings.length > 0
                  ? 'text-red-600 hover:text-red-700'
                  : 'text-secondary-600 hover:text-secondary-900'
                }`}
            >
              <span className="flex items-center justify-center">
                Warnings ({filteredWarnings.length})
                {filteredWarnings.length > 0 && (
                  <span className="ml-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" ref={tablesContainerRef}>
          {activeTab === 'tables' && (
            <div className="p-4 space-y-2">
              {filteredTables.map(table => {
                const isSelected = selectedTable === table.id;
                const tableRelationships = relationships
                  .filter(rel => rel.fromTable === table.name || rel.toTable === table.name)
                  .sort((a, b) => a.toTable.localeCompare(b.toTable));

                return (
                  <div key={table.id}>
                    <button
                      ref={el => {
                        if (el) {
                          tableRefs.current.set(table.id, el);
                        } else {
                          tableRefs.current.delete(table.id);
                        }
                      }}
                      onClick={() => handleTableClick(table.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${isSelected
                        ? 'bg-primary-50 border-primary-200 text-primary-900'
                        : 'bg-white border-secondary-200 hover:bg-secondary-50 hover:border-secondary-300'
                        }`}
                    >
                      <div className="font-medium text-sm break-words">{table.name}</div>
                      <div className="text-xs text-secondary-500 mt-1">
                        {table.fields.length} fields
                        {tableRelationships.length > 0 && (
                          <span className="ml-2">• {tableRelationships.length} relationships</span>
                        )}
                      </div>
                      {isSelected && (
                        <div className="text-xs text-primary-600 mt-1">
                          (click again to deselect)
                        </div>
                      )}
                    </button>

                    {/* Table Relationships Sub-list */}
                    {isSelected && tableRelationships.length > 0 && (
                      <div className="ml-4 mt-2 space-y-1 border-l-2 border-primary-200 pl-3">
                        <div className="text-xs font-medium text-primary-700 mb-2">
                          Related Tables:
                        </div>
                        {tableRelationships.map((rel, index) => {
                          const relatedTable =
                            rel.fromTable === table.name ? rel.toTable : rel.fromTable;
                          const direction = rel.fromTable === table.name ? 'outgoing' : 'incoming';

                          // Generate relationship label from available fields
                          const getRelationshipLabel = () => {
                            if (rel.description) {
                              return rel.description;
                            }
                            return rel.id;
                          };

                          return (
                            <button
                              key={index}
                              onClick={() =>
                                handleTableClick(
                                  tables.find(t => t.name === relatedTable)?.id || relatedTable
                                )
                              }
                              className="w-full text-left p-2 rounded-md bg-white border border-primary-100 hover:bg-primary-50 hover:border-primary-200 transition-all duration-150"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-medium text-secondary-800 break-words">
                                    {relatedTable}
                                  </div>
                                  <div className="text-xs text-secondary-500 mt-0.5">
                                    <div>
                                      {rel.type} {direction === 'outgoing' ? '→' : '←'}
                                    </div>
                                    <div className="text-xs text-primary-600 font-mono mt-0.5 break-words whitespace-pre-wrap">
                                      {getRelationshipLabel()}
                                    </div>
                                  </div>
                                </div>
                                <svg
                                  className="w-3 h-3 text-primary-400 flex-shrink-0 mt-0.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Empty state for selected table with no relationships */}
                    {isSelected && tableRelationships.length === 0 && (
                      <div className="ml-4 mt-2 p-2 border-l-2 border-primary-200 pl-3">
                        <div className="text-xs text-secondary-500 italic">
                          No relationships found for this table
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredTables.length === 0 && (
                <div className="text-center py-8 text-secondary-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-secondary-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <p>No tables found</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'relationships' && (
            <div className="p-4 space-y-2">
              {filteredRelationships.map(relationship => (
                <button
                  key={relationship.id}
                  onClick={() => handleRelationshipClick(relationship.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${selectedRelationship === relationship.id
                    ? 'bg-primary-50 border-primary-200 text-primary-900'
                    : 'bg-white border-secondary-200 hover:bg-secondary-50 hover:border-secondary-300'
                    }`}
                >
                  <div className="font-medium text-sm break-words">
                    {relationship.description}
                  </div>
                  <div className="text-xs text-secondary-500 mt-1">{relationship.type}</div>
                </button>
              ))}
              {filteredRelationships.length === 0 && (
                <div className="text-center py-8 text-secondary-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-secondary-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  <p>No relationships found</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'warnings' && (
            <div className="p-4 space-y-2">
              {filteredWarnings.map((warning, index) => (
                <div
                  key={index}
                  className="w-full text-left p-3 rounded-lg border border-red-200 bg-red-50"
                >
                  <div className="flex items-start space-x-2">
                    <svg
                      className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-red-800 break-words">
                        {warning.message}
                      </div>
                      {warning.context && (
                        <div className="text-xs text-red-600 mt-1 font-mono bg-red-100 p-1 rounded break-words">
                          {warning.context}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {filteredWarnings.length === 0 && (
                <div className="text-center py-8 text-secondary-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-green-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-green-600">No validation warnings!</p>
                  <p className="text-xs mt-1">Your ERD diagram looks great.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
