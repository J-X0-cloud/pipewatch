import type { ReactNode } from "react";

/** Status pill with a leading dot; `className` is one of the s-* tones in globals.css. */
export function StatusBadge({ tone, children }: { tone: string; children: ReactNode }) {
  return (
    <span className={`status ${tone}`}>
      <span className="dot" />
      {children}
    </span>
  );
}
