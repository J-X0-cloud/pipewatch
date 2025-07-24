import { HERO_ALERT } from "@/lib/data/alerts";
import { Icon } from "@/components/ui/Icon";

/** Incident notification as it lands in Slack, pinned beside the run history. */
export function AlertCard() {
  return (
    <div className="alert-card">
      <div className="ah">
        <span className="ic">
          <Icon name="alert" size={16} />
        </span>
        <div>
          <b>{HERO_ALERT.title}</b>
          <small>{HERO_ALERT.routing}</small>
        </div>
      </div>
      <p>
        Step {HERO_ALERT.step} returned <code>{HERO_ALERT.error}</code> {HERO_ALERT.body}
      </p>
      <div className="aa">
        <span>Assign</span>
        <span className="go">Replay from step {HERO_ALERT.step}</span>
      </div>
    </div>
  );
}
