import {
  ALERTING_POINTS,
  AUDIT_POINTS,
  FACTS,
  HOW_IT_WORKS,
  PROBLEMS,
  RECOVERY_POINTS,
  TESTIMONIAL,
} from "@/lib/data/content";
import { SOURCE_ORDER, SOURCES } from "@/lib/data/sources";
import { AlertingPreview } from "@/components/alerts/AlertingPreview";
import { AuditLog } from "@/components/audit/AuditLog";
import { CtaSection } from "@/components/marketing/CtaSection";
import { CustomerLogos } from "@/components/marketing/CustomerLogos";
import { Feature } from "@/components/marketing/Feature";
import { InfoCards } from "@/components/marketing/InfoCards";
import { SectionHead } from "@/components/marketing/SectionHead";
import { AlertCard } from "@/components/runs/AlertCard";
import { RunHistory } from "@/components/runs/RunHistory";
import { RunTimeline } from "@/components/runs/RunTimeline";
import { Header } from "@/components/site/Header";
import { ButtonLink } from "@/components/ui/ButtonLink";

function Hero() {
  return (
    <div className="theme-dark hero">
      <Header />
      <div className="wrap hero-grid">
        <div>
          <span className="pill-note">
            <b>New</b>Replay any failed run from the step that broke
          </span>
          <h1>
            Know the moment an <em>automation</em> breaks.
          </h1>
          <p className="lede">
            Pipewatch watches every Zapier, Make and n8n run and every webhook your business depends on. When one fails
            or goes quiet, the right person hears about it with the context to fix it, and every recovery is on the
            record.
          </p>
          <div className="hero-actions">
            <ButtonLink href="/pricing" arrow>
              Start monitoring free
            </ButtonLink>
            <ButtonLink href="/product" variant="ghost">
              See how it works
            </ButtonLink>
          </div>
          <div className="works-with">
            Works with{" "}
            {SOURCE_ORDER.map((id) => (
              <span className="chip" key={id}>
                <span className="dot" style={{ color: SOURCES[id].color }} />
                {SOURCES[id].label}
              </span>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <RunHistory />
          <AlertCard />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <main>
        <CustomerLogos />

        <section className="section">
          <div className="wrap">
            <SectionHead eyebrow="The problem" title="Automations don’t crash. They fail quietly." centered>
              A green checkmark in Zapier only means a request went out. It doesn&rsquo;t mean the order landed in the ERP,
              the lead reached a rep, or the invoice was sent. Most teams find out from an unhappy customer.
            </SectionHead>
            <InfoCards cards={PROBLEMS} />
          </div>
        </section>

        <section className="section alt">
          <div className="wrap">
            <SectionHead eyebrow="How it works" title="From “is it running?” to “it’s handled”">
              Pipewatch sits alongside the tools you already use. Nothing to rebuild, no agents to install.
            </SectionHead>
            <div className="steps">
              {HOW_IT_WORKS.map((step) => (
                <div className="step" key={step.label}>
                  <span className="n">{step.label}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <Feature
              eyebrow="Failed-run recovery"
              title="Fix the run, not the whole workflow."
              body="Every run is captured step by step, so you can see exactly where it stopped and why. Replay from the failing step with the original payload, or edit it first. Idempotency keys keep retries from creating duplicates."
              points={RECOVERY_POINTS}
              action={
                <ButtonLink href="/recovery" variant="outline" arrow>
                  Explore recovery
                </ButtonLink>
              }
            >
              <div className="stage">
                <RunTimeline />
              </div>
            </Feature>

            <Feature
              flip
              eyebrow="Alerting"
              title="Alerts people actually act on."
              body="Write rules in plain terms: which workflow, what counts as broken, who owns it. Pipewatch groups repeat failures into one incident instead of fifty emails, and escalates only if nobody picks it up."
              points={ALERTING_POINTS}
            >
              <AlertingPreview />
            </Feature>

            <Feature
              eyebrow="Audit log"
              title="A clear record of every fix."
              body="Every replay, edit, mute and rule change is written to a tamper-evident log with who did it and when. When finance or a client asks what happened to an order, the answer is one search away."
              points={AUDIT_POINTS}
              action={
                <ButtonLink href="/security" variant="outline" arrow>
                  Audit &amp; security
                </ButtonLink>
              }
            >
              <div className="stage">
                <AuditLog />
              </div>
            </Feature>
          </div>
        </section>

        <section className="section theme-dark">
          <div className="wrap testimonial">
            <div>
              <blockquote>{TESTIMONIAL.quote}</blockquote>
              <div className="byline">
                <span className="initials">{TESTIMONIAL.initials}</span>
                <div>
                  <b>{TESTIMONIAL.name}</b>
                  <small>{TESTIMONIAL.role}</small>
                </div>
              </div>
            </div>
            <div className="facts">
              {FACTS.map((fact) => (
                <div className="fact" key={fact.title}>
                  <b>{fact.title}</b>
                  <span>{fact.body}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CtaSection />
      </main>
    </>
  );
}
