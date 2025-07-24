import { INTEGRATIONS } from "@/lib/data/content";
import { SourceBadge } from "@/components/ui/SourceBadge";

export function Integrations() {
  return (
    <div className="int-grid">
      {INTEGRATIONS.map((integration) => (
        <div className="int" key={integration.source}>
          <SourceBadge source={integration.source} />
          <h3>{integration.title}</h3>
          <p>{integration.body}</p>
          <div className="how">{integration.setup}</div>
        </div>
      ))}
    </div>
  );
}
