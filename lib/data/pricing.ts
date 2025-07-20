export interface Plan {
  name: string;
  audience: string;
  price: string;
  billing: string;
  cta: string;
  ctaVariant: "outline" | "primary" | "dark";
  features: readonly string[];
  badge?: string;
}

export const PLANS: readonly Plan[] = [
  {
    name: "Starter",
    audience: "For a founder or ops lead keeping an eye on the essentials.",
    price: "$0",
    billing: "Free forever",
    cta: "Start free",
    ctaVariant: "outline",
    features: [
      "10 watched workflows",
      "25,000 run events / month",
      "Heartbeat & schedule checks",
      "Slack and email alerts",
      "7-day audit log",
    ],
  },
  {
    name: "Team",
    audience: "For ops and finance teams whose automations touch customers.",
    price: "$89",
    billing: "$74 / month billed annually",
    cta: "Start 14-day trial",
    ctaVariant: "primary",
    badge: "Most teams pick this",
    features: [
      "100 watched workflows",
      "500,000 run events / month",
      "Outcome checks",
      "Step-level replay",
      "SMS and on-call escalation",
      "1-year audit log",
    ],
  },
  {
    name: "Business",
    audience: "For companies running hundreds of automations with audit needs.",
    price: "$349",
    billing: "Volume and agency pricing available",
    cta: "Talk to us",
    ctaVariant: "dark",
    features: [
      "Unlimited workflows",
      "5M+ run events / month",
      "Bulk replay & review queue",
      "SSO, SCIM and custom roles",
      "Warehouse & SIEM export",
      "EU hosting option",
    ],
  },
];

/** `true` = included, `false` = not included, strings render as-is. */
export type Cell = boolean | string;

export const PLAN_COMPARISON: readonly { group: string; rows: readonly (readonly [string, Cell, Cell, Cell])[] }[] = [
  {
    group: "Monitoring",
    rows: [
      ["Watched workflows", "10", "100", "Unlimited"],
      ["Run events per month", "25k", "500k", "5M+"],
      ["Heartbeat & schedule checks", true, true, true],
      ["Outcome checks", false, true, true],
    ],
  },
  {
    group: "Alerting & recovery",
    rows: [
      ["Slack, email & webhook alerts", true, true, true],
      ["SMS & on-call escalation", false, true, true],
      ["Step-level replay", false, true, true],
      ["Bulk replay & review queue", false, false, true],
    ],
  },
  {
    group: "Audit & security",
    rows: [
      ["Audit log retention", "7 days", "1 year", "Custom"],
      ["SSO (SAML) & SCIM", false, false, true],
      ["Warehouse / SIEM export", false, false, true],
    ],
  },
];

export const PRICING_FAQ: readonly { question: string; answer: string; open?: boolean }[] = [
  {
    question: "What counts as a run event?",
    answer:
      "Each workflow run Pipewatch records, whether it succeeded or failed. Heartbeat pings and outcome checks are free and don’t count toward your limit.",
    open: true,
  },
  {
    question: "Do you need write access to my Zapier or Make account?",
    answer:
      "No. Monitoring and alerting work with read-only access. Write access is only requested if you turn on replay for a connection.",
    open: true,
  },
  {
    question: "Can I monitor self-hosted n8n?",
    answer:
      "Yes. Use an API key if your instance is reachable, or add the Pipewatch error-workflow hook if it sits behind a firewall.",
  },
  {
    question: "What happens if I go over my plan?",
    answer: "Monitoring keeps running. We’ll let you know and suggest a plan change; we never silently drop events.",
  },
  {
    question: "Is there a free trial of Team?",
    answer:
      "Every workspace starts with 14 days of Team features, no card required. After that you choose a plan or stay on Starter.",
  },
  {
    question: "Do you offer discounts for agencies?",
    answer:
      "Yes. Agencies managing automations for several clients get separate client workspaces and volume pricing. Email us.",
  },
];
