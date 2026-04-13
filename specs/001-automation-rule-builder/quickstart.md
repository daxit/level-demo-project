# Quickstart: Automation Rule Builder

**Date**: 2026-04-12

## Prerequisites

- Node.js 24.x (see `.nvmrc` / `.node-version`)
- pnpm 10+ (`corepack enable && corepack prepare pnpm@10.33.0 --activate`)

## Initial Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start the API server

The API must be running before codegen or the UI dev server.

```bash
pnpm start:api
```

Verify: `http://localhost:4000/graphql` should open Apollo Sandbox / GraphQL playground.

The API serves seeded data (3 automations). Restarting the server resets all data.

### 3. Run GraphQL Code Generator (after Prerequisite slice is complete)

```bash
cd ui && pnpm codegen
```

This generates typed operations in `ui/src/gql/` from the running API's schema. Re-run after modifying any files in `ui/src/graphql/`.

For watch mode during development:
```bash
cd ui && pnpm codegen:watch
```

### 4. Start the UI dev server

```bash
pnpm dev:ui
```

Opens at `http://localhost:5173` (Vite default).

## Development Workflow

1. **API server** must be running in one terminal: `pnpm start:api`
2. **Codegen watch** (optional) in another terminal: `cd ui && pnpm codegen:watch`
3. **UI dev server** in another terminal: `pnpm dev:ui`

### Running Tests

Unit tests for the condition tree transform (P3 only):

```bash
cd ui && pnpm test
```

Or from root:

```bash
pnpm test
```

### Type Checking

```bash
pnpm typecheck
```

### Linting & Formatting

```bash
pnpm lint        # oxlint
pnpm fmt:check   # oxfmt dry-run
pnpm fmt         # oxfmt auto-fix
```

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `api/` | GraphQL API server (read-only, do not modify) |
| `ui/` | React frontend (all implementation work here) |
| `ui/src/gql/` | Generated types from codegen (committed) |
| `ui/src/graphql/` | GraphQL operation documents (queries, mutations) |
| `ui/src/hooks/` | Custom hooks wrapping Apollo operations |
| `ui/src/components/` | React components |
| `ui/src/lib/` | Apollo client config, utilities |
| `ui/src/types/` | UI-only types (condition tree) |
| `ui/src/__tests__/` | Unit tests (transform function only) |

## Verification per Slice

### P1: List + Toggle + Delete
1. Load `http://localhost:5173` — see 3 automation cards with skeleton loading
2. Toggle an enabled switch — verify immediate API call and persisted state on reload
3. Delete an automation — verify removal from list
4. Click a card — verify list compresses and empty detail panel appears

### P2: Create + Update + Rule Builder
1. Click "New Automation" — verify new card appears and detail panel opens
2. Edit name, wait 600ms — verify auto-save (check save status indicator)
3. Change trigger type — verify fields update and save fires immediately
4. Add actions, reorder by drag — verify persistence
5. Reload page — verify all changes persisted

### P3: Nested Condition Tree
1. Open an automation's detail panel
2. Click "Add Group" — verify nested group appears with indentation
3. Add conditions at multiple depth levels
4. Run `cd ui && pnpm test` — verify transform unit tests pass
