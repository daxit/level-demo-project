/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type Action = RunScriptAction | SendNotificationAction;

export type ActionInput = {
  runScript?: InputMaybe<RunScriptActionInput>;
  sendNotification?: InputMaybe<SendNotificationActionInput>;
};

export type Automation = {
  __typename?: 'Automation';
  actions: Array<Action>;
  actionsCount: Scalars['Int']['output'];
  conditionGroup: ConditionGroup;
  conditionsCount: Scalars['Int']['output'];
  conditionsDepth: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  trigger: Trigger;
  updatedAt: Scalars['String']['output'];
};

export enum ComparisonOperator {
  Contains = 'CONTAINS',
  Equals = 'EQUALS',
  GreaterThan = 'GREATER_THAN',
  GreaterThanOrEquals = 'GREATER_THAN_OR_EQUALS',
  LessThan = 'LESS_THAN',
  LessThanOrEquals = 'LESS_THAN_OR_EQUALS',
  NotContains = 'NOT_CONTAINS',
  NotEquals = 'NOT_EQUALS',
}

export type Condition = {
  __typename?: 'Condition';
  field: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  operator: ComparisonOperator;
  value: Scalars['String']['output'];
};

export type ConditionEntry = Condition | ConditionGroup;

export type ConditionEntryInput = {
  condition?: InputMaybe<ConditionInput>;
  group?: InputMaybe<ConditionGroupInput>;
};

export type ConditionGroup = {
  __typename?: 'ConditionGroup';
  conditions: Array<ConditionEntry>;
  id: Scalars['ID']['output'];
  operator: LogicalOperator;
};

export type ConditionGroupInput = {
  conditions: Array<ConditionEntryInput>;
  operator: LogicalOperator;
};

export type ConditionInput = {
  field: Scalars['String']['input'];
  operator: ComparisonOperator;
  value: Scalars['String']['input'];
};

export type CreateAutomationInput = {
  actions: Array<ActionInput>;
  conditionGroup?: InputMaybe<ConditionGroupInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  trigger: TriggerInput;
};

export type DeleteAutomationResult = {
  __typename?: 'DeleteAutomationResult';
  id: Scalars['ID']['output'];
  success: Scalars['Boolean']['output'];
};

export enum DeviceEvent {
  HardwareChange = 'HARDWARE_CHANGE',
  Offline = 'OFFLINE',
  Online = 'ONLINE',
}

export type DeviceEventTrigger = {
  __typename?: 'DeviceEventTrigger';
  event: DeviceEvent;
  id: Scalars['ID']['output'];
};

export type DeviceEventTriggerInput = {
  event: DeviceEvent;
};

export enum Frequency {
  Days = 'DAYS',
  Hours = 'HOURS',
  Minutes = 'MINUTES',
}

export enum LogicalOperator {
  And = 'AND',
  Or = 'OR',
}

export enum Metric {
  Cpu = 'CPU',
  Disk = 'DISK',
  Memory = 'MEMORY',
}

export type Mutation = {
  __typename?: 'Mutation';
  createAutomation: Automation;
  deleteAutomation: DeleteAutomationResult;
  updateAutomation: Automation;
};

export type MutationCreateAutomationArgs = {
  input: CreateAutomationInput;
};

export type MutationDeleteAutomationArgs = {
  id: Scalars['ID']['input'];
};

export type MutationUpdateAutomationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAutomationInput;
};

export type Query = {
  __typename?: 'Query';
  automation?: Maybe<Automation>;
  automations: Array<Automation>;
};

export type QueryAutomationArgs = {
  id: Scalars['ID']['input'];
};

export type RunScriptAction = {
  __typename?: 'RunScriptAction';
  args?: Maybe<Array<Scalars['String']['output']>>;
  id: Scalars['ID']['output'];
  script: Scalars['String']['output'];
  timeout?: Maybe<Scalars['Int']['output']>;
};

export type RunScriptActionInput = {
  args?: InputMaybe<Array<Scalars['String']['input']>>;
  script: Scalars['String']['input'];
  timeout?: InputMaybe<Scalars['Int']['input']>;
};

export type ScheduleTrigger = {
  __typename?: 'ScheduleTrigger';
  frequency: Frequency;
  id: Scalars['ID']['output'];
  interval: Scalars['Int']['output'];
};

export type ScheduleTriggerInput = {
  frequency: Frequency;
  interval: Scalars['Int']['input'];
};

export type SendNotificationAction = {
  __typename?: 'SendNotificationAction';
  body: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  recipients: Array<Scalars['String']['output']>;
  subject: Scalars['String']['output'];
};

export type SendNotificationActionInput = {
  body: Scalars['String']['input'];
  recipients: Array<Scalars['String']['input']>;
  subject: Scalars['String']['input'];
};

export type ThresholdTrigger = {
  __typename?: 'ThresholdTrigger';
  duration?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  metric: Metric;
  operator: ComparisonOperator;
  value: Scalars['Float']['output'];
};

export type ThresholdTriggerInput = {
  duration?: InputMaybe<Scalars['Int']['input']>;
  metric: Metric;
  operator: ComparisonOperator;
  value: Scalars['Float']['input'];
};

export type Trigger = DeviceEventTrigger | ScheduleTrigger | ThresholdTrigger;

export type TriggerInput = {
  deviceEvent?: InputMaybe<DeviceEventTriggerInput>;
  schedule?: InputMaybe<ScheduleTriggerInput>;
  threshold?: InputMaybe<ThresholdTriggerInput>;
};

export type UpdateAutomationInput = {
  actions?: InputMaybe<Array<InputMaybe<ActionInput>>>;
  conditionGroup?: InputMaybe<ConditionGroupInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  trigger?: InputMaybe<TriggerInput>;
};

export type CreateAutomationMutationVariables = Exact<{
  input: CreateAutomationInput;
}>;

export type CreateAutomationMutation = {
  __typename?: 'Mutation';
  createAutomation: { __typename?: 'Automation' } & {
    ' $fragmentRefs'?: { AutomationDetailFieldsFragment: AutomationDetailFieldsFragment };
  };
};

export type UpdateAutomationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateAutomationInput;
}>;

export type UpdateAutomationMutation = {
  __typename?: 'Mutation';
  updateAutomation: { __typename?: 'Automation' } & {
    ' $fragmentRefs'?: { AutomationDetailFieldsFragment: AutomationDetailFieldsFragment };
  };
};

export type DeleteAutomationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type DeleteAutomationMutation = {
  __typename?: 'Mutation';
  deleteAutomation: { __typename?: 'DeleteAutomationResult'; success: boolean; id: string };
};

export type AutomationListFieldsFragment = {
  __typename?: 'Automation';
  id: string;
  name: string;
  description?: string | null;
  enabled: boolean;
  actionsCount: number;
  conditionsCount: number;
  conditionsDepth: number;
  createdAt: string;
  updatedAt: string;
  trigger:
    | { __typename: 'DeviceEventTrigger' }
    | { __typename: 'ScheduleTrigger' }
    | { __typename: 'ThresholdTrigger' };
} & { ' $fragmentName'?: 'AutomationListFieldsFragment' };

export type AutomationDetailFieldsFragment = {
  __typename?: 'Automation';
  id: string;
  name: string;
  description?: string | null;
  enabled: boolean;
  actionsCount: number;
  conditionsCount: number;
  conditionsDepth: number;
  createdAt: string;
  updatedAt: string;
  trigger:
    | { __typename: 'DeviceEventTrigger'; id: string; event: DeviceEvent }
    | { __typename: 'ScheduleTrigger'; id: string; frequency: Frequency; interval: number }
    | {
        __typename: 'ThresholdTrigger';
        id: string;
        metric: Metric;
        operator: ComparisonOperator;
        value: number;
        duration?: number | null;
      };
  conditionGroup: {
    __typename?: 'ConditionGroup';
    id: string;
    operator: LogicalOperator;
    conditions: Array<
      | {
          __typename: 'Condition';
          id: string;
          field: string;
          value: string;
          comparisonOperator: ComparisonOperator;
        }
      | {
          __typename: 'ConditionGroup';
          id: string;
          operator: LogicalOperator;
          conditions: Array<
            | {
                __typename: 'Condition';
                id: string;
                field: string;
                value: string;
                comparisonOperator: ComparisonOperator;
              }
            | {
                __typename: 'ConditionGroup';
                id: string;
                operator: LogicalOperator;
                conditions: Array<
                  | {
                      __typename: 'Condition';
                      id: string;
                      field: string;
                      value: string;
                      comparisonOperator: ComparisonOperator;
                    }
                  | {
                      __typename: 'ConditionGroup';
                      id: string;
                      operator: LogicalOperator;
                      conditions: Array<
                        | {
                            __typename: 'Condition';
                            id: string;
                            field: string;
                            value: string;
                            comparisonOperator: ComparisonOperator;
                          }
                        | {
                            __typename: 'ConditionGroup';
                            id: string;
                            operator: LogicalOperator;
                            conditions: Array<
                              | {
                                  __typename: 'Condition';
                                  id: string;
                                  field: string;
                                  value: string;
                                  comparisonOperator: ComparisonOperator;
                                }
                              | { __typename?: 'ConditionGroup' }
                            >;
                          }
                      >;
                    }
                >;
              }
          >;
        }
    >;
  };
  actions: Array<
    | {
        __typename: 'RunScriptAction';
        id: string;
        script: string;
        args?: Array<string> | null;
        timeout?: number | null;
      }
    | {
        __typename: 'SendNotificationAction';
        id: string;
        recipients: Array<string>;
        subject: string;
        body: string;
      }
  >;
} & { ' $fragmentName'?: 'AutomationDetailFieldsFragment' };

export type AutomationsQueryVariables = Exact<{ [key: string]: never }>;

export type AutomationsQuery = {
  __typename?: 'Query';
  automations: Array<
    { __typename?: 'Automation' } & {
      ' $fragmentRefs'?: { AutomationListFieldsFragment: AutomationListFieldsFragment };
    }
  >;
};

export type AutomationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type AutomationQuery = {
  __typename?: 'Query';
  automation?:
    | ({ __typename?: 'Automation' } & {
        ' $fragmentRefs'?: { AutomationDetailFieldsFragment: AutomationDetailFieldsFragment };
      })
    | null;
};

export const AutomationListFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AutomationListFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Automation' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'enabled' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'trigger' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'DeviceEventTrigger' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: '__typename' } }],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ThresholdTrigger' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: '__typename' } }],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ScheduleTrigger' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: '__typename' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'actionsCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'conditionsCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'conditionsDepth' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AutomationListFieldsFragment, unknown>;
export const AutomationDetailFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AutomationDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Automation' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'enabled' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'trigger' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'DeviceEventTrigger' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'event' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ThresholdTrigger' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'metric' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'operator' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ScheduleTrigger' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'frequency' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'interval' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'conditionGroup' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'operator' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'conditions' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'InlineFragment',
                        typeCondition: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'Condition' },
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'field' } },
                            {
                              kind: 'Field',
                              alias: { kind: 'Name', value: 'comparisonOperator' },
                              name: { kind: 'Name', value: 'operator' },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                          ],
                        },
                      },
                      {
                        kind: 'InlineFragment',
                        typeCondition: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'ConditionGroup' },
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'operator' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'conditions' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'Condition' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: '__typename' },
                                        },
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'field' } },
                                        {
                                          kind: 'Field',
                                          alias: { kind: 'Name', value: 'comparisonOperator' },
                                          name: { kind: 'Name', value: 'operator' },
                                        },
                                        { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'ConditionGroup' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: '__typename' },
                                        },
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'operator' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'conditions' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: { kind: 'Name', value: 'Condition' },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: '__typename' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'id' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'field' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      alias: {
                                                        kind: 'Name',
                                                        value: 'comparisonOperator',
                                                      },
                                                      name: { kind: 'Name', value: 'operator' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'value' },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: { kind: 'Name', value: 'ConditionGroup' },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: '__typename' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'id' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'operator' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'conditions' },
                                                      selectionSet: {
                                                        kind: 'SelectionSet',
                                                        selections: [
                                                          {
                                                            kind: 'InlineFragment',
                                                            typeCondition: {
                                                              kind: 'NamedType',
                                                              name: {
                                                                kind: 'Name',
                                                                value: 'Condition',
                                                              },
                                                            },
                                                            selectionSet: {
                                                              kind: 'SelectionSet',
                                                              selections: [
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: '__typename',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'id',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'field',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  alias: {
                                                                    kind: 'Name',
                                                                    value: 'comparisonOperator',
                                                                  },
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'operator',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'value',
                                                                  },
                                                                },
                                                              ],
                                                            },
                                                          },
                                                          {
                                                            kind: 'InlineFragment',
                                                            typeCondition: {
                                                              kind: 'NamedType',
                                                              name: {
                                                                kind: 'Name',
                                                                value: 'ConditionGroup',
                                                              },
                                                            },
                                                            selectionSet: {
                                                              kind: 'SelectionSet',
                                                              selections: [
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: '__typename',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'id',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'operator',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'conditions',
                                                                  },
                                                                  selectionSet: {
                                                                    kind: 'SelectionSet',
                                                                    selections: [
                                                                      {
                                                                        kind: 'InlineFragment',
                                                                        typeCondition: {
                                                                          kind: 'NamedType',
                                                                          name: {
                                                                            kind: 'Name',
                                                                            value: 'Condition',
                                                                          },
                                                                        },
                                                                        selectionSet: {
                                                                          kind: 'SelectionSet',
                                                                          selections: [
                                                                            {
                                                                              kind: 'Field',
                                                                              name: {
                                                                                kind: 'Name',
                                                                                value: '__typename',
                                                                              },
                                                                            },
                                                                            {
                                                                              kind: 'Field',
                                                                              name: {
                                                                                kind: 'Name',
                                                                                value: 'id',
                                                                              },
                                                                            },
                                                                            {
                                                                              kind: 'Field',
                                                                              name: {
                                                                                kind: 'Name',
                                                                                value: 'field',
                                                                              },
                                                                            },
                                                                            {
                                                                              kind: 'Field',
                                                                              alias: {
                                                                                kind: 'Name',
                                                                                value:
                                                                                  'comparisonOperator',
                                                                              },
                                                                              name: {
                                                                                kind: 'Name',
                                                                                value: 'operator',
                                                                              },
                                                                            },
                                                                            {
                                                                              kind: 'Field',
                                                                              name: {
                                                                                kind: 'Name',
                                                                                value: 'value',
                                                                              },
                                                                            },
                                                                          ],
                                                                        },
                                                                      },
                                                                    ],
                                                                  },
                                                                },
                                                              ],
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actions' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'SendNotificationAction' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'recipients' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'subject' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'body' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'RunScriptAction' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'script' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'args' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'timeout' } },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'actionsCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'conditionsCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'conditionsDepth' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AutomationDetailFieldsFragment, unknown>;
export const CreateAutomationDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateAutomation' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateAutomationInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createAutomation' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AutomationDetailFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AutomationDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Automation' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'enabled' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'trigger' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'DeviceEventTrigger' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'event' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ThresholdTrigger' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'metric' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'operator' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ScheduleTrigger' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'frequency' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'interval' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'conditionGroup' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'operator' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'conditions' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'InlineFragment',
                        typeCondition: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'Condition' },
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'field' } },
                            {
                              kind: 'Field',
                              alias: { kind: 'Name', value: 'comparisonOperator' },
                              name: { kind: 'Name', value: 'operator' },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                          ],
                        },
                      },
                      {
                        kind: 'InlineFragment',
                        typeCondition: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'ConditionGroup' },
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'operator' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'conditions' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'Condition' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: '__typename' },
                                        },
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'field' } },
                                        {
                                          kind: 'Field',
                                          alias: { kind: 'Name', value: 'comparisonOperator' },
                                          name: { kind: 'Name', value: 'operator' },
                                        },
                                        { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'ConditionGroup' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: '__typename' },
                                        },
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'operator' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'conditions' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: { kind: 'Name', value: 'Condition' },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: '__typename' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'id' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'field' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      alias: {
                                                        kind: 'Name',
                                                        value: 'comparisonOperator',
                                                      },
                                                      name: { kind: 'Name', value: 'operator' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'value' },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: { kind: 'Name', value: 'ConditionGroup' },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: '__typename' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'id' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'operator' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'conditions' },
                                                      selectionSet: {
                                                        kind: 'SelectionSet',
                                                        selections: [
                                                          {
                                                            kind: 'InlineFragment',
                                                            typeCondition: {
                                                              kind: 'NamedType',
                                                              name: {
                                                                kind: 'Name',
                                                                value: 'Condition',
                                                              },
                                                            },
                                                            selectionSet: {
                                                              kind: 'SelectionSet',
                                                              selections: [
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: '__typename',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'id',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'field',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  alias: {
                                                                    kind: 'Name',
                                                                    value: 'comparisonOperator',
                                                                  },
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'operator',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'value',
                                                                  },
                                                                },
                                                              ],
                                                            },
                                                          },
                                                          {
                                                            kind: 'InlineFragment',
                                                            typeCondition: {
                                                              kind: 'NamedType',
                                                              name: {
                                                                kind: 'Name',
                                                                value: 'ConditionGroup',
                                                              },
                                                            },
                                                            selectionSet: {
                                                              kind: 'SelectionSet',
                                                              selections: [
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: '__typename',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'id',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'operator',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'conditions',
                                                                  },
                                                                  selectionSet: {
                                                                    kind: 'SelectionSet',
                                                                    selections: [
                                                                      {
                                                                        kind: 'InlineFragment',
                                                                        typeCondition: {
                                                                          kind: 'NamedType',
                                                                          name: {
                                                                            kind: 'Name',
                                                                            value: 'Condition',
                                                                          },
                                                                        },
                                                                        selectionSet: {
                                                                          kind: 'SelectionSet',
                                                                          selections: [
                                                                            {
                                                                              kind: 'Field',
                                                                              name: {
                                                                                kind: 'Name',
                                                                                value: '__typename',
                                                                              },
                                                                            },
                                                                            {
                                                                              kind: 'Field',
                                                                              name: {
                                                                                kind: 'Name',
                                                                                value: 'id',
                                                                              },
                                                                            },
                                                                            {
                                                                              kind: 'Field',
                                                                              name: {
                                                                                kind: 'Name',
                                                                                value: 'field',
                                                                              },
                                                                            },
                                                                            {
                                                                              kind: 'Field',
                                                                              alias: {
                                                                                kind: 'Name',
                                                                                value:
                                                                                  'comparisonOperator',
                                                                              },
                                                                              name: {
                                                                                kind: 'Name',
                                                                                value: 'operator',
                                                                              },
                                                                            },
                                                                            {
                                                                              kind: 'Field',
                                                                              name: {
                                                                                kind: 'Name',
                                                                                value: 'value',
                                                                              },
                                                                            },
                                                                          ],
                                                                        },
                                                                      },
                                                                    ],
                                                                  },
                                                                },
                                                              ],
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actions' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'SendNotificationAction' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'recipients' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'subject' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'body' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'RunScriptAction' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'script' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'args' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'timeout' } },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'actionsCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'conditionsCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'conditionsDepth' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateAutomationMutation, CreateAutomationMutationVariables>;
export const UpdateAutomationDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateAutomation' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateAutomationInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateAutomation' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AutomationDetailFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AutomationDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Automation' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'enabled' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'trigger' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'DeviceEventTrigger' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'event' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ThresholdTrigger' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'metric' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'operator' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ScheduleTrigger' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'frequency' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'interval' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'conditionGroup' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'operator' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'conditions' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'InlineFragment',
                        typeCondition: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'Condition' },
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'field' } },
                            {
                              kind: 'Field',
                              alias: { kind: 'Name', value: 'comparisonOperator' },
                              name: { kind: 'Name', value: 'operator' },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                          ],
                        },
                      },
                      {
                        kind: 'InlineFragment',
                        typeCondition: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'ConditionGroup' },
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'operator' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'conditions' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'Condition' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: '__typename' },
                                        },
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'field' } },
                                        {
                                          kind: 'Field',
                                          alias: { kind: 'Name', value: 'comparisonOperator' },
                                          name: { kind: 'Name', value: 'operator' },
                                        },
                                        { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'ConditionGroup' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: '__typename' },
                                        },
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'operator' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'conditions' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: { kind: 'Name', value: 'Condition' },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: '__typename' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'id' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'field' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      alias: {
                                                        kind: 'Name',
                                                        value: 'comparisonOperator',
                                                      },
                                                      name: { kind: 'Name', value: 'operator' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'value' },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: { kind: 'Name', value: 'ConditionGroup' },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: '__typename' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'id' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'operator' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'conditions' },
                                                      selectionSet: {
                                                        kind: 'SelectionSet',
                                                        selections: [
                                                          {
                                                            kind: 'InlineFragment',
                                                            typeCondition: {
                                                              kind: 'NamedType',
                                                              name: {
                                                                kind: 'Name',
                                                                value: 'Condition',
                                                              },
                                                            },
                                                            selectionSet: {
                                                              kind: 'SelectionSet',
                                                              selections: [
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: '__typename',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'id',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'field',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  alias: {
                                                                    kind: 'Name',
                                                                    value: 'comparisonOperator',
                                                                  },
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'operator',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'value',
                                                                  },
                                                                },
                                                              ],
                                                            },
                                                          },
                                                          {
                                                            kind: 'InlineFragment',
                                                            typeCondition: {
                                                              kind: 'NamedType',
                                                              name: {
                                                                kind: 'Name',
                                                                value: 'ConditionGroup',
                                                              },
                                                            },
                                                            selectionSet: {
                                                              kind: 'SelectionSet',
                                                              selections: [
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: '__typename',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'id',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'operator',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'conditions',
                                                                  },
                                                                  selectionSet: {
                                                                    kind: 'SelectionSet',
                                                                    selections: [
                                                                      {
                                                                        kind: 'InlineFragment',
                                                                        typeCondition: {
                                                                          kind: 'NamedType',
                                                                          name: {
                                                                            kind: 'Name',
                                                                            value: 'Condition',
                                                                          },
                                                                        },
                                                                        selectionSet: {
                                                                          kind: 'SelectionSet',
                                                                          selections: [
                                                                            {
                                                                              kind: 'Field',
                                                                              name: {
                                                                                kind: 'Name',
                                                                                value: '__typename',
                                                                              },
                                                                            },
                                                                            {
                                                                              kind: 'Field',
                                                                              name: {
                                                                                kind: 'Name',
                                                                                value: 'id',
                                                                              },
                                                                            },
                                                                            {
                                                                              kind: 'Field',
                                                                              name: {
                                                                                kind: 'Name',
                                                                                value: 'field',
                                                                              },
                                                                            },
                                                                            {
                                                                              kind: 'Field',
                                                                              alias: {
                                                                                kind: 'Name',
                                                                                value:
                                                                                  'comparisonOperator',
                                                                              },
                                                                              name: {
                                                                                kind: 'Name',
                                                                                value: 'operator',
                                                                              },
                                                                            },
                                                                            {
                                                                              kind: 'Field',
                                                                              name: {
                                                                                kind: 'Name',
                                                                                value: 'value',
                                                                              },
                                                                            },
                                                                          ],
                                                                        },
                                                                      },
                                                                    ],
                                                                  },
                                                                },
                                                              ],
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actions' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'SendNotificationAction' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'recipients' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'subject' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'body' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'RunScriptAction' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'script' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'args' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'timeout' } },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'actionsCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'conditionsCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'conditionsDepth' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateAutomationMutation, UpdateAutomationMutationVariables>;
export const DeleteAutomationDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteAutomation' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteAutomation' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteAutomationMutation, DeleteAutomationMutationVariables>;
export const AutomationsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Automations' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'automations' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AutomationListFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AutomationListFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Automation' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'enabled' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'trigger' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'DeviceEventTrigger' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: '__typename' } }],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ThresholdTrigger' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: '__typename' } }],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ScheduleTrigger' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: '__typename' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'actionsCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'conditionsCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'conditionsDepth' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AutomationsQuery, AutomationsQueryVariables>;
export const AutomationDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Automation' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'automation' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AutomationDetailFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AutomationDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Automation' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'enabled' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'trigger' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'DeviceEventTrigger' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'event' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ThresholdTrigger' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'metric' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'operator' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ScheduleTrigger' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'frequency' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'interval' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'conditionGroup' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'operator' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'conditions' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'InlineFragment',
                        typeCondition: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'Condition' },
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'field' } },
                            {
                              kind: 'Field',
                              alias: { kind: 'Name', value: 'comparisonOperator' },
                              name: { kind: 'Name', value: 'operator' },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                          ],
                        },
                      },
                      {
                        kind: 'InlineFragment',
                        typeCondition: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'ConditionGroup' },
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'operator' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'conditions' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'Condition' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: '__typename' },
                                        },
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'field' } },
                                        {
                                          kind: 'Field',
                                          alias: { kind: 'Name', value: 'comparisonOperator' },
                                          name: { kind: 'Name', value: 'operator' },
                                        },
                                        { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'ConditionGroup' },
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: '__typename' },
                                        },
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'operator' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'conditions' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: { kind: 'Name', value: 'Condition' },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: '__typename' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'id' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'field' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      alias: {
                                                        kind: 'Name',
                                                        value: 'comparisonOperator',
                                                      },
                                                      name: { kind: 'Name', value: 'operator' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'value' },
                                                    },
                                                  ],
                                                },
                                              },
                                              {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                  kind: 'NamedType',
                                                  name: { kind: 'Name', value: 'ConditionGroup' },
                                                },
                                                selectionSet: {
                                                  kind: 'SelectionSet',
                                                  selections: [
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: '__typename' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'id' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'operator' },
                                                    },
                                                    {
                                                      kind: 'Field',
                                                      name: { kind: 'Name', value: 'conditions' },
                                                      selectionSet: {
                                                        kind: 'SelectionSet',
                                                        selections: [
                                                          {
                                                            kind: 'InlineFragment',
                                                            typeCondition: {
                                                              kind: 'NamedType',
                                                              name: {
                                                                kind: 'Name',
                                                                value: 'Condition',
                                                              },
                                                            },
                                                            selectionSet: {
                                                              kind: 'SelectionSet',
                                                              selections: [
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: '__typename',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'id',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'field',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  alias: {
                                                                    kind: 'Name',
                                                                    value: 'comparisonOperator',
                                                                  },
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'operator',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'value',
                                                                  },
                                                                },
                                                              ],
                                                            },
                                                          },
                                                          {
                                                            kind: 'InlineFragment',
                                                            typeCondition: {
                                                              kind: 'NamedType',
                                                              name: {
                                                                kind: 'Name',
                                                                value: 'ConditionGroup',
                                                              },
                                                            },
                                                            selectionSet: {
                                                              kind: 'SelectionSet',
                                                              selections: [
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: '__typename',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'id',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'operator',
                                                                  },
                                                                },
                                                                {
                                                                  kind: 'Field',
                                                                  name: {
                                                                    kind: 'Name',
                                                                    value: 'conditions',
                                                                  },
                                                                  selectionSet: {
                                                                    kind: 'SelectionSet',
                                                                    selections: [
                                                                      {
                                                                        kind: 'InlineFragment',
                                                                        typeCondition: {
                                                                          kind: 'NamedType',
                                                                          name: {
                                                                            kind: 'Name',
                                                                            value: 'Condition',
                                                                          },
                                                                        },
                                                                        selectionSet: {
                                                                          kind: 'SelectionSet',
                                                                          selections: [
                                                                            {
                                                                              kind: 'Field',
                                                                              name: {
                                                                                kind: 'Name',
                                                                                value: '__typename',
                                                                              },
                                                                            },
                                                                            {
                                                                              kind: 'Field',
                                                                              name: {
                                                                                kind: 'Name',
                                                                                value: 'id',
                                                                              },
                                                                            },
                                                                            {
                                                                              kind: 'Field',
                                                                              name: {
                                                                                kind: 'Name',
                                                                                value: 'field',
                                                                              },
                                                                            },
                                                                            {
                                                                              kind: 'Field',
                                                                              alias: {
                                                                                kind: 'Name',
                                                                                value:
                                                                                  'comparisonOperator',
                                                                              },
                                                                              name: {
                                                                                kind: 'Name',
                                                                                value: 'operator',
                                                                              },
                                                                            },
                                                                            {
                                                                              kind: 'Field',
                                                                              name: {
                                                                                kind: 'Name',
                                                                                value: 'value',
                                                                              },
                                                                            },
                                                                          ],
                                                                        },
                                                                      },
                                                                    ],
                                                                  },
                                                                },
                                                              ],
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actions' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'SendNotificationAction' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'recipients' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'subject' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'body' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'RunScriptAction' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'script' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'args' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'timeout' } },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'actionsCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'conditionsCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'conditionsDepth' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AutomationQuery, AutomationQueryVariables>;
