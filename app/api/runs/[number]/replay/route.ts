import { NextResponse, type NextRequest } from "next/server";
import { FAILED_RUN, FAILED_RUN_PAYLOAD, FAILED_RUN_RECORD } from "@/lib/data/workspace";
import { ReplayError, planReplay, replayRequestSchema } from "@/lib/replay";

/**
 * POST /api/runs/:number/replay
 *
 * Plans a replay of a failed run from a given step and returns the plan: which steps reuse
 * stored outputs, which re-run, the idempotency key that guards the downstream API, and
 * whether a person must review it first because the record changed.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const run = Number(number) === FAILED_RUN.number ? FAILED_RUN : undefined;
  if (!run) {
    return NextResponse.json({ error: "run_not_found", run: number }, { status: 404 });
  }

  const parsed = replayRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request", issues: parsed.error.issues }, { status: 422 });
  }

  try {
    const plan = planReplay(run, parsed.data, FAILED_RUN_PAYLOAD, FAILED_RUN_RECORD);
    return NextResponse.json({ plan, queued: !plan.requiresReview }, { status: plan.requiresReview ? 200 : 202 });
  } catch (error) {
    if (error instanceof ReplayError) {
      return NextResponse.json({ error: "invalid_replay", message: error.message }, { status: 409 });
    }
    throw error;
  }
}
