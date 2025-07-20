import type { SourceId } from "@/types/runs";

export interface SourceMeta {
  id: SourceId;
  label: string;
  /** Glyph inside the coloured source badge. */
  glyph: string;
  /** Badge class in globals.css. */
  badge: "zp" | "mk" | "n8" | "wh";
  color: string;
}

export const SOURCES: Record<SourceId, SourceMeta> = {
  zapier: { id: "zapier", label: "Zapier", glyph: "Z", badge: "zp", color: "#E4683A" },
  make: { id: "make", label: "Make", glyph: "M", badge: "mk", color: "#8F74EA" },
  n8n: { id: "n8n", label: "n8n", glyph: "n8", badge: "n8", color: "#EA6A8C" },
  webhook: { id: "webhook", label: "Webhooks", glyph: "{ }", badge: "wh", color: "#5FB3D6" },
};

export const SOURCE_ORDER: readonly SourceId[] = ["zapier", "make", "n8n", "webhook"];
