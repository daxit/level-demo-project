<!--
Sync Impact Report
- Version change: 0.0.0 → 1.0.0
- Modified principles: N/A (initial population)
- Added sections: Core Principles (7), Technology Stack & Architecture, UI Constraints & Git Workflow, Governance
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ no conflict (generic scaffold; Constitution Check section will reference these principles at plan time)
  - .specify/templates/spec-template.md — ✅ no conflict (generic scaffold)
  - .specify/templates/tasks-template.md — ✅ no conflict (generic scaffold; testing phase will reflect Principle VI at task generation time)
- Follow-up TODOs: None
-->

# Level Automation Rule Builder Constitution

## Core Principles

### I. Generated Types as Source of Truth

GraphQL Code Generator (`@graphql-codegen/cli` with `client-preset`) MUST be the
sole source of API types. Hand-rolled type definitions that duplicate the schema
are prohibited. No intermediary type-mapping layer is permitted except for the
condition tree UI state, which uses a local recursive type with a pure transform
function to convert between UI and API shapes at mutation time.

### II. Backend Boundary

The `api/` directory and the GraphQL schema it exposes are read-only. No changes
to resolvers, type definitions, seed data, or server configuration are permitted.
All work occurs in the `ui/` package. The API endpoint is
`http://localhost:4000/graphql`.

### III. State Segregation

Server state MUST live in the Apollo Client cache. Form state MUST be managed by
`react-hook-form` (with `useFieldArray` for the condition tree and actions list).
Transient UI state (drawers, selections, toggles) uses `useState` only. No Redux,
no Zustand, no other global state libraries are permitted.

### IV. Strict TypeScript

TypeScript strict mode MUST be enabled. The `any` type is prohibited everywhere —
source files, test files, and utility code. Escape hatches (`@ts-ignore`,
`@ts-expect-error` without an accompanying fix) are not allowed.

### V. Accessibility by Default

All interactive controls (selects, switches) MUST use Radix UI
primitives (`@radix-ui/react-select`, `@radix-ui/react-switch`) styled with
Tailwind v4. Semantic HTML elements MUST be
used where appropriate. Custom div-based controls that duplicate native semantics
are prohibited.

### VI. Minimal Testing, Maximum Confidence

Unit tests are required only on the condition tree transform function — a pure
function that converts between the local UI tree type and the generated API input
type. No component tests, no Playwright, no Storybook. The transform tests MUST
cover round-trip fidelity, nested groups, and edge cases (empty tree, single
condition).

### VII. Simplicity

YAGNI governs all decisions. No abstraction layers, wrapper components, or utility
libraries beyond what is explicitly listed in the stack. The project budget is 4–6
hours; every addition MUST justify its cost. Start with the simplest approach and
refactor only when a concrete problem emerges.

## Technology Stack & Architecture

### Locked Stack (do not modify or replace)

- **React** + **TypeScript** — UI framework
- **Apollo Client** — GraphQL client and cache
- **Tailwind CSS v4** — utility-first styling
- **TanStack Router** — file-based routing
- **Vite** — build tooling
- **oxlint** + **oxfmt** — linting and formatting
- **pnpm** monorepo — package management

### Additional Libraries

- `@graphql-codegen/cli` + `client-preset` — typed hooks and types from the local schema
- `zod` — runtime validation on all form inputs
- `react-hook-form` — form state management
- `@radix-ui/react-select`, `@radix-ui/react-switch` — accessible primitives
- `@dnd-kit/sortable` — drag-to-reorder for the actions list only
- `date-fns` — relative time formatting in the automation list
- `clsx` or a `cn` utility — conditional Tailwind class merging

### Architecture Rules

- All GraphQL queries and mutations MUST be wrapped in custom hooks under `hooks/`. Components MUST NOT import `@apollo/client` directly.
- Apollo error link middleware MUST be configured for global console logging. Mutation-specific UX responses use local `onError` handlers.
- Generated types from GraphQL Code Generator are canonical. No hand-rolled API types exist outside the condition tree UI state divergence described in Principle I.

### Out of Scope — Explicitly Excluded

- Backend changes of any kind
- Pagination, server-side sorting, filtering
- Audit trail / history
- Queue systems for email or script execution

## UI Constraints & Git Workflow

### Layout

- Gmail-style master-detail: list compresses to a fixed width when an automation is selected.
- WHEN / IF / THEN single-page rule builder — no tabs separating trigger, conditions, and actions.
- Progressive disclosure: trigger, condition, and action configs are all edited inline in the detail panel — no separate drawers or modals.
- Enabled toggle is a standalone interaction and MUST NOT require opening the rule builder.

### Loading States

Skeleton placeholder UI MUST be used for **initial content loads only** — when
a location in the UI has no content yet because the data has not arrived for
the first time (e.g., the automation list on app boot, the detail panel when
an automation is first selected). Spinners are prohibited as a replacement for
skeletons in these cases.

In-place mutation feedback (save status indicator, toggle state change, inline
field updates) MUST NOT use skeletons. Content that is already visible MUST
remain visible during updates — skeletons MUST NOT replace existing content
during a save cycle. Use the save status indicator for mutation feedback.

### Branch Naming

```
feat/short-description
fix/short-description
chore/short-description
refactor/short-description
```

Lowercase, hyphen-separated, no slashes beyond the prefix.

### Commit Format

Conventional commits, lowercase, imperative tense, no trailing period:

```
feat: add automation list view
fix: correct threshold duration conversion
chore: configure graphql codegen
refactor: extract condition tree transform
```

Each commit represents a complete vertical slice with clear scope.

### Pull Request Convention

Title matches the branch prefix and description in title case. Body contains:

- **What** — one sentence describing what was built or changed
- **Why** — one sentence on the decision or tradeoff worth calling out
- **How to test** — steps to verify locally, including required API state

## Governance

This constitution supersedes ad-hoc decisions. All implementation work MUST
comply with the principles above. If a principle blocks progress, the principle
MUST be amended here first — not silently bypassed.

Versioning follows semantic versioning:
- **MAJOR** — principle removed or redefined incompatibly
- **MINOR** — new principle or section added, or material expansion
- **PATCH** — wording clarifications, typo fixes

**Version**: 1.2.1 | **Ratified**: 2026-04-12 | **Last Amended**: 2026-04-12
