import { DEMO_NOW, RECENT_RUNS, TODAY_STATS, WORKSPACE } from "@/lib/data/workspace";
import { AppFrame, LiveIndicator } from "@/components/ui/AppFrame";
import { RunHistoryTable } from "./RunHistoryTable";
import { RunKpis } from "./RunKpis";

/** Run history screen: today's totals and the latest runs across every source. */
export function RunHistory() {
  return (
    <AppFrame trail={WORKSPACE.name} page="Run history" indicator={<LiveIndicator />}>
      <RunKpis
        runsToday={TODAY_STATS.runs}
        failed={TODAY_STATS.failed}
        autoRecovered={TODAY_STATS.autoRecovered}
        watched={WORKSPACE.watchedWorkflows}
      />
      <RunHistoryTable runs={RECENT_RUNS} now={new Date(DEMO_NOW)} />
    </AppFrame>
  );
}
