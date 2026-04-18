import { X } from 'lucide-react';
import { useCallback } from 'react';
import { FormProvider } from 'react-hook-form';

import { useAutomationForm } from '../hooks/useAutomationForm';
import { useDeleteAutomation } from '../hooks/useDeleteAutomation';
import { ActionsEditor } from './ActionsEditor';
import { AutomationMetadata } from './AutomationMetadata';
import { ConditionGroupEditor } from './ConditionGroupEditor';
import { SkeletonCard } from './SkeletonCard';
import { TriggerEditor } from './TriggerEditor';

interface DetailPanelProps {
  automationId: string;
  onClose: () => void;
}

export function DetailPanel({ automationId, onClose }: DetailPanelProps) {
  const { form, automation, loading, saveStatus, retryCountdown, onRetry } = useAutomationForm({
    automationId,
  });
  const { deleteAutomation } = useDeleteAutomation();

  const handleDelete = useCallback(() => {
    deleteAutomation({ variables: { id: automationId } });
    onClose();
  }, [deleteAutomation, automationId, onClose]);

  const isLoading = loading || !automation;

  return (
    <div className="flex min-h-0 flex-1 flex-col border-l border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-end border-b border-gray-200 p-4 dark:border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        >
          <X size={16} />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4 p-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <FormProvider {...form}>
          <form className="flex min-h-0 flex-1 flex-col" onSubmit={(e) => e.preventDefault()}>
            <div className="shrink-0 border-b border-gray-200 p-4 dark:border-gray-700">
              <AutomationMetadata
                automation={automation}
                saveStatus={saveStatus}
                retryCountdown={retryCountdown}
                onRetry={onRetry}
                onDelete={handleDelete}
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 pb-10">
              <div className="space-y-6">
                <section>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Trigger
                  </h3>
                  <TriggerEditor />
                </section>

                <section>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Conditions
                  </h3>
                  <ConditionGroupEditor />
                </section>

                <section>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Actions
                  </h3>
                  <ActionsEditor />
                </section>
              </div>
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  );
}
