import type { InfoCard } from "@/lib/data/content";
import { Icon } from "@/components/ui/Icon";

interface InfoCardsProps {
  cards: readonly InfoCard[];
  /** "problem" is the 3-up grid; "security" wraps to rows of three with tighter cards. */
  layout?: "problem" | "security";
}

export function InfoCards({ cards, layout = "problem" }: InfoCardsProps) {
  return (
    <div className={layout === "problem" ? "problem-grid" : "sec-grid"}>
      {cards.map((card) => (
        <div className="card" key={card.title}>
          <span className={card.tone ? `icon ${card.tone}` : "icon"}>
            <Icon name={card.icon} />
          </span>
          <h3>{card.title}</h3>
          <p>{card.body}</p>
          {card.footnote && <p className="quote-line">{card.footnote}</p>}
        </div>
      ))}
    </div>
  );
}
