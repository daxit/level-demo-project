import { useCallback, useEffect, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import type { UIConditionNode } from '../types/condition-tree';

import {
  type ActionInput,
  type AutomationDetailFieldsFragment,
  DeviceEvent,
  LogicalOperator,
  type TriggerInput,
  type UpdateAutomationInput,
} from '../gql/graphql';
import { useAutomation } from '../hooks/useAutomation';
import { useDeleteAutomation } from '../hooks/useDeleteAutomation';
import { useSaveQueue } from '../hooks/useSaveQueue';
import { useUpdateAutomation } from '../hooks/useUpdateAutomation';
import { apiTreeToUiNode, uiTreeToApiInput } from '../types/condition-tree';
import { ActionsEditor } from './ActionsEditor';
import { AutomationMetadata } from './AutomationMetadata';
import { ConditionGroupEditor } from './ConditionGroupEditor';
import { SkeletonCard } from './SkeletonCard';
import { TriggerEditor } from './TriggerEditor';

interface ActionFormValue {
  sendNotification?: {
    recipients: string[];
    subject: string;
    body: string;
  };
  runScript?: {
    script: string;
    args: string[];
    timeout: number | null;
  };
}

export interface AutomationFormValues {
  name: string;
  description: string | null;
  enabled: boolean;
  trigger: TriggerInput;
  conditionGroup: {
    type: 'group';
    id: string;
    operator: LogicalOperator;
    children: UIConditionNode[];
  };
  actions: ActionFormValue[];
}

function automationToFormValues(automation: AutomationDetailFieldsFragment): AutomationFormValues {
  const trigger: AutomationFormValues['trigger'] = {};
  if (automation.trigger.__typename === 'DeviceEventTrigger') {
    trigger.deviceEvent = { event: automation.trigger.event };
  } else if (automation.trigger.__typename === 'ThresholdTrigger') {
    trigger.threshold = {
      metric: automation.trigger.metric,
      operator: automation.trigger.operator,
      value: automation.trigger.value,
      duration: automation.trigger.duration ?? null,
    };
  } else if (automation.trigger.__typename === 'ScheduleTrigger') {
    trigger.schedule = {
      frequency: automation.trigger.frequency,
      interval: automation.trigger.interval,
    };
  }

  // Use apiTreeToUiNode for recursive condition tree conversion
  const conditionGroup = apiTreeToUiNode(
    automation.conditionGroup as Parameters<typeof apiTreeToUiNode>[0],
  );

  const actions: ActionFormValue[] = automation.actions.map((action) => {
    if (action.__typename === 'SendNotificationAction') {
      return {
        sendNotification: {
          recipients: [...action.recipients],
          subject: action.subject,
          body: action.body,
        },
      };
    }
    return {
      runScript: {
        script: action.script,
        args: action.args ? [...action.args] : [],
        timeout: action.timeout ?? null,
      },
    };
  });

  return {
    name: automation.name,
    description: automation.description ?? null,
    enabled: automation.enabled,
    trigger,
    conditionGroup,
    actions,
  };
}

function cleanTriggerInput(trigger: TriggerInput): TriggerInput {
  // Only include the active trigger key — check for populated required fields
  // to guard against empty objects left by react-hook-form
  if (trigger.threshold?.metric != null) return { threshold: trigger.threshold };
  if (trigger.schedule?.frequency != null) return { schedule: trigger.schedule };
  return { deviceEvent: trigger.deviceEvent };
}

function formValuesToInput(values: AutomationFormValues): UpdateAutomationInput {
  // Use uiTreeToApiInput for recursive condition tree conversion
  const conditionGroup = uiTreeToApiInput(values.conditionGroup);

  const actions: ActionInput[] = values.actions.map((a) => {
    if (a.sendNotification) {
      return { sendNotification: a.sendNotification };
    }
    return {
      runScript: {
        script: a.runScript!.script,
        args: a.runScript!.args.length > 0 ? a.runScript!.args : undefined,
        timeout: a.runScript!.timeout,
      },
    };
  });

  return {
    name: values.name,
    description: values.description,
    enabled: values.enabled,
    trigger: cleanTriggerInput(values.trigger),
    conditionGroup,
    actions,
  };
}

interface DetailPanelProps {
  automationId: string;
  automationName: string | undefined;
  onClose: () => void;
}

export function DetailPanel({ automationId, onClose }: DetailPanelProps) {
  const { automation, loading } = useAutomation(automationId);
  const { updateAutomation } = useUpdateAutomation();
  const { deleteAutomation } = useDeleteAutomation();
  const initializedRef = useRef(false);
  const prevValuesRef = useRef<string>('');

  const { control, reset, getValues, setValue } = useForm<AutomationFormValues>({
    defaultValues: {
      name: '',
      description: null,
      enabled: false,
      trigger: { deviceEvent: { event: DeviceEvent.Online } },
      conditionGroup: { type: 'group', id: 'default', operator: LogicalOperator.And, children: [] },
      actions: [],
    },
  });

  const mutateFn = useCallback(
    async (payload: UpdateAutomationInput) => {
      await updateAutomation({ variables: { id: automationId, input: payload } });
    },
    [updateAutomation, automationId],
  );

  const { saveDebounced, saveImmediate, retry, status, retryCountdown } = useSaveQueue({
    mutateFn,
  });

  // Hydrate form when automation data loads
  useEffect(() => {
    if (automation && !initializedRef.current) {
      reset(automationToFormValues(automation));
      initializedRef.current = true;
    }
  }, [automation, reset]);

  // Reset initialization and baseline snapshot when automationId changes
  useEffect(() => {
    initializedRef.current = false;
    prevValuesRef.current = '';
  }, [automationId]);

  // Watch for form changes and trigger debounced save
  const watchedValues = useWatch({ control });

  useEffect(() => {
    if (!initializedRef.current) return;
    const serialized = JSON.stringify(watchedValues);
    if (serialized !== prevValuesRef.current && prevValuesRef.current !== '') {
      saveDebounced(formValuesToInput(getValues()));
    }
    prevValuesRef.current = serialized;
  }, [watchedValues, saveDebounced, getValues]);

  const handleImmediateSave = useCallback(() => {
    if (!initializedRef.current) return;
    // Small delay to let react-hook-form update state
    setTimeout(() => {
      saveImmediate(formValuesToInput(getValues()));
    }, 0);
  }, [saveImmediate, getValues]);

  const handleDelete = useCallback(() => {
    deleteAutomation({ variables: { id: automationId } });
    onClose();
  }, [deleteAutomation, automationId, onClose]);

  if (loading || !automation) {
    return (
      <div className="flex min-h-0 flex-1 flex-col border-l border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between pb-4">
          <div className="h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col border-l border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-end border-b border-gray-200 px-4 py-2 dark:border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        >
          &times;
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <AutomationMetadata
            automationId={automationId}
            control={control}
            automation={automation}
            saveStatus={status}
            retryCountdown={retryCountdown}
            onRetry={retry}
            onImmediateSave={handleImmediateSave}
            onDelete={handleDelete}
          />

          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Trigger
            </h3>
            <TriggerEditor
              control={control}
              setValue={setValue}
              onImmediateSave={handleImmediateSave}
            />
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Conditions
            </h3>
            <ConditionGroupEditor control={control} onImmediateSave={handleImmediateSave} />
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Actions
            </h3>
            <ActionsEditor control={control} onImmediateSave={handleImmediateSave} />
          </section>
        </form>
      </div>
    </div>
  );
}
