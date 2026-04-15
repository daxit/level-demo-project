import { graphql } from '../gql/gql';

export const AutomationListFieldsFragment = graphql(`
  fragment AutomationListFields on Automation {
    id
    name
    description
    enabled
    trigger {
      ... on DeviceEventTrigger {
        __typename
      }
      ... on ThresholdTrigger {
        __typename
      }
      ... on ScheduleTrigger {
        __typename
      }
    }
    actionsCount
    conditionsCount
    conditionsDepth
    createdAt
    updatedAt
  }
`);

export const AutomationDetailFieldsFragment = graphql(`
  fragment AutomationDetailFields on Automation {
    id
    name
    description
    enabled
    trigger {
      ... on DeviceEventTrigger {
        __typename
        id
        event
      }
      ... on ThresholdTrigger {
        __typename
        id
        metric
        operator
        value
        duration
      }
      ... on ScheduleTrigger {
        __typename
        id
        frequency
        interval
      }
    }
    conditionGroup {
      id
      operator
      conditions {
        ... on Condition {
          __typename
          id
          field
          comparisonOperator: operator
          value
        }
        ... on ConditionGroup {
          __typename
          id
          operator
          conditions {
            ... on Condition {
              __typename
              id
              field
              comparisonOperator: operator
              value
            }
            ... on ConditionGroup {
              __typename
              id
              operator
              conditions {
                ... on Condition {
                  __typename
                  id
                  field
                  comparisonOperator: operator
                  value
                }
                ... on ConditionGroup {
                  __typename
                  id
                  operator
                  conditions {
                    ... on Condition {
                      __typename
                      id
                      field
                      comparisonOperator: operator
                      value
                    }
                    ... on ConditionGroup {
                      __typename
                      id
                      operator
                      conditions {
                        ... on Condition {
                          __typename
                          id
                          field
                          comparisonOperator: operator
                          value
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    actions {
      ... on SendNotificationAction {
        __typename
        id
        recipients
        subject
        body
      }
      ... on RunScriptAction {
        __typename
        id
        script
        args
        timeout
      }
    }
    actionsCount
    conditionsCount
    conditionsDepth
    createdAt
    updatedAt
  }
`);

export const AutomationsQuery = graphql(`
  query Automations {
    automations {
      ...AutomationListFields
    }
  }
`);

export const AutomationQuery = graphql(`
  query Automation($id: ID!) {
    automation(id: $id) {
      ...AutomationDetailFields
    }
  }
`);
