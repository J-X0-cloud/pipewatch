import type { Metadata } from "next";
import { ALERT_RULE_POINTS, MONITORING_SIGNALS } from "@/lib/data/content";
import { AlertingPreview } from "@/components/alerts/AlertingPreview";
import { CtaSection } from "@/components/marketing/CtaSection";
import { Feature } from "@/components/marketing/Feature";
import { InfoCards } from "@/components/marketing/InfoCards";
import { Integrations } from "@/components/marketing/Integrations";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionHead } from "@/components/marketing/SectionHead";
import { WorkflowHealthList } from "@/components/runs/WorkflowHealthList";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: "Product",
  description:
    "See the health of every Zapier, Make, n8n and webhook automation in one view, with failure, missed-run and outcome checks and alert rules your team can read.",
};

export default function ProductPage() {
  return (
    <>
      <PageHero
        eyebrow="Product"
        title={
          <>
            Every workflow, <em>one health view.</em>
          </>
        }
        lede="Pipewatch pulls run history from Zapier, Make and n8n, listens to your webhooks, and compares what happened against what should have happened. The result is a single list of what’s healthy, what’s late and what’s broken, with an owner next to each."
        actions={
          <>
            <ButtonLink href="/pricing" variant="green" arrow>
              Start free
            </ButtonLink>
            <ButtonLink href="/recovery" variant="outline">
              How recovery works
            </ButtonLink>
          </>
        }
        visual={<WorkflowHealthList />}
      />
      <main>
        <section className="section">
          <div className="wrap">
            <SectionHead eyebrow="Monitoring" title="Three signals, so nothing slips through" centered>
              Errors are the easy part. Pipewatch also notices when a run never happens, and when it runs but
              doesn&rsquo;t produce the result it was built for.
            </SectionHead>
            <InfoCards cards={MONITORING_SIGNALS} />
          </div>
        </section>

        <section className="section alt" id="alerts">
          <div className="wrap">
            <Feature
              flip
              eyebrow="Alert rules"
              title="Rules your whole team can read."
              body="No query language. Pick a workflow or a tag, choose what counts as a problem, and decide who hears about it and how fast it escalates."
              points={ALERT_RULE_POINTS}
            >
              <AlertingPreview />
            </Feature>
          </div>
        </section>

        <section className="section" id="integrations">
          <div className="wrap">
            <SectionHead eyebrow="Integrations" title="Connects to the tools you already run">
              Read-only by default. Pipewatch only asks for write access when you turn on replay for a connection.
            </SectionHead>
            <Integrations />
          </div>
        </section>

        <CtaSection />
      </main>
    </>
  );
}
