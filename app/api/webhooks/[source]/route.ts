import { NextResponse, type NextRequest } from "next/server";
import { evaluateHealth } from "@/lib/runs";
import { runStore } from "@/lib/store";
import { isWebhookSource, parseRunEvent, verifyWebhook } from "@/lib/webhooks";

/**
 * POST /api/webhooks/:source   (source = zapier | make | n8n | webhook)
 *
 * Run-event ingest. Each platform posts in its own shape; the adapter normalises it into a
 * RunEvent, which is stored idempotently on (source, run ID) and re-evaluated for health.
 * Responds 202 quickly so the sender never retries because of our latency.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ source: string }> }) {
  const { source } = await params;
  if (!isWebhookSource(source)) {
    return NextResponse.json({ error: "unknown_source", source }, { status: 404 });
  }

  const rawBody = await request.text();
  if (!verifyWebhook(source, request.headers, rawBody)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = parseRunEvent(source, body);
  if (!parsed.ok) {
    return NextResponse.json({ error: "invalid_payload", issues: parsed.issues }, { status: 422 });
  }

  const { run, created } = await runStore.upsert(parsed.event);
  const recent = await runStore.recentForWorkflow(run.source, run.externalWorkflowId);
  const health = evaluateHealth({ health: "healthy", schedule: { kind: "event", label: "event" } }, recent, new Date());

  return NextResponse.json(
    { run: run.number, status: run.status, created, workflowHealth: health },
    { status: 202 },
  );
}
