import { useEffect } from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
  progress: number;
  stage: string;
  onLoadingComplete?: () => void;
}

export function LoadingOverlay({
  isLoading,
  progress,
  stage,
  onLoadingComplete,
}: LoadingOverlayProps) {
  // Handle completion when progress reaches 100%
  useEffect(() => {
    if (progress >= 100 && isLoading) {
      const timer = setTimeout(() => {
        onLoadingComplete?.();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [progress, isLoading, onLoadingComplete]);

  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-20 rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="text-blue-600 font-medium">Computing optimal layout...</span>
      </div>

      {/* Progress Bar */}
      <div className="w-64 bg-gray-200 rounded-full h-2.5 mb-1">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Progress Text */}
      <div className="text-xs text-secondary-500">{`${Math.min(progress, 100)}% complete`}</div>

      {/* Status Text */}
      <div className="text-xs text-secondary-400 mt-2">{stage}</div>
    </div>
  );
}
