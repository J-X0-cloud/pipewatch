"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAV } from "@/lib/data/site";

export function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {MAIN_NAV.map((link) => (
        <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
          {link.label}
        </Link>
      ))}
    </>
  );
}
