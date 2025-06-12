
interface HeaderProps {
  selectedTable: string | null;
  selectedRelationship: string | null;
  onToggleSidebar: () => void;
}

export default function Header({
  selectedTable,
  selectedRelationship,
  onToggleSidebar,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-secondary-200 responsive-padding relative z-30 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="p-1.5 sm:p-2 rounded-md hover:bg-secondary-100 transition-colors focus-ring"
            aria-label="Toggle sidebar"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div>
            <h1 className="responsive-text font-bold text-secondary-900">
              Database Schema
            </h1>
            <p className="text-secondary-600 text-xs sm:text-sm hidden sm:block">
              Interactive Entity Relationship Diagram Explorer
            </p>
          </div>
        </div>
      </div>

      {/* Selection Info */}
      {(selectedTable || selectedRelationship) && (
        <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-primary-50 border border-primary-200 rounded-lg layout-transition">
          {selectedTable && (
            <div className="flex items-start gap-2 sm:gap-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1">
                  <span className="font-medium text-primary-800 text-sm">Selected Table:</span>
                  <span className="text-primary-700 break-all text-sm">{selectedTable}</span>
                  <span className="text-primary-600 text-xs">(click again to deselect)</span>
                </div>
              </div>
            </div>
          )}

          {selectedRelationship && (
            <div className="flex items-start gap-2 sm:gap-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1">
                  <span className="font-medium text-primary-800 text-sm">Selected Relationship:</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
} 