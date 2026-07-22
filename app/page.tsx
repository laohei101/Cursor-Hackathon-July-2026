"use client";

import { useCallback, useEffect, useState } from "react";
import Scanner from "@/components/Scanner";
import StageSelector from "@/components/StageSelector";
import VerdictCard from "@/components/VerdictCard";
import { AnalysisResult, Stage } from "@/lib/types";

type Phase = "input" | "loading" | "result";

// Seeded barcodes (see lib/seedProducts.ts) so the full scan → lookup → verdict
// flow is demoable in any browser without a physical barcode.
const DEMO_SCANS: { label: string; barcode: string }[] = [
  { label: "Retinol serum", barcode: "0850000000019" },
  { label: "Cold & flu tablets", barcode: "0850000000026" },
  { label: "Safe moisturizer", barcode: "0850000000040" },
  { label: "Prenatal + DHA", barcode: "0850000000057" },
];

const EXAMPLES: { label: string; text: string }[] = [
  {
    label: "Retinol night cream",
    text: "Water, Glycerin, Retinol, Niacinamide, Hyaluronic Acid, Fragrance",
  },
  {
    label: "Cold & flu tablets",
    text: "Ibuprofen 200mg, Pseudoephedrine, Caffeine",
  },
  {
    label: "Energy drink",
    text: "Carbonated Water, Sugar, Caffeine, Taurine, Aspartame",
  },
];

export default function Home() {
  const [stage, setStage] = useState<Stage>("trimester_1");
  const [phase, setPhase] = useState<Phase>("input");
  const [scanning, setScanning] = useState(false);
  const [ingredients, setIngredients] = useState("");
  const [productName, setProductName] = useState("");
  const [barcode, setBarcode] = useState<string | undefined>();
  const [notice, setNotice] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Remember the mother's stage between visits.
  useEffect(() => {
    const saved = localStorage.getItem("expecta:stage") as Stage | null;
    if (saved) setStage(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("expecta:stage", stage);
  }, [stage]);

  const runAnalysis = useCallback(
    async (text: string, opts?: { productName?: string; barcode?: string }) => {
      setPhase("loading");
      setNotice(null);
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ingredientsText: text,
            stage,
            productName: opts?.productName ?? (productName || undefined),
            barcode: opts?.barcode ?? barcode,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Analysis failed.");
        setResult(data as AnalysisResult);
        setPhase("result");
      } catch (e) {
        setNotice(e instanceof Error ? e.message : "Something went wrong.");
        setPhase("input");
      }
    },
    [stage, productName, barcode]
  );

  const handleBarcode = useCallback(
    async (code: string) => {
      setScanning(false);
      setBarcode(code);
      setPhase("loading");
      setNotice(null);
      try {
        const res = await fetch(`/api/lookup?barcode=${encodeURIComponent(code)}`);
        const data = await res.json();
        if (data.found && data.hasIngredients) {
          setProductName(data.productName || "");
          setIngredients(data.ingredientsText);
          await runAnalysis(data.ingredientsText, {
            productName: data.productName,
            barcode: code,
          });
        } else if (data.found && !data.hasIngredients) {
          setProductName(data.productName || "");
          setNotice(
            `Found "${data.productName || code}" but its ingredient list isn't on file. Add it below to get a verdict.`
          );
          setPhase("input");
        } else {
          setNotice(
            data.message ||
              "We don't have this product yet — enter its ingredients below."
          );
          setPhase("input");
        }
      } catch {
        setNotice("Lookup failed. Enter the ingredients manually below.");
        setPhase("input");
      }
    },
    [runAnalysis]
  );

  const reset = () => {
    setResult(null);
    setIngredients("");
    setProductName("");
    setBarcode(undefined);
    setNotice(null);
    setPhase("input");
    setScanning(false);
  };

  return (
    <main className="flex flex-1 flex-col gap-5 px-4 pb-10 pt-6">
      {/* Header */}
      <header className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-lg font-bold text-white shadow-sm">
          e
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none text-brand-800">
            Expecta
          </h1>
          <p className="text-[11px] text-brand-700/70">
            Is it safe? Know at the shelf.
          </p>
        </div>
      </header>

      <StageSelector stage={stage} onChange={setStage} />

      {phase === "result" && result ? (
        <VerdictCard result={result} onReset={reset} />
      ) : (
        <div className="space-y-4">
          {/* Scan / camera */}
          {scanning ? (
            <Scanner
              active={scanning}
              onDetected={handleBarcode}
              onError={(m) => {
                setNotice(m);
                setScanning(false);
              }}
            />
          ) : (
            <button
              onClick={() => {
                setNotice(null);
                setScanning(true);
              }}
              disabled={phase === "loading"}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-300 bg-white/60 py-6 font-semibold text-brand-700 transition hover:border-brand-400 hover:bg-white disabled:opacity-50"
            >
              <span className="text-2xl">📷</span>
              Scan a barcode
            </button>
          )}

          {scanning && (
            <button
              onClick={() => setScanning(false)}
              className="w-full text-sm font-medium text-brand-700 underline-offset-2 hover:underline"
            >
              Cancel scan
            </button>
          )}

          {/* Demo scans — simulate scanning a seeded barcode (no camera needed). */}
          {!scanning && (
            <div>
              <p className="mb-1.5 text-center text-[11px] font-medium text-brand-700/60">
                No barcode handy? Try a demo scan
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {DEMO_SCANS.map((d) => (
                  <button
                    key={d.barcode}
                    onClick={() => handleBarcode(d.barcode)}
                    disabled={phase === "loading"}
                    className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 transition hover:bg-brand-200 disabled:opacity-50"
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {notice && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {notice}
            </div>
          )}

          {/* Manual entry */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-brand-200" />
              <span className="text-xs font-medium text-brand-700/60">
                or enter ingredients
              </span>
              <div className="h-px flex-1 bg-brand-200" />
            </div>

            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Product name (optional)"
              className="w-full rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
            />
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Paste or type the ingredient list… e.g. Water, Retinol, Niacinamide, Fragrance"
              rows={4}
              className="w-full resize-none rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
            />

            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => {
                    setProductName(ex.label);
                    setIngredients(ex.text);
                  }}
                  className="rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-700 transition hover:border-brand-300"
                >
                  {ex.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => runAnalysis(ingredients)}
              disabled={phase === "loading" || ingredients.trim().length < 2}
              className="w-full rounded-xl bg-brand-500 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {phase === "loading" ? "Checking…" : "Check safety"}
            </button>
          </div>

          <p className="px-1 text-center text-[11px] leading-relaxed text-slate-400">
            Verdicts come from named clinical sources (ACOG, FDA, CDC, NIH
            LactMed, MotherToBaby) — not forum threads. Informational only; not a
            substitute for your clinician.
          </p>
        </div>
      )}
    </main>
  );
}
