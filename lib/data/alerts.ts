import type { AlertNotification, AlertRule, ConditionToken } from "@/types/alerts";

const field = (text: string): ConditionToken => ({ text, kind: "field" });
const value = (text: string): ConditionToken => ({ text, kind: "value" });
const plain = (text: string): ConditionToken => ({ text, kind: "plain" });

export const ALERT_RULES: readonly AlertRule[] = [
  {
    id: "rule_erp_failures",
    name: "ERP sync failures",
    enabled: true,
    lines: [
      [
        plain("When "),
        field("workflow"),
        plain(" is "),
        value("Order → ERP sync"),
        plain(" and "),
        field("status"),
        plain(" = "),
        value("failed"),
        plain(" after "),
        value("3 retries"),
      ],
      [plain("Notify "), field("#ops-alerts"), plain(" "), field("on-call: Ops"), plain(" · page after "), value("15 min")],
    ],
  },
  {
    id: "rule_invoice_missed",
    name: "Invoice run missed",
    enabled: true,
    lines: [[plain("When no successful run by "), value("09:00 PT"), plain(" on weekdays")]],
  },
  {
    id: "rule_lead_volume",
    name: "Lead volume drop",
    enabled: false,
    lines: [[plain("When runs in 1h < "), value("40% of 7-day median")]],
  },
];

export const SAMPLE_NOTIFICATION: AlertNotification = {
  channel: "#ops-alerts",
  time: "09:12",
  runNumber: 48219,
  failedStep: 4,
  retries: 3,
  workflow: "Order → ERP sync",
  detail: "HTTP 429 from ERP API · order SO-20931 is not in the ERP yet",
};

/** The alert card floating next to the hero run history. */
export const HERO_ALERT = {
  title: "Order → ERP sync failed",
  routing: "Sent to #ops-alerts · Priya S. on call",
  step: 4,
  error: "429 Too Many Requests",
  body: "three times. Order SO-20931 has not reached the ERP.",
};
