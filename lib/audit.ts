import { createHash } from "node:crypto";
import type { AuditAction, AuditActor, AuditEntry } from "@/types/audit";

/** Every workspace chain starts from the same genesis value. */
export const GENESIS_HASH = "0".repeat(64);

type AuditInput = { at: string; actor: AuditActor; action: AuditAction; message: string };

/** Canonical serialisation: field order is fixed so the hash is reproducible anywhere. */
function canonical(entry: AuditInput & { prevHash: string }): string {
  return JSON.stringify([entry.prevHash, entry.at, entry.actor.kind, entry.actor.name, entry.action, entry.message]);
}

export const hashEntry = (entry: AuditInput & { prevHash: string }) =>
  createHash("sha256").update(canonical(entry)).digest("hex");

/**
 * Append-only, hash-chained log. Each entry commits to the one before it, so removing or
 * editing any entry breaks every hash after it.
 */
export function chainEntries(entries: readonly AuditInput[], prevHash = GENESIS_HASH): AuditEntry[] {
  const chronological = [...entries].sort((a, b) => a.at.localeCompare(b.at));
  const chained: AuditEntry[] = [];
  let previous = prevHash;
  chronological.forEach((entry, i) => {
    const hash = hashEntry({ ...entry, prevHash: previous });
    chained.push({ ...entry, id: `aud_${i + 1}`, prevHash: previous, hash });
    previous = hash;
  });
  return chained;
}

export type ChainCheck = { valid: true; head: string } | { valid: false; brokenAt: string };

/** Recompute every hash in order. Returns the first entry whose hash doesn't match. */
export function verifyChain(entries: readonly AuditEntry[]): ChainCheck {
  const chronological = [...entries].sort((a, b) => a.at.localeCompare(b.at));
  let previous = chronological[0]?.prevHash ?? GENESIS_HASH;
  for (const entry of chronological) {
    if (entry.prevHash !== previous || hashEntry(entry) !== entry.hash) {
      return { valid: false, brokenAt: entry.id };
    }
    previous = entry.hash;
  }
  return { valid: true, head: previous };
}

/** "9f2c…e41a" */
export const shortHash = (hash: string) => `${hash.slice(0, 4)}…${hash.slice(-4)}`;
