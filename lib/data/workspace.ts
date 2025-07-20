import type { Run, RunDetail, RecoveryItem, Workflow } from "@/types/runs";

export const WORKSPACE = { name: "Northfield Supply", watchedWorkflows: 61 };

/** Reference "now" for the demo workspace: a weekday morning, Pacific time. */
export const DEMO_NOW = "2026-09-24T16:14:00Z";

export const TODAY_STATS = { runs: 3482, failed: 4, autoRecovered: 27 };

/** Latest runs across every connected source, newest first. */
export const RECENT_RUNS: readonly Run[] = [
  {
    number: 48219,
    workflowId: "wf_order_erp",
    workflow: "Order → ERP sync",
    source: "zapier",
    status: "failed",
    summary: "Step 4 of 6 · Create sales order",
    startedAt: "2026-09-24T16:12:00Z",
    failedStep: 4,
    totalSteps: 6,
    httpStatus: 429,
  },
  {
    number: 48218,
    workflowId: "wf_lead_crm",
    workflow: "Inbound lead → CRM",
    source: "make",
    status: "recovered",
    summary: "Retried once, 38s backoff",
    startedAt: "2026-09-24T16:08:00Z",
  },
  {
    number: null,
    workflowId: "wf_invoice_pdf",
    workflow: "Invoice PDF → shared drive",
    source: "make",
    status: "missed",
    summary: "Expected by 09:00, nothing yet",
    startedAt: "2026-09-24T16:03:00Z",
  },
  {
    number: 48216,
    workflowId: "wf_inventory_export",
    workflow: "Nightly inventory export",
    source: "n8n",
    status: "succeeded",
    summary: "1,204 rows written",
    startedAt: "2026-09-24T16:00:00Z",
  },
  {
    number: 48215,
    workflowId: "wf_payout",
    workflow: "Payout received",
    source: "webhook",
    status: "succeeded",
    summary: "Signature verified",
    startedAt: "2026-09-24T15:53:00Z",
  },
  {
    number: 48214,
    workflowId: "wf_onboarding",
    workflow: "Customer onboarding",
    source: "n8n",
    status: "running",
    summary: "Step 2 of 5",
    startedAt: "2026-09-24T16:14:00Z",
  },
];

export const WORKFLOWS: readonly Workflow[] = [
  {
    id: "wf_order_erp",
    name: "Order → ERP sync",
    source: "zapier",
    owner: "Priya S.",
    tags: ["Fulfillment", "Finance"],
    schedule: { kind: "rate", label: "~40/h", perHour: 40 },
    health: "incident",
    note: "3 failures in 1h",
  },
  {
    id: "wf_invoice_pdf",
    name: "Invoice PDF → shared drive",
    source: "make",
    owner: "Jen O.",
    tags: ["Finance"],
    schedule: { kind: "daily", label: "09:00", at: "09:00", timezone: "America/Los_Angeles" },
    health: "missed",
    note: "last success 26h ago",
  },
  {
    id: "wf_lead_crm",
    name: "Inbound lead → CRM",
    source: "make",
    owner: "Marcus T.",
    tags: ["Sales ops"],
    schedule: { kind: "rate", label: "~12/h", perHour: 12 },
    health: "healthy",
    note: "99.4% success, 7d",
  },
  {
    id: "wf_inventory_export",
    name: "Nightly inventory export",
    source: "n8n",
    owner: "Luis A.",
    tags: ["Fulfillment"],
    schedule: { kind: "daily", label: "02:00", at: "02:00", timezone: "America/Los_Angeles" },
    health: "healthy",
    note: "ran 02:00, 1,204 rows",
  },
  {
    id: "wf_payout",
    name: "Payout received",
    source: "webhook",
    owner: "Finance",
    tags: ["Finance"],
    schedule: { kind: "event", label: "event" },
    health: "healthy",
    note: "signatures verified",
  },
  {
    id: "wf_refunds",
    name: "Refund approvals",
    source: "zapier",
    owner: "Priya S.",
    tags: ["Finance"],
    schedule: { kind: "event", label: "event" },
    health: "paused",
    note: "paused by owner",
  },
];

export const FAILED_RUN: RunDetail = {
  ...RECENT_RUNS[0]!,
  trigger: "new paid order",
  recordId: "SO-20931",
  owner: "Priya S. · Ops",
  steps: [
    { index: 1, name: "Trigger · Order paid", status: "succeeded", detail: "Payload captured, 2.1 KB", durationMs: 120 },
    { index: 2, name: "Look up customer", status: "succeeded", detail: "Matched account ACC-7781", durationMs: 340 },
    { index: 3, name: "Map line items", status: "succeeded", detail: "3 items, tax applied", durationMs: 18 },
    { index: 4, name: "Create sales order", status: "failed", detail: "ERP API rejected the request", durationMs: 1900 },
    { index: 5, name: "Send confirmation email", status: "pending", detail: "Held until step 4 succeeds", durationMs: null },
  ],
  error: {
    httpStatus: 429,
    message: "Too Many Requests",
    retryAfterSeconds: 60,
    attempts: 3,
    maxAttempts: 3,
    idempotencyKey: "so-20931-a4f2",
  },
};

export const RECOVERY_QUEUE = {
  incident: "ERP rate limit",
  runs: 14,
  throttle: "1 run every 8s",
  items: [
    { runNumber: 48219, recordId: "SO-20931", status: "recovered", detail: "Sales order created on attempt 1" },
    { runNumber: 48211, recordId: "SO-20927", status: "recovered", detail: "Duplicate check passed, key so-20927-91bc" },
    {
      runNumber: 48204,
      recordId: "SO-20922",
      status: "replaying",
      detail: "Step 4 of 6 · create sales order",
      progress: 0.62,
    },
    {
      runNumber: 48198,
      recordId: "SO-20917",
      status: "needs_review",
      detail: "Customer record changed since the original run",
    },
  ] satisfies RecoveryItem[],
  remaining: 10,
  remainingProgress: 0.22,
  eta: "Estimated finish in about 2 minutes",
};

/** Trigger payload stored with run #48219 (what a replay re-sends unless edited). */
export const FAILED_RUN_PAYLOAD: Record<string, unknown> = {
  order_id: "SO-20931",
  customer_id: "ACC-7781",
  currency: "USD",
  total: 248.4,
  line_items: 3,
  paid_at: "2026-09-24T16:11:52Z",
};

/** Snapshot of the customer record taken when the run started. */
export const FAILED_RUN_RECORD: Record<string, unknown> = {
  id: "ACC-7781",
  name: "Harlow Outdoor Co.",
  terms: "NET30",
  ship_to: "4410 Alder St, Portland OR",
};
