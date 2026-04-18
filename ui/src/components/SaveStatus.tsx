import { Check, RotateCcw } from 'lucide-react';

interface SaveStatusProps {
  status: 'idle' | 'debouncing' | 'saving' | 'saved' | 'retrying' | 'failed';
  retryCountdown: number;
  onRetry: () => void;
}

export function SaveStatus({ status, retryCountdown, onRetry }: SaveStatusProps) {
  if (status === 'idle' || status === 'debouncing') return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      {status === 'saving' && (
        <span className="inline-flex items-baseline gap-px text-gray-500 dark:text-gray-400">
          Saving
          <span className="animate-[bounce_1s_ease-in-out_0ms_infinite] text-base leading-none">
            .
          </span>
          <span className="animate-[bounce_1s_ease-in-out_150ms_infinite] text-base leading-none">
            .
          </span>
          <span className="animate-[bounce_1s_ease-in-out_300ms_infinite] text-base leading-none">
            .
          </span>
        </span>
      )}
      {status === 'saved' && (
        <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
          <Check size={14} />
          Saved
        </span>
      )}
      {status === 'retrying' && (
        <span className="text-amber-600 dark:text-amber-400">Retrying in {retryCountdown}s</span>
      )}
      {status === 'failed' && (
        <>
          <span className="text-red-600 dark:text-red-400">Failed to save</span>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex cursor-pointer items-center gap-1 rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
          >
            <RotateCcw size={11} />
            Retry
          </button>
        </>
      )}
    </span>
  );
}
