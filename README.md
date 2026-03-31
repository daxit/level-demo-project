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
