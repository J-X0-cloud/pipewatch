import type { AlertNotification } from "@/types/alerts";
import { PulseGlyph } from "@/components/ui/Brand";

export function SlackNotification({ notification: n }: { notification: AlertNotification }) {
  return (
    <div className="notif">
      <span className="av">
        <PulseGlyph />
      </span>
      <div>
        <b>Pipewatch</b>
        <span className="when">
          {n.channel} &middot; {n.time}
        </span>
        <p>
          Run <b>#{n.runNumber}</b> failed on step {n.failedStep} after {n.retries} retries.
        </p>
        <div className="quote">
          <b>{n.workflow}</b>
          {n.detail}
        </div>
        <div className="btns">
          <span className="mini-btn primary">Open run</span>
          <span className="mini-btn">Replay</span>
          <span className="mini-btn">Assign to me</span>
        </div>
      </div>
    </div>
  );
}
