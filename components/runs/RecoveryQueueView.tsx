"use client";

import { useEffect, useState } from "react";
import type { RecoveryItem } from "@/types/runs";
import { RECOVERY_QUEUE } from "@/lib/data/workspace";
import { RUN_STATUS } from "@/lib/runs";
import { AppFrame } from "@/components/ui/AppFrame";
import { StatusBadge } from "@/components/ui/StatusBadge";

const TICK_MS = 400;
/** Progress added per tick while replaying (a full replay takes ~8s, matching the throttle). */
const STEP = TICK_MS / 8000;
/** The rest of the batch advances one run's worth of bar every 8s. */
const BATCH_STEP = (STEP * (1 - RECOVERY_QUEUE.remainingProgress)) / RECOVERY_QUEUE.remaining;

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}>
      <i style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  );
}

/**
 * Bulk recovery for one incident. Replays are throttled; the queue can be paused and resumed.
 * Runs whose record changed since the original attempt wait for a person to review them.
 */
export function RecoveryQueueView() {
  const [items, setItems] = useState<RecoveryItem[]>(() => RECOVERY_QUEUE.items.map((i) => ({ ...i })));
  const [batchProgress, setBatchProgress] = useState(RECOVERY_QUEUE.remainingProgress);
  const [paused, setPaused] = useState(false);

  // Runs left in the batch, derived from its progress bar (10 runs at 22% → 0 at 100%).
  const remaining = Math.ceil(
    (RECOVERY_QUEUE.remaining * (1 - batchProgress)) / (1 - RECOVERY_QUEUE.remainingProgress) - 1e-9,
  );

  const replaying = items.some((i) => i.status === "replaying");
  const finished = !replaying && remaining === 0;

  useEffect(() => {
    if (paused || finished) return;
    const id = window.setInterval(() => {
      setItems((current) =>
        current.map((item) => {
          if (item.status !== "replaying") return item;
          const progress = Math.min((item.progress ?? 0) + STEP, 1);
          return progress >= 1
            ? { ...item, status: "recovered", progress: undefined, detail: "Sales order created on attempt 1" }
            : { ...item, progress };
        }),
      );
      setBatchProgress((p) => Math.min(p + BATCH_STEP, 1));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [paused, finished]);

  const status = finished ? "recovered" : "replaying";

  return (
    <AppFrame
      trail="Incidents"
      page={`${RECOVERY_QUEUE.incident} · ${RECOVERY_QUEUE.runs} runs`}
      indicator={<StatusBadge tone="s-retry">{finished ? "Recovered" : "Recovering"}</StatusBadge>}
    >
      <div className="app-head">
        <div>
          <h4>Recovery queue</h4>
          <div className="sub">
            Replaying from step 4 with the original payloads &middot; {RECOVERY_QUEUE.throttle}
          </div>
        </div>
        <button type="button" className="mini-btn" disabled={finished} onClick={() => setPaused((p) => !p)}>
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
      {items.map((item) => (
        <div className="queue-row" key={item.runNumber}>
          <div>
            <b>
              #{item.runNumber} &middot; {item.recordId}
            </b>
            <small>
              <StatusBadge tone={item.status === "recovered" ? "s-ok" : RUN_STATUS[item.status].className}>{RUN_STATUS[item.status].label}</StatusBadge>{" "}
              {item.detail}
            </small>
          </div>
          <div className="right">
            {item.status === "replaying" && <ProgressBar value={item.progress ?? 0} />}
            {item.status === "recovered" && (
              <button type="button" className="mini-btn">
                View
              </button>
            )}
            {item.status === "needs_review" && (
              <button type="button" className="mini-btn primary">
                Review payload
              </button>
            )}
          </div>
        </div>
      ))}
      <div className="queue-row" data-state={status}>
        <div>
          <b>{remaining > 0 ? `+ ${remaining} more queued` : "Queue finished"}</b>
          <small>{remaining > 0 ? RECOVERY_QUEUE.eta : "Every replayable run recovered"}</small>
        </div>
        <div className="right">
          <ProgressBar value={batchProgress} />
        </div>
      </div>
    </AppFrame>
  );
}
