import { ALERT_RULES, SAMPLE_NOTIFICATION } from "@/lib/data/alerts";
import { AlertRuleList } from "./AlertRuleList";
import { SlackNotification } from "./SlackNotification";

/** Dark stage with the rule editor and the Slack message it produces. */
export function AlertingPreview() {
  return (
    <div className="stage dark">
      <AlertRuleList rules={ALERT_RULES} />
      <SlackNotification notification={SAMPLE_NOTIFICATION} />
    </div>
  );
}
