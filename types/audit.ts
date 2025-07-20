export type AuditAction =
  | "run.replayed"
  | "run.recovered"
  | "rule.updated"
  | "heartbeat.muted"
  | "connection.token_rotated"
  | "payload.edited"
  | "run.skipped_step";

export interface AuditActor {
  kind: "user" | "system";
  name: string;
  initials: string;
  color?: string;
}

export interface AuditEntry {
  id: string;
  at: string;
  actor: AuditActor;
  action: AuditAction;
  /** Rendered message; `**x**` is emphasised, `` `x` `` is monospace. */
  message: string;
  /** Hash of the previous entry; the first entry chains from the genesis hash. */
  prevHash: string;
  hash: string;
}
