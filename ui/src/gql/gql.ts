import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/* eslint-disable */
import * as types from './graphql';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  '\n  mutation CreateAutomation($input: CreateAutomationInput!) {\n    createAutomation(input: $input) {\n      ...AutomationDetailFields\n    }\n  }\n': typeof types.CreateAutomationDocument;
  '\n  mutation UpdateAutomation($id: ID!, $input: UpdateAutomationInput!) {\n    updateAutomation(id: $id, input: $input) {\n      ...AutomationDetailFields\n    }\n  }\n': typeof types.UpdateAutomationDocument;
  '\n  mutation DeleteAutomation($id: ID!) {\n    deleteAutomation(id: $id) {\n      success\n      id\n    }\n  }\n': typeof types.DeleteAutomationDocument;
  '\n  fragment AutomationListFields on Automation {\n    id\n    name\n    description\n    enabled\n    trigger {\n      ... on DeviceEventTrigger {\n        __typename\n      }\n      ... on ThresholdTrigger {\n        __typename\n      }\n      ... on ScheduleTrigger {\n        __typename\n      }\n    }\n    actionsCount\n    conditionsCount\n    conditionsDepth\n    createdAt\n    updatedAt\n  }\n': typeof types.AutomationListFieldsFragmentDoc;
  '\n  fragment AutomationDetailFields on Automation {\n    id\n    name\n    description\n    enabled\n    trigger {\n      ... on DeviceEventTrigger {\n        __typename\n        id\n        event\n      }\n      ... on ThresholdTrigger {\n        __typename\n        id\n        metric\n        operator\n        value\n        duration\n      }\n      ... on ScheduleTrigger {\n        __typename\n        id\n        frequency\n        interval\n      }\n    }\n    conditionGroup {\n      id\n      operator\n      conditions {\n        ... on Condition {\n          __typename\n          id\n          field\n          comparisonOperator: operator\n          value\n        }\n        ... on ConditionGroup {\n          __typename\n          id\n          operator\n          conditions {\n            ... on Condition {\n              __typename\n              id\n              field\n              comparisonOperator: operator\n              value\n            }\n            ... on ConditionGroup {\n              __typename\n              id\n              operator\n              conditions {\n                ... on Condition {\n                  __typename\n                  id\n                  field\n                  comparisonOperator: operator\n                  value\n                }\n                ... on ConditionGroup {\n                  __typename\n                  id\n                  operator\n                  conditions {\n                    ... on Condition {\n                      __typename\n                      id\n                      field\n                      comparisonOperator: operator\n                      value\n                    }\n                    ... on ConditionGroup {\n                      __typename\n                      id\n                      operator\n                      conditions {\n                        ... on Condition {\n                          __typename\n                          id\n                          field\n                          comparisonOperator: operator\n                          value\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n    actions {\n      ... on SendNotificationAction {\n        __typename\n        id\n        recipients\n        subject\n        body\n      }\n      ... on RunScriptAction {\n        __typename\n        id\n        script\n        args\n        timeout\n      }\n    }\n    actionsCount\n    conditionsCount\n    conditionsDepth\n    createdAt\n    updatedAt\n  }\n': typeof types.AutomationDetailFieldsFragmentDoc;
  '\n  query Automations {\n    automations {\n      ...AutomationListFields\n    }\n  }\n': typeof types.AutomationsDocument;
  '\n  query Automation($id: ID!) {\n    automation(id: $id) {\n      ...AutomationDetailFields\n    }\n  }\n': typeof types.AutomationDocument;
};
const documents: Documents = {
  '\n  mutation CreateAutomation($input: CreateAutomationInput!) {\n    createAutomation(input: $input) {\n      ...AutomationDetailFields\n    }\n  }\n':
    types.CreateAutomationDocument,
  '\n  mutation UpdateAutomation($id: ID!, $input: UpdateAutomationInput!) {\n    updateAutomation(id: $id, input: $input) {\n      ...AutomationDetailFields\n    }\n  }\n':
    types.UpdateAutomationDocument,
  '\n  mutation DeleteAutomation($id: ID!) {\n    deleteAutomation(id: $id) {\n      success\n      id\n    }\n  }\n':
    types.DeleteAutomationDocument,
  '\n  fragment AutomationListFields on Automation {\n    id\n    name\n    description\n    enabled\n    trigger {\n      ... on DeviceEventTrigger {\n        __typename\n      }\n      ... on ThresholdTrigger {\n        __typename\n      }\n      ... on ScheduleTrigger {\n        __typename\n      }\n    }\n    actionsCount\n    conditionsCount\n    conditionsDepth\n    createdAt\n    updatedAt\n  }\n':
    types.AutomationListFieldsFragmentDoc,
  '\n  fragment AutomationDetailFields on Automation {\n    id\n    name\n    description\n    enabled\n    trigger {\n      ... on DeviceEventTrigger {\n        __typename\n        id\n        event\n      }\n      ... on ThresholdTrigger {\n        __typename\n        id\n        metric\n        operator\n        value\n        duration\n      }\n      ... on ScheduleTrigger {\n        __typename\n        id\n        frequency\n        interval\n      }\n    }\n    conditionGroup {\n      id\n      operator\n      conditions {\n        ... on Condition {\n          __typename\n          id\n          field\n          comparisonOperator: operator\n          value\n        }\n        ... on ConditionGroup {\n          __typename\n          id\n          operator\n          conditions {\n            ... on Condition {\n              __typename\n              id\n              field\n              comparisonOperator: operator\n              value\n            }\n            ... on ConditionGroup {\n              __typename\n              id\n              operator\n              conditions {\n                ... on Condition {\n                  __typename\n                  id\n                  field\n                  comparisonOperator: operator\n                  value\n                }\n                ... on ConditionGroup {\n                  __typename\n                  id\n                  operator\n                  conditions {\n                    ... on Condition {\n                      __typename\n                      id\n                      field\n                      comparisonOperator: operator\n                      value\n                    }\n                    ... on ConditionGroup {\n                      __typename\n                      id\n                      operator\n                      conditions {\n                        ... on Condition {\n                          __typename\n                          id\n                          field\n                          comparisonOperator: operator\n                          value\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n    actions {\n      ... on SendNotificationAction {\n        __typename\n        id\n        recipients\n        subject\n        body\n      }\n      ... on RunScriptAction {\n        __typename\n        id\n        script\n        args\n        timeout\n      }\n    }\n    actionsCount\n    conditionsCount\n    conditionsDepth\n    createdAt\n    updatedAt\n  }\n':
    types.AutomationDetailFieldsFragmentDoc,
  '\n  query Automations {\n    automations {\n      ...AutomationListFields\n    }\n  }\n':
    types.AutomationsDocument,
  '\n  query Automation($id: ID!) {\n    automation(id: $id) {\n      ...AutomationDetailFields\n    }\n  }\n':
    types.AutomationDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateAutomation($input: CreateAutomationInput!) {\n    createAutomation(input: $input) {\n      ...AutomationDetailFields\n    }\n  }\n',
): (typeof documents)['\n  mutation CreateAutomation($input: CreateAutomationInput!) {\n    createAutomation(input: $input) {\n      ...AutomationDetailFields\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateAutomation($id: ID!, $input: UpdateAutomationInput!) {\n    updateAutomation(id: $id, input: $input) {\n      ...AutomationDetailFields\n    }\n  }\n',
): (typeof documents)['\n  mutation UpdateAutomation($id: ID!, $input: UpdateAutomationInput!) {\n    updateAutomation(id: $id, input: $input) {\n      ...AutomationDetailFields\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation DeleteAutomation($id: ID!) {\n    deleteAutomation(id: $id) {\n      success\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation DeleteAutomation($id: ID!) {\n    deleteAutomation(id: $id) {\n      success\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment AutomationListFields on Automation {\n    id\n    name\n    description\n    enabled\n    trigger {\n      ... on DeviceEventTrigger {\n        __typename\n      }\n      ... on ThresholdTrigger {\n        __typename\n      }\n      ... on ScheduleTrigger {\n        __typename\n      }\n    }\n    actionsCount\n    conditionsCount\n    conditionsDepth\n    createdAt\n    updatedAt\n  }\n',
): (typeof documents)['\n  fragment AutomationListFields on Automation {\n    id\n    name\n    description\n    enabled\n    trigger {\n      ... on DeviceEventTrigger {\n        __typename\n      }\n      ... on ThresholdTrigger {\n        __typename\n      }\n      ... on ScheduleTrigger {\n        __typename\n      }\n    }\n    actionsCount\n    conditionsCount\n    conditionsDepth\n    createdAt\n    updatedAt\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment AutomationDetailFields on Automation {\n    id\n    name\n    description\n    enabled\n    trigger {\n      ... on DeviceEventTrigger {\n        __typename\n        id\n        event\n      }\n      ... on ThresholdTrigger {\n        __typename\n        id\n        metric\n        operator\n        value\n        duration\n      }\n      ... on ScheduleTrigger {\n        __typename\n        id\n        frequency\n        interval\n      }\n    }\n    conditionGroup {\n      id\n      operator\n      conditions {\n        ... on Condition {\n          __typename\n          id\n          field\n          comparisonOperator: operator\n          value\n        }\n        ... on ConditionGroup {\n          __typename\n          id\n          operator\n          conditions {\n            ... on Condition {\n              __typename\n              id\n              field\n              comparisonOperator: operator\n              value\n            }\n            ... on ConditionGroup {\n              __typename\n              id\n              operator\n              conditions {\n                ... on Condition {\n                  __typename\n                  id\n                  field\n                  comparisonOperator: operator\n                  value\n                }\n                ... on ConditionGroup {\n                  __typename\n                  id\n                  operator\n                  conditions {\n                    ... on Condition {\n                      __typename\n                      id\n                      field\n                      comparisonOperator: operator\n                      value\n                    }\n                    ... on ConditionGroup {\n                      __typename\n                      id\n                      operator\n                      conditions {\n                        ... on Condition {\n                          __typename\n                          id\n                          field\n                          comparisonOperator: operator\n                          value\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n    actions {\n      ... on SendNotificationAction {\n        __typename\n        id\n        recipients\n        subject\n        body\n      }\n      ... on RunScriptAction {\n        __typename\n        id\n        script\n        args\n        timeout\n      }\n    }\n    actionsCount\n    conditionsCount\n    conditionsDepth\n    createdAt\n    updatedAt\n  }\n',
): (typeof documents)['\n  fragment AutomationDetailFields on Automation {\n    id\n    name\n    description\n    enabled\n    trigger {\n      ... on DeviceEventTrigger {\n        __typename\n        id\n        event\n      }\n      ... on ThresholdTrigger {\n        __typename\n        id\n        metric\n        operator\n        value\n        duration\n      }\n      ... on ScheduleTrigger {\n        __typename\n        id\n        frequency\n        interval\n      }\n    }\n    conditionGroup {\n      id\n      operator\n      conditions {\n        ... on Condition {\n          __typename\n          id\n          field\n          comparisonOperator: operator\n          value\n        }\n        ... on ConditionGroup {\n          __typename\n          id\n          operator\n          conditions {\n            ... on Condition {\n              __typename\n              id\n              field\n              comparisonOperator: operator\n              value\n            }\n            ... on ConditionGroup {\n              __typename\n              id\n              operator\n              conditions {\n                ... on Condition {\n                  __typename\n                  id\n                  field\n                  comparisonOperator: operator\n                  value\n                }\n                ... on ConditionGroup {\n                  __typename\n                  id\n                  operator\n                  conditions {\n                    ... on Condition {\n                      __typename\n                      id\n                      field\n                      comparisonOperator: operator\n                      value\n                    }\n                    ... on ConditionGroup {\n                      __typename\n                      id\n                      operator\n                      conditions {\n                        ... on Condition {\n                          __typename\n                          id\n                          field\n                          comparisonOperator: operator\n                          value\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n    actions {\n      ... on SendNotificationAction {\n        __typename\n        id\n        recipients\n        subject\n        body\n      }\n      ... on RunScriptAction {\n        __typename\n        id\n        script\n        args\n        timeout\n      }\n    }\n    actionsCount\n    conditionsCount\n    conditionsDepth\n    createdAt\n    updatedAt\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Automations {\n    automations {\n      ...AutomationListFields\n    }\n  }\n',
): (typeof documents)['\n  query Automations {\n    automations {\n      ...AutomationListFields\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Automation($id: ID!) {\n    automation(id: $id) {\n      ...AutomationDetailFields\n    }\n  }\n',
): (typeof documents)['\n  query Automation($id: ID!) {\n    automation(id: $id) {\n      ...AutomationDetailFields\n    }\n  }\n'];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
