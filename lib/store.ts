import type { RunEvent } from "@/lib/runs";

export interface StoredRun extends RunEvent {
  id: string;
  number: number;
  receivedAt: string;
}

export interface RunStore {
  upsert(event: RunEvent): Promise<{ run: StoredRun; created: boolean }>;
  get(number: number): Promise<StoredRun | undefined>;
  recentForWorkflow(source: RunEvent["source"], externalWorkflowId: string, limit?: number): Promise<StoredRun[]>;
}

/**
 * In-process run store used in development and tests. Production uses Postgres with the same
 * interface; `(source, externalRunId)` is the natural key so webhook redeliveries are idempotent.
 */
class MemoryRunStore implements RunStore {
  private readonly runs = new Map<string, StoredRun>();
  private nextNumber = 48_220;

  private key(event: Pick<RunEvent, "source" | "externalRunId">) {
    return `${event.source}:${event.externalRunId}`;
  }

  async upsert(event: RunEvent) {
    const key = this.key(event);
    const existing = this.runs.get(key);
    if (existing) {
      const run = { ...existing, ...event };
      this.runs.set(key, run);
      return { run, created: false };
    }
    const run: StoredRun = {
      ...event,
      id: `run_${crypto.randomUUID()}`,
      number: this.nextNumber++,
      receivedAt: new Date().toISOString(),
    };
    this.runs.set(key, run);
    return { run, created: true };
  }

  async get(number: number) {
    return [...this.runs.values()].find((r) => r.number === number);
  }

  async recentForWorkflow(source: RunEvent["source"], externalWorkflowId: string, limit = 50) {
    return [...this.runs.values()]
      .filter((r) => r.source === source && r.externalWorkflowId === externalWorkflowId)
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
      .slice(0, limit);
  }
}

export const runStore: RunStore = new MemoryRunStore();
