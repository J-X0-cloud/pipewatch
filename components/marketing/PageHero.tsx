import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Header } from "@/components/site/Header";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  actions?: ReactNode;
  /** Product visual on the right. Without it the hero is centred. */
  visual?: ReactNode;
}

/** Light hero used by the inner pages, with the site header on top. */
export function PageHero({ eyebrow, title, lede, actions, visual }: PageHeroProps) {
  const copy = (
    <div className="inner">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      <p className="lede">{lede}</p>
      {actions && <div className="hero-actions">{actions}</div>}
    </div>
  );

  return (
    <div className={visual ? "page-hero" : "page-hero center"}>
      <Header />
      {visual ? (
        <div className="wrap split-hero">
          {copy}
          <div>{visual}</div>
        </div>
      ) : (
        <div className="wrap">{copy}</div>
      )}
    </div>
  );
}
