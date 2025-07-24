import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface SectionHeadProps {
  eyebrow?: string;
  title: ReactNode;
  centered?: boolean;
  children?: ReactNode;
}

export function SectionHead({ eyebrow, title, centered = false, children }: SectionHeadProps) {
  return (
    <div className={centered ? "section-head center" : "section-head"}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}
