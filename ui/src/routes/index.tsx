import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';

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

  const pendingNewId = useRef<string | null>(null);

  const isDetailOpen = id !== undefined;
  const selectedAutomation = automations.find((a) => a.id === id);

  useEffect(() => {
    if (id && pendingNewId.current === id) return;
    if (id && !loading && automations.length > 0 && !selectedAutomation) {
      navigate({ search: { id: undefined } });
    }
  }, [id, loading, automations, selectedAutomation, navigate]);

  const handleDelete = (deletedId: string) => {
    if (deletedId !== id) return;
    const sorted = [...automations].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const next = sorted.find((a) => a.id !== deletedId);
    navigate({ search: { id: next?.id } });
  };

  return (
    <div className="flex h-screen">
      <div
        className={cn(
          'transition-all',
          isDetailOpen ? 'w-80 shrink-0 border-r border-gray-200 dark:border-gray-700' : 'flex-1',
        )}
      >
        <AutomationList
          automations={automations}
          loading={loading}
          error={error}
          selectedId={id}
          onSelect={(automationId) => navigate({ search: { id: automationId } })}
          onCreated={(automationId) => {
            pendingNewId.current = automationId;
            navigate({ search: { id: automationId } });
          }}
          onDelete={handleDelete}
        />
      </div>
      {isDetailOpen && (
        <DetailPanel
          key={id}
          automationId={id}
          onClose={() => navigate({ search: { id: undefined } })}
        />
      )}
    </div>
  );
}
