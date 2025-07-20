import type { AuditAction, AuditActor } from "@/types/audit";

const PIPEWATCH: AuditActor = { kind: "system", name: "Pipewatch", initials: "PW" };

/** Recent workspace activity in display order, before hashing (see lib/audit.ts). */
export const RECENT_AUDIT: readonly { at: string; actor: AuditActor; action: AuditAction; message: string }[] = [
  {
    at: "2026-09-24T16:14:02Z",
    actor: { kind: "user", name: "Priya S.", initials: "PS", color: "#6D4BD8" },
    action: "run.replayed",
    message: "replayed run `#48219` from step 4",
  },
  {
    at: "2026-09-24T16:14:07Z",
    actor: PIPEWATCH,
    action: "run.recovered",
    message: "marked `#48219` recovered after replay",
  },
  {
    at: "2026-09-24T15:52:40Z",
    actor: { kind: "user", name: "Marcus T.", initials: "MT", color: "#D9456B" },
    action: "rule.updated",
    message: "edited alert rule **ERP sync failures**",
  },
  {
    at: "2026-09-24T15:31:19Z",
    actor: { kind: "user", name: "Jen O.", initials: "JO", color: "#2D6E8E" },
    action: "heartbeat.muted",
    message: "muted **Invoice PDF** heartbeat for 2h",
  },
  {
    at: "2026-09-24T14:00:00Z",
    actor: PIPEWATCH,
    action: "connection.token_rotated",
    message: "rotated the Make connection token",
  },
];
