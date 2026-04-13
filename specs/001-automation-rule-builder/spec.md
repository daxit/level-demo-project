# Feature Specification: Automation Rule Builder

**Feature Branch**: `001-automation-rule-builder`  
**Created**: 2026-04-12  
**Status**: Draft  
**Input**: User description: "Build a frontend application for managing automation rules on a Remote Monitoring and Management platform."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Automation List (Priority: P1)

An IT administrator opens the application and sees all existing automation rules
displayed as cards in a full-width list. Each card shows the automation name, an
enabled status indicator, a trigger type summary, condition and action counts, and
a relative "last updated" timestamp. The administrator can toggle any automation's
enabled state directly from the card without opening the detail panel. They can
also delete an automation from the list.

**Why this priority**: The list is the entry point to the entire application. Without
it, no other feature is reachable. Toggling enabled state and deleting are the two
most common lightweight operations IT teams perform on existing rules.

**Independent Test**: Load the application with seeded data. Verify the list
renders all automations, toggling enabled persists to the API, deleting an
automation removes it from the list, and selecting a card opens an empty detail
panel placeholder.

**Acceptance Scenarios**:

1. **Given** the API has seeded automations, **When** the application loads,
   **Then** all automations are displayed as cards sorted by last updated
   descending, each showing name, enabled indicator, trigger summary, condition
   count, action count, and relative updated time.

2. **Given** an automation card is visible, **When** the user clicks the enabled
   toggle, **Then** the toggle state updates immediately and an updateAutomation
   mutation fires with the new enabled value.

3. **Given** an automation card is visible, **When** the user clicks delete,
   **Then** the automation is removed from the list and a deleteAutomation
   mutation fires, evicting the item from the cache.

4. **Given** the list is at full width, **When** the user selects a card,
   **Then** the list compresses to a fixed narrow sidebar on the left and a
   detail panel slides in from the right.

5. **Given** a card is selected and the detail panel is open, **When** the user
   closes the detail panel, **Then** the list returns to full width.

6. **Given** the API returns an error on toggle or delete, **When** the mutation
   fails, **Then** the UI surfaces an error message to the user.

7. **Given** a card is selected and the detail panel is open, **When** the user
   copies the URL, **Then** the URL contains `?id=<automationId>` and opening
   that URL directly opens the application with the same automation already
   selected in the detail panel.

8. **Given** an automation is selected and the detail panel is open, **When**
   the user presses the browser back button, **Then** the detail panel closes
   and the list returns to full width — back/forward navigation reflects
   selection history.

---

### User Story 2 — Rule Builder: Create & Update (Priority: P2)

An IT administrator creates a new automation by clicking "New Automation". The
system immediately creates a shell automation on the server with defaults
(placeholder name, disabled, default trigger, empty conditions, no actions) and
opens it in the detail panel. All fields are editable inline at all times — there
is no edit mode toggle. Changes auto-save: toggles and dropdowns save immediately,
text inputs debounce before saving. A save status indicator shows Saving, Saved, or
Failed with a Retry action.

Above the rule builder, a persistent metadata section displays all automation
metadata: name, description, enabled state, trigger type summary, conditions count,
actions count, created date, last updated date, and the save status indicator. All
fields are editable inline. The enabled toggle in the metadata section fires
immediately — identical behavior to the list card toggle. A delete action in the
metadata section removes the automation and closes the detail panel.

The administrator configures the trigger by selecting a type (Device Event,
Threshold, or Schedule) and filling in the type-specific fields. They add actions
to an ordered list, choosing between Send Notification and Run Script, and can
drag to reorder. They edit a flat (single-level) condition group with individual
conditions.

**Why this priority**: Creating and editing rules is the core value proposition.
This story delivers the full CRUD lifecycle for automations with all three trigger
types, both action types, and a flat condition group — enough to handle the
majority of real-world rules.

**Independent Test**: Create a new automation, verify the shell appears in the
list. Configure a threshold trigger, add two actions (one notification, one
script), add a flat condition. Verify all auto-saves persist. Reload the page and
confirm the automation loads with the saved state.

**Acceptance Scenarios**:

1. **Given** the list is visible, **When** the user clicks "New Automation",
   **Then** a createAutomation mutation fires with defaults (name: "New
   Automation", enabled: false, trigger: DeviceEvent ONLINE, empty condition
   group, no actions) and the returned automation is selected with the detail
   panel open.

2. **Given** the detail panel is open, **When** the user edits the name field
   and stops typing for 600ms, **Then** an updateAutomation mutation fires
   with the new name and the save status shows "Saving…" then "Saved".

3. **Given** the detail panel is open, **When** the user selects a different
   trigger type, **Then** the existing trigger configuration is silently
   discarded, the new type's default configuration fields appear inline, and
   the mutation fires immediately — no confirmation dialog is shown.

4. **Given** Threshold trigger is selected, **When** the user configures metric,
   operator, value, and optional duration, **Then** each field change persists
   via auto-save with the correct types (value as Float, duration as Int in
   seconds).

5. **Given** Schedule trigger is selected, **When** the user sets frequency and
   interval, **Then** the interval is validated as an integer between 1 and 999
   and the mutation fires.

6. **Given** the actions list is empty, **When** the user clicks "Add Action" and
   selects Send Notification, **Then** a notification action form appears with
   recipients, subject, and body fields. Recipients are validated as email
   addresses.

7. **Given** the actions list is empty, **When** the user clicks "Add Action" and
   selects Run Script, **Then** a script action form appears with script name,
   arguments list, and optional timeout fields.

8. **Given** multiple actions exist, **When** the user drags an action to a new
   position, **Then** the reorder persists immediately via auto-save.

9. **Given** a flat condition group, **When** the user adds a condition with
   field, operator, and value, **Then** the condition is added to the root group
   and auto-saves immediately.

10. **Given** a mutation fails, **When** the save fails, **Then** the save status
    transitions to "Retrying in X seconds" and automatically retries with
    exponential backoff. A manual Retry button is also visible for the user to
    trigger an immediate retry.

11. **Given** automatic retry is counting down, **When** the user makes a new
    edit, **Then** the pending retry is cancelled, the debounce timer resets, and
    the next save attempt uses the latest form state — the most recent user input
    always takes priority over any queued retry.

12. **Given** all automatic retries are exhausted, **When** no further retries
    remain, **Then** the save status shows "Failed to save" with only the manual
    Retry button remaining.

13. **Given** the detail panel is open, **When** it renders, **Then** the metadata
    section at the top displays the automation name (editable), description
    (editable), enabled toggle, trigger type summary, conditions count, actions
    count, created date, last updated date, and save status indicator — all
    visible without scrolling.

14. **Given** the detail panel is open, **When** the user clicks the enabled
    toggle in the metadata section, **Then** an updateAutomation mutation fires
    immediately with the new enabled value — identical behavior to the list card
    toggle.

15. **Given** the detail panel is open, **When** the user clicks delete in the
    metadata section, **Then** a deleteAutomation mutation fires, the automation
    is evicted from the cache, the detail panel closes, and the list returns to
    full width.

---

### User Story 3 — Nested Condition Tree (Priority: P3)

An IT administrator builds a complex condition tree with nested AND/OR groups at
arbitrary depth. The root group has an AND/OR toggle. Groups can contain individual
conditions and nested sub-groups. Each group has Add Condition, Add Group, and
Remove controls. Indentation visually communicates nesting depth. The condition
tree renders inline in the rule builder — no separate panel or modal.

The local UI state uses a recursive tagged union type (`UIConditionNode`) that is
transformed to the API's `ConditionGroupInput` wrapper-object format at mutation
time via a pure function (`uiTreeToApiInput`). This transform function is the sole
target of unit tests.

**Why this priority**: Nested conditions are the most complex UI component and
depend on the flat condition group from P2 being functional. Most automations can
be expressed with flat conditions; nesting is needed for advanced rules.

**Independent Test**: Open an automation, build a condition tree with 3 levels of
nesting (AND > OR > AND), verify the tree renders correctly with indentation,
verify add/remove at each level, verify the transform produces the correct API
input shape. Run the transform unit tests.

**Acceptance Scenarios**:

1. **Given** a flat condition group exists, **When** the user clicks "Add Group",
   **Then** a nested group is added with an AND/OR toggle defaulting to AND and
   one empty condition row pre-populated.

2. **Given** a nested group exists, **When** the user adds a condition to the
   nested group, **Then** the condition appears indented under that group and
   auto-saves immediately.

3. **Given** a nested group exists at depth 2, **When** the user clicks "Add
   Group" inside it, **Then** a depth-3 group is created, demonstrating
   arbitrary nesting with no hard depth limit.

4. **Given** a non-root group exists, **When** the user clicks Remove on that
   group, **Then** the group and all its children are removed and the change
   auto-saves immediately.

5. **Given** the root group, **When** the user clicks Remove, **Then** nothing
   happens — the root group cannot be removed.

6. **Given** a condition tree with nested groups, **When** the auto-save fires,
   **Then** the `uiTreeToApiInput` transform converts the `UIConditionNode` tree
   to `ConditionGroupInput` wrapper objects, stripping `type` discriminants and
   client-side `id` fields.

7. **Given** the transform function, **When** tested with an empty tree (root
   group with zero conditions), **Then** it produces
   `{ operator: 'AND', conditions: [] }`.

8. **Given** the transform function, **When** tested with a tree containing
   nested groups, **Then** each node is correctly wrapped as
   `{ condition: {...} }` or `{ group: {...} }` matching `ConditionEntryInput`.

---

### Edge Cases

- What happens when the API is unreachable on initial load? The list view shows
  an error message with a clear description. No empty state is rendered.
- What happens when a mutation fails repeatedly? The save status indicator shows
  "Failed to save" with a Retry action. The form state is preserved — the user
  does not lose their edits.
- What happens when the user deletes the only automation? The list shows an empty
  state with a prompt to create a new automation.
- What happens when the user removes all conditions from a group? The group
  remains with an empty conditions array — this is valid per the API schema.
- What happens when the user creates a new automation while the API is slow? The
  "New Automation" button is disabled while the create mutation is in flight.
- What happens when toggling enabled fails? The toggle reverts to its previous
  state and an error is surfaced.
- What happens when the URL contains an invalid automation ID (`?id=<nonexistent>`)?
  The `id` search parameter is cleared, the detail panel does not open, and the
  list displays at full width.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display all automations as cards in a list view sorted
  by last updated descending.
- **FR-002**: System MUST allow toggling an automation's enabled state directly
  from the list card without opening the detail panel.
- **FR-003**: System MUST allow deleting an automation from the list with
  immediate cache eviction.
- **FR-004**: System MUST implement a Gmail-style master-detail layout where the
  list compresses to a fixed-width sidebar when a card is selected.
- **FR-005**: System MUST create a new automation with server-side defaults when
  "New Automation" is clicked and immediately open it in the detail panel.
- **FR-006**: System MUST auto-save all form changes — toggles and dropdowns
  immediately, text inputs after a 600ms debounce.
- **FR-007**: System MUST display a save status indicator in the detail panel
  metadata section with four states: "Saving…", "Saved", "Retrying in X seconds"
  (with countdown and a manual Retry button), and "Failed to save" (manual Retry
  button only, after retries are exhausted). Auto-retry MUST use exponential
  backoff with exactly 3 attempts at 2s / 4s / 8s intervals. If the user makes
  a new edit while a retry is pending, the retry MUST be cancelled and the save
  cycle MUST restart with the latest form state.
- **FR-008**: System MUST support all three trigger types (Device Event, Threshold,
  Schedule) with type-specific inline configuration fields.
- **FR-009**: System MUST validate trigger inputs at the form level: threshold
  value as decimal, duration as integer in seconds, schedule interval as integer
  1–999. Condition `field` MUST be validated as a required non-empty string
  (whitespace-trimmed); no format constraint beyond non-empty is enforced.
- **FR-010**: System MUST support both action types (Send Notification, Run Script)
  with type-specific fields and Zod validation (email format for recipients,
  required subject/body, valid filename for script name).
- **FR-011**: System MUST support drag-to-reorder on the actions list with
  immediate auto-save on reorder.
- **FR-012**: System MUST support nested AND/OR condition groups at arbitrary
  depth using a recursive component with nested useFieldArray per group.
- **FR-013**: System MUST use a local `UIConditionNode` recursive type for the
  condition tree form state and transform it to `ConditionGroupInput` via a pure
  `uiTreeToApiInput` function at mutation time.
- **FR-014**: System MUST wrap all GraphQL operations in custom hooks under
  `hooks/` — components MUST NOT import Apollo Client directly.
- **FR-015**: System MUST configure Apollo error link middleware for global console
  logging of all API errors with operation name.
- **FR-016**: System MUST use Radix UI primitives for all selects, dialogs, and
  switches, styled with Tailwind v4.
- **FR-017**: System MUST have unit tests on the `uiTreeToApiInput` transform
  function covering round-trip fidelity, nested groups, empty tree, and single
  condition.
- **FR-018**: System MUST serialize mutations per automation. While a mutation
  is in-flight, subsequent mutations for the same automation MUST be queued.
  Immediate-save triggers (toggles, dropdowns, add/remove operations) MUST flush
  any pending debounce and jump the queue — the latest user input always wins.
- **FR-019**: System MUST use skeleton placeholder UI for initial content loads
  (automation list on app boot, detail panel on first selection). Spinners are
  prohibited. Content already visible MUST remain visible during mutations —
  skeletons MUST NOT replace existing content during a save cycle.
- **FR-020**: System MUST encode the selected automation ID as a URL search
  parameter (`?id=<automationId>`). Navigating directly to a URL with a valid
  `id` param MUST open the application with the corresponding automation
  selected. Browser back and forward navigation MUST reflect selection history.
  Closing the detail panel MUST remove the `id` param from the URL.

### Key Entities

- **Automation**: The top-level entity. Has a name, optional description, enabled
  flag, exactly one trigger, one root condition group, and an ordered list of
  actions. Includes computed counts (actions, conditions, depth) and timestamps.
- **Trigger**: Polymorphic — one of DeviceEventTrigger, ThresholdTrigger, or
  ScheduleTrigger. Each type has distinct configuration fields.
- **ConditionGroup**: A logical group (AND or OR) containing an ordered list of
  condition entries, where each entry is either a leaf Condition or a nested
  ConditionGroup. Forms a recursive tree.
- **Condition**: A leaf node in the condition tree. Has a field name, comparison
  operator, and string value.
- **Action**: Polymorphic — one of SendNotificationAction or RunScriptAction.
  Ordered within an automation. Each type has distinct configuration fields.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view all seeded automations on first load with correct
  metadata displayed on each card.
- **SC-002**: Users can toggle an automation's enabled state from the list card
  and see the change persist after a page reload.
- **SC-003**: Users can create a new automation, configure a trigger, add
  conditions, add actions, and see the complete automation persist after a page
  reload — all without clicking a Save button.
- **SC-004**: Users can build a condition tree with at least 3 levels of nesting
  and the correct API input is produced by the transform function.
- **SC-005**: The `uiTreeToApiInput` transform function passes all unit tests
  covering empty tree, single condition, flat group, and nested groups.
- **SC-006**: All API errors during mutations surface a "Failed to save" status
  with a functional Retry action.
- **SC-007**: The application gracefully handles API unavailability on initial
  load by showing a clear error message instead of a blank screen.

## Clarifications

The following decisions were made during the clarification session on 2026-04-12:

- **Retry parameters** — Auto-retry uses exactly 3 attempts at 2s / 4s / 8s
  exponential backoff. After all retries are exhausted, the status shows
  "Failed to save" with a manual Retry button only. (See FR-007)

- **Concurrent mutations** — Mutations for the same automation are serialized.
  Immediate-save triggers flush the debounce and take priority. This prevents
  last-write-wins cache corruption from concurrent `updateAutomation` calls.
  (See FR-018)

- **Trigger type change** — Switching trigger type silently discards the
  existing trigger configuration and replaces it with the new type's defaults.
  No confirmation dialog is shown. This is consistent with the no-undo
  auto-save model across the rest of the app. (See P2 Scenario 3)

- **Loading states** — Skeleton placeholder UI is used for all loading states
  throughout the application. Spinners are prohibited. (See FR-019)

- **Condition field validation** — The `field` attribute is a required
  non-empty string (whitespace-trimmed). No format constraint beyond non-empty
  is enforced, consistent with the open-ended `String` type in the API schema.
  (See FR-009)

## Assumptions

- Users are IT administrators with stable internet connectivity and modern desktop
  browsers. Mobile and tablet layouts are not required.
- The API server is running locally at `http://localhost:4000/graphql` and seeded
  with sample data. Restarting the server resets data.
- The API simulates variable response times and occasional mutation failures.
  The UI MUST handle these gracefully.
- The API schema is fixed — `conditionsCount`, `actionsCount`, and
  `conditionsDepth` are computed server-side. The UI does not need to calculate
  these.
- Authentication and authorization are not required — the API is open.
- The three priority slices (P1, P2, P3) are delivered sequentially. P2 depends
  on P1's layout shell. P3 depends on P2's flat condition group.
- The condition tree `UIConditionNode` type and `uiTreeToApiInput` transform are
  the only areas where hand-written types diverge from generated GraphQL types.
