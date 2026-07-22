"use client";

import { STAGES, Stage } from "@/lib/types";

/**
 * Horizontal stage picker. The chosen stage drives every verdict, so it stays
 * visible at the top of the flow — safety thresholds shift as pregnancy
 * progresses and again once nursing begins.
 */
export default function StageSelector({
  stage,
  onChange,
}: {
  stage: Stage;
  onChange: (s: Stage) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-brand-700/70">
        I am currently
      </p>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {STAGES.map((s) => {
          const active = s.id === stage;
          return (
            <button
              key={s.id}
              onClick={() => onChange(s.id)}
              className={[
                "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition",
                active
                  ? "border-brand-500 bg-brand-500 text-white shadow-sm"
                  : "border-brand-200 bg-white/70 text-brand-800 hover:border-brand-300",
              ].join(" ")}
              aria-pressed={active}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
