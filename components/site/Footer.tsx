import Link from "next/link";
import { FOOTER_COLUMNS, type NavLink } from "@/lib/data/site";
import { Brand } from "@/components/ui/Brand";

function FooterLink({ link }: { link: NavLink }) {
  return link.href.startsWith("/") ? <Link href={link.href}>{link.label}</Link> : <a href={link.href}>{link.label}</a>;
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Brand />
            <p className="footer-about">
              Monitoring, alerting and failed-run recovery for the automations your business quietly depends on.
            </p>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h4>{column.title}</h4>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 Pipewatch. Made in Los Angeles.</span>
          <span className="status-ok">
            <span className="dot" />
            All monitoring systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}
