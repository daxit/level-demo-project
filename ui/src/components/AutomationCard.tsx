import * as Switch from '@radix-ui/react-switch';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';

import type { AutomationListFieldsFragment } from '../gql/graphql';

import { cn } from '../lib/cn';

const TRIGGER_LABEL: Record<string, string> = {
  DeviceEventTrigger: 'Device Event',
  ThresholdTrigger: 'Threshold',
  ScheduleTrigger: 'Schedule',
};

interface AutomationCardProps {
  automation: AutomationListFieldsFragment;
  isSelected: boolean;
  enabled: boolean;
  toggleError: string | null;
  deleteError: string | null;
  deleteLoading: boolean;
  onSelect: () => void;
  onToggle: (checked: boolean) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export function AutomationCard({
  automation,
  isSelected,
  enabled,
  toggleError,
  deleteError,
  deleteLoading,
  onSelect,
  onToggle,
  onDelete,
}: AutomationCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        'group cursor-pointer rounded-lg border p-4 transition-colors',
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950'
          : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600',
      )}
    >
      <div className="flex items-center justify-between">
        <h3
          className={cn(
            'truncate font-medium',
            enabled ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500',
          )}
        >
          {automation.name}
        </h3>
        <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
          <Switch.Root
            checked={enabled}
            onCheckedChange={onToggle}
            className={cn(
              'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors',
              enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600',
            )}
          >
            <Switch.Thumb
              className={cn(
                'pointer-events-none block h-4 w-4 translate-y-0.5 rounded-full bg-white shadow transition-transform',
                enabled ? 'translate-x-4.5' : 'translate-x-0.5',
              )}
            />
          </Switch.Root>
        </div>
      </div>

      <p className="mt-0.5 text-left text-xs text-gray-400 dark:text-gray-500">
        {TRIGGER_LABEL[automation.trigger.__typename] ?? automation.trigger.__typename}
      </p>

      <div className="mt-2 flex items-center gap-2">
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

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Updated {formatDistanceToNow(new Date(automation.updatedAt), { addSuffix: true })}
        </span>
        <button
          type="button"
          disabled={deleteLoading}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e);
          }}
          className="inline-flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-xs text-red-600 opacity-0 transition-opacity hover:bg-red-50 focus-visible:opacity-100 disabled:opacity-50 group-hover:opacity-100 dark:text-red-400 dark:hover:bg-red-950"
        >
          <Trash2 size={12} />
          Delete
        </button>
      </div>

      {(toggleError || deleteError) && (
        <p className="mt-3 text-left text-xs text-red-600 dark:text-red-400">
          {toggleError ?? deleteError}
        </p>
      )}
    </div>
  );
}
