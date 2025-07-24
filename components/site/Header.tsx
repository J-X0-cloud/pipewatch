import Link from "next/link";
import { MAIN_NAV } from "@/lib/data/site";
import { Brand } from "@/components/ui/Brand";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { NavLinks } from "./NavLinks";

/** Site header. Rendered inside each page's hero so it inherits the hero's light or dark theme. */
export function Header() {
  return (
    <header className="site-header">
      <div className="wrap nav">
        <Brand />
        <nav className="nav-links" aria-label="Main">
          <NavLinks />
        </nav>
        <div className="nav-cta">
          <a className="signin" href="#">
            Sign in
          </a>
          <ButtonLink href="/pricing" small>
            Start free
          </ButtonLink>
          <details className="menu">
            <summary aria-label="Open menu">
              <i />
            </summary>
            <div className="menu-panel">
              {MAIN_NAV.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
              <a href="#">Sign in</a>
              <ButtonLink href="/pricing" variant="dark" small>
                Start free
              </ButtonLink>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
