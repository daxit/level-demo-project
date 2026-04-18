# Level Test Repo

## Overview

Level is a Remote Monitoring and Management (RMM) platform. One of our core features is automations — allowing IT teams to define rules that automatically respond to events across their managed devices.

## Project Structure

This is a pnpm monorepo with two packages:

- **`api/`** — GraphQL API (Apollo Server) with seeded automation data
- **`ui/`** — Your frontend goes here. Currently scaffolded with React, Typescript, Vite, Apollo Client, Tailwind, and Tanstack Router, but you're welcome to replace Vite and Tanstack Router with whatever you're most comfortable using/will help you move fastest.

## Prerequisites

- Node.js 24.x
- pnpm 10+

## Getting Started

```sh
pnpm install
```

Start the API server (runs on http://localhost:4000):

```sh
pnpm start:api
```

Start the UI dev server:

```sh
pnpm dev:ui
```

## Available Scripts

| Command          | Description                    |
| ---------------- | ------------------------------ |
| `pnpm start:api` | Start the GraphQL API server   |
| `pnpm dev:ui`    | Start the UI dev server        |
| `pnpm typecheck` | Type-check both packages       |
| `pnpm test`      | Run tests across both packages |
| `pnpm fmt`       | Format code                    |
| `pnpm lint`      | Lint code                      |

## Project Structure

```
ui/
├── codegen/graphql/       # .graphql documents (queries, mutations, fragments)
├── src/
│   ├── components/        # Presentational React components
│   ├── hooks/             # All data-fetching, mutation, and form logic
│   ├── gql/               # Generated types from graphql-codegen
│   ├── types/             # Hand-written types (condition tree)
│   ├── utilities/         # Pure transform and validation functions
│   ├── lib/               # Apollo client setup, utility functions
│   └── routes/            # TanStack Router file-based routes
api/
├── src/                   # Apollo Server with in-memory data store
```

## Design Decisions

### Auto-Save for Frictionless Editing

There is no Save button. All changes auto-save to provide a frictionless experience for admins who may be managing dozens of rules. Inputs save with debounce (1.5s) before firing a mutation. A save status indicator in the detail panel shows **Saving...**, **Saved**, **Retrying in Xs**, or **Failed to save** with a manual Retry action.

The auto-save pipeline (`useSaveQueue`) serializes mutations per automation — while one is in-flight, the next is queued. If a save fails, exponential backoff retries at 2s / 4s / 8s before surfacing a failure. Any new user edit cancels pending retries and restarts the cycle with the latest form state, so the most recent input always wins.

### Presentational Components + Hook-Based Logic

Components are kept presentational wherever possible. Core logic — data fetching, optimistic updates, form state management, save orchestration — lives in custom hooks under `hooks/`. This separation makes side effects easy to trace: `useAutomationCard` owns toggle/delete logic for the list, `useAutomationForm` + `useSaveQueue` own the detail panel lifecycle, and components receive pre-computed props. It also makes the codebase easier to test — the condition tree transform and validation functions are pure and independently testable.

### URL-Based Selection Instead of Separate Pages

The app has only two visual states: full-width list and list-sidebar + detail panel. Rather than creating separate routes, the selected automation is encoded as a `?id=` search parameter. This keeps routing minimal (a single index route) while still supporting deep-linking, browser back/forward, and shareable URLs. TanStack Router's `validateSearch` handles type-safe parsing of the search param.

### Inline "Natural Language" Editing Pattern

Triggers and conditions render as inline sentence fragments ("When a device goes **offline**", "If **all** of the following are true") with embedded Radix Select dropdowns and number inputs styled to blend into the text. This makes rules scannable and self-documenting without needing separate form labels for every field.

### Recursive Condition Tree with Tagged Union

The condition tree uses a local `UIConditionNode` discriminated union (`type: 'condition' | 'group'`) for form state, which maps naturally to `react-hook-form`'s `useFieldArray` at each nesting level. A pure `uiTreeToApiInput` function converts this to the API's wrapper-object format (`{ condition: {...} } | { group: {...} }`) at mutation time. This keeps the form state ergonomic while matching the GraphQL schema exactly at the boundary. The transform is the primary target of unit tests.

### Library Choices

- **react-hook-form** — Uncontrolled form performance is critical with deeply nested condition trees and frequent auto-saves. The `watch` subscription drives the save pipeline without re-rendering the entire form.
- **Radix UI** (Select, Switch) — Accessible primitives without opinionated styling, paired with Tailwind v4 for consistent design.
- **dnd-kit** — Lightweight drag-and-drop for action reordering with good React 19 compatibility.
- **graphql-codegen** (client preset) — Full type safety from `.graphql` documents through to component props with fragment masking.
- **date-fns** — Tree-shakeable date formatting for relative timestamps.
- **zod** — Email validation in the recipient chip input.

### Known Limitations

- The GraphQL condition tree query is manually nested to ~5 levels deep. The UI allows unlimited nesting, but conditions deeper than 5 levels won't round-trip through a page reload. This is a fundamental GraphQL limitation with recursive union types.
- The API has a 10% random mutation failure rate by design. The retry mechanism handles this gracefully, but rapid editing during API instability can briefly show stale save statuses.
