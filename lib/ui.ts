import { Level } from "./types";

/** Visual treatment for each safety level. Tailwind-safe static class strings. */
export const LEVEL_STYLES: Record<
  Level,
  {
    label: string;
    emoji: string;
    text: string;
    bg: string;
    border: string;
    pill: string;
    ring: string;
  }
> = {
  safe: {
    label: "Safe",
    emoji: "✓",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    pill: "bg-emerald-100 text-emerald-800",
    ring: "ring-emerald-200",
  },
  unknown: {
    label: "Limited data",
    emoji: "?",
    text: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
    pill: "bg-slate-100 text-slate-700",
    ring: "ring-slate-200",
  },
  caution: {
    label: "Caution",
    emoji: "!",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    pill: "bg-amber-100 text-amber-800",
    ring: "ring-amber-200",
  },
  avoid: {
    label: "Avoid",
    emoji: "✕",
    text: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    pill: "bg-rose-100 text-rose-800",
    ring: "ring-rose-200",
  },
};

export const CATEGORY_LABEL: Record<string, string> = {
  skincare: "Skincare",
  food: "Food",
  beverage: "Beverage",
  medicine: "Medicine",
  supplement: "Supplement",
  additive: "Additive",
  herb: "Herb",
};
