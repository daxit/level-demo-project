# @acme/api

Mock GraphQL API with a basic automations schema. Runs an Apollo Server on port 4000 with seeded in-memory data.

## Running

```sh
# from the repo root
pnpm start:api

# or from this directory
pnpm start
```

The server starts at http://localhost:4000. Apollo Server's landing page includes an embedded GraphQL explorer you can use to browse the schema and run queries.

## Schema

### Core Types

An **Automation** contains:

- **Trigger** — what starts the rule (one of):
  - `DeviceEventTrigger` — fires on a device event (`ONLINE`, `OFFLINE`, `HARDWARE_CHANGE`)
  - `ThresholdTrigger` — fires when a metric (`CPU`, `MEMORY`, `DISK`) crosses a threshold
  - `ScheduleTrigger` — fires on a recurring schedule
- **ConditionGroup** — nested conditions that must be met (supports `AND`/`OR` groups with arbitrary nesting depth)
- **Actions** — what to do when triggered (one or more of):
  - `SendNotificationAction` — send an email notification
  - `RunScriptAction` — execute a script on the device

### Queries

```graphql
automations: [Automation!]!
automation(id: ID!): Automation
```

### Mutations

```graphql
createAutomation(input: CreateAutomationInput!): Automation!
updateAutomation(id: ID!, input: UpdateAutomationInput!): Automation!
deleteAutomation(id: ID!): DeleteAutomationResult!
```

## Seed Data

The API starts with three automations of increasing condition complexity:

1. **High CPU Alert** — flat conditions (no nesting)
2. **Disk Space Management** — 2 levels of condition nesting
3. **Critical Infrastructure Monitor** — 3 levels of condition nesting
