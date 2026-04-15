import type { ComparisonOperator, ConditionGroupInput, LogicalOperator } from '../gql/graphql';

export type UIConditionLeaf = {
  type: 'condition';
  id: string;
  field: string;
  operator: ComparisonOperator;
  value: string;
};

export type UIConditionGroup = {
  type: 'group';
  id: string;
  operator: LogicalOperator;
  children: UIConditionNode[];
};

export type UIConditionNode = UIConditionLeaf | UIConditionGroup;

export function uiTreeToApiInput(node: UIConditionGroup): ConditionGroupInput {
  return {
    operator: node.operator,
    conditions: (node.children ?? []).map((child) => {
      if (child.type === 'condition') {
        return {
          condition: {
            field: child.field,
            operator: child.operator,
            value: child.value,
          },
        };
      }
      return {
        group: uiTreeToApiInput(child),
      };
    }),
  };
}

interface ApiCondition {
  __typename: 'Condition';
  id: string;
  field: string;
  comparisonOperator: ComparisonOperator;
  value: string;
}

interface ApiConditionGroup {
  __typename: 'ConditionGroup';
  id: string;
  operator: LogicalOperator;
  conditions: Array<ApiCondition | ApiConditionGroup>;
}

export function apiTreeToUiNode(group: ApiConditionGroup): UIConditionGroup {
  return {
    type: 'group',
    id: crypto.randomUUID(),
    operator: group.operator,
    children: group.conditions.map((entry): UIConditionNode => {
      if (entry.__typename === 'Condition') {
        return {
          type: 'condition',
          id: crypto.randomUUID(),
          field: entry.field,
          operator: entry.comparisonOperator,
          value: entry.value,
        };
      }
      return apiTreeToUiNode(entry);
    }),
  };
}
