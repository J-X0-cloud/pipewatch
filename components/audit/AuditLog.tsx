import { chainEntries, shortHash, verifyChain } from "@/lib/audit";
import { RECENT_AUDIT } from "@/lib/data/audit";
import { formatClock } from "@/lib/time";
import { AppFrame, LiveIndicator } from "@/components/ui/AppFrame";
import { RichText } from "@/components/ui/RichText";

/**
 * Recent audit entries with the chain check underneath. The hashes are recomputed on render,
 * so the footer only says "verified" when every entry still matches.
 */
export function AuditLog() {
  const chain = chainEntries(RECENT_AUDIT);
  const check = verifyChain(chain);
  const byTime = new Map(chain.map((e) => [e.at, e]));

  return (
    <AppFrame trail="Workspace" page="Audit log" indicator={<LiveIndicator label="Append-only" />}>
      <ul className="audit">
        {RECENT_AUDIT.map((entry) => (
          <li key={byTime.get(entry.at)?.id ?? entry.at}>
            <span
              className={entry.actor.kind === "system" ? "who sys" : "who"}
              style={entry.actor.color ? { background: entry.actor.color } : undefined}
            >
              {entry.actor.initials}
            </span>
            <div className="what">
              <b>{entry.actor.name}</b> <RichText text={entry.message} />
            </div>
            <span className="t">{formatClock(entry.at)}</span>
          </li>
        ))}
      </ul>
      <div className="hash">
        {check.valid ? (
          <>
            Chain verified &middot; <span className="mono">sha256 {shortHash(check.head)}</span>
          </>
        ) : (
          <>Chain broken at {check.brokenAt}</>
        )}
      </div>
    </AppFrame>
  );
}
