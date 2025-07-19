import type { ReactElement } from "react";

interface IconDefinition {
  strokeWidth: number;
  paths: ReactElement;
}

/** Line icons on a 24×24 grid. Status glyphs (check, x, replay) use a heavier stroke. */
export const ICONS = {
  alert: {
    strokeWidth: 2.4,
    paths: (
      <>
        <path d="M12 3 2 20h20L12 3z" />
        <path d="M12 10v4M12 17h.01" />
      </>
    ),
  },
  muted: {
    strokeWidth: 2,
    paths: (
      <>
        <path d="M11 5 6 9H2v6h4l5 4V5z" />
        <path d="m22 9-6 6M16 9l6 6" />
      </>
    ),
  },
  halfDone: {
    strokeWidth: 2,
    paths: (
      <>
        <path d="M4 12h5M15 12h5" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M4 6h16M4 18h9" />
      </>
    ),
  },
  noOwner: {
    strokeWidth: 2,
    paths: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
        <path d="M18 3l3 3" />
      </>
    ),
  },
  check: { strokeWidth: 3, paths: <path d="M5 12.5l4.5 4.5L19 7.5" /> },
  x: { strokeWidth: 3, paths: <path d="M6 6l12 12M18 6 6 18" /> },
  pulse: { strokeWidth: 2, paths: <path d="M3 12h4l2-5 4 10 2-5h6" /> },
  eye: {
    strokeWidth: 2,
    paths: (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  replay: {
    strokeWidth: 2.6,
    paths: (
      <>
        <path d="M20 11a8 8 0 1 0-2.3 5.7" />
        <path d="M20 4v7h-7" />
      </>
    ),
  },
  list: {
    strokeWidth: 2,
    paths: (
      <>
        <path d="M9 6h11M9 12h11M9 18h11" />
        <path d="M4 6h.01M4 12h.01M4 18h.01" />
      </>
    ),
  },
  users: {
    strokeWidth: 2,
    paths: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20c.8-3.4 3.4-5.5 6.5-5.5s5.7 2.1 6.5 5.5" />
        <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.8c1.6.8 2.6 2.6 3 5.2" />
      </>
    ),
  },
  database: {
    strokeWidth: 2,
    paths: (
      <>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
        <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
      </>
    ),
  },
  key: {
    strokeWidth: 2,
    paths: (
      <>
        <circle cx="8" cy="15" r="4" />
        <path d="m10.8 12.2 9.2-9.2M17 6l3 3M15 8l2 2" />
      </>
    ),
  },
  lock: {
    strokeWidth: 2,
    paths: (
      <>
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </>
    ),
  },
  bell: {
    strokeWidth: 2,
    paths: (
      <>
        <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
      </>
    ),
  },
} satisfies Record<string, IconDefinition>;

export type IconName = keyof typeof ICONS;
