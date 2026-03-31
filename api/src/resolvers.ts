import { GraphQLError } from 'graphql';

import type { Action, Automation, ConditionEntry, ConditionGroup, Trigger } from './data.ts';

import { automations } from './data.ts';

// --- Helpers ---

const delay = () => new Promise<void>((resolve) => setTimeout(resolve, 200 + Math.random() * 300));

const MUTATION_ERROR_MESSAGES = [
  'Failed to save automation. Please try again.',
  'Service temporarily unavailable. Please retry.',
  'Request timed out. Please try again later.',
];

const maybeFail = () => {
  if (Math.random() < 0.1) {
    const msg = MUTATION_ERROR_MESSAGES[Math.floor(Math.random() * MUTATION_ERROR_MESSAGES.length)];
    throw new GraphQLError(msg);
  }
};

// --- Input builders ---

// biome-ignore lint: using any for untyped GraphQL input objects
export function buildTrigger(input: any): Trigger {
  const keys = Object.keys(input).filter((k) => input[k] != null);
  if (keys.length !== 1) {
    throw new GraphQLError('Exactly one trigger type must be provided in TriggerInput.');
  }

  if (input.deviceEvent) {
    return {
      __typename: 'DeviceEventTrigger',
      id: crypto.randomUUID(),
      event: input.deviceEvent.event,
    };
  }
  if (input.threshold) {
    return {
      __typename: 'ThresholdTrigger',
      id: crypto.randomUUID(),
      metric: input.threshold.metric,
      operator: input.threshold.operator,
      value: input.threshold.value,
      duration: input.threshold.duration ?? null,
    };
  }
  return {
    __typename: 'ScheduleTrigger',
    id: crypto.randomUUID(),
    frequency: input.schedule.frequency,
    interval: input.schedule.interval,
  };
}

// biome-ignore lint: using any for untyped GraphQL input objects
export function buildConditionEntry(input: any): ConditionEntry {
  if (input.condition && input.group) {
    throw new GraphQLError(
      'Exactly one of condition or group must be provided in ConditionEntryInput.',
    );
  }
  if (input.condition) {
    return {
      __typename: 'Condition',
      id: crypto.randomUUID(),
      field: input.condition.field,
      operator: input.condition.operator,
      value: input.condition.value,
    };
  }
  if (input.group) {
    return buildConditionGroup(input.group);
  }
  throw new GraphQLError(
    'Exactly one of condition or group must be provided in ConditionEntryInput.',
  );
}

// biome-ignore lint: using any for untyped GraphQL input objects
export function buildConditionGroup(input: any): ConditionGroup {
  return {
    __typename: 'ConditionGroup',
    id: crypto.randomUUID(),
    operator: input.operator,
    conditions: input.conditions.map(buildConditionEntry),
  };
}

// biome-ignore lint: using any for untyped GraphQL input objects
export function buildAction(input: any): Action {
  const keys = Object.keys(input).filter((k) => input[k] != null);
  if (keys.length !== 1) {
    throw new GraphQLError('Exactly one action type must be provided in ActionInput.');
  }

  if (input.sendNotification) {
    return {
      __typename: 'SendNotificationAction',
      id: crypto.randomUUID(),
      recipients: input.sendNotification.recipients,
      subject: input.sendNotification.subject,
      body: input.sendNotification.body,
    };
  }
  return {
    __typename: 'RunScriptAction',
    id: crypto.randomUUID(),
    script: input.runScript.script,
    args: input.runScript.args ?? null,
    timeout: input.runScript.timeout ?? null,
  };
}

// --- Condition tree helpers ---

export function countConditions(group: ConditionGroup): number {
  let count = 0;
  for (const entry of group.conditions) {
    if (entry.__typename === 'Condition') {
      count++;
    } else {
      count += countConditions(entry);
    }
  }
  return count;
}

export function conditionsDepth(group: ConditionGroup): number {
  let maxChildDepth = 0;
  for (const entry of group.conditions) {
    if (entry.__typename === 'ConditionGroup') {
      maxChildDepth = Math.max(maxChildDepth, conditionsDepth(entry));
    }
  }
  return 1 + maxChildDepth;
}

// --- Resolvers ---

export const resolvers = {
  Automation: {
    actionsCount: (automation: Automation) => automation.actions.length,
    conditionsCount: (automation: Automation) => countConditions(automation.conditionGroup),
    conditionsDepth: (automation: Automation) => conditionsDepth(automation.conditionGroup),
  },
  ConditionEntry: {
    __resolveType: (obj: ConditionEntry) => obj.__typename,
  },
  Trigger: {
    __resolveType: (obj: Trigger) => obj.__typename,
  },
  Action: {
    __resolveType: (obj: Action) => obj.__typename,
  },

  Query: {
    automations: async () => {
      await delay();
      return automations;
    },
    automation: async (_: unknown, { id }: { id: string }) => {
      await delay();
      return automations.find((a) => a.id === id) ?? null;
    },
  },

  Mutation: {
    createAutomation: async (_: unknown, { input }: { input: any }) => {
      await delay();
      maybeFail();

      const now = new Date().toISOString();
      const automation: Automation = {
        id: crypto.randomUUID(),
        name: input.name,
        description: input.description ?? null,
        enabled: input.enabled ?? false,
        trigger: buildTrigger(input.trigger),
        conditionGroup: input.conditionGroup
          ? buildConditionGroup(input.conditionGroup)
          : {
              __typename: 'ConditionGroup' as const,
              id: crypto.randomUUID(),
              operator: 'AND',
              conditions: [],
            },
        actions: input.actions.map(buildAction),
        createdAt: now,
        updatedAt: now,
      };

      automations.push(automation);
      return automation;
    },

    updateAutomation: async (_: unknown, { id, input }: { id: string; input: any }) => {
      await delay();
      maybeFail();

      const automation = automations.find((a) => a.id === id);
      if (!automation) {
        throw new GraphQLError(`Automation with id "${id}" not found.`);
      }

      if (input.name !== undefined) automation.name = input.name;
      if (input.description !== undefined) automation.description = input.description;
      if (input.enabled !== undefined) automation.enabled = input.enabled;
      if (input.trigger !== undefined) automation.trigger = buildTrigger(input.trigger);
      if (input.conditionGroup !== undefined) {
        automation.conditionGroup = buildConditionGroup(input.conditionGroup);
      }
      if (input.actions !== undefined) {
        automation.actions = input.actions.filter((a: any) => a != null).map(buildAction);
      }

      automation.updatedAt = new Date().toISOString();
      return automation;
    },

    deleteAutomation: async (_: unknown, { id }: { id: string }) => {
      await delay();
      maybeFail();

      const index = automations.findIndex((a) => a.id === id);
      if (index === -1) {
        throw new GraphQLError(`Automation with id "${id}" not found.`);
      }

      automations.splice(index, 1);
      return { success: true, id };
    },
  },
};
