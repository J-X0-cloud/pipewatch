import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SITE_URL } from "@/lib/data/site";
import { Footer } from "@/components/site/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pipewatch | Monitoring and recovery for Zapier, Make and n8n",
    template: "%s | Pipewatch",
  },
  description:
    "Pipewatch monitors your Zapier, Make, n8n and webhook automations, alerts the right owner when a run fails or goes quiet, and lets you replay failed runs with a full audit log.",
  icons: { icon: { url: "/favicon.svg", type: "image/svg+xml" } },
  openGraph: { siteName: "Pipewatch", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#07171A",
};

/** Pages render their own hero (with the header inside it) so the header can take the hero's theme. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
