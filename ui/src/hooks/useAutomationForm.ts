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

  const { saveDebounced, retry, cancel, status, retryCountdown, isDebouncing, isSaving } =
    useSaveQueue({
      mutateFn,
    });

  useEffect(() => {
    if (automation && !isDebouncing.current && !isSaving.current) {
      reset(automationToFormValues(automation), { keepDirtyValues: true });
    }
  }, [automation?.id, reset, isDebouncing, isSaving]);

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
