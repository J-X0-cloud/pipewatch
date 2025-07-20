export type ConditionToken = { text: string; kind: "field" | "value" | "plain" };

export interface AlertRule {
  id: string;
  name: string;
  enabled: boolean;
  /** Human-readable rule lines, tokenised so values can be highlighted. */
  lines: readonly (readonly ConditionToken[])[];
}

export interface AlertNotification {
  channel: string;
  time: string;
  runNumber: number;
  failedStep: number;
  retries: number;
  workflow: string;
  detail: string;
}
