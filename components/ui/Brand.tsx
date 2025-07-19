import Link from "next/link";

export function BrandMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#0F7B66" />
      <rect x=".5" y=".5" width="31" height="31" rx="8.5" fill="none" stroke="#3EE0B0" strokeOpacity=".35" />
      <path
        d="M5.5 17.5h5.5l2.6-6.5 4.2 11.5 2.6-5H26.5"
        fill="none"
        stroke="#3EE0B0"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Heartbeat line on its own, used as the Slack app avatar. */
export function PulseGlyph() {
  return (
    <svg viewBox="0 0 32 32">
      <path
        d="M5.5 17.5h5.5l2.6-6.5 4.2 11.5 2.6-5H26.5"
        fill="none"
        stroke="#3EE0B0"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Pipewatch home">
      <BrandMark />
      <span>
        <b>pipe</b>
        <span>watch</span>
      </span>
    </Link>
  );
}
