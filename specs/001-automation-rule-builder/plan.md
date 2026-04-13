# Implementation Plan: Automation Rule Builder

**Branch**: `001-automation-rule-builder` | **Date**: 2026-04-12 | **Spec**: `specs/001-automation-rule-builder/spec.md`
**Input**: Feature specification from `/specs/001-automation-rule-builder/spec.md`

## Summary

Build a React frontend for managing automation rules on an RMM platform. The UI consumes a fixed GraphQL API (`api/` package, read-only) and provides a Gmail-style master-detail layout for listing, creating, editing, and deleting automations. Each automation has a polymorphic trigger (Device Event / Threshold / Schedule), an ordered actions list (Send Notification / Run Script), and a recursive AND/OR condition tree. All edits auto-save — toggles and dropdowns immediately, text inputs after debounce — with mutation serialization per automation and exponential backoff retry.

Delivered in three sequential vertical slices, each independently deployable:
- **P1**: Automation list + toggle enabled + delete
- **P2**: Create + update + full rule builder (trigger, flat conditions, actions)
- **P3**: Nested condition tree with recursive groups + transform unit tests

## Technical Context

**Language/Version**: TypeScript 6.x (strict mode enabled), Node 24.x  
**Primary Dependencies**: React 19, Apollo Client 4, Tailwind CSS v4, TanStack Router, Vite 8  
**Storage**: Apollo Client InMemoryCache (server state); react-hook-form (form state); useState (transient UI)  
**Testing**: vitest 4.x — unit tests on `uiTreeToApiInput` transform only (Principle VI)  
**Target Platform**: Desktop web browsers (modern); no mobile/tablet  
**Project Type**: Web application — SPA frontend (`ui/`) + separate GraphQL API (`api/`, read-only)  
**Performance Goals**: N/A — single-user admin tool  
**Constraints**: No backend changes (Principle II); 4–6 hour budget (Principle VII); no Redux/Zustand (Principle III)  
**Scale/Scope**: ~3 seeded automations, single concurrent user, ~15 components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Notes |
|---|-----------|--------|-------|
| I | Generated Types as Source of Truth | PASS | `@graphql-codegen/cli` + `client-preset` generates all API types. Only `UIConditionNode` diverges (explicitly allowed). |
| II | Backend Boundary | PASS | All work in `ui/` package. `api/` directory and schema are untouched. |
| III | State Segregation | PASS | Apollo cache = server state. `react-hook-form` = form state. `useState` = transient UI (selection, panels). |
| IV | Strict TypeScript | PASS | `tsconfig.json` already has `"strict": true`. No `any` or `@ts-ignore` permitted. |
| V | Accessibility by Default | PASS | Radix UI primitives for select, dialog, switch. Semantic HTML elements throughout. |
| VI | Minimal Testing | PASS | Unit tests only on `uiTreeToApiInput` transform. No component tests, no Playwright, no Storybook. |
| VII | Simplicity | PASS | Libraries limited to constitution's locked list. No extra abstraction layers. |

**Gate result**: PASS — no violations. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-automation-rule-builder/
├── plan.md                        # This file
├── research.md                    # Phase 0: technology decisions
├── data-model.md                  # Phase 1: entity model from GraphQL schema
├── quickstart.md                  # Phase 1: developer setup guide
├── contracts/
│   └── graphql-operations.md      # Phase 1: UI ↔ API operation contracts
└── tasks.md                       # Phase 2 (/speckit.tasks — NOT created by /speckit.plan)
```

### Source Code (ui/ package)

```text
ui/
├── codegen.ts                              # GraphQL Code Generator config
├── package.json                            # Updated with new dependencies
├── tsconfig.json                           # Unchanged (strict already enabled)
├── vite.config.ts                          # Unchanged
└── src/
    ├── lib/
    │   ├── apollo.ts                       # Apollo Client: HttpLink, error link, InMemoryCache, possibleTypes
    │   └── cn.ts                           # clsx className merge utility
    ├── gql/                                # Codegen output (generated, committed)
    │   ├── fragment-masking.ts
    │   ├── gql.ts
    │   └── graphql.ts
    ├── graphql/
    │   ├── queries.ts                      # automations list + single automation query documents
    │   └── mutations.ts                    # create, update, delete mutation documents
    ├── hooks/
    │   ├── useAutomations.ts               # [P1] List query wrapper
    │   ├── useAutomation.ts                # [P2] Single automation query wrapper
    │   ├── useCreateAutomation.ts          # [P2] Create mutation wrapper
    │   ├── useUpdateAutomation.ts          # [P1] Update mutation (toggle) → [P2] full auto-save
    │   ├── useDeleteAutomation.ts          # [P1] Delete mutation wrapper with cache eviction
    │   └── useSaveQueue.ts                 # [P2] Mutation serialization + debounce + retry logic
    ├── types/
    │   └── condition-tree.ts               # [P3] UIConditionNode type + uiTreeToApiInput + apiTreeToUiNode
    ├── components/
    │   ├── AutomationList.tsx              # [P1] Card list with skeleton loading, error, empty states
    │   ├── AutomationCard.tsx              # [P1] Card: name, enabled toggle, trigger summary, counts, timestamp, delete
    │   ├── DetailPanel.tsx                 # [P1] Empty shell → [P2] full rule builder host
    │   ├── AutomationMetadata.tsx          # [P2] Header: editable name/desc, enabled toggle, counts, dates, save status
    │   ├── SaveStatus.tsx                  # [P2] Saving / Saved / Retrying (countdown) / Failed (Retry button)
    │   ├── TriggerEditor.tsx               # [P2] Trigger type Radix Select + inline type-specific fields
    │   ├── DeviceEventFields.tsx           # [P2] DeviceEvent trigger: event select
    │   ├── ThresholdFields.tsx             # [P2] Threshold trigger: metric, operator, value, duration
    │   ├── ScheduleFields.tsx              # [P2] Schedule trigger: frequency, interval
    │   ├── ActionsEditor.tsx               # [P2] @dnd-kit/sortable actions list + Add Action
    │   ├── ActionForm.tsx                  # [P2] Polymorphic: notification (recipients, subject, body) / script (name, args, timeout)
    │   ├── ConditionGroupEditor.tsx        # [P2] Flat condition group → [P3] recursive tree with nested useFieldArray
    │   ├── ConditionRow.tsx                # [P2] Single condition: field input, operator select, value input, remove
    │   └── SkeletonCard.tsx                # Skeleton placeholder for list loading (foundational, used by P1+)
    ├── routes/
    │   ├── __root.tsx                      # Updated: import pre-configured client from lib/apollo.ts
    │   └── index.tsx                       # Replaced: master-detail layout with selection state
    └── __tests__/
        └── condition-tree.test.ts          # [P3] uiTreeToApiInput vitest unit tests
```

**Structure Decision**: Frontend-only SPA in the existing `ui/` package. `api/` is untouched (Principle II). All new code lives under `ui/src/`. Generated types in `ui/src/gql/`. GraphQL operation documents in `ui/src/graphql/`. Custom hooks in `ui/src/hooks/` (Principle I architecture rule). Components in `ui/src/components/`.

## Routing

### Route Structure

The app has a single route (`/`). No additional route files are created. The detail panel is not a separate page — it is an in-page selection within the master-detail layout.

```text
routes/
├── __root.tsx          # Root layout: ApolloProvider
└── index.tsx           # Only route: full master-detail layout
```

### Selection via Search Params

The selected automation ID is stored in the URL as a search param: `/?id=<automationId>`. This is managed via TanStack Router's `validateSearch` + `useSearch` on the index route.

```ts
// routes/index.tsx — search param contract
export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search.id === 'string' ? search.id : undefined,
  }),
  component: IndexPage,
});
```

**Why search params over local `useState`**: Deep-linkable (share a URL directly to a specific automation), browser back/forward navigates between selections, reload restores the open panel. Aligns with how Gmail-style layouts work in practice (Gmail reflects selection in the URL). No additional route files or route nesting needed.

**Why search params over a nested route (`/$automationId`)**: Nested routes imply page-level navigation, which would require the layout to re-mount on selection and complicates the "list stays rendered as a compressed sidebar" pattern. Search params keep everything on one rendered layout.

### Navigation Patterns

| Action | Navigation call |
|--------|----------------|
| Select an automation card | `navigate({ search: { id: automation.id } })` |
| Close the detail panel | `navigate({ search: {} })` |
| Create new automation (auto-select) | `navigate({ search: { id: newAutomation.id } })` |
| Delete automation from detail panel | `navigate({ search: {} })` then list refetches |

### Reading Selection

```ts
function IndexPage() {
  const { id } = Route.useSearch();
  const navigate = useNavigate({ from: '/' });
  const isDetailOpen = id !== undefined;
  // ...
}
```

### P1 vs P2 Detail Panel Behaviour

- **P1**: `id` from search params is used to find the matching automation in the already-fetched list cache (by filtering the `automations` array). The detail panel shows a placeholder with the automation name. No separate `useAutomation` query.
- **P2**: `useAutomation(id)` query fetches full detail (trigger config, condition tree, action details) when `id` is present. The list query uses `AutomationListFields` (summary only); the detail query uses `AutomationDetailFields` (full). Both run independently.

## Library Installation

All dependencies installed in the `ui/` workspace:

```bash
# Runtime dependencies
pnpm --filter @acme/ui add \
  react-hook-form \
  @hookform/resolvers \
  zod \
  @radix-ui/react-select \
  @radix-ui/react-switch \
  @dnd-kit/core \
  @dnd-kit/sortable \
  @dnd-kit/utilities \
  date-fns \
  clsx

# Dev dependencies (codegen tooling)
pnpm --filter @acme/ui add -D \
  @graphql-codegen/cli \
  @graphql-codegen/client-preset \
  @parcel/watcher
```

**Scripts added to `ui/package.json`**:

```json
{
  "codegen": "graphql-codegen --config codegen.ts",
  "codegen:watch": "graphql-codegen --config codegen.ts --watch"
}
```

## Prerequisite: Codegen & Infrastructure Setup

Before any slice work begins:

| # | Task | Output |
|---|------|--------|
| 0.1 | Install all runtime + dev dependencies (see Library Installation above) | Updated `package.json` + `pnpm-lock.yaml` |
| 0.2 | Create `ui/codegen.ts` — schema via introspection at `http://localhost:4000/graphql`, documents: `src/graphql/**/*.ts`, output: `src/gql/` with `client` preset | `ui/codegen.ts` |
| 0.3 | Write GraphQL query documents in `ui/src/graphql/queries.ts` — `automations` (list) and `automation(id)` (detail) with full fragment coverage for all union types | `ui/src/graphql/queries.ts` |
| 0.4 | Write GraphQL mutation documents in `ui/src/graphql/mutations.ts` — `createAutomation`, `updateAutomation`, `deleteAutomation` | `ui/src/graphql/mutations.ts` |
| 0.5 | Run `pnpm codegen` (API server must be running) to generate typed operations | `ui/src/gql/` directory |
| 0.6 | Create `ui/src/lib/apollo.ts` — ApolloClient with HttpLink, `onError` link (console log operation name + error), InMemoryCache with `possibleTypes` for ConditionEntry, Trigger, Action unions | `ui/src/lib/apollo.ts` |
| 0.7 | Create `ui/src/lib/cn.ts` — `clsx` wrapper for conditional Tailwind classes | `ui/src/lib/cn.ts` |
| 0.8 | Update `ui/src/routes/__root.tsx` — import pre-configured client from `lib/apollo.ts` instead of inline setup | Updated `__root.tsx` |
| 0.9 | Strip boilerplate from `ui/src/routes/index.tsx` — replace with empty layout shell; refactor `ui/src/App.tsx` — strip placeholder content and wire as root component rendered by `main.tsx` (standard React convention) | Clean entry points |

## Slice P1: List + Toggle + Delete

**Goal**: Render all automations as cards. Toggle enabled state and delete from the list. Master-detail layout shell with empty detail placeholder.

**Independently deployable**: Yes — list is the app entry point, toggle and delete are complete interactions.

| # | Task | Output |
|---|------|--------|
| 1.1 | Create `useAutomations` hook — wraps `automations` query, returns `{ automations, loading, error }` | `hooks/useAutomations.ts` |
| 1.2 | Create `useUpdateAutomation` hook — wraps `updateAutomation` mutation, accepts `(id, input)`, returns `{ updateAutomation, loading }` | `hooks/useUpdateAutomation.ts` |
| 1.3 | Create `useDeleteAutomation` hook — wraps `deleteAutomation` mutation, evicts automation from cache on success | `hooks/useDeleteAutomation.ts` |
| 1.4 | Create `SkeletonCard` component — skeleton placeholder matching card dimensions (FR-019) | `components/SkeletonCard.tsx` |
| 1.5 | Create `AutomationCard` component — name, Radix Switch for enabled toggle (immediate mutation), trigger type summary, condition count, action count, relative timestamp (date-fns `formatDistanceToNow`), delete button | `components/AutomationCard.tsx` |
| 1.6 | Create `AutomationList` component — maps automations to cards, sorted by `updatedAt` descending; skeleton loading state (3–4 skeleton cards); error state with message; empty state with "create" prompt | `components/AutomationList.tsx` |
| 1.7 | Build master-detail layout in `index.tsx` — declare `validateSearch` to type the `id` search param; read `id` via `Route.useSearch()`; full-width list when `id` is undefined; compressed list (fixed 320px sidebar) + detail panel when `id` is set; card click calls `navigate({ search: { id } })`, close calls `navigate({ search: {} })` | `routes/index.tsx` |
| 1.8 | Create `DetailPanel` component — empty placeholder showing automation name; close button that clears selection | `components/DetailPanel.tsx` |
| 1.9 | Handle edge cases — API unreachable on load shows error (not empty state); toggle failure reverts switch and shows error; delete failure shows error; deleting last automation shows empty state | Integrated in components |

## Slice P2: Create + Update + Rule Builder

**Goal**: Full CRUD lifecycle. Create new automations. Inline editing with auto-save for all fields. Trigger configuration (3 types), flat condition group, actions list with drag-to-reorder.

**Independently deployable**: Yes — delivers complete rule management on top of P1's list.

| # | Task | Output |
|---|------|--------|
| 2.1 | Create `useAutomation` hook — wraps `automation(id)` query for single automation detail with full field coverage | `hooks/useAutomation.ts` |
| 2.2 | Create `useCreateAutomation` hook — wraps `createAutomation` mutation with defaults (name: "New Automation", enabled: false, trigger: DeviceEvent ONLINE, empty condition group, no actions); updates list cache; caller navigates to `?id=<newId>` on success | `hooks/useCreateAutomation.ts` |
| 2.3 | Build `useSaveQueue` hook — mutation serialization per automation; debounced saves (600ms) for text inputs; immediate saves for toggles/dropdowns/add/remove; exponential backoff retry (3 attempts: 2s/4s/8s); new edits cancel pending retry and restart cycle; save status state machine (idle → saving → saved / retrying → failed) | `hooks/useSaveQueue.ts` |
| 2.4 | Create `SaveStatus` component — displays "Saving…", "Saved", "Retrying in Xs" (with countdown + manual Retry), or "Failed to save" (manual Retry only) | `components/SaveStatus.tsx` |
| 2.5 | Create `AutomationMetadata` component — editable name (text input, debounced save), editable description (text input, debounced save), Radix Switch for enabled (immediate save), trigger type summary (read-only), conditions count, actions count, created date, updated date, save status indicator; delete button (fires mutation, closes panel, returns to full-width list) | `components/AutomationMetadata.tsx` |
| 2.6 | Create `TriggerEditor` component — Radix Select for trigger type (DeviceEvent/Threshold/Schedule); switching type discards existing config silently, renders new type defaults, fires immediate save | `components/TriggerEditor.tsx` |
| 2.7 | Create `DeviceEventFields` (event Radix Select), `ThresholdFields` (metric select, operator select, value number input, optional duration), `ScheduleFields` (frequency select, interval number input 1–999) — each with Zod validation | Trigger field components |
| 2.8 | Create flat `ConditionGroupEditor` — root AND/OR Radix Select toggle; list of `ConditionRow` components; "Add Condition" button; each add/remove fires immediate save | `components/ConditionGroupEditor.tsx` |
| 2.9 | Create `ConditionRow` — field text input (required non-empty, trimmed), operator Radix Select (all ComparisonOperator values), value text input, remove button | `components/ConditionRow.tsx` |
| 2.10 | Create `ActionsEditor` — `@dnd-kit/sortable` list of actions; "Add Action" button with Radix Select (Send Notification / Run Script); reorder fires immediate save; add/remove fires immediate save | `components/ActionsEditor.tsx` |
| 2.11 | Create `ActionForm` — polymorphic: SendNotification (recipients as comma-separated emails with Zod email validation, subject, body) or RunScript (script name with filename validation, optional args list, optional timeout) | `components/ActionForm.tsx` |
| 2.12 | Wire `DetailPanel` — single `react-hook-form` form wrapping the entire automation; `useFieldArray` for actions and conditions; hydrate from `useAutomation` query data; integrate `useSaveQueue` for all auto-save; skeleton loading on first open (FR-019) | Updated `components/DetailPanel.tsx` |
| 2.13 | Add "New Automation" button to list header — disabled while create mutation is in-flight; on success, auto-selects new automation and opens detail panel | Updated `components/AutomationList.tsx` |

## Slice P3: Nested Condition Tree

**Goal**: Replace flat condition group with recursive AND/OR tree at arbitrary depth. Pure transform function with unit tests.

**Independently deployable**: Yes — extends P2's flat conditions to full nesting.

| # | Task | Output |
|---|------|--------|
| 3.1 | Define `UIConditionNode` tagged union type — `{ type: 'condition'; id: string; field: string; operator: ComparisonOperator; value: string }` or `{ type: 'group'; id: string; operator: LogicalOperator; children: UIConditionNode[] }` | `types/condition-tree.ts` |
| 3.2 | Implement `uiTreeToApiInput(node: UIConditionNode): ConditionGroupInput` — strips `type` discriminant and client-side `id`; wraps each child as `{ condition: {...} }` or `{ group: {...} }` per `ConditionEntryInput` | `types/condition-tree.ts` |
| 3.3 | Implement `apiTreeToUiNode(group: ConditionGroup): UIConditionNode` — reverse transform for hydrating form from API response; generates client-side IDs | `types/condition-tree.ts` |
| 3.4 | Write vitest unit tests — empty tree (`{ operator: 'AND', conditions: [] }`), single condition, flat group, 3-level nested groups, round-trip fidelity (`apiTreeToUiNode → uiTreeToApiInput` produces equivalent API shape) | `__tests__/condition-tree.test.ts` |
| 3.5 | Refactor `ConditionGroupEditor` to recursive component — each group level has its own `useFieldArray`; AND/OR Radix Select toggle; "Add Condition" button; "Add Group" button (inserts nested group with AND default + one empty condition row); "Remove" button (disabled on root group); visual indentation via left border + padding per depth level | Updated `components/ConditionGroupEditor.tsx` |
| 3.6 | Integrate `uiTreeToApiInput` into save pipeline — call transform at mutation time in `useSaveQueue` or `DetailPanel`; form state uses `UIConditionNode`; API mutations receive `ConditionGroupInput` | Updated save integration |
| 3.7 | Verify: build 3-level tree (AND > OR > AND), confirm render with indentation, confirm add/remove at each level, run `pnpm test` for transform unit tests, inspect mutation payload matches `ConditionGroupInput` shape | Manual + automated verification |

## Complexity Tracking

> No Constitution Check violations. Table left empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
