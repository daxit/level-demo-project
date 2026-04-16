import { formatDistanceToNow } from 'date-fns';
import { Controller } from 'react-hook-form';

import type { AutomationDetailFieldsFragment } from '../gql/graphql';

import { cn } from '../lib/cn';
import { SaveStatus } from './SaveStatus';

interface AutomationMetadataProps {
  automationId: string;
  automation: AutomationDetailFieldsFragment;
  saveStatus: 'idle' | 'debouncing' | 'saving' | 'saved' | 'retrying' | 'failed';
  retryCountdown: number;
  onRetry: () => void;
  onDelete: () => void;
}

const TRIGGER_LABEL: Record<string, string> = {
  DeviceEventTrigger: 'Device Event',
  ThresholdTrigger: 'Threshold',
  ScheduleTrigger: 'Schedule',
};

function triggerTypeLabel(trigger: AutomationDetailFieldsFragment['trigger']): string {
  return TRIGGER_LABEL[trigger.__typename] ?? trigger.__typename;
}

export function AutomationMetadata({
  automation,
  saveStatus,
  retryCountdown,
  onRetry,
  onDelete,
}: AutomationMetadataProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Controller
          name="name"
          render={({ field }) => (
            <input
              {...field}
              className="flex-1 rounded bg-transparent px-2 py-1.5 text-lg font-semibold text-gray-900 outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:ring-1 focus:ring-blue-500 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
              placeholder="Automation name"
            />
          )}
        />
        <SaveStatus status={saveStatus} retryCountdown={retryCountdown} onRetry={onRetry} />
        <button
          type="button"
          onClick={onDelete}
          className="cursor-pointer rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
        >
          Delete
        </button>
      </div>

      <Controller
        name="description"
        render={({ field }) => (
          <input
            {...field}
            value={field.value ?? ''}
            className="w-full rounded bg-transparent px-2 py-1.5 text-sm text-gray-600 outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:ring-1 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
            placeholder="Add a description..."
          />
        )}
      />

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'rounded border px-2 py-0.5 text-xs font-medium',
            automation.enabled
              ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400'
              : 'border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500',
          )}
        >
          {automation.enabled ? 'Enabled' : 'Disabled'}
        </span>
        <span className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {triggerTypeLabel(automation.trigger)}
        </span>
        <span
          className={cn(
            'rounded border px-2 py-0.5 text-xs',
            automation.conditionsCount === 0
              ? 'border-gray-100 bg-gray-50 text-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-600'
              : 'border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300',
          )}
        >
          {automation.conditionsCount} conditions
        </span>
        <span
          className={cn(
            'rounded border px-2 py-0.5 text-xs',
            automation.actionsCount === 0
              ? 'border-gray-100 bg-gray-50 text-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-600'
              : 'border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300',
          )}
        >
          {automation.actionsCount} actions
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span>
          Created {formatDistanceToNow(new Date(automation.createdAt), { addSuffix: true })}
        </span>
        <span>
          Updated {formatDistanceToNow(new Date(automation.updatedAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
