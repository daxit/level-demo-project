# Research: Automation Rule Builder

**Date**: 2026-04-12  
**Status**: Complete  
**Input**: Technical Context from `plan.md`, constitution principles, existing codebase

## R1: GraphQL Code Generator Setup

**Decision**: Use `@graphql-codegen/cli` with `client-preset`, schema via introspection against the running API server.

**Rationale**: The schema is defined as a template literal in `api/src/schema.ts` (read-only). Introspection against `http://localhost:4000/graphql` is the simplest approach — no schema file to maintain or sync. The API server must be running anyway for development, so this adds no extra burden. The `client-preset` generates typed document nodes, fragment masking, and all necessary types from the schema.

**Alternatives considered**:
- Extract SDL to a standalone `.graphql` file in `ui/`: Adds a file that must stay in sync with `api/src/schema.ts`. Since the schema is fixed and the API is read-only, this sync burden has no upside. Rejected per Principle VII (YAGNI).
- Use `typescript` + `typescript-operations` presets separately: More granular control but more config. `client-preset` bundles these with better defaults. Rejected for simplicity.

**Configuration**:
```ts
// ui/codegen.ts
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',
  documents: ['src/graphql/**/*.ts'],
  generates: {
    './src/gql/': {
      preset: 'client',
    },
  },
};

export default config;
```

**Watch mode**: `@parcel/watcher` as dev dependency enables `--watch` flag for codegen during development. Regenerates types when `src/graphql/**/*.ts` files change.

## R2: Apollo Client Cache Configuration

**Decision**: Configure `InMemoryCache` with hardcoded `possibleTypes` for the three GraphQL union types. Use `from` + `ApolloLink.concat` for error link composition.

**Rationale**: The schema has three unions (`ConditionEntry`, `Trigger`, `Action`). Apollo Client requires `possibleTypes` to correctly resolve fragments on union types in the cache. Since the schema is fixed, hardcoding is simpler than auto-generating from introspection at runtime. The error link middleware (`onError`) logs all GraphQL and network errors with the operation name to the console (FR-015). Mutation-specific error handling uses local `onError` callbacks per hook.

**Alternatives considered**:
- Auto-generate `possibleTypes` from introspection at build time: Adds a build step and a generated file for 3 static unions. Rejected per Principle VII.
- Skip `possibleTypes` entirely: Would break fragment matching on union types in cache reads. Not viable.

**possibleTypes map**:
```ts
{
  ConditionEntry: ['Condition', 'ConditionGroup'],
  Trigger: ['DeviceEventTrigger', 'ThresholdTrigger', 'ScheduleTrigger'],
  Action: ['SendNotificationAction', 'RunScriptAction'],
}
```

## R3: Mutation Serialization & Auto-Save Architecture

**Decision**: Custom `useSaveQueue` hook using refs + `setTimeout` for debounce, in-flight tracking, and retry. No RxJS for this specific use case.

**Rationale**: The save queue requirements are (FR-006, FR-007, FR-018):
1. Text inputs debounce 600ms before saving
2. Toggles/dropdowns/add/remove save immediately (flush pending debounce)
3. Mutations for the same automation are serialized (one in-flight at a time)
4. Failed mutations retry with exponential backoff: 3 attempts at 2s/4s/8s
5. New edits cancel pending retries and restart the save cycle
6. Save status state machine: idle → saving → saved / retrying → failed

Although `rxjs` is in the project dependencies, a custom hook with `useRef` for timers and a simple state machine is more transparent and easier to debug for this constrained use case. The queue is per-detail-panel (only one automation edited at a time), so there's no global coordination needed.

**Alternatives considered**:
- RxJS `Subject` + `concatMap` + `retryWhen`: Powerful but adds conceptual overhead for a single-consumer queue. The retry cancellation on new edit is awkward to express in RxJS. Rejected for readability.
- Global mutation queue manager: Over-engineering for single-automation-at-a-time editing. Rejected per Principle VII.

**State machine**:
```
idle ──(edit)──→ debouncing ──(timer)──→ saving ──(success)──→ saved ──(3s)──→ idle
                     ↑                     │
                     │                  (failure)
                     │                     ↓
                     └──(new edit)── retrying ──(exhausted)──→ failed
                                       │                         │
                                       └──(retry success)──→ saved
                                                          (manual retry)──→ saving
```

## R4: React Hook Form with Nested Structures

**Decision**: Single `useForm` per automation in `DetailPanel`. `useFieldArray` for the actions list and the condition tree. Condition tree uses nested `useFieldArray` at each group level (P3).

**Rationale**: `react-hook-form` is mandated by Principle III. The form wraps the entire automation state. `useFieldArray` handles ordered lists (actions) and the flat condition list (P2). In P3, the recursive `ConditionGroupEditor` component creates a nested `useFieldArray` per group depth. Form state uses the `UIConditionNode` type; the `uiTreeToApiInput` transform converts to `ConditionGroupInput` at mutation time.

**Alternatives considered**:
- Separate forms per section (trigger, conditions, actions): Fragments the save logic and complicates the serialized mutation queue. Rejected.
- Manual state management with `useState` for conditions: Violates Principle III (form state must be `react-hook-form`). Not viable.

## R5: Drag-to-Reorder for Actions

**Decision**: `@dnd-kit/sortable` with `useSortable` per action item. Reorder triggers immediate save (flush debounce, update form state, fire mutation).

**Rationale**: `@dnd-kit` is the constitution's specified library for drag-to-reorder. The `sortable` preset provides `SortableContext` + `useSortable` for ordered lists. On drag end, the `useFieldArray` `move` method reorders items, and the immediate-save path fires the mutation with the new action order.

**Alternatives considered**:
- `react-beautiful-dnd`: Deprecated, not in the constitution's stack. Not viable.
- Manual drag implementation: Accessibility issues, reinvents the wheel. Rejected.

## R6: Radix UI Primitives Styling with Tailwind v4

**Decision**: Use unstyled Radix UI primitives (`@radix-ui/react-select`, `@radix-ui/react-dialog`, `@radix-ui/react-switch`) styled exclusively with Tailwind v4 utility classes. No Radix Themes.

**Rationale**: Principle V mandates Radix primitives for accessibility. Tailwind v4 is the styling system (constitution locked stack). Radix primitives are unstyled — they provide accessible behavior (keyboard navigation, ARIA attributes, focus management) while Tailwind provides visual styling. This avoids any CSS-in-JS runtime.

**Alternatives considered**:
- Radix Themes: Adds a pre-built design system on top of primitives. Not in the stack, adds bundle weight. Rejected per Principle VII.
- shadcn/ui: Builds on Radix + Tailwind but adds a component library to maintain. Not in the constitution's stack. Rejected.

## R7: Date Formatting

**Decision**: `date-fns` `formatDistanceToNow` for relative timestamps in the automation list cards (e.g., "5 minutes ago", "2 hours ago").

**Rationale**: `date-fns` is in the constitution's additional libraries list. `formatDistanceToNow` provides human-readable relative time with no configuration. Tree-shakeable — only the used function is bundled.

**Alternatives considered**:
- Native `Intl.RelativeTimeFormat`: Requires manual calculation of the time unit. More code for the same result. Rejected for simplicity.
- `dayjs` or `moment`: Not in the constitution's stack. Not viable.
