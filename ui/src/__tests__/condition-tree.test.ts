import { describe, expect, it } from 'vitest';

import type { UIConditionGroup, UIConditionLeaf } from '../types/condition-tree';

import { ComparisonOperator, LogicalOperator } from '../gql/graphql';
import { apiTreeToUiNode, uiTreeToApiInput } from '../types/condition-tree';

describe('uiTreeToApiInput', () => {
  it('converts an empty tree', () => {
    const input: UIConditionGroup = {
      type: 'group',
      id: 'root',
      operator: LogicalOperator.And,
      children: [],
    };

    expect(uiTreeToApiInput(input)).toEqual({
      operator: LogicalOperator.And,
      conditions: [],
    });
  });

  it('converts a single condition', () => {
    const leaf: UIConditionLeaf = {
      type: 'condition',
      id: 'c1',
      field: 'f',
      operator: ComparisonOperator.Equals,
      value: 'v',
    };
    const input: UIConditionGroup = {
      type: 'group',
      id: 'root',
      operator: LogicalOperator.And,
      children: [leaf],
    };

    const result = uiTreeToApiInput(input);

    expect(result).toEqual({
      operator: LogicalOperator.And,
      conditions: [{ condition: { field: 'f', operator: ComparisonOperator.Equals, value: 'v' } }],
    });
    // No type or id fields in output
    expect(result.conditions[0]).not.toHaveProperty('type');
    expect(result.conditions[0]).not.toHaveProperty('id');
  });

  it('converts a flat group with 2 conditions', () => {
    const input: UIConditionGroup = {
      type: 'group',
      id: 'root',
      operator: LogicalOperator.Or,
      children: [
        {
          type: 'condition',
          id: 'c1',
          field: 'a',
          operator: ComparisonOperator.Equals,
          value: '1',
        },
        {
          type: 'condition',
          id: 'c2',
          field: 'b',
          operator: ComparisonOperator.NotEquals,
          value: '2',
        },
      ],
    };

    const result = uiTreeToApiInput(input);

    expect(result.conditions).toHaveLength(2);
    expect(result.conditions[0]).toEqual({
      condition: { field: 'a', operator: ComparisonOperator.Equals, value: '1' },
    });
    expect(result.conditions[1]).toEqual({
      condition: { field: 'b', operator: ComparisonOperator.NotEquals, value: '2' },
    });
  });

  it('converts a nested group (3 levels deep)', () => {
    const input: UIConditionGroup = {
      type: 'group',
      id: 'root',
      operator: LogicalOperator.And,
      children: [
        {
          type: 'group',
          id: 'g1',
          operator: LogicalOperator.Or,
          children: [
            {
              type: 'group',
              id: 'g2',
              operator: LogicalOperator.And,
              children: [
                {
                  type: 'condition',
                  id: 'c1',
                  field: 'x',
                  operator: ComparisonOperator.GreaterThan,
                  value: '10',
                },
              ],
            },
          ],
        },
      ],
    };

    const result = uiTreeToApiInput(input);

    expect(result).toEqual({
      operator: LogicalOperator.And,
      conditions: [
        {
          group: {
            operator: LogicalOperator.Or,
            conditions: [
              {
                group: {
                  operator: LogicalOperator.And,
                  conditions: [
                    {
                      condition: {
                        field: 'x',
                        operator: ComparisonOperator.GreaterThan,
                        value: '10',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
  });

  it('round-trips through apiTreeToUiNode and uiTreeToApiInput', () => {
    const seedGroup = {
      __typename: 'ConditionGroup' as const,
      id: 'root-id',
      operator: LogicalOperator.And,
      conditions: [
        {
          __typename: 'Condition' as const,
          id: 'c1-id',
          field: 'env',
          comparisonOperator: ComparisonOperator.Equals,
          value: 'prod',
        },
        {
          __typename: 'ConditionGroup' as const,
          id: 'g1-id',
          operator: LogicalOperator.Or,
          conditions: [
            {
              __typename: 'Condition' as const,
              id: 'c2-id',
              field: 'region',
              comparisonOperator: ComparisonOperator.Contains,
              value: 'us',
            },
          ],
        },
      ],
    };

    const uiTree = apiTreeToUiNode(seedGroup);
    const apiInput = uiTreeToApiInput(uiTree);

    expect(apiInput).toEqual({
      operator: LogicalOperator.And,
      conditions: [
        { condition: { field: 'env', operator: ComparisonOperator.Equals, value: 'prod' } },
        {
          group: {
            operator: LogicalOperator.Or,
            conditions: [
              {
                condition: { field: 'region', operator: ComparisonOperator.Contains, value: 'us' },
              },
            ],
          },
        },
      ],
    });
  });
});
