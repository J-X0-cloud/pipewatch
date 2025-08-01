# Pipewatch

Monitoring, alerting and failed-run recovery for Zapier, Make, n8n and webhook automations.

**Live demo:** https://www.freelancerportfoliohub.com/jameslee/projects/pipewatch/index.html

![Preview](docs/preview.webp)

## Overview

Pipewatch watches the business automations that quietly move orders, leads and invoices between tools. Run history
from every platform is normalised into one health model with three signals (failures, missed heartbeats and outcome
checks), alerts go to a named owner, failed runs can be replayed from the step that broke, and every action lands in a
hash-chained audit log.

This repository contains the marketing site, the product UI it showcases, and the ingest, replay and heartbeat API.

## Features

- **Run history components**: live run table with source badges and status, workflow health list with tag filters,
  step-level run timeline with Skip step / Edit payload / Replay, and a throttled bulk recovery queue with pause and
  resume
- **Run model** (`lib/runs.ts`): status and health vocabularies, the normalised `RunEvent` shape, and health
  evaluation from recent runs plus schedules (rate, daily at a local time, or event-driven)
- **Webhook ingest** (`POST /api/webhooks/:source`): zod-validated adapters for Zapier, Make, n8n Error Trigger and a
  generic signed webhook; token or HMAC-SHA256 verification with a five-minute replay window; idempotent on
  `(source, run ID)`
- **Replay service** (`lib/replay.ts`): replay plans that reuse stored step outputs, stable idempotency keys,
  payload diffs, drift detection that holds a run for review, and a throttled `RecoveryQueue`
- **Audit log** (`lib/audit.ts`): append-only, SHA-256 hash-chained entries with chain verification
- **Heartbeats** (`/api/heartbeats/:workflow`): ping URL for cron jobs and scripts

## Tech stack

- [Next.js 15](https://nextjs.org/) App Router, React 19, TypeScript (strict)
- [zod](https://zod.dev/) for payload and request validation
- Node `crypto` for HMAC verification, idempotency keys and the audit hash chain
- Plain CSS design system in `app/globals.css`, Inter self-hosted

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

| Variable                   | Description                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------ |
| `PIPEWATCH_WEBHOOK_SECRET` | `x-pipewatch-token` for Zapier/Make/n8n, and the HMAC key for signed custom webhooks |

### Sending a run event

```bash
BODY='{"workflow":"payout-received","runId":"r_1042","status":"failed","startedAt":"2026-09-24T16:00:00Z"}'
TS=$(date +%s)
SIG=$(printf '%s' "$TS.$BODY" | openssl dgst -sha256 -hmac "$PIPEWATCH_WEBHOOK_SECRET" | awk '{print $2}')

curl -X POST http://localhost:3000/api/webhooks/webhook \
  -H "x-pipewatch-signature: t=$TS,v1=$SIG" \
  -H "Content-Type: application/json" \
  -d "$BODY"
```

### Planning a replay

```bash
curl -X POST http://localhost:3000/api/runs/48219/replay \
  -H "Content-Type: application/json" \
  -d '{"fromStep":4,"actor":"Priya S."}'
```

## Project structure

```
app/
  page.tsx, product/, recovery/, security/, pricing/   marketing pages
  api/webhooks/[source]/                              run-event ingest
  api/runs/[number]/replay/                           replay planning
  api/heartbeats/[workflow]/                          heartbeat pings
  globals.css
components/
  runs/        RunHistory, RunHistoryTable, WorkflowHealthList, RunTimeline, RecoveryQueueView, AlertCard
  alerts/      AlertRuleList, SlackNotification, AlertingPreview
  audit/       AuditLog
  marketing/   page sections (PageHero, Feature, InfoCards, CompareTable…)
  site/, ui/   header, footer, icons and primitives
lib/
  runs.ts      run and health model
  webhooks.ts  signature verification and source adapters
  replay.ts    replay planning and recovery queue
  audit.ts     hash-chained audit log
  store.ts     run store
  data/        workspace demo data and site content
types/         runs, alerts, audit
public/        favicon, fonts
```

## Scripts

| Script           | Description                      |
| ---------------- | -------------------------------- |
| `pnpm dev`       | Start the dev server (Turbopack) |
| `pnpm build`     | Production build                 |
| `pnpm start`     | Serve the production build       |
| `pnpm lint`      | ESLint                           |
| `pnpm typecheck` | TypeScript, no emit              |
| `pnpm format`    | Prettier                         |
