"use client";

import { useState } from "react";
import type { Workflow, WorkflowTag } from "@/types/runs";
import { WORKFLOWS, WORKSPACE } from "@/lib/data/workspace";
import { WORKFLOW_HEALTH, needsAttention, rowTone } from "@/lib/runs";
import { AppFrame, LiveIndicator } from "@/components/ui/AppFrame";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";

type Filter = { id: string; label: string; count?: number; attention?: boolean; match: (w: Workflow) => boolean };

const TAGS: readonly WorkflowTag[] = ["Finance", "Sales ops", "Fulfillment"];

/** Workspace-wide count; the table itself shows the first page. */
const NEEDS_ATTENTION = 3;

const FILTERS: readonly Filter[] = [
  { id: "all", label: `All ${WORKSPACE.watchedWorkflows}`, match: () => true },
  { id: "attention", label: "Needs attention", count: NEEDS_ATTENTION, attention: true, match: needsAttention },
  ...TAGS.map((tag) => ({ id: tag, label: tag, match: (w: Workflow) => w.tags.includes(tag) })),
];

/** Every workflow with its owner, source, health and expected cadence, filterable by tag. */
export function WorkflowHealthList() {
  const [filterId, setFilterId] = useState("all");
  const filter = FILTERS.find((f) => f.id === filterId) ?? FILTERS[0]!;
  const rows = WORKFLOWS.filter(filter.match);

  return (
    <AppFrame trail={WORKSPACE.name} page="Workflows" indicator={<LiveIndicator />}>
      <div className="tabs" role="tablist" aria-label="Filter workflows">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={f.id === filterId}
            className={f.id === filterId ? "on" : undefined}
            onClick={() => setFilterId(f.id)}
          >
            {f.label}
            {f.count !== undefined && <em>{f.count}</em>}
          </button>
        ))}
      </div>
      <table className="runs">
        <colgroup>
          <col style={{ width: "41%" }} />
          <col className="c-src" style={{ width: "19%" }} />
          <col style={{ width: "24%" }} />
          <col className="c-time" style={{ width: "16%" }} />
        </colgroup>
        <thead>
          <tr>
            <th>Workflow &middot; owner</th>
            <th className="c-src">Source</th>
            <th>Health</th>
            <th className="c-time">Expected</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((w) => (
            <tr key={w.id} className={rowTone(w.health)}>
              <td className="wf">
                {w.name}
                <small>
                  {w.owner} &middot; {w.note}
                </small>
              </td>
              <td className="c-src">
                <SourceBadge source={w.source} />
              </td>
              <td>
                <StatusBadge tone={WORKFLOW_HEALTH[w.health].className}>{WORKFLOW_HEALTH[w.health].label}</StatusBadge>
              </td>
              <td className="t c-time">{w.schedule.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AppFrame>
  );
}
