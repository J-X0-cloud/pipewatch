import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import type { SourceId, StepStatus } from "@/types/runs";
import type { RunEvent } from "@/lib/runs";

/* -------------------------------------------------------------------------- */
/* Authentication                                                              */
/* -------------------------------------------------------------------------- */

const SIGNATURE_TOLERANCE_SECONDS = 300;

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/**
 * Zapier, Make and n8n post from their HTTP modules with a static workspace token header.
 * Custom webhooks sign the body: `x-pipewatch-signature: t=<unix>,v1=<hex hmac-sha256("t.body")>`.
 */
export function verifyWebhook(
  source: SourceId,
  headers: Headers,
  rawBody: string,
  env: NodeJS.ProcessEnv = process.env,
  now = Date.now(),
): boolean {
  const secret = env.PIPEWATCH_WEBHOOK_SECRET;
  if (!secret) return false;

  if (source !== "webhook") {
    const token = headers.get("x-pipewatch-token");
    return token !== null && safeEqual(token, secret);
  }

  const signature = headers.get("x-pipewatch-signature") ?? "";
  const parts = Object.fromEntries(signature.split(",").map((kv) => kv.split("=") as [string, string]));
  const timestamp = Number(parts.t);
  if (!parts.v1 || !Number.isFinite(timestamp)) return false;
  if (Math.abs(now / 1000 - timestamp) > SIGNATURE_TOLERANCE_SECONDS) return false;

  const expected = createHmac("sha256", secret).update(`${parts.t}.${rawBody}`).digest("hex");
  return safeEqual(parts.v1, expected);
}

/* -------------------------------------------------------------------------- */
/* Source payloads                                                             */
/* -------------------------------------------------------------------------- */

const httpError = z.object({ status_code: z.number().int().optional(), message: z.string() });

const zapierSchema = z.object({
  zap_id: z.union([z.string(), z.number()]).transform(String),
  zap_title: z.string(),
  execution_id: z.string(),
  status: z.enum(["success", "error", "halted", "running"]),
  started_at: z.string().datetime({ offset: true }),
  finished_at: z.string().datetime({ offset: true }).optional(),
  steps: z
    .array(
      z.object({
        title: z.string(),
        status: z.enum(["success", "error", "halted", "skipped", "waiting"]),
        duration_ms: z.number().int().nonnegative().optional(),
        error: httpError.optional(),
      }),
    )
    .default([]),
  input: z.unknown().optional(),
});

/** Make reports execution status as 1 (success), 2 (warning / incomplete) or 3 (error). */
const makeSchema = z.object({
  scenarioId: z.number().int(),
  scenarioName: z.string(),
  executionId: z.string(),
  status: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  startedAt: z.string().datetime({ offset: true }),
  finishedAt: z.string().datetime({ offset: true }).optional(),
  modules: z
    .array(
      z.object({
        name: z.string(),
        status: z.enum(["ok", "warning", "error", "skipped"]),
        duration: z.number().nonnegative().optional(),
        error: z.object({ statusCode: z.number().int().optional(), message: z.string() }).optional(),
      }),
    )
    .default([]),
  bundle: z.unknown().optional(),
});

/** Shape posted by an n8n Error Trigger workflow. */
const n8nSchema = z.object({
  execution: z.object({
    id: z.string(),
    url: z.string().url().optional(),
    mode: z.string().optional(),
    lastNodeExecuted: z.string().optional(),
    error: z.object({ message: z.string(), httpCode: z.string().optional(), node: z.object({ name: z.string() }).optional() }),
  }),
  workflow: z.object({ id: z.string(), name: z.string() }),
  timestamp: z.string().datetime({ offset: true }).optional(),
});

const genericSchema = z.object({
  workflow: z.string().min(1).max(120),
  workflowName: z.string().max(200).optional(),
  runId: z.string().min(1).max(200),
  status: z.enum(["succeeded", "failed", "running"]),
  startedAt: z.string().datetime({ offset: true }),
  finishedAt: z.string().datetime({ offset: true }).optional(),
  steps: z
    .array(
      z.object({
        name: z.string(),
        status: z.enum(["succeeded", "failed", "skipped", "pending"]),
        durationMs: z.number().int().nonnegative().optional(),
        error: z.string().optional(),
      }),
    )
    .default([]),
  payload: z.unknown().optional(),
});

/* -------------------------------------------------------------------------- */
/* Adapters                                                                    */
/* -------------------------------------------------------------------------- */

const ZAPIER_STEP: Record<string, StepStatus> = {
  success: "succeeded",
  error: "failed",
  halted: "failed",
  skipped: "skipped",
  waiting: "pending",
};

const MAKE_STEP: Record<string, StepStatus> = { ok: "succeeded", warning: "failed", error: "failed", skipped: "skipped" };

export type ParseResult = { ok: true; event: RunEvent } | { ok: false; issues: z.ZodIssue[] };

function fromZapier(body: unknown): ParseResult {
  const parsed = zapierSchema.safeParse(body);
  if (!parsed.success) return { ok: false, issues: parsed.error.issues };
  const zap = parsed.data;
  return {
    ok: true,
    event: {
      source: "zapier",
      externalWorkflowId: zap.zap_id,
      externalRunId: zap.execution_id,
      workflowName: zap.zap_title,
      status: zap.status === "success" ? "succeeded" : zap.status === "running" ? "running" : "failed",
      startedAt: zap.started_at,
      finishedAt: zap.finished_at,
      steps: zap.steps.map((s) => ({
        name: s.title,
        status: ZAPIER_STEP[s.status] ?? "pending",
        durationMs: s.duration_ms,
        error: s.error && { httpStatus: s.error.status_code, message: s.error.message },
      })),
      payload: zap.input,
    },
  };
}

function fromMake(body: unknown): ParseResult {
  const parsed = makeSchema.safeParse(body);
  if (!parsed.success) return { ok: false, issues: parsed.error.issues };
  const run = parsed.data;
  return {
    ok: true,
    event: {
      source: "make",
      externalWorkflowId: String(run.scenarioId),
      externalRunId: run.executionId,
      workflowName: run.scenarioName,
      status: run.status === 1 ? "succeeded" : "failed",
      startedAt: run.startedAt,
      finishedAt: run.finishedAt,
      steps: run.modules.map((m) => ({
        name: m.name,
        status: MAKE_STEP[m.status] ?? "pending",
        durationMs: m.duration,
        error: m.error && { httpStatus: m.error.statusCode, message: m.error.message },
      })),
      payload: run.bundle,
    },
  };
}

function fromN8n(body: unknown, receivedAt: string): ParseResult {
  const parsed = n8nSchema.safeParse(body);
  if (!parsed.success) return { ok: false, issues: parsed.error.issues };
  const { execution, workflow, timestamp } = parsed.data;
  const failedNode = execution.error.node?.name ?? execution.lastNodeExecuted ?? "Unknown node";
  return {
    ok: true,
    event: {
      source: "n8n",
      externalWorkflowId: workflow.id,
      externalRunId: execution.id,
      workflowName: workflow.name,
      status: "failed",
      startedAt: timestamp ?? receivedAt,
      steps: [
        {
          name: failedNode,
          status: "failed",
          error: {
            httpStatus: execution.error.httpCode ? Number(execution.error.httpCode) : undefined,
            message: execution.error.message,
          },
        },
      ],
    },
  };
}

function fromGeneric(body: unknown): ParseResult {
  const parsed = genericSchema.safeParse(body);
  if (!parsed.success) return { ok: false, issues: parsed.error.issues };
  const run = parsed.data;
  return {
    ok: true,
    event: {
      source: "webhook",
      externalWorkflowId: run.workflow,
      externalRunId: run.runId,
      workflowName: run.workflowName ?? run.workflow,
      status: run.status,
      startedAt: run.startedAt,
      finishedAt: run.finishedAt,
      steps: run.steps.map((s) => ({
        name: s.name,
        status: s.status,
        durationMs: s.durationMs,
        error: s.error ? { message: s.error } : undefined,
      })),
      payload: run.payload,
    },
  };
}

export const WEBHOOK_SOURCES = ["zapier", "make", "n8n", "webhook"] as const satisfies readonly SourceId[];

export function isWebhookSource(value: string): value is SourceId {
  return (WEBHOOK_SOURCES as readonly string[]).includes(value);
}

/** Normalise any source's payload into a `RunEvent`. */
export function parseRunEvent(source: SourceId, body: unknown, receivedAt = new Date().toISOString()): ParseResult {
  switch (source) {
    case "zapier":
      return fromZapier(body);
    case "make":
      return fromMake(body);
    case "n8n":
      return fromN8n(body, receivedAt);
    case "webhook":
      return fromGeneric(body);
  }
}
