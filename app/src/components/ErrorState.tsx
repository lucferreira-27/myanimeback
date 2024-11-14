import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface ErrorStateProps {
  error: string | null;
}

const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Error Loading Data</h2>
        <p className="text-gray-400">{error || 'An unexpected error occurred'}</p>
      </div>
    </div>
  );
};

export default ErrorState;
