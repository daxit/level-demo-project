import * as Switch from '@radix-ui/react-switch';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

import type { AutomationListFieldsFragment } from '../gql/graphql';

import { useDeleteAutomation } from '../hooks/useDeleteAutomation';
import { useUpdateAutomation } from '../hooks/useUpdateAutomation';
import { cn } from '../lib/cn';

function triggerLabel(typename: string): string {
  return typename.replace('Trigger', '');
}

interface AutomationCardProps {
  automation: AutomationListFieldsFragment;
  isSelected: boolean;
  onSelect: () => void;
}

export function AutomationCard({ automation, isSelected, onSelect }: AutomationCardProps) {
  const [toggleError, setToggleError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [optimisticEnabled, setOptimisticEnabled] = useState<boolean | null>(null);

  const { updateAutomation } = useUpdateAutomation((err) => {
    setOptimisticEnabled(null);
    setToggleError(err.message);
  });

  const { deleteAutomation, loading: deleteLoading } = useDeleteAutomation();

  const enabled = optimisticEnabled ?? automation.enabled;

  const handleToggle = (checked: boolean) => {
    setToggleError(null);
    setOptimisticEnabled(checked);
    updateAutomation({
      variables: { id: automation.id, input: { enabled: checked } },
      onCompleted: () => setOptimisticEnabled(null),
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteError(null);
    deleteAutomation({
      variables: { id: automation.id },
      onError: (err) => setDeleteError(err.message),
    });
  };

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
        'cursor-pointer rounded-lg border p-4 transition-colors',
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950'
          : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600',
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="truncate font-medium text-gray-900 dark:text-gray-100">{automation.name}</h3>
        <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
          <Switch.Root
            checked={enabled}
            onCheckedChange={handleToggle}
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

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {triggerLabel(automation.trigger.__typename)}
      </p>

      <div className="mt-2 flex items-center gap-2">
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {automation.conditionsCount} conditions
        </span>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {automation.actionsCount} actions
        </span>
        <span className="ml-auto text-xs text-gray-400">
          {formatDistanceToNow(new Date(automation.updatedAt), { addSuffix: true })}
        </span>
      </div>

      {toggleError && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{toggleError}</p>}

      <div className="mt-2 flex justify-end">
        <button
          type="button"
          disabled={deleteLoading}
          onClick={handleDelete}
          className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950"
        >
          Delete
        </button>
      </div>

      {deleteError && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{deleteError}</p>}
    </div>
  );
}
