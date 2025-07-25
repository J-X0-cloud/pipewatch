import type { Metadata } from "next";
import { AUDIT_FEATURES, SECURITY_FEATURES } from "@/lib/data/content";
import { CONTACT_MAILTO } from "@/lib/data/site";
import { AuditLog } from "@/components/audit/AuditLog";
import { CtaSection } from "@/components/marketing/CtaSection";
import { InfoCards } from "@/components/marketing/InfoCards";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionHead } from "@/components/marketing/SectionHead";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: "Audit log & security",
  description:
    "An append-only, hash-chained audit log of every replay, edit and rule change, plus encrypted credentials, field redaction, SSO and retention controls.",
};

export default function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Audit log & security"
        title={
          <>
            Every fix, <em>on the record.</em>
          </>
        }
        lede="Automations move money, orders and customer data. Pipewatch records every action taken on them in an append-only log, and handles your credentials and payloads with the care that deserves."
        actions={
          <ButtonLink href={CONTACT_MAILTO} variant="green">
            Request our security overview
          </ButtonLink>
        }
        visual={<AuditLog />}
      />
      <main>
        <section className="section">
          <div className="wrap">
            <SectionHead eyebrow="Audit log" title="Answer “what happened?” in one search" centered>
              Search by order number, run ID, workflow or person. Every entry shows who acted, what changed, and the state
              before and after.
            </SectionHead>
            <InfoCards cards={AUDIT_FEATURES} layout="security" />
          </div>
        </section>

        <section className="section alt">
          <div className="wrap">
            <SectionHead eyebrow="Security" title="Built for data you can’t afford to leak" />
            <InfoCards cards={SECURITY_FEATURES} layout="security" />
          </div>
        </section>

        <CtaSection />
      </main>
    </>
  );
}
