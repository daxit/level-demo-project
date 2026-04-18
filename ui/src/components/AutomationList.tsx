import { Plus } from 'lucide-react';

import { type AutomationListFieldsFragment } from '../gql/graphql';
import { useAutomationCard } from '../hooks/useAutomationCard';
import { useCreateAutomation } from '../hooks/useCreateAutomation';
import { AutomationCard } from './AutomationCard';
import { SkeletonCard } from './SkeletonCard';

interface AutomationCardContainerProps {
  automation: AutomationListFieldsFragment;
  isSelected: boolean;
  onSelect: () => void;
}

function AutomationCardContainer({
  automation,
  isSelected,
  onSelect,
}: AutomationCardContainerProps) {
  const { enabled, toggleError, deleteError, deleteLoading, handleToggle, handleDelete } =
    useAutomationCard({ automation });

  return (
    <AutomationCard
      automation={automation}
      isSelected={isSelected}
      enabled={enabled}
      toggleError={toggleError}
      deleteError={deleteError}
      deleteLoading={deleteLoading}
      onSelect={onSelect}
      onToggle={handleToggle}
      onDelete={handleDelete}
    />
  );
}

interface AutomationListProps {
  automations: AutomationListFieldsFragment[];
  loading: boolean;
  error: Error | undefined;
  selectedId: string | undefined;
  onSelect: (id: string) => void;
  onCreated: (id: string) => void;
}

export function AutomationList({
  automations,
  loading,
  error,
  selectedId,
  onSelect,
  onCreated,
}: AutomationListProps) {
  const { createAutomation, loading: createLoading } = useCreateAutomation({ onCreated });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
        <h1 className="text-lg font-semibold tracking-wide text-gray-900 dark:text-gray-100">
          Automations
        </h1>
        <button
          type="button"
          disabled={createLoading}
          onClick={createAutomation}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {createLoading ? (
            'Creating...'
          ) : (
            <>
              <Plus size={14} /> New Automation
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="space-y-3 p-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {error && (
          <div className="p-4">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              Failed to load automations: {error.message}
            </div>
          </div>
        )}

        {!loading && !error && automations.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium">No automations yet</p>
            <p className="mt-1 text-sm">Create your first automation to get started.</p>
          </div>
        )}

        {!loading && !error && automations.length > 0 && (
          <div className="space-y-3 p-4">
            {[...automations]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((automation) => (
                <AutomationCardContainer
                  key={automation.id}
                  automation={automation}
                  isSelected={automation.id === selectedId}
                  onSelect={() => onSelect(automation.id)}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
