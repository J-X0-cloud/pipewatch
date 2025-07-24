"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { RunDetail, RunStatus, RunStep, StepStatus } from "@/types/runs";
import { FAILED_RUN, FAILED_RUN_PAYLOAD } from "@/lib/data/workspace";
import { RUN_STATUS } from "@/lib/runs";
import { SOURCES } from "@/lib/data/sources";
import { formatDuration } from "@/lib/time";
import { AppFrame } from "@/components/ui/AppFrame";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";

const STEP_CLASS: Record<StepStatus, string | undefined> = {
  succeeded: undefined,
  failed: "fail",
  retrying: "retry",
  skipped: "skip",
  pending: "skip",
};

/** Delay between animated step transitions while a replay runs. */
const STEP_DELAY_MS = 900;

function StepBadge({ step }: { step: RunStep }) {
  if (step.status === "succeeded") return <Icon name="check" />;
  if (step.status === "failed") return <Icon name="x" />;
  if (step.status === "retrying") return <Icon name="replay" />;
  return <>{step.index}</>;
}

type Phase = "failed" | "editing" | "replaying" | "recovered" | "error";

/**
 * Step-level run timeline with the recovery actions. "Replay from step N" asks the API for a
 * replay plan, then walks the timeline through it: reused steps stay as they were, replayed
 * steps retry and succeed, skipped steps are marked as handled by hand.
 */
export function RunTimeline({ run = FAILED_RUN }: { run?: RunDetail }) {
  const failedStep = run.steps.find((s) => s.status === "failed");
  const [steps, setSteps] = useState<readonly RunStep[]>(run.steps);
  const [phase, setPhase] = useState<Phase>("failed");
  const [payload, setPayload] = useState(() => JSON.stringify(FAILED_RUN_PAYLOAD, null, 2));
  const [message, setMessage] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const payloadValid = (() => {
    try {
      return typeof JSON.parse(payload) === "object";
    } catch {
      return false;
    }
  })();

  const runStatus: RunStatus = phase === "recovered" ? "recovered" : phase === "replaying" ? "replaying" : "failed";

  function animate(plan: { index: number; action: "reuse" | "replay" | "skip" }[]) {
    const sequence = plan.filter((s) => s.action !== "reuse");
    sequence.forEach((planned, i) => {
      const at = i * STEP_DELAY_MS * 2;
      const update = (status: StepStatus, detail?: string) =>
        setSteps((current) =>
          current.map((s) =>
            s.index === planned.index ? { ...s, status, detail: detail ?? s.detail, durationMs: s.durationMs } : s,
          ),
        );
      if (planned.action === "skip") {
        timers.current.push(window.setTimeout(() => update("skipped", "Skipped, handled by hand"), at));
        return;
      }
      timers.current.push(window.setTimeout(() => update("retrying", "Replaying with stored payload"), at));
      timers.current.push(
        window.setTimeout(() => update("succeeded", planned.index === failedStep?.index ? "Created on attempt 1" : "Sent"), at + STEP_DELAY_MS),
      );
    });
    timers.current.push(
      window.setTimeout(() => setPhase("recovered"), sequence.length * STEP_DELAY_MS * 2),
    );
  }

  async function replay(skip: number[] = []) {
    if (!failedStep || phase === "replaying" || phase === "recovered") return;
    setPhase("replaying");
    setMessage(null);
    try {
      const response = await fetch(`/api/runs/${run.number}/replay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromStep: failedStep.index,
          skipSteps: skip,
          payload: payloadValid ? JSON.parse(payload) : undefined,
          actor: "Priya S.",
        }),
      });
      const body = (await response.json()) as {
        plan?: { steps: { index: number; action: "reuse" | "replay" | "skip" }[]; requiresReview: boolean; reviewReasons: string[] };
        message?: string;
      };
      if (!response.ok || !body.plan) throw new Error(body.message ?? "Replay could not be planned");
      if (body.plan.requiresReview) {
        setPhase("failed");
        setMessage(body.plan.reviewReasons.join(" "));
        return;
      }
      animate(body.plan.steps);
    } catch (error) {
      setPhase("error");
      setMessage(error instanceof Error ? error.message : "Replay failed");
    }
  }

  const done = phase === "replaying" || phase === "recovered";

  return (
    <AppFrame
      trail="Runs"
      page={`#${run.number} · ${run.workflow}`}
      indicator={<StatusBadge tone={RUN_STATUS[runStatus].className}>{RUN_STATUS[runStatus].label}</StatusBadge>}
    >
      <div className="app-head">
        <div>
          <h4>Run timeline</h4>
          <div className="sub">
            Triggered by {run.trigger} <span className="mono">{run.recordId}</span> &middot; {SOURCES[run.source].label}
          </div>
        </div>
      </div>
      <div className="run-detail">
        <div className="timeline">
          {steps.map((step) => (
            <Fragment key={step.index}>
              <div className={["tl", STEP_CLASS[step.status]].filter(Boolean).join(" ")}>
                <span className="b">
                  <StepBadge step={step} />
                </span>
                <div>
                  <b>{step.name}</b>
                  <small>{step.detail}</small>
                </div>
                <span className="ms">{formatDuration(step.durationMs)}</span>
              </div>
              {step.index === failedStep?.index && run.error && phase !== "recovered" && (
                <div className="err-box">
                  HTTP {run.error.httpStatus} {run.error.message}
                  <br />
                  <span>retry-after:</span> {run.error.retryAfterSeconds} &nbsp;<span>attempts:</span> {run.error.attempts} of{" "}
                  {run.error.maxAttempts}
                  <br />
                  <span>idempotency-key:</span> {run.error.idempotencyKey}
                </div>
              )}
              {step.index === failedStep?.index && phase === "editing" && (
                <textarea
                  className="payload-editor"
                  aria-label="Trigger payload"
                  aria-invalid={!payloadValid}
                  spellCheck={false}
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                />
              )}
            </Fragment>
          ))}
        </div>
      </div>
      <div className="recover-bar">
        <span className="note">{message ?? `Owner: ${run.owner}`}</span>
        <button
          type="button"
          className="mini-btn"
          disabled={done || !failedStep}
          onClick={() => failedStep && replay([failedStep.index])}
        >
          Skip step
        </button>
        <button
          type="button"
          className="mini-btn"
          disabled={done}
          aria-pressed={phase === "editing"}
          onClick={() => setPhase((p) => (p === "editing" ? "failed" : "editing"))}
        >
          Edit payload
        </button>
        <button
          type="button"
          className="mini-btn primary"
          disabled={done || !payloadValid}
          onClick={() => replay()}
        >
          {phase === "recovered" ? "Recovered" : `Replay from step ${failedStep?.index ?? 1}`}
        </button>
      </div>
    </AppFrame>
  );
}
