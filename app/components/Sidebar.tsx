import { useState } from "react";
import { erdData } from "~/data/erd-data";

interface SidebarProps {
  selectedTable: string | null;
  selectedRelationship: string | null;
  onTableSelect: (tableId: string) => void;
  onRelationshipSelect: (relationshipId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  selectedTable,
  selectedRelationship,
  onTableSelect,
  onRelationshipSelect,
  isOpen,
  onClose,
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"tables" | "relationships">("tables");

  const filteredTables = erdData.tables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRelationships = erdData.relationships.filter(rel =>
    rel.fromTable.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rel.toTable.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rel.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTableClick = (tableId: string) => {
    onTableSelect(tableId);
    // Auto-close on mobile using CSS media queries
  };

  const handleRelationshipClick = (relationshipId: string) => {
    onRelationshipSelect(relationshipId);
    // Auto-close on mobile using CSS media queries
  };

  return (
    <>
      {/* Mobile Overlay - CSS-driven */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`
        fixed md:relative
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isOpen ? 'w-80' : 'w-0 md:w-80'}
        h-full z-50 md:z-10
        transition-all duration-300 ease-in-out
        bg-white border-r border-secondary-200
        flex flex-col
        overflow-hidden
      `}>
        {/* Header */}
        <div className="p-4 border-b border-secondary-200 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900">Database Explorer</h2>
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-md hover:bg-secondary-100 transition-colors focus-ring"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search tables and relationships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Tabs */}
          <div className="flex mt-4 bg-secondary-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("tables")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === "tables"
                ? "bg-white text-primary-700 shadow-sm"
                : "text-secondary-600 hover:text-secondary-900"
                }`}
            >
              Tables ({filteredTables.length})
            </button>
            <button
              onClick={() => setActiveTab("relationships")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === "relationships"
                ? "bg-white text-primary-700 shadow-sm"
                : "text-secondary-600 hover:text-secondary-900"
                }`}
            >
              Relations ({filteredRelationships.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "tables" && (
            <div className="p-4 space-y-2">
              {filteredTables.map((table) => (
                <button
                  key={table.id}
                  onClick={() => handleTableClick(table.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${selectedTable === table.id
                    ? "bg-primary-50 border-primary-200 text-primary-900"
                    : "bg-white border-secondary-200 hover:bg-secondary-50 hover:border-secondary-300"
                    }`}
                >
                  <div className="font-medium text-sm">{table.name}</div>
                  <div className="text-xs text-secondary-500 mt-1">
                    {table.fields.length} fields
                  </div>

                </button>
              ))}
              {filteredTables.length === 0 && (
                <div className="text-center py-8 text-secondary-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p>No tables found</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "relationships" && (
            <div className="p-4 space-y-2">
              {filteredRelationships.map((relationship) => (
                <button
                  key={relationship.id}
                  onClick={() => handleRelationshipClick(relationship.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${selectedRelationship === relationship.id
                    ? "bg-primary-50 border-primary-200 text-primary-900"
                    : "bg-white border-secondary-200 hover:bg-secondary-50 hover:border-secondary-300"
                    }`}
                >
                  <div className="font-medium text-sm">
                    {relationship.fromTable} → {relationship.toTable}
                  </div>
                  <div className="text-xs text-secondary-500 mt-1">
                    {relationship.type}
                  </div>

                </button>
              ))}
              {filteredRelationships.length === 0 && (
                <div className="text-center py-8 text-secondary-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <p>No relationships found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
