import { CUSTOMER_LOGOS } from "@/lib/data/content";

function Mark({ kind }: { kind: "peak" | "rings" }) {
  return kind === "peak" ? (
    <svg viewBox="0 0 20 20">
      <path d="M2 16 10 3l8 13z" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20">
      <circle cx="7" cy="10" r="5" fill="currentColor" />
      <circle cx="13" cy="10" r="5" fill="none" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

export function CustomerLogos() {
  return (
    <section className="logos">
      <div className="wrap">
        <p>Ops, finance and RevOps teams keep their automations on watch with Pipewatch</p>
        <div className="logo-row" aria-label="Customer names">
          {CUSTOMER_LOGOS.map((logo) => (
            <span key={logo.name} className={`lw ${logo.variant}`}>
              {logo.mark && <Mark kind={logo.mark} />}
              {logo.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
