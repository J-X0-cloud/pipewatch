import type { Metadata } from "next";
import { RECOVERY_OPTIONS, REPLAY_POINTS } from "@/lib/data/content";
import { CtaSection } from "@/components/marketing/CtaSection";
import { Feature } from "@/components/marketing/Feature";
import { InfoCards } from "@/components/marketing/InfoCards";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionHead } from "@/components/marketing/SectionHead";
import { RecoveryQueueView } from "@/components/runs/RecoveryQueueView";
import { RunTimeline } from "@/components/runs/RunTimeline";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: "Failed-run recovery",
  description:
    "Replay failed Zapier, Make and n8n runs from the exact step that broke, with stored payloads, bulk replay and idempotency keys that prevent duplicates.",
};

export default function RecoveryPage() {
  return (
    <>
      <PageHero
        eyebrow="Failed-run recovery"
        title={
          <>
            Finish the run that <em>broke halfway.</em>
          </>
        }
        lede="When a workflow fails on step four, steps one to three already happened. Pipewatch keeps the payload and the context from every step, so you can resume exactly where it stopped, without double-charging, double-emailing or re-creating records."
        actions={
          <>
            <ButtonLink href="/pricing" variant="green" arrow>
              Start free
            </ButtonLink>
            <ButtonLink href="/security" variant="outline">
              See the audit log
            </ButtonLink>
          </>
        }
        visual={<RecoveryQueueView />}
      />
      <main>
        <section className="section">
          <div className="wrap">
            <Feature
              eyebrow="Step-level replay"
              title="See exactly where it stopped."
              body="Each run opens as a timeline: what came in, what every step returned, and the exact response that ended it. Replay from the failed step, skip a step you’ve handled by hand, or fix a bad field in the payload first."
              points={REPLAY_POINTS}
            >
              <div className="stage">
                <RunTimeline />
              </div>
            </Feature>
          </div>
        </section>

        <section className="section alt">
          <div className="wrap">
            <SectionHead eyebrow="Recovery options" title="The right fix for each kind of failure" centered>
              Not every failure should be retried. Pipewatch tells the difference and suggests the safe next step.
            </SectionHead>
            <InfoCards cards={RECOVERY_OPTIONS} />
          </div>
        </section>

        <CtaSection />
      </main>
    </>
  );
}
