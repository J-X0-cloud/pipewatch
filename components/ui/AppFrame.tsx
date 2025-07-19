import type { ReactNode } from "react";

interface AppFrameProps {
  /** Breadcrumb before the current page, e.g. "Northfield Supply". */
  trail: string;
  page: ReactNode;
  /** Right side of the title bar: a live indicator or a status badge. */
  indicator?: ReactNode;
  children: ReactNode;
}

/** Product window chrome: traffic lights, breadcrumbs and a live/status slot. */
export function AppFrame({ trail, page, indicator, children }: AppFrameProps) {
  return (
    <div className="app">
      <div className="app-bar">
        <div className="lights">
          <i />
          <i />
          <i />
        </div>
        <div className="crumbs">
          {trail} / <b>{page}</b>
        </div>
        {indicator && <span className="live">{indicator}</span>}
      </div>
      {children}
    </div>
  );
}

export function LiveIndicator({ label = "Live" }: { label?: string }) {
  return (
    <>
      <span className="dot" />
      {label}
    </>
  );
}
