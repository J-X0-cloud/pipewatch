import type { MetadataRoute } from "next";
import { MAIN_NAV, SITE_URL } from "@/lib/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL, priority: 1 }, ...MAIN_NAV.map((link) => ({ url: `${SITE_URL}${link.href}`, priority: 0.8 }))];
}
