import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

import { AutomationList } from '../components/AutomationList';
import { DetailPanel } from '../components/DetailPanel';
import { useAutomations } from '../hooks/useAutomations';
import { cn } from '../lib/cn';

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search.id === 'string' ? search.id : undefined,
  }),
  component: IndexPage,
});

function IndexPage() {
  const { id } = Route.useSearch();
  const navigate = useNavigate({ from: '/' });
  const { automations, loading, error } = useAutomations();

  const isDetailOpen = id !== undefined;
  const selectedAutomation = automations.find((a) => a.id === id);

  useEffect(() => {
    if (id && !loading && automations.length > 0 && !selectedAutomation) {
      navigate({ search: { id: undefined } });
    }
  }, [id, loading, automations.length, selectedAutomation, navigate]);

  return (
    <div className="flex h-screen">
      <div
        className={cn(
          'overflow-y-auto transition-all',
          isDetailOpen ? 'w-80 shrink-0 border-r border-gray-200 dark:border-gray-700' : 'flex-1',
        )}
      >
        <AutomationList
          automations={automations}
          loading={loading}
          error={error}
          selectedId={id}
          onSelect={(automationId) => navigate({ search: { id: automationId } })}
        />
      </div>
      {isDetailOpen && (
        <DetailPanel
          automationId={id}
          automationName={selectedAutomation?.name}
          onClose={() => navigate({ search: { id: undefined } })}
        />
      )}
    </div>
  );
}
