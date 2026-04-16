import { useState } from 'react';

import type { AutomationListFieldsFragment } from '../gql/graphql';
import { useDeleteAutomation } from './useDeleteAutomation';
import { useUpdateAutomation } from './useUpdateAutomation';

interface UseAutomationCardOptions {
  automation: AutomationListFieldsFragment;
}

export function useAutomationCard({ automation }: UseAutomationCardOptions) {
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

  const handleDelete = () => {
    setDeleteError(null);
    deleteAutomation({
      variables: { id: automation.id },
      onError: (err) => setDeleteError(err.message),
    });
  };

  return {
    enabled,
    toggleError,
    deleteError,
    deleteLoading,
    handleToggle,
    handleDelete,
  };
}
