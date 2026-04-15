import * as Switch from '@radix-ui/react-switch';
import { formatDistanceToNow } from 'date-fns';
import { type Control, Controller } from 'react-hook-form';

import type { AutomationDetailFieldsFragment } from '../gql/graphql';
import type { AutomationFormValues } from './DetailPanel';

import { cn } from '../lib/cn';
import { SaveStatus } from './SaveStatus';

interface AutomationMetadataProps {
  automationId: string;
  control: Control<AutomationFormValues>;
  automation: AutomationDetailFieldsFragment;
  saveStatus: 'idle' | 'debouncing' | 'saving' | 'saved' | 'retrying' | 'failed';
  retryCountdown: number;
  onRetry: () => void;
  onImmediateSave: () => void;
  onDelete: () => void;
}

function triggerTypeLabel(trigger: AutomationDetailFieldsFragment['trigger']): string {
  return trigger.__typename.replace('Trigger', '');
}

export function AutomationMetadata({
  control,
  automation,
  saveStatus,
  retryCountdown,
  onRetry,
  onImmediateSave,
  onDelete,
}: AutomationMetadataProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="flex-1 border-b border-transparent bg-transparent text-lg font-semibold text-gray-900 outline-none focus:border-blue-500 dark:text-gray-100"
              placeholder="Automation name"
            />
          )}
        />
        <SaveStatus status={saveStatus} retryCountdown={retryCountdown} onRetry={onRetry} />
      </div>

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <input
            {...field}
            value={field.value ?? ''}
            className="w-full border-b border-transparent bg-transparent text-sm text-gray-600 outline-none focus:border-blue-500 dark:text-gray-400"
            placeholder="Add a description..."
          />
        )}
      />

      <div className="flex items-center gap-4">
        <Controller
          name="enabled"
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm">
              <Switch.Root
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  onImmediateSave();
                }}
                className={cn(
                  'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors',
                  field.value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600',
                )}
              >
                <Switch.Thumb
                  className={cn(
                    'pointer-events-none block h-4 w-4 translate-y-0.5 rounded-full bg-white shadow transition-transform',
                    field.value ? 'translate-x-4.5' : 'translate-x-0.5',
                  )}
                />
              </Switch.Root>
              <span className="text-gray-700 dark:text-gray-300">
                {field.value ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          )}
        />
        <span className="text-xs text-gray-500">{triggerTypeLabel(automation.trigger)}</span>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {automation.conditionsCount} conditions
        </span>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
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
        <button
          type="button"
          onClick={onDelete}
          className="ml-auto rounded px-2 py-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
