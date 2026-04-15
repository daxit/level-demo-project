interface SaveStatusProps {
  status: 'idle' | 'debouncing' | 'saving' | 'saved' | 'retrying' | 'failed';
  retryCountdown: number;
  onRetry: () => void;
}

export function SaveStatus({ status, retryCountdown, onRetry }: SaveStatusProps) {
  if (status === 'idle' || status === 'debouncing') return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      {status === 'saving' && <span className="text-gray-500 dark:text-gray-400">Saving...</span>}
      {status === 'saved' && (
        <span className="text-green-600 dark:text-green-400">
          <svg className="inline-block h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>{' '}
          Saved
        </span>
      )}
      {status === 'retrying' && (
        <>
          <span className="text-amber-600 dark:text-amber-400">Retrying in {retryCountdown}s</span>
          <button
            type="button"
            onClick={onRetry}
            className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-300 dark:hover:bg-amber-800"
          >
            Retry
          </button>
        </>
      )}
      {status === 'failed' && (
        <>
          <span className="text-red-600 dark:text-red-400">Failed to save</span>
          <button
            type="button"
            onClick={onRetry}
            className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
          >
            Retry
          </button>
        </>
      )}
    </span>
  );
}
