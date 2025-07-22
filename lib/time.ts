/** Workspace timezone used for schedules, alerts and the audit log. */
export const WORKSPACE_TIMEZONE = "America/Los_Angeles";

const clock = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: WORKSPACE_TIMEZONE,
});

/** "09:14:02" in the workspace timezone. */
export const formatClock = (iso: string) => clock.format(new Date(iso));

/** Compact age for run tables: "now", "6m", "3h", "2d". */
export function formatAge(iso: string, now: Date): string {
  const minutes = Math.floor((now.getTime() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)}h`;
  return `${Math.floor(minutes / 1440)}d`;
}

export function formatDuration(ms: number | null): string {
  if (ms === null) return "—";
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}
