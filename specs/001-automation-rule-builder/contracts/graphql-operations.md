# GraphQL Operation Contracts: Automation Rule Builder

**Date**: 2026-04-12  
**API Endpoint**: `http://localhost:4000/graphql`  
**Schema Source**: `api/src/schema.ts`

## Fragments

Fragments ensure consistent field selection across queries and mutations. All union types require inline fragments for each concrete type.

### AutomationListFields

Used by the list query. Fetches summary data only (no trigger config details, no condition tree, no action details).

```graphql
fragment AutomationListFields on Automation {
  id
  name
  description
  enabled
  trigger {
    ... on DeviceEventTrigger { __typename }
    ... on ThresholdTrigger { __typename }
    ... on ScheduleTrigger { __typename }
  }
  actionsCount
  conditionsCount
  conditionsDepth
  createdAt
  updatedAt
}
```

### AutomationDetailFields

Used by the detail query and mutation responses. Fetches all fields including full trigger config, condition tree, and action details.

```graphql
fragment TriggerFields on Trigger {
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

fragment ConditionFields on ConditionEntry {
  ... on Condition {
    __typename
    id
    field
    operator
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
        operator
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
            operator
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
                operator
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
                    operator
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

fragment ActionFields on Action {
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

fragment AutomationDetailFields on Automation {
  id
  name
  description
  enabled
  trigger {
    ...TriggerFields
  }
  conditionGroup {
    id
    operator
    conditions {
      ...ConditionFields
    }
  }
  actions {
    ...ActionFields
  }
  actionsCount
  conditionsCount
  conditionsDepth
  createdAt
  updatedAt
}
```

**Note on condition tree depth**: GraphQL does not support recursive fragments. The `ConditionFields` fragment is manually expanded to ~5 levels of nesting. This is sufficient for practical use (the seed data reaches depth 3). If deeper nesting is needed, the fragment can be extended.

## Queries

### automations

**Used by**: `useAutomations` hook (P1)  
**Purpose**: Fetch all automations for the list view.

```graphql
query Automations {
  automations {
    ...AutomationListFields
  }
}
```

**Expected response**: Array of automations sorted by `updatedAt` descending (sorting done client-side).

### automation

**Used by**: `useAutomation` hook (P2)  
**Purpose**: Fetch a single automation with full detail for the rule builder.

```graphql
query Automation($id: ID!) {
  automation(id: $id) {
    ...AutomationDetailFields
  }
}
```

**Expected response**: Single automation or `null` if not found.

## Mutations

### createAutomation

**Used by**: `useCreateAutomation` hook (P2)  
**Purpose**: Create a new automation with defaults. Called on "New Automation" button click.

```graphql
mutation CreateAutomation($input: CreateAutomationInput!) {
  createAutomation(input: $input) {
    ...AutomationDetailFields
  }
}
```

**Default input**:
```json
{
  "input": {
    "name": "New Automation",
    "enabled": false,
    "trigger": {
      "deviceEvent": { "event": "ONLINE" }
    },
    "conditionGroup": {
      "operator": "AND",
      "conditions": []
    },
    "actions": []
  }
}
```

**Cache update**: Append new automation to `automations` list in cache.

### updateAutomation

**Used by**: `useUpdateAutomation` hook (P1 for toggle, P2 for full auto-save)  
**Purpose**: Partial update of an automation. All input fields are optional.

```graphql
mutation UpdateAutomation($id: ID!, $input: UpdateAutomationInput!) {
  updateAutomation(id: $id, input: $input) {
    ...AutomationDetailFields
  }
}
```

**Example inputs**:

Toggle enabled (P1):
```json
{
  "id": "abc-123",
  "input": { "enabled": true }
}
```

Update name (P2, debounced):
```json
{
  "id": "abc-123",
  "input": { "name": "My New Rule Name" }
}
```

Full update (P2, auto-save):
```json
{
  "id": "abc-123",
  "input": {
    "name": "High CPU Alert",
    "description": "Updated description",
    "trigger": {
      "threshold": {
        "metric": "CPU",
        "operator": "GREATER_THAN",
        "value": 90.0,
        "duration": 300
      }
    },
    "conditionGroup": {
      "operator": "AND",
      "conditions": [
        { "condition": { "field": "env", "operator": "EQUALS", "value": "prod" } }
      ]
    },
    "actions": [
      { "sendNotification": { "recipients": ["ops@co.com"], "subject": "Alert", "body": "CPU high" } }
    ]
  }
}
```

**Cache update**: Apollo Client automatically updates the cached automation by `id`.

### deleteAutomation

**Used by**: `useDeleteAutomation` hook (P1)  
**Purpose**: Delete an automation. Called from list card or detail panel metadata.

```graphql
mutation DeleteAutomation($id: ID!) {
  deleteAutomation(id: $id) {
    success
    id
  }
}
```

**Cache update**: On success, evict the automation from cache using `cache.evict({ id: cache.identify({ __typename: 'Automation', id }) })` and call `cache.gc()`.

## Error Handling Contract

- **Global**: Apollo `onError` link logs all errors to console with `operation.operationName`.
- **Queries**: `useAutomations` and `useAutomation` expose `error` to components. Components render error state UI (not empty state).
- **Mutations**: Each mutation hook accepts an `onError` callback for local UX responses (revert toggle, show save status "Failed"). The `useSaveQueue` manages retry logic (FR-007).
