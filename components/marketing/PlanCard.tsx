import type { Plan } from "@/lib/data/pricing";
import { CONTACT_MAILTO } from "@/lib/data/site";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div className={plan.badge ? "plan pop" : "plan"}>
      {plan.badge && <span className="tag">{plan.badge}</span>}
      <h3>{plan.name}</h3>
      <p className="for">{plan.audience}</p>
      <div className="price">
        <strong>{plan.price}</strong>
        <span>/ month</span>
      </div>
      <div className="annual">{plan.billing}</div>
      <ButtonLink href={CONTACT_MAILTO} variant={plan.ctaVariant}>
        {plan.cta}
      </ButtonLink>
      <ul>
        {plan.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </div>
  );
}
