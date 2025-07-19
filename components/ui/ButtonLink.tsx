import type { ReactNode } from "react";
import Link from "next/link";

type Variant = "primary" | "ghost" | "outline" | "green" | "dark";

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  small?: boolean;
  /** Trailing → arrow that nudges on hover. */
  arrow?: boolean;
  children: ReactNode;
}

export function ButtonLink({ href, variant = "primary", small = false, arrow = false, children }: ButtonLinkProps) {
  const className = ["btn", small && "btn-sm", `btn-${variant}`].filter(Boolean).join(" ");
  const content = (
    <>
      {children}
      {arrow && (
        <>
          {" "}
          <span className="arrow">&rarr;</span>
        </>
      )}
    </>
  );
  return href.startsWith("/") ? (
    <Link className={className} href={href}>
      {content}
    </Link>
  ) : (
    <a className={className} href={href}>
      {content}
    </a>
  );
}
