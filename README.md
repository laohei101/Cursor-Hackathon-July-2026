# Expecta — Is it safe? Know at the shelf.

> Instant, evidence-based pregnancy & breastfeeding safety verdicts for any
> product — from a barcode or an ingredient label, with the clinical reasoning
> behind the answer.

A pregnant woman asks whether a product is safe a dozen times a day: a medicine,
a food label, a skincare bottle. The answer lives in clinical databases. Her
access runs through Google, forums, and dated blog posts. **Expecta** reads a
product's barcode or ingredient list, cross-references it against a curated
medical-safety database, and returns a clear verdict — **Safe / Caution / Avoid**
— with per-ingredient reasoning and named sources. Thresholds shift as the
pregnancy progresses and again once nursing begins.

Idea: https://www.ideabrowser.com/hub/ideas/pregnancy-safety-scanner-for-expecting-moms

---

## What version one does

- **Scan a barcode** with the phone camera → looks the product up → analyzes it.
- **Type or paste an ingredient list** when a barcode isn't available or the
  product isn't on file — the primary, always-available path.
- **Pick your stage** — trying to conceive, each trimester, or breastfeeding.
  The verdict changes with it (ibuprofen is *avoid* in the third trimester but
  *safe* while nursing; Listeria-risk foods matter in pregnancy, not after).
- **Get an explainable verdict** — the answer first, then each flagged
  ingredient with plain-language reasoning, dose thresholds, and the
  organizations behind it (ACOG, FDA, CDC, NIH LactMed, MotherToBaby).
- **See the coverage honestly** — recognized-and-cleared ingredients are shown
  as reassurance, and ingredients not yet in the database are surfaced rather
  than silently ignored.

## Why it's trustworthy

The verdict engine encodes **medical caution** without overclaiming:

- **Conservative aggregation** — a product's overall verdict is the most severe
  of its ingredients. One *avoid* ingredient makes the product *avoid*.
- **Absence of evidence ≠ safety** — unclassified ingredients are flagged as a
  coverage gap, never rounded up to "safe."
- **Stage-specific rules** — every ingredient can carry a different verdict per
  life stage, because the real thresholds do.
- **Named sources, not forum threads** — each finding cites the clinical body it
  comes from.

> Expecta is informational and is **not** a substitute for a doctor, midwife, or
> pharmacist. It says so, in the app, on every verdict.

## The moat

The proprietary safety database (`lib/safetyDatabase.ts`) is the asset that
compounds. It seeds ~30 high-frequency ingredients across skincare, food,
medicine, supplements, and herbs, and is designed to deepen category by category
as scan frequency reveals demand. A seed product catalog
(`lib/seedProducts.ts`) layers curated coverage on top of open barcode data for
products the crowd-sourced set handles poorly (medicines, cosmetics).

---

## Architecture

Next.js 15 (App Router) + TypeScript + Tailwind. Mobile-first, single-column.

```
app/
  page.tsx                 Scan flow orchestrator (client)
  layout.tsx               Mobile shell + metadata
  api/
    lookup/route.ts        barcode → product (seed catalog → Open Food Facts)
    analyze/route.ts       ingredients + stage → verdict
components/
  Scanner.tsx              Live camera barcode scanning (@zxing/browser)
  StageSelector.tsx        Life-stage picker (drives every verdict)
  VerdictCard.tsx          Verdict + per-ingredient reasoning + sources
lib/
  safetyDatabase.ts        The proprietary safety database (seed)
  seedProducts.ts          Curated barcode → ingredients catalog
  verdictEngine.ts         Deterministic, explainable verdict computation
  normalize.ts             Label parsing / ingredient tokenization
  types.ts                 Domain model (Stage, Level, Ingredient, …)
  ui.ts                    Level styling helpers
```

**Data flow:** camera decodes a barcode → `/api/lookup` resolves it (seed
catalog first, then Open Food Facts) → the ingredient text and chosen stage go
to `/api/analyze` → the verdict engine matches ingredients against the database,
resolves each to the current stage, and returns the structured result the
`VerdictCard` renders.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
# or
npm run build && npm run start
```

Camera scanning needs `https://` (or `localhost`) and a real camera. No barcode
handy? The home screen has **demo scan** chips that run the full
scan → lookup → verdict path against the seed catalog, plus quick-fill ingredient
examples. Open Food Facts lookups require outbound network access; without it,
the barcode path degrades gracefully to manual entry.

## Try these

| Product | Stage | Verdict |
|---|---|---|
| Retinol night serum | First trimester | **Avoid** (retinoids) |
| Cold & flu tablets | Third trimester | **Avoid** (NSAID) |
| Cold & flu tablets | Breastfeeding | Caffeine/pseudoephedrine **caution** |
| Energy drink | Second trimester | **Caution** (caffeine) |
| Prenatal + DHA | First trimester | **Safe** (folate & DHA cleared) |

## Roadmap

- OCR of photographed labels (barcode + manual entry cover v1).
- Category-by-category database expansion driven by scan frequency.
- Accounts that carry a mother's stage and history across pregnancy and into
  nursing — and into the next baby.
