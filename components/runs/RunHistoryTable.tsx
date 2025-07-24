import type { Run } from "@/types/runs";
import { RUN_STATUS, rowTone, statusLabel } from "@/lib/runs";
import { formatAge } from "@/lib/time";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface RunHistoryTableProps {
  runs: readonly Run[];
  now: Date;
}

/** Latest runs across every source. Run and source columns collapse on small screens. */
export function RunHistoryTable({ runs, now }: RunHistoryTableProps) {
  return (
    <table className="runs">
      <colgroup>
        <col className="c-id" style={{ width: "13%" }} />
        <col style={{ width: "37%" }} />
        <col className="c-src" style={{ width: "19%" }} />
        <col style={{ width: "22%" }} />
        <col className="c-time" style={{ width: "9%" }} />
      </colgroup>
      <thead>
        <tr>
          <th className="c-id">Run</th>
          <th>Workflow</th>
          <th className="c-src">Source</th>
          <th>Status</th>
          <th className="c-time">When</th>
        </tr>
      </thead>
      <tbody>
        {runs.map((run) => (
          <tr key={run.number ?? `${run.workflowId}-${run.startedAt}`} className={rowTone(run.status)}>
            <td className="id c-id">{run.number ? `#${run.number}` : "—"}</td>
            <td className="wf">
              {run.workflow}
              <small>{run.summary}</small>
            </td>
            <td className="c-src">
              <SourceBadge source={run.source} />
            </td>
            <td>
              <StatusBadge tone={RUN_STATUS[run.status].className}>{statusLabel(run)}</StatusBadge>
            </td>
            <td className="t c-time">{formatAge(run.startedAt, now)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
