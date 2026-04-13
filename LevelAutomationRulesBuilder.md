# Level frontend take-home: Automation Rule Builder

## Overview

Level is a Remote Monitoring and Management (RMM) platform. One of our core features is automations — allowing IT teams to define rules that automatically respond to events across their managed devices.

Your task is to build a visual rule builder for creating and managing automation rules. Each rule follows the pattern:

**WHEN** [trigger] **IF** [conditions] **THEN** [actions]

We'll provide a mock GraphQL API with seeded data. You build the frontend.

## Getting started

1. Clone or fork the repository: `https://github.com/levelrmm/level-demo-project`
2. Install dependencies: `pnpm install`
3. Start the API server: `pnpm start:api`
4. GraphQL endpoint: `http://localhost:4000/graphql`
5. Explore the schema using Apollo Sandbox at the same URL

The API uses an in-memory data store seeded with sample automations. Restart the server to reset the data. The API simulates real-world conditions — expect variable response times and occasional mutation failures.

### Frontend setup

The repo includes a scaffolded UI in `ui/` with React, TypeScript, Vite, Apollo Client, Tailwind, and Tanstack Router already configured. You can start the dev server with `pnpm dev:ui`. Feel free to use this scaffold as-is, modify it (e.g., swap out Vite or Tanstack Router), or start your own project from scratch — just build against the provided API and stick to the given technical constraints (listed below).

## The domain

An **automation** has a name, description, enabled flag, a trigger, a condition tree, and one or more actions.

### Triggers

Triggers determine when an automation evaluates. The API defines three types:

- **Device Event** — fires when a device comes online, goes offline, or reports a hardware change
- **Threshold** — fires when a metric (CPU, memory, or disk usage) crosses a value for a specified duration
- **Schedule** — fires on a recurring interval (every N minutes, hours, or days)

### Conditions

Conditions determine whether the automation's actions should execute based on device state. Conditions are organized in groups combined with AND/OR logic. Groups can be nested to express complex rules. For example:

> environment is "production" **AND** (role is "database" **OR** (role is "web-server" **AND** region contains "us-"))

### Actions

Actions are what the automation does when triggered and conditions are met:

- **Send Notification** — sends an email to specified recipients with a subject and body
- **Run Script** — executes a named script with optional arguments and a timeout

## Requirements

Build a frontend application that provides:

1. **Automation list** — display all automations with relevant metadata
2. **Rule builder** — a visual editor for the condition tree supporting nested AND/OR groups. Users should be able to add, remove, and configure conditions and groups at any depth
3. **Trigger configuration** — type-specific UI for each trigger type. Selecting a trigger type should present the appropriate configuration fields
4. **Action configuration** — type-specific UI for each action type, with support for multiple actions per automation
5. **Mutations** — create, update, and delete automations via the GraphQL API
6. **Error handling** — handle API failures gracefully in the UI

## Technical constraints

- React
- TypeScript
- Apollo Client
- Tailwind CSS v4

Everything else — project setup, routing, state management, component libraries, design, folder structure — is your choice.

## What we care about

We care about the quality of what you build, not just that it works. We're looking for solutions that demonstrate strong engineering fundamentals and thoughtful design — one that feels like it was built by someone who takes pride in their craft and considers the people who will use what they build.

## Working with AI

You're encouraged to use AI coding assistants. This is how our team works and we want to see how you work with them.

We'll ask you to share your AI chat history as part of your submission. We're evaluating how you collaborate with AI as a part of this assignment.

## Submission

- A Git repository (GitHub, GitLab, etc.) with your **full commit history** — don't squash
- A README with setup instructions and any design decisions you want to call out
- An export of your AI chat history from whatever tool(s) you used

## Time

Plan for **4 to 6 hours**. If you finish the core requirements and have time left, you're welcome to add functionality that you think improves the feature. We value quality and judgment over quantity though so don't add features just to add them.

## What comes next

We'll schedule a review session where you'll walk us through your solution. There will also be a short hands-on exercise — details will be provided at the session.

If you have questions about the API or requirements, reach out to rick@level.io (CC josh@level.io).
