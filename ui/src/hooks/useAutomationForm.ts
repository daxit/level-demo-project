import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { DeviceEvent, LogicalOperator } from '../gql/graphql';
import {
  automationToFormValues,
  formValuesToInput,
  type AutomationFormValues,
} from '../utilities/automationTransform';
import { useAutomation } from './useAutomation';
import { useSaveQueue } from './useSaveQueue';
import { useUpdateAutomation } from './useUpdateAutomation';

interface UseAutomationFormOptions {
  automationId: string;
}

export function useAutomationForm({ automationId }: UseAutomationFormOptions) {
  const { automation, loading } = useAutomation(automationId);
  const { updateAutomation } = useUpdateAutomation();

  const form = useForm<AutomationFormValues>({
    defaultValues: {
      name: '',
      description: null,
      enabled: false,
      trigger: { deviceEvent: { event: DeviceEvent.Online } },
      conditionGroup: { type: 'group', id: 'default', operator: LogicalOperator.And, children: [] },
      actions: [],
    },
  });

  const { reset, watch } = form;

  const mutateFn = useCallback(
    async (payload: import('../gql/graphql').UpdateAutomationInput) => {
      await updateAutomation({ variables: { id: automationId, input: payload } });
    },
    [updateAutomation, automationId],
  );

  const { saveDebounced, retry, cancel, status, retryCountdown } = useSaveQueue({ mutateFn });

  // Hydrate form when server data changes. automation is reference-stable (see useAutomation)
  // so this only fires when the server actually returns new data.
  useEffect(() => {
    if (automation) {
      reset(automationToFormValues(automation));
    }
  }, [automation, reset]);

  // Save on user-driven form changes. The watch callback receives { type } as its second argument:
  // type === 'change' for user input, type === undefined for programmatic reset()/setValue().
  // This is the documented RHF pattern for side-effect subscriptions.
  useEffect(() => {
    const { unsubscribe } = watch((values, { type }) => {
      if (type !== 'change') return;
      if (!values.conditionGroup) return;
      saveDebounced(formValuesToInput(values as AutomationFormValues));
    });
    return unsubscribe;
  }, [watch, saveDebounced]);

  return {
    form,
    automation,
    loading,
    saveStatus: status,
    retryCountdown,
    onRetry: retry,
    cancel,
  };
}
