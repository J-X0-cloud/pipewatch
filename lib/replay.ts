import { createHash } from "node:crypto";
import { z } from "zod";
import type { RunDetail } from "@/types/runs";

export const replayRequestSchema = z.object({
  fromStep: z.number().int().min(1),
  /** Steps handled by hand; they're recorded as skipped instead of re-executed. */
  skipSteps: z.array(z.number().int().min(1)).default([]),
  /** Edited trigger payload. The diff against the original is written to the audit log. */
  payload: z.record(z.string(), z.unknown()).optional(),
  /** Current state of the record; used to detect drift since the original run. */
  currentRecord: z.record(z.string(), z.unknown()).optional(),
  actor: z.string().min(1).max(80),
});

export type ReplayRequest = z.infer<typeof replayRequestSchema>;

export type StepAction = "reuse" | "replay" | "skip";

export interface ReplayPlan {
  runNumber: number | null;
  idempotencyKey: string;
  fromStep: number;
  steps: { index: number; name: string; action: StepAction }[];
  payloadChanged: boolean;
  requiresReview: boolean;
  reviewReasons: string[];
}

export class ReplayError extends Error {}

/**
 * Stable per-run idempotency key: the same run always replays with the same key, so the
 * downstream API can reject a second "create sales order" even if the replay itself is retried.
 */
export function idempotencyKey(recordId: string, runNumber: number | null): string {
  const digest = createHash("sha256").update(`${recordId}:${runNumber ?? "manual"}`).digest("hex");
  return `${recordId.toLowerCase()}-${digest.slice(0, 4)}`;
}

/** Top-level fields whose values differ between two snapshots. */
export function changedFields(before: Record<string, unknown>, after: Record<string, unknown>): string[] {
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  return [...keys].filter((k) => JSON.stringify(before[k]) !== JSON.stringify(after[k])).sort();
}

/**
 * Plan a replay. Steps before `fromStep` reuse their stored outputs, skipped steps are
 * recorded, everything from `fromStep` on runs again with the (possibly edited) payload.
 * If the underlying record has changed since the original run, the plan is held for review.
 */
export function planReplay(
  run: RunDetail,
  request: ReplayRequest,
  originalPayload: Record<string, unknown>,
  originalRecord: Record<string, unknown> = {},
): ReplayPlan {
  const lastStep = run.steps.length;
  if (request.fromStep > lastStep) {
    throw new ReplayError(`Run #${run.number} has ${lastStep} steps; cannot replay from step ${request.fromStep}`);
  }
  const firstFailed = run.steps.find((s) => s.status === "failed")?.index;
  if (firstFailed !== undefined && request.fromStep > firstFailed) {
    throw new ReplayError(`Step ${firstFailed} failed; replay must start at or before it`);
  }

  const payloadChanged = request.payload !== undefined && changedFields(originalPayload, request.payload).length > 0;
  const drift = request.currentRecord ? changedFields(originalRecord, request.currentRecord) : [];
  const reviewReasons = drift.length > 0 ? [`Record changed since the original run: ${drift.join(", ")}`] : [];

  return {
    runNumber: run.number,
    idempotencyKey: run.error?.idempotencyKey ?? idempotencyKey(run.recordId, run.number),
    fromStep: request.fromStep,
    steps: run.steps.map((step) => ({
      index: step.index,
      name: step.name,
      action: request.skipSteps.includes(step.index) ? "skip" : step.index < request.fromStep ? "reuse" : "replay",
    })),
    payloadChanged,
    requiresReview: reviewReasons.length > 0,
    reviewReasons,
  };
}

export type ReplayOutcome = { status: "recovered" } | { status: "failed"; error: string } | { status: "needs_review" };

export type QueueState = "running" | "paused" | "cancelled" | "done";

/**
 * Throttled bulk replay for an incident. Runs one plan at a time with a fixed gap between
 * starts (default 8s) so a rate-limited API isn't tripped again by the recovery itself.
 */
export class RecoveryQueue {
  private readonly pending: ReplayPlan[];
  private readonly results = new Map<number | null, ReplayOutcome>();
  private state: QueueState = "paused";
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor(
    plans: readonly ReplayPlan[],
    private readonly execute: (plan: ReplayPlan) => Promise<ReplayOutcome>,
    private readonly intervalMs = 8000,
    private readonly onChange: (queue: RecoveryQueue) => void = () => {},
  ) {
    this.pending = [...plans];
  }

  get status() {
    return {
      state: this.state,
      remaining: this.pending.length,
      recovered: [...this.results.values()].filter((r) => r.status === "recovered").length,
      needsReview: [...this.results.values()].filter((r) => r.status === "needs_review").length,
      failed: [...this.results.values()].filter((r) => r.status === "failed").length,
    };
  }

  start() {
    if (this.state === "running" || this.state === "cancelled" || this.state === "done") return;
    this.state = "running";
    this.tick();
  }

  pause() {
    if (this.state !== "running") return;
    this.state = "paused";
    clearTimeout(this.timer);
    this.onChange(this);
  }

  cancel() {
    this.state = "cancelled";
    clearTimeout(this.timer);
    this.onChange(this);
  }

  private async tick() {
    if (this.state !== "running") return;
    const plan = this.pending.shift();
    if (!plan) {
      this.state = "done";
      this.onChange(this);
      return;
    }
    const outcome: ReplayOutcome = plan.requiresReview
      ? { status: "needs_review" }
      : await this.execute(plan).catch((error: unknown) => ({
          status: "failed" as const,
          error: error instanceof Error ? error.message : String(error),
        }));
    this.results.set(plan.runNumber, outcome);
    this.onChange(this);
    this.timer = setTimeout(() => void this.tick(), this.intervalMs);
  }
}
