import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { runStore } from "@/lib/store";

const slugSchema = z.string().regex(/^[a-z0-9][a-z0-9-]{1,62}$/);

/**
 * GET or POST /api/heartbeats/:workflow
 *
 * Heartbeat URL for cron jobs and scripts. Each ping records a successful run; when pings
 * stop arriving on schedule, the workflow is flagged as a missed run. Pings never count
 * toward the monthly run-event limit.
 */
async function ping(request: NextRequest, { params }: { params: Promise<{ workflow: string }> }) {
  const { workflow } = await params;
  if (!slugSchema.safeParse(workflow).success) {
    return NextResponse.json({ error: "invalid_workflow" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const runId = request.nextUrl.searchParams.get("run") ?? `hb-${now}`;
  const { run } = await runStore.upsert({
    source: "webhook",
    externalWorkflowId: workflow,
    externalRunId: runId,
    workflowName: workflow,
    status: "succeeded",
    startedAt: now,
    finishedAt: now,
    steps: [],
  });

  return NextResponse.json({ ok: true, run: run.number, receivedAt: now });
}

export const GET = ping;
export const POST = ping;
