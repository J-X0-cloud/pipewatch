"use client";

import { useState } from "react";
import type { AlertRule } from "@/types/alerts";

/** Plain-language alert rules with on/off switches. */
export function AlertRuleList({ rules }: { rules: readonly AlertRule[] }) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(rules.map((r) => [r.id, r.enabled])),
  );

  return (
    <>
      {rules.map((rule) => {
        const on = enabled[rule.id] ?? false;
        return (
          <div className="rule" key={rule.id}>
            <div className="rh">
              <b>{rule.name}</b>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-label={`${rule.name} ${on ? "on" : "off"}`}
                className={on ? "toggle" : "toggle off"}
                onClick={() => setEnabled((e) => ({ ...e, [rule.id]: !on }))}
              />
            </div>
            {rule.lines.map((line, i) => (
              <div className="cond" key={i}>
                {line.map((token, j) =>
                  token.kind === "plain" ? (
                    token.text
                  ) : (
                    <span key={j} className={token.kind === "value" ? "tok m" : "tok"}>
                      {token.text}
                    </span>
                  ),
                )}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}
