"use client";

import { AnalysisResult, STAGES } from "@/lib/types";
import { CATEGORY_LABEL, LEVEL_STYLES } from "@/lib/ui";

/**
 * The verdict, delivered the way a mother needs it at the shelf: the answer
 * first, then the reasoning per ingredient, then the evidence, then the honest
 * limits (coverage gaps + disclaimer).
 */
export default function VerdictCard({
  result,
  onReset,
}: {
  result: AnalysisResult;
  onReset: () => void;
}) {
  const overall = LEVEL_STYLES[result.overall];
  const stageLabel =
    STAGES.find((s) => s.id === result.stage)?.label ?? result.stage;

  return (
    <div className="animate-rise space-y-4">
      {/* Overall verdict banner */}
      <div
        className={`rounded-2xl border ${overall.border} ${overall.bg} p-5 shadow-sm`}
      >
        <div className="flex items-start gap-3">
          <span
            className={`flex h-11 w-11 flex-none items-center justify-center rounded-full text-xl font-bold ring-4 ${overall.ring} ${overall.pill}`}
            aria-hidden
          >
            {overall.emoji}
          </span>
          <div className="min-w-0">
            <div
              className={`text-xs font-semibold uppercase tracking-wide ${overall.text}`}
            >
              {overall.label} · {stageLabel}
            </div>
            <h2 className="mt-0.5 text-lg font-semibold leading-snug text-slate-900">
              {result.headline}
            </h2>
            {result.productName && (
              <p className="mt-1 truncate text-sm text-slate-500">
                {result.productName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Flagged ingredients with per-ingredient reasoning */}
      {result.findings.length > 0 && (
        <section className="space-y-3">
          <h3 className="px-1 text-sm font-semibold text-slate-700">
            What to know ({result.findings.length})
          </h3>
          {result.findings.map((f) => {
            const s = LEVEL_STYLES[f.level];
            return (
              <article
                key={f.id}
                className={`rounded-xl border ${s.border} bg-white p-4 shadow-sm`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-slate-900">{f.name}</h4>
                  <span
                    className={`flex-none rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.pill}`}
                  >
                    {s.label}
                  </span>
                </div>
                <p className="mt-0.5 text-xs uppercase tracking-wide text-slate-400">
                  {CATEGORY_LABEL[f.category] ?? f.category}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {f.note}
                </p>
                {f.threshold && (
                  <p className="mt-2 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                    Threshold: {f.threshold}
                  </p>
                )}
                {f.sources.length > 0 && (
                  <p className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                    {f.sources.map((src, i) => (
                      <span
                        key={i}
                        className="rounded bg-slate-100 px-1.5 py-0.5"
                        title={src.label}
                      >
                        {src.org}
                      </span>
                    ))}
                  </p>
                )}
              </article>
            );
          })}
        </section>
      )}

      {/* Cleared ingredients — reassurance */}
      {result.cleared.length > 0 && (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
          <h3 className="text-sm font-semibold text-emerald-800">
            Recognized & cleared ({result.cleared.length})
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {result.cleared.map((c) => (
              <span
                key={c.id}
                className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200"
                title={c.note}
              >
                {c.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Honest coverage signal */}
      {result.unrecognizedCount > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-700">
            {result.unrecognizedCount} ingredient
            {result.unrecognizedCount === 1 ? "" : "s"} not yet in our database
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            We don&apos;t have a verdict for these yet, so they aren&apos;t
            reflected above. Coverage grows with every scan.
          </p>
          {result.unrecognized.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {result.unrecognized.map((u, i) => (
                <span
                  key={i}
                  className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500"
                >
                  {u}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Disclaimer */}
      <p className="px-1 text-[11px] leading-relaxed text-slate-400">
        Expecta is informational and encodes medical caution, but it is not a
        substitute for your doctor, midwife, or pharmacist. When in doubt, or for
        prescription medicines, check with your clinician.
      </p>

      <button
        onClick={onReset}
        className="w-full rounded-xl bg-brand-500 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-600"
      >
        Scan another product
      </button>
    </div>
  );
}
