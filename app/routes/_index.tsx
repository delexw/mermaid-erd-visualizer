import { useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import ERDViewer from "~/components/ERDViewer";
import Sidebar from "~/components/Sidebar";
import Header from "~/components/Header";

export const meta: MetaFunction = () => {
  return [
    { title: "ERD Explorer - Marketplace Database Schema" },
    { name: "description", content: "Interactive Entity Relationship Diagram viewer for the Envato Marketplace database schema" },
  ];
};

export default function Index() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedRelationship, setSelectedRelationship] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTableSelect = (tableId: string) => {
    console.log('Table selected in main route:', tableId);
    setSelectedTable(tableId);
  };

  return (
    <div className="main-layout">
      <Sidebar
        selectedTable={selectedTable}
        selectedRelationship={selectedRelationship}
        onTableSelect={handleTableSelect}
        onRelationshipSelect={setSelectedRelationship}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="diagram-content responsive-height">
        <Header
          selectedTable={selectedTable}
          selectedRelationship={selectedRelationship}
          onClearSelection={() => {
            setSelectedTable(null);
            setSelectedRelationship(null);
          }}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="diagram-viewport">
          <ERDViewer
            selectedTable={selectedTable}
          />
        </div>
      </div>
    </div>
  );
} 