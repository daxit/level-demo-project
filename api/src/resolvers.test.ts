import { describe, expect, it } from 'vitest';

import type { ConditionGroup } from './data.ts';

import { automations } from './data.ts';
import {
  buildAction,
  buildConditionEntry,
  buildConditionGroup,
  buildTrigger,
  conditionsDepth,
  countConditions,
  resolvers,
} from './resolvers.ts';

// --- buildTrigger ---

describe('buildTrigger', () => {
  it('builds a DeviceEventTrigger', () => {
    const result = buildTrigger({ deviceEvent: { event: 'ONLINE' } });
    expect(result.__typename).toBe('DeviceEventTrigger');
    expect(result).toHaveProperty('event', 'ONLINE');
    expect(result.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it('builds a ThresholdTrigger with all fields', () => {
    const result = buildTrigger({
      threshold: { metric: 'CPU', operator: 'GREATER_THAN', value: 90, duration: 300 },
    });
    expect(result.__typename).toBe('ThresholdTrigger');
    expect(result).toMatchObject({
      metric: 'CPU',
      operator: 'GREATER_THAN',
      value: 90,
      duration: 300,
    });
  });

  it('builds a ThresholdTrigger with duration defaulting to null', () => {
    const result = buildTrigger({
      threshold: { metric: 'MEMORY', operator: 'LESS_THAN', value: 10 },
    });
    expect(result).toHaveProperty('duration', null);
  });

  it('builds a ScheduleTrigger', () => {
    const result = buildTrigger({ schedule: { frequency: 'HOURS', interval: 6 } });
    expect(result.__typename).toBe('ScheduleTrigger');
    expect(result).toMatchObject({ frequency: 'HOURS', interval: 6 });
  });

  it('throws when zero trigger types are provided', () => {
    expect(() => buildTrigger({})).toThrow('Exactly one trigger type');
  });

  it('throws when multiple trigger types are provided', () => {
    expect(() =>
      buildTrigger({
        deviceEvent: { event: 'ONLINE' },
        threshold: { metric: 'CPU', operator: 'GREATER_THAN', value: 90 },
      }),
    ).toThrow('Exactly one trigger type');
  });

  it('ignores null-valued keys', () => {
    const result = buildTrigger({ deviceEvent: { event: 'OFFLINE' }, threshold: null });
    expect(result.__typename).toBe('DeviceEventTrigger');
  });
});

// --- buildAction ---

describe('buildAction', () => {
  it('builds a SendNotificationAction', () => {
    const result = buildAction({
      sendNotification: {
        recipients: ['a@b.com'],
        subject: 'Alert',
        body: 'Something happened',
      },
    });
    expect(result.__typename).toBe('SendNotificationAction');
    expect(result).toMatchObject({
      recipients: ['a@b.com'],
      subject: 'Alert',
      body: 'Something happened',
    });
  });

  it('builds a RunScriptAction with all fields', () => {
    const result = buildAction({
      runScript: { script: 'cleanup', args: ['--force'], timeout: 60 },
    });
    expect(result.__typename).toBe('RunScriptAction');
    expect(result).toMatchObject({ script: 'cleanup', args: ['--force'], timeout: 60 });
  });

  it('defaults args and timeout to null', () => {
    const result = buildAction({ runScript: { script: 'deploy' } });
    expect(result).toMatchObject({ script: 'deploy', args: null, timeout: null });
  });

  it('throws when zero action types are provided', () => {
    expect(() => buildAction({})).toThrow('Exactly one action type');
  });

  it('throws when multiple action types are provided', () => {
    expect(() =>
      buildAction({
        sendNotification: { recipients: ['a@b.com'], subject: 's', body: 'b' },
        runScript: { script: 'x' },
      }),
    ).toThrow('Exactly one action type');
  });
});

// --- buildConditionEntry / buildConditionGroup ---

describe('buildConditionEntry', () => {
  it('builds a leaf Condition', () => {
    const result = buildConditionEntry({
      condition: { field: 'os', operator: 'EQUALS', value: 'linux' },
    });
    expect(result.__typename).toBe('Condition');
    expect(result).toMatchObject({ field: 'os', operator: 'EQUALS', value: 'linux' });
  });

  it('builds a ConditionGroup', () => {
    const result = buildConditionEntry({
      group: {
        operator: 'OR',
        conditions: [{ condition: { field: 'a', operator: 'EQUALS', value: '1' } }],
      },
    });
    expect(result.__typename).toBe('ConditionGroup');
    expect((result as ConditionGroup).conditions).toHaveLength(1);
  });

  it('throws when both condition and group are provided', () => {
    expect(() =>
      buildConditionEntry({
        condition: { field: 'a', operator: 'EQUALS', value: '1' },
        group: { operator: 'AND', conditions: [] },
      }),
    ).toThrow('Exactly one of condition or group');
  });

  it('throws when neither condition nor group is provided', () => {
    expect(() => buildConditionEntry({})).toThrow('Exactly one of condition or group');
  });
});

describe('buildConditionGroup', () => {
  it('builds a group with nested conditions', () => {
    const result = buildConditionGroup({
      operator: 'AND',
      conditions: [
        { condition: { field: 'a', operator: 'EQUALS', value: '1' } },
        { condition: { field: 'b', operator: 'NOT_EQUALS', value: '2' } },
      ],
    });
    expect(result.__typename).toBe('ConditionGroup');
    expect(result.operator).toBe('AND');
    expect(result.conditions).toHaveLength(2);
  });

  it('builds deeply nested groups', () => {
    const result = buildConditionGroup({
      operator: 'OR',
      conditions: [
        {
          group: {
            operator: 'AND',
            conditions: [{ condition: { field: 'x', operator: 'EQUALS', value: 'y' } }],
          },
        },
      ],
    });
    expect(result.conditions[0].__typename).toBe('ConditionGroup');
    const nested = result.conditions[0] as ConditionGroup;
    expect(nested.conditions[0].__typename).toBe('Condition');
  });
});

// --- countConditions ---

describe('countConditions', () => {
  it('counts leaf conditions in a flat group', () => {
    const group: ConditionGroup = {
      __typename: 'ConditionGroup',
      id: '1',
      operator: 'AND',
      conditions: [
        { __typename: 'Condition', id: 'a', field: 'f', operator: 'EQUALS', value: 'v' },
        { __typename: 'Condition', id: 'b', field: 'g', operator: 'EQUALS', value: 'w' },
      ],
    };
    expect(countConditions(group)).toBe(2);
  });

  it('returns 0 for an empty group', () => {
    const group: ConditionGroup = {
      __typename: 'ConditionGroup',
      id: '1',
      operator: 'AND',
      conditions: [],
    };
    expect(countConditions(group)).toBe(0);
  });

  it('counts across nested groups', () => {
    const group: ConditionGroup = {
      __typename: 'ConditionGroup',
      id: '1',
      operator: 'AND',
      conditions: [
        { __typename: 'Condition', id: 'a', field: 'f', operator: 'EQUALS', value: 'v' },
        {
          __typename: 'ConditionGroup',
          id: '2',
          operator: 'OR',
          conditions: [
            { __typename: 'Condition', id: 'b', field: 'g', operator: 'EQUALS', value: 'w' },
            { __typename: 'Condition', id: 'c', field: 'h', operator: 'EQUALS', value: 'x' },
          ],
        },
      ],
    };
    expect(countConditions(group)).toBe(3);
  });

  it('counts correctly against seed data', () => {
    expect(countConditions(automations[0].conditionGroup)).toBe(2);
    expect(countConditions(automations[1].conditionGroup)).toBe(3);
    expect(countConditions(automations[2].conditionGroup)).toBe(5);
  });
});

// --- conditionsDepth ---

describe('conditionsDepth', () => {
  it('returns 1 for a flat group', () => {
    const group: ConditionGroup = {
      __typename: 'ConditionGroup',
      id: '1',
      operator: 'AND',
      conditions: [
        { __typename: 'Condition', id: 'a', field: 'f', operator: 'EQUALS', value: 'v' },
      ],
    };
    expect(conditionsDepth(group)).toBe(1);
  });

  it('returns 1 for an empty group', () => {
    const group: ConditionGroup = {
      __typename: 'ConditionGroup',
      id: '1',
      operator: 'AND',
      conditions: [],
    };
    expect(conditionsDepth(group)).toBe(1);
  });

  it('returns 2 for one level of nesting', () => {
    const group: ConditionGroup = {
      __typename: 'ConditionGroup',
      id: '1',
      operator: 'AND',
      conditions: [
        {
          __typename: 'ConditionGroup',
          id: '2',
          operator: 'OR',
          conditions: [
            { __typename: 'Condition', id: 'a', field: 'f', operator: 'EQUALS', value: 'v' },
          ],
        },
      ],
    };
    expect(conditionsDepth(group)).toBe(2);
  });

  it('returns correct depth against seed data', () => {
    expect(conditionsDepth(automations[0].conditionGroup)).toBe(1);
    expect(conditionsDepth(automations[1].conditionGroup)).toBe(2);
    expect(conditionsDepth(automations[2].conditionGroup)).toBe(3);
  });
});

// --- Automation resolver fields ---

describe('Automation resolver fields', () => {
  const { actionsCount, conditionsCount, conditionsDepth: depthResolver } = resolvers.Automation;

  it('actionsCount returns the number of actions', () => {
    expect(actionsCount(automations[0])).toBe(1);
    expect(actionsCount(automations[1])).toBe(2);
    expect(actionsCount(automations[2])).toBe(2);
  });

  it('conditionsCount returns the leaf condition count', () => {
    expect(conditionsCount(automations[0])).toBe(2);
    expect(conditionsCount(automations[1])).toBe(3);
    expect(conditionsCount(automations[2])).toBe(5);
  });

  it('conditionsDepth returns the nesting depth', () => {
    expect(depthResolver(automations[0])).toBe(1);
    expect(depthResolver(automations[1])).toBe(2);
    expect(depthResolver(automations[2])).toBe(3);
  });
});

// --- Union type resolvers ---

describe('type resolvers', () => {
  it('ConditionEntry resolves __typename', () => {
    expect(
      resolvers.ConditionEntry.__resolveType({
        __typename: 'Condition',
        id: '1',
        field: '',
        operator: '',
        value: '',
      }),
    ).toBe('Condition');
    expect(
      resolvers.ConditionEntry.__resolveType({
        __typename: 'ConditionGroup',
        id: '1',
        operator: '',
        conditions: [],
      }),
    ).toBe('ConditionGroup');
  });

  it('Trigger resolves __typename', () => {
    expect(
      resolvers.Trigger.__resolveType({ __typename: 'DeviceEventTrigger', id: '1', event: '' }),
    ).toBe('DeviceEventTrigger');
  });

  it('Action resolves __typename', () => {
    expect(
      resolvers.Action.__resolveType({
        __typename: 'SendNotificationAction',
        id: '1',
        recipients: [],
        subject: '',
        body: '',
      }),
    ).toBe('SendNotificationAction');
  });
});
