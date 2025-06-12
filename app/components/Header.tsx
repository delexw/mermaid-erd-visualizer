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
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div>
            <h1 className="responsive-text font-bold text-secondary-900">Database Schema</h1>
            <p className="text-secondary-600 text-xs sm:text-sm hidden sm:block">
              Interactive Entity Relationship Diagram Explorer
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
