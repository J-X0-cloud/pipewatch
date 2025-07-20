import type { IconName } from "@/components/ui/icons";

export interface InfoCard {
  icon: IconName;
  tone?: "red" | "amber" | "blue";
  title: string;
  body: string;
  footnote?: string;
}

export const PROBLEMS: readonly InfoCard[] = [
  {
    icon: "muted",
    tone: "red",
    title: "Silent failures",
    body: "A scenario gets switched off, a token expires, a schedule stops firing. Nothing errors, so nothing alerts.",
    footnote: "“The Monday report just… didn’t run for three weeks.”",
  },
  {
    icon: "halfDone",
    tone: "amber",
    title: "Half-finished runs",
    body: "Step three succeeds, step four hits a rate limit. Now you have a charge with no order and no clean way to finish it.",
    footnote: "“We rebuilt 40 orders by hand from the payment export.”",
  },
  {
    icon: "noOwner",
    tone: "blue",
    title: "No one owns it",
    body: "Error emails land in a shared inbox nobody reads. When something is fixed, there’s no record of who did what, or why.",
    footnote: "“Who re-ran this? And did it double-bill anyone?”",
  },
];

export const HOW_IT_WORKS: readonly { label: string; title: string; body: string }[] = [
  {
    label: "01 · CONNECT",
    title: "Link your accounts",
    body: "Connect Zapier, Make or n8n with an API key, or point any webhook at a Pipewatch endpoint.",
  },
  {
    label: "02 · WATCH",
    title: "Set what “healthy” means",
    body: "Expected schedules, volume ranges and the outcome each workflow must produce.",
  },
  {
    label: "03 · ALERT",
    title: "Route to an owner",
    body: "Slack, email, SMS or on-call paging, with the failing step and payload attached.",
  },
  {
    label: "04 · RECOVER",
    title: "Replay, then prove it",
    body: "Resume from the broken step, safely, and keep a signed record of every fix.",
  },
];

export const RECOVERY_POINTS = [
  "Step-level timeline with inputs, outputs and API responses",
  "Replay from any step, in bulk or one at a time",
  "Automatic retries with backoff that respect rate limits",
] as const;

export const ALERTING_POINTS = [
  "Failure, missed-heartbeat and volume-drop rules",
  "Slack, Microsoft Teams, email, SMS and webhook destinations",
  "Quiet hours, deduplication and escalation windows",
] as const;

export const AUDIT_POINTS = [
  "Append-only, hash-chained event history",
  "Filter by workflow, person, run or record ID",
  "Export to CSV or stream to your warehouse",
] as const;

export const TESTIMONIAL = {
  quote:
    "We had sixty-odd automations and no idea which ones were healthy. Now a failed order sync pings the person who owns it, they replay it in a minute, and I can show our auditors exactly what happened.",
  name: "Dana K.",
  role: "Head of Operations, Northfield Supply",
  initials: "DK",
};

export const FACTS: readonly { title: string; body: string }[] = [
  { title: "One place for every run", body: "Zapier, Make, n8n and custom webhooks side by side." },
  { title: "Named owners, not shared inboxes", body: "Each workflow has someone responsible for it." },
  { title: "Recovery on the record", body: "Every replay is logged, attributed and reversible." },
];

export const MONITORING_SIGNALS: readonly InfoCard[] = [
  {
    icon: "x",
    tone: "red",
    title: "Run failures",
    body: "Every failed step, with the error, the request that caused it, and how many retries are left. Repeat failures roll up into one incident.",
  },
  {
    icon: "pulse",
    tone: "amber",
    title: "Heartbeats & schedules",
    body: "Tell Pipewatch when a workflow should run. If 09:00 passes without a successful run, the owner hears about it at 09:01.",
  },
  {
    icon: "eye",
    title: "Outcome checks",
    body: "Confirm the record actually landed: the order exists in the ERP, the row is in the sheet, the email was delivered.",
  },
];

export const ALERT_RULE_POINTS = [
  "Failure, missed-run, volume-drop and slow-run conditions",
  "Route by tag, so every finance workflow goes to finance",
  "Snooze, quiet hours and on-call schedules built in",
  "One incident per problem, not one email per failed run",
] as const;

export const INTEGRATIONS: readonly { source: "zapier" | "make" | "n8n" | "webhook"; title: string; body: string; setup: string }[] = [
  {
    source: "zapier",
    title: "Zapier",
    body: "Zap run history, step-level errors and replay through the Zapier API.",
    setup: "API key · 2 min setup",
  },
  {
    source: "make",
    title: "Make",
    body: "Scenario executions, incomplete runs and data-store checks across organizations.",
    setup: "API token · 2 min setup",
  },
  {
    source: "n8n",
    title: "n8n",
    body: "Cloud or self-hosted. Execution history, error workflows and node-level detail.",
    setup: "API key or error-workflow hook",
  },
  {
    source: "webhook",
    title: "Webhooks & HTTP",
    body: "Ping a heartbeat URL or post run events from any script, cron job or custom service.",
    setup: "One URL · any language",
  },
];

export const REPLAY_POINTS = [
  "Original inputs and outputs stored for every step",
  "Edit a payload before replay, with a diff saved to the log",
  "Idempotency keys generated per run to block duplicates",
] as const;

export const RECOVERY_OPTIONS: readonly InfoCard[] = [
  {
    icon: "replay",
    tone: "blue",
    title: "Automatic retries",
    body: "Timeouts and rate limits retry on their own with exponential backoff that respects each API’s retry-after header.",
    footnote: "Configurable per workflow and per step",
  },
  {
    icon: "list",
    title: "Bulk replay",
    body: "An outage failed 200 runs overnight? Select the incident and replay them all, throttled so you don’t trip the same limit again.",
    footnote: "Pause, resume or cancel mid-queue",
  },
  {
    icon: "users",
    tone: "amber",
    title: "Review before replay",
    body: "When data has changed since the original run, Pipewatch holds the run for a person to approve instead of guessing.",
    footnote: "Approvals are recorded in the audit log",
  },
];

export const AUDIT_FEATURES: readonly InfoCard[] = [
  {
    icon: "list",
    title: "Append-only history",
    body: "Entries are hash-chained, so any gap or edit is detectable. Nothing in the log can be changed from the app, including by admins.",
  },
  {
    icon: "database",
    tone: "blue",
    title: "Export anywhere",
    body: "Download CSV for an auditor, or stream events to your warehouse or SIEM on a schedule you choose.",
  },
  {
    icon: "users",
    tone: "amber",
    title: "Attributed actions",
    body: "Replays, payload edits, mutes and rule changes are tied to a named person, never to a shared login.",
  },
];

export const SECURITY_FEATURES: readonly InfoCard[] = [
  {
    icon: "key",
    title: "Encrypted credentials",
    body: "Connection tokens are encrypted at rest with per-workspace keys and never shown again after you save them.",
  },
  {
    icon: "eye",
    title: "Field-level redaction",
    body: "Mark fields like card numbers or SSNs as sensitive and they’re masked before a payload is ever stored.",
  },
  {
    icon: "lock",
    title: "SSO & roles",
    body: "SAML single sign-on, SCIM provisioning and roles that separate who can view, who can replay and who can change rules.",
  },
  {
    icon: "database",
    title: "Retention you control",
    body: "Keep payloads for 7 to 400 days, per workflow. Deleted data is purged from backups on a fixed schedule.",
  },
  {
    icon: "bell",
    title: "Least-privilege connections",
    body: "Monitoring runs on read-only access. Write access is requested only for connections where you enable replay.",
  },
  {
    icon: "pulse",
    title: "US data residency",
    body: "Hosted in US regions with encrypted backups. EU hosting is available on the Business plan.",
  },
];

export const CUSTOMER_LOGOS: readonly { name: string; variant: "a" | "b" | "c" | "d" | "e" | "f"; mark?: "peak" | "rings" }[] = [
  { name: "Northfield", variant: "a", mark: "peak" },
  { name: "Harbor & Pine", variant: "b" },
  { name: "Kestrel Health", variant: "c" },
  { name: "ledgerline", variant: "d" },
  { name: "Mosaic Freight", variant: "e", mark: "rings" },
  { name: "juniper/ops", variant: "f" },
];
