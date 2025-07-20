export const CONTACT_EMAIL = "hello@pipewatch.com";
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;
export const SITE_URL = "https://pipewatch.com";

export interface NavLink {
  href: string;
  label: string;
}

export const MAIN_NAV: readonly NavLink[] = [
  { href: "/product", label: "Product" },
  { href: "/recovery", label: "Recovery" },
  { href: "/security", label: "Audit & security" },
  { href: "/pricing", label: "Pricing" },
];

export const FOOTER_COLUMNS: readonly { title: string; links: readonly NavLink[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/product", label: "Monitoring" },
      { href: "/product#alerts", label: "Alert rules" },
      { href: "/recovery", label: "Failed-run recovery" },
      { href: "/security", label: "Audit log" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Connects to",
    links: [
      { href: "/product#integrations", label: "Zapier" },
      { href: "/product#integrations", label: "Make" },
      { href: "/product#integrations", label: "n8n" },
      { href: "/product#integrations", label: "Webhooks & HTTP" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/security", label: "Security" },
      { href: "#", label: "Changelog" },
      { href: "#", label: "Docs" },
      { href: CONTACT_MAILTO, label: CONTACT_EMAIL },
    ],
  },
];
