import type { SourceId } from "@/types/runs";
import { SOURCES } from "@/lib/data/sources";

/** Coloured glyph plus platform name. The generic source reads "Webhook" in tables. */
export function SourceBadge({ source }: { source: SourceId }) {
  const meta = SOURCES[source];
  return (
    <span className="src">
      <i className={meta.badge}>{meta.glyph}</i>
      {source === "webhook" ? "Webhook" : meta.label}
    </span>
  );
}
