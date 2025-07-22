import type { Run, RunStatus, Schedule, SourceId, StepStatus, Workflow, WorkflowHealth } from "@/types/runs";

/** Badge class and label for each run status. */
export const RUN_STATUS: Record<RunStatus, { label: string; className: string }> = {
  failed: { label: "Failed", className: "s-fail" },
  recovered: { label: "Recovered", className: "s-retry" },
  missed: { label: "Missed run", className: "s-warn" },
  succeeded: { label: "Succeeded", className: "s-ok" },
  running: { label: "Running", className: "s-run" },
  replaying: { label: "Replaying", className: "s-run" },
  needs_review: { label: "Needs review", className: "s-warn" },
};

export const WORKFLOW_HEALTH: Record<WorkflowHealth, { label: string; className: string }> = {
  incident: { label: "Incident", className: "s-fail" },
  missed: { label: "Missed run", className: "s-warn" },
  healthy: { label: "Healthy", className: "s-ok" },
  paused: { label: "Paused", className: "s-run" },
};

/** Row highlight in run tables. */
export function rowTone(status: RunStatus | WorkflowHealth): "is-failed" | "is-warn" | undefined {
  if (status === "failed" || status === "incident") return "is-failed";
  if (status === "missed" || status === "needs_review") return "is-warn";
  return undefined;
}

/** "Failed · 429" when the failure came with an HTTP status. */
export function statusLabel(run: Pick<Run, "status" | "httpStatus">): string {
  const { label } = RUN_STATUS[run.status];
  return run.status === "failed" && run.httpStatus ? `${label} · ${run.httpStatus}` : label;
}

export const needsAttention = (w: Pick<Workflow, "health">) => w.health === "incident" || w.health === "missed";

/**
 * A normalised run event, produced by the webhook adapters for every source.
 * This is the only shape the rest of the system deals with.
 */
export interface RunEvent {
  source: SourceId;
  /** The platform's own ID for the workflow (zap ID, scenario ID, n8n workflow ID, or a webhook slug). */
  externalWorkflowId: string;
  externalRunId: string;
  workflowName: string;
  status: "succeeded" | "failed" | "running";
  startedAt: string;
  finishedAt?: string;
  steps: { name: string; status: StepStatus; durationMs?: number; error?: { httpStatus?: number; message: string } }[];
  /** Original trigger payload, stored (after redaction) so the run can be replayed. */
  payload?: unknown;
}

const HOUR = 3_600_000;

/**
 * Health from recent runs plus the workflow's schedule. Three signals:
 * failures (incident), missed heartbeats (missed), and everything else healthy.
 */
export function evaluateHealth(
  workflow: Pick<Workflow, "health" | "schedule">,
  recent: readonly Pick<RunEvent, "status" | "startedAt">[],
  now: Date,
  { failureThreshold = 3, windowHours = 1 }: { failureThreshold?: number; windowHours?: number } = {},
): WorkflowHealth {
  if (workflow.health === "paused") return "paused";

  const windowStart = now.getTime() - windowHours * HOUR;
  const failures = recent.filter((r) => r.status === "failed" && new Date(r.startedAt).getTime() >= windowStart);
  if (failures.length >= failureThreshold) return "incident";

  if (isOverdue(workflow.schedule, recent, now)) return "missed";
  return "healthy";
}

/** Has a scheduled run failed to succeed by its expected time? */
export function isOverdue(schedule: Schedule, recent: readonly Pick<RunEvent, "status" | "startedAt">[], now: Date): boolean {
  const lastSuccess = recent
    .filter((r) => r.status === "succeeded")
    .map((r) => new Date(r.startedAt).getTime())
    .sort((a, b) => b - a)[0];

  switch (schedule.kind) {
    case "event":
      return false;
    case "rate": {
      // No run at all for three expected intervals counts as a missed heartbeat.
      const interval = HOUR / Math.max(schedule.perHour ?? 1, 1);
      return lastSuccess === undefined || now.getTime() - lastSuccess > interval * 3;
    }
    case "daily": {
      const due = dueTimeToday(schedule, now);
      if (now < due) return false;
      // A success up to an hour before the due time counts as today's run.
      return lastSuccess === undefined || lastSuccess < due.getTime() - HOUR;
    }
  }
}

/** Today's due time for a daily schedule, in the schedule's timezone. */
function dueTimeToday(schedule: Schedule, now: Date): Date {
  const [h = 0, m = 0] = (schedule.at ?? "00:00").split(":").map(Number);
  const tz = schedule.timezone ?? "UTC";
  const local = new Date(now.toLocaleString("en-US", { timeZone: tz }));
  const offset = now.getTime() - local.getTime();
  local.setHours(h, m, 0, 0);
  return new Date(local.getTime() + offset);
}

/** KPI strip over a set of runs. */
export function summarizeRuns(runs: readonly Pick<RunEvent, "status">[], recoveredCount: number) {
  return {
    runs: runs.length,
    failed: runs.filter((r) => r.status === "failed").length,
    autoRecovered: recoveredCount,
  };
}
