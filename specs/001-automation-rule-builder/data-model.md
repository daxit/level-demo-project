# Data Model: Automation Rule Builder

**Date**: 2026-04-12  
**Source**: `api/src/schema.ts` (GraphQL SDL) + `api/src/data.ts` (seed data types)

## Entity Relationship Overview

```text
Automation (1) ──── (1) Trigger [union: DeviceEvent | Threshold | Schedule]
     │
     ├──── (1) ConditionGroup (root)
     │           │
     │           └──── (*) ConditionEntry [union: Condition | ConditionGroup (recursive)]
     │
     └──── (*) Action [union: SendNotification | RunScript] (ordered)
```

## Entities

### Automation

The top-level entity. Represents a single automation rule.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | `ID!` | Yes | Server-generated UUID |
| `name` | `String!` | Yes | Editable, default "New Automation" on create |
| `description` | `String` | No | Editable, optional |
| `enabled` | `Boolean!` | Yes | Default `false` on create; toggleable from list card and detail panel |
| `trigger` | `Trigger!` | Yes | Exactly one trigger type; default DeviceEvent ONLINE on create |
| `conditionGroup` | `ConditionGroup!` | Yes | Root condition group; default empty AND group on create |
| `actions` | `[Action!]!` | Yes | Ordered list; default empty on create |
| `actionsCount` | `Int!` | Yes | Computed server-side. Read-only. |
| `conditionsCount` | `Int!` | Yes | Computed server-side (leaf conditions only). Read-only. |
| `conditionsDepth` | `Int!` | Yes | Computed server-side (nesting depth). Read-only. |
| `createdAt` | `String!` | Yes | ISO 8601 timestamp. Server-set. Read-only. |
| `updatedAt` | `String!` | Yes | ISO 8601 timestamp. Server-updated on every mutation. Read-only. |

**Validation rules**: `name` is required (non-empty). `description` is optional (nullable).

### Trigger (Union)

Polymorphic — exactly one of three types. Switching type discards existing config.

#### DeviceEventTrigger

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | `ID!` | Yes | Server-generated |
| `event` | `DeviceEvent!` | Yes | Enum: `ONLINE`, `OFFLINE`, `HARDWARE_CHANGE` |

#### ThresholdTrigger

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | `ID!` | Yes | Server-generated |
| `metric` | `Metric!` | Yes | Enum: `CPU`, `MEMORY`, `DISK` |
| `operator` | `ComparisonOperator!` | Yes | See ComparisonOperator enum |
| `value` | `Float!` | Yes | Decimal number. Validated as float on form. |
| `duration` | `Int` | No | Seconds. Validated as integer on form. |

#### ScheduleTrigger

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | `ID!` | Yes | Server-generated |
| `frequency` | `Frequency!` | Yes | Enum: `MINUTES`, `HOURS`, `DAYS` |
| `interval` | `Int!` | Yes | Integer 1–999. Validated on form. |

### ConditionGroup

A logical group containing an ordered list of condition entries. Forms a recursive tree.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | `ID!` | Yes | Server-generated |
| `operator` | `LogicalOperator!` | Yes | Enum: `AND`, `OR`. Toggleable. |
| `conditions` | `[ConditionEntry!]!` | Yes | Ordered list of entries. May be empty (valid). |

**State transitions**: `operator` toggles between AND and OR. Entries can be added or removed. An empty conditions array is valid.

### ConditionEntry (Union)

Each entry in a condition group is either a leaf `Condition` or a nested `ConditionGroup`.

#### Condition (Leaf)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | `ID!` | Yes | Server-generated |
| `field` | `String!` | Yes | Required non-empty, whitespace-trimmed. No format constraint. |
| `operator` | `ComparisonOperator!` | Yes | See ComparisonOperator enum |
| `value` | `String!` | Yes | Free-form string |

### Action (Union)

Polymorphic — one of two types. Ordered within an automation.

#### SendNotificationAction

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | `ID!` | Yes | Server-generated |
| `recipients` | `[String!]!` | Yes | Email addresses. Validated with Zod email format. |
| `subject` | `String!` | Yes | Required non-empty |
| `body` | `String!` | Yes | Required non-empty |

#### RunScriptAction

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | `ID!` | Yes | Server-generated |
| `script` | `String!` | Yes | Filename. Validated as valid filename string. |
| `args` | `[String!]` | No | Optional argument list |
| `timeout` | `Int` | No | Optional. Seconds. |

## Enums

| Enum | Values |
|------|--------|
| `LogicalOperator` | `AND`, `OR` |
| `ComparisonOperator` | `EQUALS`, `NOT_EQUALS`, `GREATER_THAN`, `LESS_THAN`, `GREATER_THAN_OR_EQUALS`, `LESS_THAN_OR_EQUALS`, `CONTAINS`, `NOT_CONTAINS` |
| `DeviceEvent` | `ONLINE`, `OFFLINE`, `HARDWARE_CHANGE` |
| `Metric` | `CPU`, `MEMORY`, `DISK` |
| `Frequency` | `MINUTES`, `HOURS`, `DAYS` |

## Input Types (Mutations)

### CreateAutomationInput

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | `String!` | Yes | |
| `description` | `String` | No | |
| `enabled` | `Boolean` | No | Defaults server-side |
| `trigger` | `TriggerInput!` | Yes | Exactly one trigger type key must be non-null |
| `conditionGroup` | `ConditionGroupInput` | No | Defaults to empty AND group if omitted |
| `actions` | `[ActionInput!]!` | Yes | |

### UpdateAutomationInput

All fields optional — partial updates supported.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | `String` | No | |
| `description` | `String` | No | |
| `enabled` | `Boolean` | No | |
| `trigger` | `TriggerInput` | No | |
| `conditionGroup` | `ConditionGroupInput` | No | |
| `actions` | `[ActionInput]` | No | |

### TriggerInput (Wrapper)

Exactly one key must be non-null:

| Field | Type |
|-------|------|
| `deviceEvent` | `DeviceEventTriggerInput` |
| `threshold` | `ThresholdTriggerInput` |
| `schedule` | `ScheduleTriggerInput` |

### ConditionGroupInput (Recursive)

| Field | Type |
|-------|------|
| `operator` | `LogicalOperator!` |
| `conditions` | `[ConditionEntryInput!]!` |

### ConditionEntryInput (Wrapper)

Exactly one key must be non-null:

| Field | Type |
|-------|------|
| `condition` | `ConditionInput` |
| `group` | `ConditionGroupInput` |

### ActionInput (Wrapper)

Exactly one key must be non-null:

| Field | Type |
|-------|------|
| `sendNotification` | `SendNotificationActionInput` |
| `runScript` | `RunScriptActionInput` |

## UI-Only Type: UIConditionNode (P3)

A tagged union for local form state. Not generated by codegen. Defined in `types/condition-tree.ts`.

```typescript
type UIConditionLeaf = {
  type: 'condition';
  id: string;           // Client-generated UUID for react-hook-form key
  field: string;
  operator: ComparisonOperator;
  value: string;
};

type UIConditionGroup = {
  type: 'group';
  id: string;           // Client-generated UUID for react-hook-form key
  operator: LogicalOperator;
  children: UIConditionNode[];
};

type UIConditionNode = UIConditionLeaf | UIConditionGroup;
```

**Transform functions**:
- `uiTreeToApiInput(node: UIConditionGroup): ConditionGroupInput` — strips `type` and `id`, wraps children as `ConditionEntryInput`
- `apiTreeToUiNode(group: ConditionGroup): UIConditionGroup` — adds `type` discriminant and generates client-side IDs
