import { CONTACT_MAILTO } from "@/lib/data/site";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function CtaSection() {
  return (
    <section className="section tight">
      <div className="wrap">
        <div className="cta">
          <div>
            <h2>Put your automations on watch this afternoon.</h2>
            <p>
              Connect one Zapier, Make or n8n account, pick the workflows that matter, and get your first alert rule live
              before the next scheduled run. No agents to install.
            </p>
          </div>
          <div className="hero-actions">
            <ButtonLink href="/pricing" arrow>
              Start free
            </ButtonLink>
            <ButtonLink href={CONTACT_MAILTO} variant="ghost">
              Talk to us
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
