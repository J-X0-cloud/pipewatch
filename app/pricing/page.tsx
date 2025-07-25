import type { Metadata } from "next";
import { PLANS, PRICING_FAQ } from "@/lib/data/pricing";
import { CompareTable } from "@/components/marketing/CompareTable";
import { CtaSection } from "@/components/marketing/CtaSection";
import { PageHero } from "@/components/marketing/PageHero";
import { PlanCard } from "@/components/marketing/PlanCard";
import { SectionHead } from "@/components/marketing/SectionHead";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple Pipewatch pricing by watched workflows, not seats. Start free, then add replay, escalation and a longer audit log as you grow.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={
          <>
            Priced by workflows, <em>not by seats.</em>
          </>
        }
        lede="Invite your whole team at no extra cost. Start free, and upgrade when your automations start carrying real revenue."
      />
      <main>
        <section className="section flush-top">
          <div className="wrap">
            <div className="plans flush">
              {PLANS.map((plan) => (
                <PlanCard key={plan.name} plan={plan} />
              ))}
            </div>
          </div>
        </section>

        <section className="section alt">
          <div className="wrap">
            <SectionHead title="Compare plans" centered />
            <CompareTable />
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <SectionHead eyebrow="FAQ" title="Questions, answered" centered />
            <div className="faq">
              {PRICING_FAQ.map((item) => (
                <details key={item.question} open={item.open}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <CtaSection />
      </main>
    </>
  );
}
