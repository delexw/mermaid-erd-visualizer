import { useState, useCallback, useEffect } from 'react';
import CustomERDViewer from './CustomERDViewer';
import Header from './Header';
import {
  MermaidUploader,
  ParseErrorDisplay,
  ParseSuccessDisplay,
} from './MermaidUploader';
import Sidebar from './Sidebar';
import { useERD } from '../contexts/ERDContext';
import type { ParsedERD, ParseError } from '../types/erd';

interface MainAppViewProps {
  /**
   * Function to auto-load ERD data on component mount.
   * Should return a promise with the result of loading ERD data.
   */
  onAutoLoad?: () => Promise<{ success: boolean; data?: ParsedERD; errors?: ParseError[] }>;
  
  /**
   * Auto-loading state information for display purposes.
   */
  autoLoadInfo?: {
    /** Whether auto-loading should be attempted */
    shouldAutoLoad: boolean;
    /** Display message during auto-loading */
    loadingMessage: string;
  };
}

export default function MainAppView({ onAutoLoad, autoLoadInfo }: MainAppViewProps) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedRelationship, setSelectedRelationship] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [parseErrors, setParseErrors] = useState<ParseError[]>([]);
  const [parseSuccess, setParseSuccess] = useState<ParsedERD | null>(null);
  const [isAutoLoading, setIsAutoLoading] = useState(false);

  const { loadData, clearData, hasData, uploadedFileName } = useERD();

  const handleTableSelect = useCallback((tableId: string | null) => {
    setSelectedTable(prev => (prev === tableId ? null : tableId));
    setSelectedRelationship(prev => (prev !== null && tableId !== null ? null : prev));
  }, []);

  const handleDataParsed = useCallback(
    (data: ParsedERD) => {
      loadData(data, uploadedFileName || 'uploaded file');
      setParseSuccess(data);
      setParseErrors([]);
      setUploadDialogOpen(false);
      setSelectedTable(null);
      setSelectedRelationship(null);
    },
    [loadData, uploadedFileName]
  );

  const handleParseError = useCallback((errors: ParseError[]) => {
    setParseErrors(errors);
    setParseSuccess(null);
  }, []);

  const handleClearData = useCallback(() => {
    clearData();
    setParseSuccess(null);
    setParseErrors([]);
    setSelectedTable(null);
    setSelectedRelationship(null);
  }, [clearData]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const toggleUploadDialog = useCallback(() => {
    setUploadDialogOpen(prev => !prev);
  }, []);

  const dismissParseErrors = useCallback(() => {
    setParseErrors([]);
  }, []);

  const dismissParseSuccess = useCallback(() => {
    setParseSuccess(null);
  }, []);

  // Auto-load ERD data using the provided onAutoLoad function
  useEffect(() => {
    if (autoLoadInfo?.shouldAutoLoad && !hasData && !isAutoLoading && onAutoLoad) {
      setIsAutoLoading(true);
      
      onAutoLoad()
        .then(result => {
          if (result.success && result.data) {
            loadData(result.data, autoLoadInfo.loadingMessage.replace('Loading embedded ERD diagram...', 'Embedded ERD Diagram').replace('Auto-loading diagram from: ', ''));
            setParseSuccess(result.data);
            setParseErrors([]);
          } else {
            setParseErrors(
              result.errors || [
                {
                  line: 0,
                  message: 'Failed to load ERD data',
                },
              ]
            );
          }
        })
        .catch(error => {
          setParseErrors([
            {
              line: 0,
              message: `Error loading ERD: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ]);
        })
        .finally(() => {
          setIsAutoLoading(false);
        });
    }
  }, [hasData, isAutoLoading, loadData, onAutoLoad, autoLoadInfo]);

  return (
    <div className="main-layout">
      <Sidebar
        selectedTable={selectedTable}
        selectedRelationship={selectedRelationship}
        onTableSelect={handleTableSelect}
        onRelationshipSelect={setSelectedRelationship}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />
      <div className="diagram-content responsive-height">
        <Header onToggleSidebar={toggleSidebar} />

        {hasData ? (
          <>
            <div className="bg-white border-b border-gray-200 px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Loaded
                  </span>
                  {uploadedFileName && (
                    <span className="text-sm text-gray-600 truncate max-w-48">
                      {uploadedFileName}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleUploadDialog}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Upload New
                  </button>
                  <button
                    onClick={handleClearData}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            <div className="diagram-viewport flex-1">
              <CustomERDViewer selectedTable={selectedTable} onTableSelect={handleTableSelect} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            {isAutoLoading ? (
              <div className="text-center max-w-2xl px-4">
                <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600 mx-auto mb-6"></div>
                <h3 className="text-2xl font-medium text-gray-900 mb-4">Loading ERD Diagram...</h3>
                <p className="text-lg text-gray-600 mb-8">
                  {autoLoadInfo?.loadingMessage || 'Loading ERD diagram...'}
                </p>
              </div>
            ) : (
              <div className="text-center max-w-2xl px-4">
                <svg
                  className="mx-auto h-20 w-20 text-gray-400 mb-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 17a2 2 0 002-2V7a2 2 0 00-2-2M9 17h6a2 2 0 002-2V7a2 2 0 00-2-2H9m12 0H9"
                  />
                </svg>
                <h3 className="text-2xl font-medium text-gray-900 mb-4">Welcome to ERD Explorer</h3>
                <p className="text-lg text-gray-600 mb-8">
                  Upload a Mermaid ERD diagram to start exploring your database schema with our
                  interactive viewer.
                </p>

                <MermaidUploader onDataParsed={handleDataParsed} onError={handleParseError} />

                {parseErrors.length > 0 && (
                  <div className="mt-6">
                    <ParseErrorDisplay errors={parseErrors} onDismiss={dismissParseErrors} />
                  </div>
                )}

                {parseSuccess && (
                  <div className="mt-6">
                    <ParseSuccessDisplay data={parseSuccess} onDismiss={dismissParseSuccess} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {uploadDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Upload New ERD Diagram</h3>
                <button
                  onClick={toggleUploadDialog}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <MermaidUploader onDataParsed={handleDataParsed} onError={handleParseError} />

                {parseErrors.length > 0 && (
                  <div className="mt-4">
                    <ParseErrorDisplay errors={parseErrors} onDismiss={dismissParseErrors} />
                  </div>
                )}

                {parseSuccess && (
                  <div className="mt-4">
                    <ParseSuccessDisplay data={parseSuccess} onDismiss={dismissParseSuccess} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}