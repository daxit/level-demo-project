# Automation Rule Builder — Specify

## Overview

Build a frontend application for Level's Remote Monitoring and Management (RMM) 
platform that allows IT teams to create, view, edit, and delete automation rules. 
Each automation follows the pattern: WHEN [trigger] IF [conditions] THEN [actions].

The application is built against an existing GraphQL API. 
The backend is read-only — no schema or server changes.

---

## Feature Priorities

Three vertical slices in priority order:

**P1 — Automation list (read + toggle + delete)**
Master-detail layout shell, list query, automation cards, enabled toggle
(fires updateAutomation immediately), delete with cache eviction.
No detail panel content yet — selecting a card opens an empty panel.

**P2 — Rule builder: create + update**
Optimistic create flow, detail panel with metadata and full WHEN/IF/THEN
rule builder, auto-save, trigger configuration for all three trigger types,
flat (single-level) condition group, action configuration for both action
types, drag-to-reorder actions, save status indicator.

**P3 — Nested condition tree**
Nested AND/OR groups at arbitrary depth, recursive condition tree component
with nested useFieldArray per group, full transform function with unit tests.

---

## Architecture

### High Level Components

1. **Automation List** — displays all automations as interactive cards 
   in a master-detail layout
2. **Automation Detail / Rule Builder** — always-editable view of a selected 
   automation with auto-save
3. **Apollo Data Layer** — custom hooks wrapping all queries and mutations, 
   cache policies, and error logging middleware
4. **Form Layer** — manages all editor state and input validation
5. **Condition Tree** — recursive UI component for building nested 
   AND/OR condition groups

### Component Interaction

- Apollo cache is the single source of truth for server state
- The form layer owns all in-progress editor state between keystrokes 
  and discrete actions
- Changes are persisted automatically via auto-save — no explicit save 
  action required
- The enabled toggle on the list card and in the detail panel both persist 
  immediately without waiting for any debounce

### Data Flow

- The list view fetches only the fields needed to render each card — name, 
  description, enabled state, counts, and timestamps
- The detail view fetches the full automation including the nested trigger, 
  condition tree, and actions
- On auto-save, the condition tree UI state is transformed into the shape 
  the API expects before the mutation fires
- The list is sorted by last updated date descending — handled client-side 
  via a cache read policy, no backend changes required

### Error Handling

- Apollo error link middleware logs all API errors to the console 
  with the operation name
- Each mutation surfaces failures through the save status indicator 
  with automated retry logic with exponential backoff
- Query errors on the list and detail views are surfaced to the user 
  with a clear message

---

## Data

### Queries

Two queries:

**List query** — fetches the fields needed to render automation cards: id, name, 
description, enabled, actionsCount, conditionsCount, createdAt, updatedAt

**Detail query** — fetches the full automation including the complete nested 
trigger, condition group tree, and all actions

### Mutations

Three mutations:

**Create** — clicking "New Automation" immediately calls createAutomation
with the following defaults and adds the result to the cached list:
- name: "New Automation"
- enabled: false
- trigger: { deviceEvent: { event: ONLINE } }
- conditionGroup: { operator: AND, conditions: [] }
- actions: []

The returned automation is immediately selected and the detail panel opens.
All subsequent edits fire updateAutomation — there is no create-vs-update
branching in the form layer.

**Update** — updates an existing automation, cache updates automatically. 
Also used for the enabled toggle

**Delete** — deletes an automation and removes it from the cached list

### Caching

- Default Apollo cache normalization by id
- List sorted by updatedAt descending via a client-side cache read policy
- Mutations handle their own cache updates — create adds to the list, 
  delete evicts from the list, update merges automatically
- No manual refresh button — mutations drive all reactive updates
- Last updated time is shown per card as a relative timestamp

---

## UI

### Layout — Gmail-Style Master-Detail

- Full-width automation list when no automation is selected
- When an automation is selected the list compresses to a narrow fixed left 
  sidebar and the detail panel fills the remaining width, sliding in from the right
- A New Automation button sits at the top of the list panel and collapses 
  to a compact state when the sidebar is narrow
- Closing the detail panel returns the list to full width

### Visual Style

Modern developer tool aesthetic — clean neutral grays, subtle borders, no 
decorative elements. Rounded corners on cards and inputs. Background contrast 
and borders for depth rather than heavy shadows. All interactive elements have 
clear hover and focus states.

---

## Automation List

Each automation is displayed as a card with the following layout:

- **Title row:** enabled status indicator + automation name
- **Subtitle row:** trigger type + human-readable summary of the trigger 
  configuration
- **Footer row:** conditions count chip + actions count chip + relative 
  last updated time

The enabled indicator is green when enabled and gray when disabled. The enabled 
toggle on the card fires immediately without requiring the detail panel to be 
opened. The selected card has a distinct highlighted state.

---

## Automation Detail Panel

### Metadata Section (top)

Always visible. Contains all automation metadata, all fields editable inline:

- Name
- Description
- Enabled toggle
- Trigger type and summary
- Conditions count
- Actions count
- Created date
- Last updated date
- Save status indicator (see Edit Behavior)

### Rule Builder Section (bottom)

Displays the full WHEN / IF / THEN rule as a single scrollable view — no tabs. 
All fields are editable inline at all times — there is no read-only mode or 
edit mode toggle.

---

## Edit Behavior

All fields in the detail panel are editable inline at all times. There is no 
edit mode toggle, no Save button, and no Cancel button. Changes are persisted 
automatically:

- **Toggles and dropdowns** — save immediately on change
- **Text inputs and textareas** — debounce 500–800ms after the user stops 
  typing before saving
- **Condition tree add and remove operations** — save immediately

A save status indicator is always visible in the metadata section showing 
one of three states:

- Saving...
- Saved
- Failed to save — with a Retry action

The auto-save model means the persisted state is always the source of truth. 
There is no revert or undo.

---

## Trigger Configuration

A trigger type selector presents three options: Device Event, Threshold, Schedule. 
Selecting a type reveals the relevant configuration fields inline.

**Device Event** — a single dropdown for the event type: ONLINE, OFFLINE, 
HARDWARE_CHANGE

**Threshold** — a metric dropdown (CPU, MEMORY, DISK), a comparison operator 
dropdown (EQUALS, NOT_EQUALS, GREATER_THAN, LESS_THAN, GREATER_THAN_OR_EQUALS, 
LESS_THAN_OR_EQUALS, CONTAINS, NOT_CONTAINS), a numeric value input validated 
as a decimal, and an optional duration input validated as an integer stored 
in seconds

**Schedule** — a frequency dropdown (MINUTES, HOURS, DAYS) and an interval 
input validated as an integer between 1 and 999

---

## Condition Tree

The condition tree is the centerpiece of the rule builder. It supports nested 
AND/OR groups at arbitrary depth.

### Layout
[AND ▾]                          [+ Add Condition] [+ Add Group]
├─ environment  [EQUALS ▾]  "production"                  [✕]
└─ [OR ▾]                    [+ Add Condition] [+ Add Group]
├─ role  [EQUALS ▾]  "database"                      [✕]
└─ role  [EQUALS ▾]  "web-server"                    [✕]

### Behavior

- The root group has an AND/OR toggle defaulting to AND
- Each group contains an AND/OR toggle, its condition entries, an Add Condition 
  button, an Add Group button, and a Remove button (all groups except the root 
  can be removed)
- Each condition entry has a field input, operator dropdown, value input, 
  and a Remove button
- Adding a group nests a new AND/OR group at that level with one empty 
  condition pre-populated
- Indentation visually communicates nesting depth
- No hard depth limit is enforced in the UI
- All add and remove operations on the condition tree save immediately 
  per the auto-save behavior

---

## Condition Tree UI Type Design

The API returns a `union ConditionEntry = Condition | ConditionGroup` and
accepts a wrapper-object input `ConditionEntryInput { condition, group }`.
Neither shape is ergonomic for recursive React rendering. A local UI type
is used in the form layer and transformed to the API input shape at save time.

### Local UI Type

```ts
type UIConditionNode =
  | { type: 'condition'; id: string; field: string; operator: ComparisonOperator; value: string }
  | { type: 'group';     id: string; operator: LogicalOperator; conditions: UIConditionNode[] }

type UIConditionGroup = Extract<UIConditionNode, { type: 'group' }>
```

IDs are `crypto.randomUUID()` client-side, used as React keys only —
never sent to the API (input types have no id field).

### Form Approach

Nested useFieldArray per group level. Each ConditionGroupEditor component
calls useFieldArray for its own conditions array at its nested field path
(e.g. `conditionGroup.conditions.0.conditions.1…`).

### Empty Condition Row Defaults

When the user clicks Add Condition:

```ts
{ type: 'condition', id: crypto.randomUUID(), field: '', operator: 'EQUALS', value: '' }
```

### Transform Function Contract

Pure function, no side effects:

```ts
function uiTreeToApiInput(root: UIConditionGroup): ConditionGroupInput
```

Strips the `type` discriminant and `id`, converts each `UIConditionNode`
to a `ConditionEntryInput` wrapper: `{ condition: ... }` or `{ group: ... }`.
Recurses into nested groups. This function is the sole target of unit tests.

---

## Action Configuration

Actions are displayed as an ordered list. Each action has a drag handle for 
reordering. An Add Action button appears below the list. Clicking it appends 
a new action with a type selector — selecting a type reveals the relevant fields. 
Reordering saves immediately. Adding and removing actions saves immediately.

**Send Notification:**
- Recipients: tag-style list input, each entry validated as a properly 
  formatted email address
- Subject: required text input
- Body: required textarea

**Run Script:**
- Script name: text input validated as a valid filename
- Arguments: a dynamic list of text inputs where each entry is one argument, 
  entries can be added and removed
- Timeout: optional integer input in seconds