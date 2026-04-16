import type {
  ActionInput,
  AutomationDetailFieldsFragment,
  TriggerInput,
  UpdateAutomationInput,
} from '../gql/graphql';
import type { UIConditionGroup } from '../types/condition-tree';

import { ComparisonOperator, DeviceEvent, Frequency, Metric } from '../gql/graphql';
import { apiTreeToUiNode, uiTreeToApiInput } from '../types/condition-tree';

/**
 * The internal form representation of an automation.
 * Used by react-hook-form to manage the detail panel state.
 */
export interface AutomationFormValues {
  name: string;
  description: string | null;
  enabled: boolean;
  trigger: TriggerInput;
  conditionGroup: UIConditionGroup;
  actions: Array<{
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
  }>;
}

/**
 * Converts an API automation response into form-compatible values.
 * Handles polymorphic trigger types and recursive condition tree conversion.
 *
 * @param automation - The automation data from the GraphQL API
 * @returns Form-ready values for react-hook-form initialization
 *
 * @example
 * const formValues = automationToFormValues(automation);
 * reset(formValues); // react-hook-form reset
 */
export function automationToFormValues(
  automation: AutomationDetailFieldsFragment,
): AutomationFormValues {
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

  const conditionGroup = apiTreeToUiNode(
    automation.conditionGroup as Parameters<typeof apiTreeToUiNode>[0],
  );

  const actions: AutomationFormValues['actions'] = automation.actions.map((action) => {
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

/**
 * Sanitizes the trigger input to ensure only the active trigger type is sent.
 * Guards against empty objects left by react-hook-form when switching trigger types.
 *
 * @param trigger - The raw trigger input from form values
 * @returns A cleaned trigger input with only the active type populated
 *
 * @example
 * cleanTriggerInput({ threshold: { metric: Metric.Cpu, ... }, deviceEvent: {} })
 * // returns { threshold: { metric: Metric.Cpu, ... } }
 */
export function cleanTriggerInput(trigger: TriggerInput): TriggerInput {
  if (trigger.threshold?.metric) {
    return {
      threshold: {
        ...trigger.threshold,
        metric: trigger.threshold.metric || Metric.Cpu,
        operator: trigger.threshold.operator || ComparisonOperator.GreaterThan,
      },
    };
  }
  if (trigger.schedule?.frequency) {
    return {
      schedule: {
        ...trigger.schedule,
        frequency: trigger.schedule.frequency || Frequency.Minutes,
        interval: trigger.schedule.interval || 1,
      },
    };
  }
  return { deviceEvent: trigger.deviceEvent ?? { event: DeviceEvent.Online } };
}

/**
 * Converts form values into the API input format for mutations.
 * Recursively transforms the UI condition tree to API format and cleans actions.
 *
 * @param values - The current form values from react-hook-form
 * @returns Valid UpdateAutomationInput for the GraphQL mutation
 *
 * @example
 * const input = formValuesToInput(getValues());
 * await updateAutomation({ variables: { id, input } });
 */
export function formValuesToInput(values: AutomationFormValues): UpdateAutomationInput {
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
