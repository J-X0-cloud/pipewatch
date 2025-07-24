import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface FeatureProps {
  eyebrow: string;
  title: string;
  body: string;
  points: readonly string[];
  /** Visual on the left instead of the right. */
  flip?: boolean;
  action?: ReactNode;
  children: ReactNode;
}

/** Copy + checklist beside a product visual. */
export function Feature({ eyebrow, title, body, points, flip = false, action, children }: FeatureProps) {
  return (
    <div className={flip ? "feature flip" : "feature"}>
      <div className="feature-copy">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2>{title}</h2>
        <p>{body}</p>
        <ul className="ticks">
          {points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        {action && <div className="hero-actions">{action}</div>}
      </div>
      <div className="feature-visual">{children}</div>
    </div>
  );
}
