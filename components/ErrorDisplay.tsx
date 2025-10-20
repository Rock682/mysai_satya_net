
import React from 'react';
import { AlertTriangleIcon, XMarkIcon, ArrowPathIcon } from './IconComponents';

interface ErrorDisplayProps {
  message: string;
  onDismiss: () => void;
  onRetry?: () => void; // Optional retry function
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onDismiss, onRetry }) => {
  const isNetworkError = message.toLowerCase().includes('network error');

  return (
    <div className="max-w-4xl mx-auto bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 dark:border-red-700 text-red-800 dark:text-red-200 p-4 rounded-md shadow-md mb-8 animate-fade-in" role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangleIcon className="h-6 w-6 text-red-500" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <div>
            <p className="text-sm font-bold">Error Loading Jobs</p>
            <p className="text-sm mt-1">{message}</p>
          </div>
          <div className="mt-3 md:mt-0 md:ml-6 flex-shrink-0">
            {isNetworkError && onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-100 dark:focus:ring-offset-red-900/50 focus:ring-red-500"
              >
                <ArrowPathIcon className="w-4 h-4 mr-1.5" />
                Retry
              </button>
            )}
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
            <button
              onClick={onDismiss}
              className="inline-flex text-red-500 rounded-md hover:bg-red-200 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-100 dark:focus:ring-offset-red-900/50 focus:ring-red-600 p-1"
              aria-label="Dismiss"
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" />
            </button>
        </div>
      </div>
    </div>
  );
};

const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
  }
`;
document.head.appendChild(style);
