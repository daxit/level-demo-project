# Tasks: Automation Rule Builder

**Input**: Design documents from `/specs/001-automation-rule-builder/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅ | quickstart.md ✅

**Tests**: Unit tests are included for the `uiTreeToApiInput` transform only (FR-017, Principle VI). No component tests or E2E tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup (Codegen & Dependencies)

**Purpose**: Install all libraries, configure GraphQL Code Generator, write operation documents, generate types. Must complete before any component work begins.

**⚠️ PREREQUISITE**: API server must be running (`pnpm start:api`) before T007.

- [ ] T001 Install runtime dependencies in `ui/` — `pnpm --filter @acme/ui add react-hook-form @hookform/resolvers zod @radix-ui/react-select @radix-ui/react-switch @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities date-fns clsx`
- [ ] T002 [P] Install dev dependencies in `ui/` — `pnpm --filter @acme/ui add -D @graphql-codegen/cli @graphql-codegen/client-preset @parcel/watcher`
- [ ] T003 [P] Create `ui/codegen.ts` — set schema to `http://localhost:4000/graphql`, documents to `src/graphql/**/*.ts`, output preset `client` to `./src/gql/`; add `"codegen": "graphql-codegen --config codegen.ts"` and `"codegen:watch": "graphql-codegen --config codegen.ts --watch"` scripts to `ui/package.json`
- [ ] T004 [P] Configure vitest in `ui/package.json` — replace test script `echo "Error: no test specified" && exit 0` with `vitest run`; add `test: { include: ['src/__tests__/**/*.test.ts'] }` block to `ui/vite.config.ts` under `defineConfig`
- [ ] T005 [P] Create `ui/src/graphql/queries.ts` — define `AutomationListFields` fragment (id, name, description, enabled, trigger `__typename` only, actionsCount, conditionsCount, conditionsDepth, createdAt, updatedAt); define `AutomationDetailFields` fragment with full trigger fields (all three union types via inline fragments), conditionGroup with manually-expanded `ConditionFields` inline fragments to 5 levels, actions with `ActionFields` inline fragment; define `AutomationsQuery` using `AutomationListFields`; define `AutomationQuery($id: ID!)` using `AutomationDetailFields`
- [ ] T006 [P] Create `ui/src/graphql/mutations.ts` — define `CreateAutomationMutation($input: CreateAutomationInput!)` returning `AutomationDetailFields`; define `UpdateAutomationMutation($id: ID!, $input: UpdateAutomationInput!)` returning `AutomationDetailFields`; define `DeleteAutomationMutation($id: ID!)` returning `{ success id }`
- [ ] T007 Run `pnpm --filter @acme/ui codegen` with API server running to generate `ui/src/gql/fragment-masking.ts`, `ui/src/gql/gql.ts`, and `ui/src/gql/graphql.ts` (depends on T001–T006)

**Checkpoint**: `ui/src/gql/` directory exists with generated types. `pnpm typecheck` passes on the generated files.

---

## Phase 2: Foundational (Shared Infrastructure)

**Purpose**: Apollo Client setup, utility functions, root layout update, and route shell. All user story work blocks on this phase.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T008 [P] Create `ui/src/lib/apollo.ts` — import `ApolloClient`, `HttpLink`, `InMemoryCache`, `ApolloLink` from `@apollo/client` and `onError` from `@apollo/client/link/error`; create `errorLink` that logs `operation.operationName` plus all `graphQLErrors` and `networkError` to console (FR-015); create `InMemoryCache` with `possibleTypes: { ConditionEntry: ['Condition', 'ConditionGroup'], Trigger: ['DeviceEventTrigger', 'ThresholdTrigger', 'ScheduleTrigger'], Action: ['SendNotificationAction', 'RunScriptAction'] }`; export pre-configured `client` combining errorLink + HttpLink at `http://localhost:4000/graphql`
- [ ] T009 [P] Create `ui/src/lib/cn.ts` — import `clsx` and `type ClassValue` from `clsx`; export a `cn(...inputs: ClassValue[])` function that calls `clsx(...inputs)` and returns the result
- [ ] T010 [P] Create `ui/src/components/SkeletonCard.tsx` — render a skeleton placeholder div matching the height and layout of a future AutomationCard; use Tailwind `animate-pulse` with grey rounded blocks for name line, two smaller detail lines, and a right-side toggle placeholder; no props required
- [ ] T011 [P] Refactor `ui/src/App.tsx` — strip placeholder boilerplate content; retain file as the root app shell component rendered by `main.tsx` (standard React convention); if `App.tsx` is not currently imported by `main.tsx`, update `main.tsx` to render `<App />` which in turn renders `<RouterProvider />`
- [ ] T012 Update `ui/src/routes/__root.tsx` — import the pre-configured `client` from `../lib/apollo.ts`; remove the inline `ApolloClient`, `HttpLink`, and `InMemoryCache` instantiation; pass imported `client` to `ApolloProvider` (depends on T008)

**Checkpoint**: `pnpm dev:ui` starts without errors. Root layout renders via `App.tsx` → `RouterProvider` → `__root.tsx`. No Apollo Client errors in console.

---

## Phase 3: User Story 1 — Automation List (Priority: P1) 🎯 MVP

**Goal**: Render all automations as cards. Toggle enabled state from the card. Delete automations. Master-detail layout with URL-based selection and an empty detail panel placeholder.

**Independent Test**: Start API (`pnpm start:api`), open `http://localhost:5173`. Verify 3 automation cards render with skeleton loading first. Toggle enabled on any card — verify immediate UI update and persisted state on page reload. Delete an automation — verify it disappears from the list. Click a card — verify URL changes to `?id=<id>`, list compresses to sidebar, empty detail panel appears. Press browser back — verify URL loses `?id`, list returns to full width. Navigate directly to `/?id=<validId>` — verify detail panel opens immediately. Navigate to `/?id=<nonexistentId>` — verify param is cleared and list displays at full width.

### Implementation for User Story 1

- [ ] T013 [P] [US1] Create `ui/src/hooks/useAutomations.ts` — import `useQuery` from `@apollo/client` and the typed `AutomationsQuery` document from `../gql/gql`; return `{ automations: data?.automations ?? [], loading, error }`; components consume this hook — they never import `@apollo/client` directly (FR-014)
- [ ] T014 [P] [US1] Create `ui/src/hooks/useUpdateAutomation.ts` — import `useMutation` from `@apollo/client` and the typed `UpdateAutomationMutation` document from `../gql/gql`; return `{ updateAutomation: mutate, loading }`; accept an optional `onError` callback parameter for local error handling
- [ ] T015 [P] [US1] Create `ui/src/hooks/useDeleteAutomation.ts` — import `useMutation` from `@apollo/client` and the typed `DeleteAutomationMutation` document from `../gql/gql`; on mutation success (`data.deleteAutomation.success === true`), call `cache.evict({ id: cache.identify({ __typename: 'Automation', id: variables.id }) })` then `cache.gc()`; return `{ deleteAutomation: mutate, loading }`
- [ ] T016 [US1] Create `ui/src/components/AutomationCard.tsx` — props: `automation` (typed from generated `AutomationListFields` fragment type), `onSelect: () => void`; render: automation name as heading, trigger type label derived from `trigger.__typename` (strip "Trigger" suffix), `conditionsCount` and `actionsCount` as pill badges, relative timestamp using `date-fns` `formatDistanceToNow(new Date(automation.updatedAt), { addSuffix: true })`; Radix `Switch` for enabled (call `useUpdateAutomation` with `{ enabled: !automation.enabled }` on change, optimistic UI update, revert and show inline error message on `onError`); delete button (call `useDeleteAutomation`, show inline error on failure); clicking the card body (not toggle or delete) calls `onSelect`; no direct Apollo Client imports (depends on T013, T014, T015)
- [ ] T017 [US1] Create `ui/src/components/AutomationList.tsx` — props: `selectedId: string | undefined`, `onSelect: (id: string) => void`; call `useAutomations()`; while `loading`: render 3 `SkeletonCard` components; if `error`: render error message div with error description (not an empty state); if data is empty array: render empty state with "No automations yet" message and a placeholder to add one later (P2 adds the button); otherwise: sort automations by `updatedAt` descending and map to `AutomationCard` components passing `isSelected={automation.id === selectedId}`; use `cn()` to highlight the selected card (depends on T010, T016)
- [ ] T018 [P] [US1] Create `ui/src/components/DetailPanel.tsx` — props: `automationId: string`, `automationName: string | undefined`, `onClose: () => void`; render a panel showing the automation name as a heading and a close button (×) that calls `onClose`; rest of the panel body is an empty placeholder; this shell will be replaced in P2
- [ ] T019 [US1] Build master-detail layout in `ui/src/routes/index.tsx` — add `validateSearch: (search: Record<string, unknown>) => ({ id: typeof search.id === 'string' ? search.id : undefined })` to `createFileRoute('/')`; in `IndexPage`: call `Route.useSearch()` to get `id`; call `useNavigate({ from: '/' })`; derive `isDetailOpen = id !== undefined`; find `selectedAutomation` by filtering the automations list from `useAutomations()` by `id`; if `id` is present and the list has finished loading (`!loading`) and no matching automation exists (`automations.length > 0 && !automations.find(a => a.id === id)`), clear the search param via `navigate({ search: {} })` to prevent a broken detail panel state — do NOT clear while `loading` is true, as the matching automation may not have arrived yet; render a flex container: left pane is `AutomationList` with `className` transitioning from full-width to fixed `w-80` when `isDetailOpen`; right pane renders `DetailPanel` when `isDetailOpen` passing `automationId={id}`, `automationName={selectedAutomation?.name}`, and `onClose={() => navigate({ search: {} })}`; card `onSelect` calls `navigate({ search: { id: automation.id } })` (depends on T017, T018)

**Checkpoint**: All P1 acceptance scenarios (spec.md scenarios 1–8 of US1) pass. URL reflects selection. Browser back/forward works. Deep-link to `/?id=<id>` opens detail panel. Invalid `?id` is cleared gracefully.

---

## Phase 4: User Story 2 — Rule Builder: Create & Update (Priority: P2)

**Goal**: Full CRUD lifecycle. Create new automations with defaults. Inline editing with auto-save (debounce + serialization + exponential backoff retry). Trigger configuration for all 3 trigger types, flat condition group, drag-to-reorder actions list.

**Independent Test**: Create a new automation — verify it appears in the list and detail panel opens. Set name (wait 600ms) — verify save status shows "Saving…" then "Saved". Change trigger type to Threshold — verify immediate save, new fields appear, old fields gone. Add a SendNotification action with valid email — verify auto-save. Add a condition with field, operator, value — verify auto-save. Drag action to reorder — verify immediate save. Reload page — verify all changes persisted. Simulate API failure (stop server mid-save) — verify retry countdown then "Failed to save" with Retry button.

### Implementation for User Story 2

- [ ] T020 [P] [US2] Create `ui/src/hooks/useAutomation.ts` — import `useQuery` from `@apollo/client` and the typed `AutomationQuery` document from `../gql/gql`; return `{ automation: data?.automation ?? null, loading, error }`; skip query when `id` is undefined using `skip` option
- [ ] T021 [P] [US2] Create `ui/src/hooks/useCreateAutomation.ts` — import `useMutation` from `@apollo/client` and the typed `CreateAutomationMutation` document from `../gql/gql`; after success, call `cache.modify` to append the new automation to the `automations` root field; return `{ createAutomation: mutate, loading }`
- [ ] T022 [US2] Create `ui/src/hooks/useSaveQueue.ts` — implement the save status state machine with states: `idle | debouncing | saving | saved | retrying | failed`; expose `{ saveDebounced(payload), saveImmediate(payload), retry(), status, retryCountdown }`; debounce timer: 600ms using `useRef<ReturnType<typeof setTimeout>>`; immediate save flushes any pending debounce and enqueues ahead; in-flight guard: if a mutation is in-flight, queue the next payload and execute on completion; retry: 3 attempts at 2s / 4s / 8s intervals using `useRef` for retry timer; new edit while retrying: cancel retry timer via `clearTimeout`, clear queued payload, restart debounce; after 3 failed retries: set status to `failed`, clear retry; accepts `mutateFn: (payload: UpdateAutomationInput) => Promise<void>` as parameter
- [ ] T023 [P] [US2] Create `ui/src/components/SaveStatus.tsx` — props: `status: 'idle' | 'debouncing' | 'saving' | 'saved' | 'retrying' | 'failed'`, `retryCountdown: number`, `onRetry: () => void`; render nothing when `idle` or `debouncing`; render "Saving…" when `saving`; render "Saved" with a checkmark when `saved`; render "Retrying in {retryCountdown}s" with a manual Retry button when `retrying`; render "Failed to save" with a Retry button only when `failed`
- [ ] T024 [US2] Create `ui/src/components/DeviceEventFields.tsx` — props: `control: Control` from react-hook-form; render a Radix `Select` for `trigger.deviceEvent.event` with options ONLINE, OFFLINE, HARDWARE_CHANGE; field is required
- [ ] T025 [US2] Create `ui/src/components/ThresholdFields.tsx` — props: `control: Control`; render Radix `Select` for metric (CPU, MEMORY, DISK) and operator (all 8 ComparisonOperator values); render number input for value (required, validated as float via Zod); render number input for duration (optional, validated as integer); show validation error messages inline below each field
- [ ] T026 [US2] Create `ui/src/components/ScheduleFields.tsx` — props: `control: Control`; render Radix `Select` for frequency (MINUTES, HOURS, DAYS); render number input for interval (required, integer 1–999, Zod validation); show validation error message below interval field
- [ ] T027 [US2] Create `ui/src/components/TriggerEditor.tsx` — props: `control: Control`, `onImmediateSave: () => void`; render a Radix `Select` for trigger type (Device Event / Threshold / Schedule); on type change: reset trigger fields to new type defaults in form state via `setValue`, call `onImmediateSave` immediately — no confirmation dialog; conditionally render `DeviceEventFields`, `ThresholdFields`, or `ScheduleFields` based on selected type (depends on T024, T025, T026)
- [ ] T028 [P] [US2] Create `ui/src/components/ConditionRow.tsx` — props: `control: Control`, `index: number`, `onRemove: () => void`, `onImmediateSave: () => void`; render text input for `field` (required non-empty after trim, Zod validation); Radix `Select` for `operator` (all 8 ComparisonOperator values, immediate save on change); text input for `value` (required); remove button (calls `onRemove` then `onImmediateSave`); inline validation error messages
- [ ] T029 [US2] Create `ui/src/components/ConditionGroupEditor.tsx` (flat, P2 version) — props: `control: Control`, `onImmediateSave: () => void`; use `useFieldArray` for `conditionGroup.conditions`; render Radix `Select` for root AND/OR operator (immediate save on change); render list of `ConditionRow` components; render "Add Condition" button (appends empty condition row, calls `onImmediateSave`); this component will be refactored in P3 to support recursion (depends on T028)
- [ ] T030 [P] [US2] Create `ui/src/components/ActionForm.tsx` — props: `control: Control`, `index: number`, `actionType: 'sendNotification' | 'runScript'`; if `sendNotification`: render textarea for recipients (comma-separated, each validated as Zod email, shown as tag-style inputs), text input for subject (required), textarea for body (required); if `runScript`: text input for script name (required, validated as valid filename — no path separators), text area for args (one per line, split to array), number input for timeout (optional integer); show validation errors inline
- [ ] T031 [US2] Create `ui/src/components/ActionsEditor.tsx` — props: `control: Control`, `onImmediateSave: () => void`; use `useFieldArray` for `actions`; wrap in `@dnd-kit/core` `DndContext` + `@dnd-kit/sortable` `SortableContext`; render each action in a `useSortable` wrapper showing drag handle, action type label, `ActionForm`, and remove button; on `DragEndEvent`: call `useFieldArray.move` to reorder, then call `onImmediateSave`; render "Add Action" button with Radix `Select` (Send Notification / Run Script) that appends the action with type defaults and calls `onImmediateSave`; remove button calls `useFieldArray.remove` then `onImmediateSave` (depends on T030)
- [ ] T032 [US2] Create `ui/src/components/AutomationMetadata.tsx` — props: `automationId: string`, `control: Control`, `automation: AutomationDetailFields fragment type`, `saveStatus`, `retryCountdown`, `onRetry`, `onImmediateSave`, `onDelete`; render: editable name text input (debounced save on change), editable description text input (debounced save), Radix `Switch` for enabled (immediate save on change, identical to list card toggle — FR-014), read-only trigger type summary string, `conditionsCount` badge, `actionsCount` badge, formatted `createdAt` and `updatedAt` dates, `SaveStatus` component; delete button that calls `onDelete` which fires `useDeleteAutomation`, navigates to `search: {}` on success (depends on T023)
- [ ] T033 [US2] Wire `ui/src/components/DetailPanel.tsx` as full rule builder — call `useAutomation(automationId)`; while loading show skeleton placeholders for metadata + trigger + conditions + actions sections (FR-019); on data: initialize `react-hook-form` `useForm` with automation data; P2 interim: form state stores `conditionGroup` as `{ operator: LogicalOperator, conditions: Array<{ field: string, operator: ComparisonOperator, value: string }> }`; at mutation time, build `ConditionGroupInput` inline: `{ operator, conditions: conditions.map(c => ({ condition: { field: c.field, operator: c.operator, value: c.value } })) }` (this interim transform is replaced by `uiTreeToApiInput` in T038); call `useUpdateAutomation` to get the mutation function; instantiate `useSaveQueue` with mutation function; on text field change call `saveQueue.saveDebounced(formValues)`; on immediate fields (toggle, select, add, remove) call `saveQueue.saveImmediate(formValues)`; compose `AutomationMetadata`, `TriggerEditor`, `ConditionGroupEditor`, and `ActionsEditor` within a single `<form>` element; delete from metadata calls `useDeleteAutomation` then `onClose` (depends on T020, T021, T022, T027, T029, T031, T032)
- [ ] T034 [US2] Add "New Automation" button to `ui/src/components/AutomationList.tsx` — call `useCreateAutomation()`; render a "New Automation" button in the list header; button is disabled while `createLoading` is true; on click: call `createAutomation` with defaults (name: "New Automation", enabled: false, trigger: `{ deviceEvent: { event: "ONLINE" } }`, conditionGroup: `{ operator: "AND", conditions: [] }`, actions: `[]`); on success: call `onSelect(newAutomation.id)` which triggers `navigate({ search: { id: newAutomation.id } })` in the parent (depends on T021, T017)

**Checkpoint**: All P2 acceptance scenarios (spec.md US2 scenarios 1–15) pass. Create, edit all field types, auto-save, retry on failure, reload persists all changes.

---

## Phase 5: User Story 3 — Nested Condition Tree (Priority: P3)

**Goal**: Replace the flat condition group with a recursive AND/OR tree at arbitrary depth. Implement the `UIConditionNode` type and `uiTreeToApiInput` pure transform. Ship unit tests for the transform.

**Independent Test**: Open any automation. Click "Add Group" inside the root condition group — verify a nested group appears with visual indentation. Add a condition to the nested group. Click "Add Group" again inside the nested group — verify depth-3 group appears. Remove the depth-2 group — verify it and its children disappear. Run `pnpm --filter @acme/ui test` — all transform unit tests pass.

### Tests for User Story 3

- [ ] T035 [P] [US3] Create `ui/src/__tests__/condition-tree.test.ts` — import `uiTreeToApiInput` and `apiTreeToUiNode` from `../types/condition-tree`; write tests: (1) empty tree — `uiTreeToApiInput({ type: 'group', operator: 'AND', children: [] })` produces `{ operator: 'AND', conditions: [] }`; (2) single condition — a group with one leaf produces `{ operator: 'AND', conditions: [{ condition: { field: 'f', operator: 'EQUALS', value: 'v' } }] }`; (3) flat group — 2 leaf conditions produce 2 `{ condition: {...} }` entries, no `type` or `id` fields in output; (4) nested group — AND > OR > AND three levels produce correctly wrapped `{ group: { operator: 'OR', conditions: [{ group: { operator: 'AND', conditions: [...] } }] } }` structure; (5) round-trip fidelity — `apiTreeToUiNode(seedGroup)` then `uiTreeToApiInput(result)` produces the equivalent `ConditionGroupInput` shape; run with `pnpm --filter @acme/ui test` and confirm tests FAIL before T036 is implemented

### Implementation for User Story 3

- [ ] T036 [US3] Create `ui/src/types/condition-tree.ts` — import `ComparisonOperator` and `LogicalOperator` enums from `../gql/graphql`; import `ConditionGroup` type from generated types; define `UIConditionLeaf = { type: 'condition'; id: string; field: string; operator: ComparisonOperator; value: string }`; define `UIConditionGroup = { type: 'group'; id: string; operator: LogicalOperator; children: UIConditionNode[] }`; define `UIConditionNode = UIConditionLeaf | UIConditionGroup`; implement `uiTreeToApiInput(node: UIConditionGroup): ConditionGroupInput` — recursively maps `children` to `ConditionEntryInput[]` by wrapping leaves as `{ condition: { field, operator, value } }` and nested groups as `{ group: uiTreeToApiInput(child) }` stripping `type` and `id` throughout; implement `apiTreeToUiNode(group: ConditionGroup): UIConditionGroup` — recursively maps `conditions` by checking `__typename`, assigns `crypto.randomUUID()` as client-side `id` for each node; confirm T035 tests now PASS (depends on T035)
- [ ] T037 [US3] Refactor `ui/src/components/ConditionGroupEditor.tsx` to recursive component — add props: `nestingDepth: number` (default 0), `isRoot: boolean` (default true), `onRemoveGroup?: () => void`; use `useFieldArray` scoped to the current group's `children` path in the form (using the `name` prop convention for nested arrays); render AND/OR Radix `Select` toggle (immediate save on change); render each child: if `type === 'condition'` render `ConditionRow`; if `type === 'group'` render a recursive `ConditionGroupEditor` with incremented `nestingDepth` and an `onRemoveGroup` callback; add left border + left padding (`pl-4 border-l-2 border-gray-200`) per depth level for visual indentation; "Add Condition" button: appends a new `UIConditionLeaf` with `crypto.randomUUID()` id and defaults, calls `onImmediateSave`; "Add Group" button: appends a new `UIConditionGroup` with `crypto.randomUUID()` id, operator AND, and one pre-populated empty `UIConditionLeaf`, calls `onImmediateSave`; "Remove" button: disabled when `isRoot === true` (root group cannot be removed — spec US3 scenario 5); when `!isRoot`: clicking Remove calls `onRemoveGroup()` then `onImmediateSave` (depends on T036, T029)
- [ ] T038 [US3] Integrate `uiTreeToApiInput` into the save pipeline in `ui/src/components/DetailPanel.tsx` — when building the `UpdateAutomationInput` payload in the `useSaveQueue` `mutateFn`, call `uiTreeToApiInput(formValues.conditionGroup)` to convert the `UIConditionGroup` form state to `ConditionGroupInput` before sending to the API; update `useForm` hydration call to use `apiTreeToUiNode(automation.conditionGroup)` as the initial value for `conditionGroup` (replaces the flat P2 interim transform in T033) (depends on T036, T033, T037)

**Checkpoint**: All P3 acceptance scenarios pass. `pnpm --filter @acme/ui test` shows all 5 transform tests green. 3-level nesting renders with correct indentation. Root group cannot be removed. Transform produces correct `ConditionGroupInput` shape on auto-save.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, type safety, and linting across all slices.

- [ ] T039 [P] Run `pnpm typecheck` from repo root — fix any TypeScript errors introduced across `ui/src/` (strict mode, no `any`, no `@ts-ignore`); common fixes: ensure all generated type imports use the correct fragment types, ensure `useSaveQueue` payload type matches `UpdateAutomationInput`
- [ ] T040 [P] Run `pnpm lint` from repo root — fix any oxlint violations in new files under `ui/src/`; run `pnpm fmt` to auto-format with oxfmt
- [ ] T041 End-to-end verification per `quickstart.md` — verify P1 slice (list renders, toggle persists, delete works, URL navigation, invalid ID cleared), P2 slice (create, configure trigger, add conditions, add actions, all auto-save, reload persists), P3 slice (3-level condition tree renders, add/remove at each depth, unit tests pass); confirm API error handling: stop server mid-save and verify retry countdown appears then "Failed to save" with functional Retry button

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion (codegen output must exist) — **BLOCKS all user stories**
- **US1 (Phase 3)**: Depends on Phase 2 completion
- **US2 (Phase 4)**: Depends on Phase 3 completion (uses P1 layout shell and hooks)
- **US3 (Phase 5)**: Depends on Phase 4 completion (extends P2's flat ConditionGroupEditor)
- **Polish (Phase 6)**: Depends on all story phases complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — no dependency on US2 or US3
- **US2 (P2)**: Depends on US1 layout shell and master-detail routing (T019)
- **US3 (P3)**: Depends on US2's `DetailPanel`, `ConditionGroupEditor`, and save pipeline (T033, T029)

### Within Each User Story

- Hooks before components that consume them
- Leaf components before composite components
- Composite components before route wiring
- Tests written before implementation (US3 only)

### Parallel Opportunities

Within **Phase 1**: T002, T003, T004, T005, T006 can all run in parallel. T007 runs after all complete.

Within **Phase 2**: T008, T009, T010, T011 run in parallel. T012 follows T008.

Within **Phase 3**: T013, T014, T015, T018 run in parallel. T016 follows T013–T015. T017 follows T010, T016. T019 follows T017, T018.

Within **Phase 4**: T020, T021 run in parallel. T024, T025, T026, T028, T030 run in parallel. T027 follows T024–T026. T029 follows T028. T031 follows T030. T023 is independent [P]. T032 depends on T023. T033 depends on T020 + T022 + T027 + T029 + T031 + T032. T034 follows T021 + T017.

Within **Phase 5**: T035 [P] and T036 are sequential (tests before impl). T037 follows T036. T038 follows T037 + T033.

---

## Parallel Example: Phase 1

```text
Parallel batch 1 (no dependencies):
  T001 Install runtime deps
  T002 Install dev deps
  T003 Create codegen.ts + add scripts
  T004 Configure vitest
  T005 Write queries.ts
  T006 Write mutations.ts

Sequential (after batch 1):
  T007 Run codegen
```

## Parallel Example: Phase 3 (US1)

```text
Parallel batch 1:
  T013 useAutomations.ts
  T014 useUpdateAutomation.ts
  T015 useDeleteAutomation.ts
  T018 DetailPanel.tsx (empty shell)

Sequential:
  T016 AutomationCard.tsx     ← needs T013–T015
  T017 AutomationList.tsx     ← needs T010, T016
  T019 routes/index.tsx       ← needs T017, T018
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: P1 independent test passes
5. Demo: list, toggle, delete, URL navigation all work

### Incremental Delivery

1. Setup + Foundational → infrastructure ready
2. US1 (Phase 3) → list view deployable, verify P1 acceptance scenarios
3. US2 (Phase 4) → full rule builder deployable, verify P2 acceptance scenarios
4. US3 (Phase 5) → nested conditions deployable, verify P3 + unit tests green
5. Polish (Phase 6) → typecheck + lint + end-to-end pass

---

## Notes

- `[P]` tasks operate on different files with no incomplete dependencies — safe to run in parallel
- `[Story]` label maps each task to its user story for traceability to spec.md acceptance scenarios
- Commit after each phase checkpoint using conventional commit format (e.g., `feat: add automation list view`)
- Stop at each **Checkpoint** line to validate before proceeding — each story is independently testable
- `api/` is read-only — do not modify any files under `api/src/`
- All hooks import `useQuery`/`useMutation` from `@apollo/client` and typed documents from `ui/src/gql/gql`; components MUST NOT import `@apollo/client` directly (FR-014)
- All interactive controls must use Radix UI primitives (FR-016); no custom div-based controls
