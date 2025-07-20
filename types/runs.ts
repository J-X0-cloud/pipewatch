export type SourceId = "zapier" | "make" | "n8n" | "webhook";

/** Outcome of a single run as shown in run history. */
export type RunStatus = "failed" | "recovered" | "missed" | "succeeded" | "running" | "replaying" | "needs_review";

/** Rolled-up state of a workflow across its recent runs. */
export type WorkflowHealth = "incident" | "missed" | "healthy" | "paused";

export type StepStatus = "succeeded" | "failed" | "retrying" | "skipped" | "pending";

export interface RunStep {
  index: number;
  name: string;
  status: StepStatus;
  detail: string;
  durationMs: number | null;
}

export interface RunError {
  httpStatus: number;
  message: string;
  retryAfterSeconds?: number;
  attempts: number;
  maxAttempts: number;
  idempotencyKey: string;
}

export interface Run {
  /** Pipewatch run number (#48219). `null` for runs that were expected but never happened. */
  number: number | null;
  workflowId: string;
  workflow: string;
  source: SourceId;
  status: RunStatus;
  /** One-line context under the workflow name. */
  summary: string;
  startedAt: string;
  failedStep?: number;
  totalSteps?: number;
  httpStatus?: number;
}

export interface RunDetail extends Run {
  trigger: string;
  recordId: string;
  owner: string;
  steps: readonly RunStep[];
  error?: RunError;
}

export type WorkflowTag = "Finance" | "Sales ops" | "Fulfillment";

export interface Schedule {
  kind: "rate" | "daily" | "event";
  /** "~40/h", "09:00" or "event". */
  label: string;
  /** For daily schedules: expected local time (HH:MM) and timezone. */
  at?: string;
  timezone?: string;
  /** For rate schedules: expected runs per hour. */
  perHour?: number;
}

export interface Workflow {
  id: string;
  name: string;
  source: SourceId;
  owner: string;
  tags: readonly WorkflowTag[];
  schedule: Schedule;
  health: WorkflowHealth;
  note: string;
}

export interface RecoveryItem {
  runNumber: number;
  recordId: string;
  status: Extract<RunStatus, "recovered" | "replaying" | "needs_review">;
  detail: string;
  /** Replay progress 0–1 while replaying. */
  progress?: number;
}
