import { useCallback } from 'react';
import MainAppView from '../app/components/MainAppView';
import { ERDProvider } from '../app/contexts/ERDContext';
import { parseMermaidERD } from '../app/lib/mermaidParser/mermaidParser';
import type { ParsedERD, ParseError } from '../app/types/erd';

function getURLParams(): URLSearchParams {
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search);
  }
  return new URLSearchParams();
}

function MainApp() {
  // Auto-load ERD from embedded placeholder
  const handleAutoLoad = useCallback(async (): Promise<{ success: boolean; data?: ParsedERD; errors?: ParseError[] }> => {
    try {
      // Get ERD diagram from global variable (set at the top of the HTML file)
      const erdDiagram = (window as any).ERD_DIAGRAM || '';
      if (!erdDiagram.trim()) {
        return {
          success: false,
          errors: [{ line: 0, message: 'No ERD diagram found in ERD_DIAGRAM variable' }],
        };
      }
      
      const result = await parseMermaidERD(erdDiagram);
      return result;
    } catch (error) {
      return {
        success: false,
        errors: [
          {
            line: 0,
            message: error instanceof Error ? error.message : 'Failed to parse embedded ERD',
          },
        ],
      };
    }
  }, []);

  const searchParams = getURLParams();
  const autoLoad = searchParams.get('auto') !== 'false'; // Default to true, can be disabled with ?auto=false
  
  const autoLoadInfo = autoLoad ? {
    shouldAutoLoad: true,
    loadingMessage: 'Loading embedded ERD diagram...',
  } : undefined;

  return (
    <MainAppView 
      onAutoLoad={autoLoadInfo ? handleAutoLoad : undefined}
      autoLoadInfo={autoLoadInfo}
    />
  );
}

export default function App() {
  return (
    <ERDProvider>
      <MainApp />
    </ERDProvider>
  );
}