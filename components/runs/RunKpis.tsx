import { formatCount } from "@/lib/format";

interface RunKpisProps {
  runsToday: number;
  failed: number;
  autoRecovered: number;
  watched: number;
}

export function RunKpis({ runsToday, failed, autoRecovered, watched }: RunKpisProps) {
  return (
    <div className="kpis">
      <div>
        <small>Runs today</small>
        <strong>{formatCount(runsToday)}</strong>
      </div>
      <div>
        <small>Failed</small>
        <strong className="bad">{formatCount(failed)}</strong>
      </div>
      <div>
        <small>Auto-recovered</small>
        <strong className="ok">{formatCount(autoRecovered)}</strong>
      </div>
      <div>
        <small>Watched workflows</small>
        <strong>{formatCount(watched)}</strong>
      </div>
    </div>
  );
}
