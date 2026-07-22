/**
 * Seed product catalog — a small proprietary layer that sits in front of the
 * open barcode database.
 *
 * Two jobs:
 *   1. Fills coverage holes where crowd-sourced open data lacks a clean
 *      ingredient list (common for medicines and cosmetics).
 *   2. Keeps the scan flow demoable even without outbound network access.
 *
 * In production this table is where curated, category-by-category coverage
 * accrues as scan frequency reveals demand.
 */
export interface SeedProduct {
  productName: string;
  ingredientsText: string;
  categories?: string;
}

export const SEED_PRODUCTS: Record<string, SeedProduct> = {
  // A retinol night serum (skincare) — the archetypal "looks innocent, isn't" case.
  "0850000000019": {
    productName: "GlowLab Retinol Renewal Night Serum",
    ingredientsText:
      "Water, Glycerin, Retinol, Niacinamide, Hyaluronic Acid, Squalane, Tocopherol, Fragrance",
    categories: "Skincare, Serum",
  },
  // Combination cold & flu tablets (medicine).
  "0850000000026": {
    productName: "ReliefMax Cold & Flu Day Tablets",
    ingredientsText: "Ibuprofen 200mg, Pseudoephedrine Hydrochloride 30mg, Caffeine 25mg",
    categories: "Medicine, Cold and flu",
  },
  // Energy drink (beverage).
  "0850000000033": {
    productName: "Voltage Zero Energy Drink",
    ingredientsText:
      "Carbonated Water, Citric Acid, Taurine, Caffeine, Aspartame, Acesulfame K, Natural Flavors, Niacinamide",
    categories: "Beverages, Energy drinks",
  },
  // Pregnancy-safe moisturizer (skincare) — the reassuring all-clear case.
  "0850000000040": {
    productName: "PureBloom Daily Barrier Moisturizer",
    ingredientsText:
      "Water, Glycerin, Niacinamide, Hyaluronic Acid, Azelaic Acid, Zinc Oxide, Shea Butter",
    categories: "Skincare, Moisturizer",
  },
  // Prenatal supplement (supplement) — recognized & beneficial.
  "0850000000057": {
    productName: "NestWell Prenatal + DHA",
    ingredientsText: "Folic Acid, DHA (Omega-3), Iron, Vitamin D, Vitamin B9, Aspartame",
    categories: "Supplements, Prenatal",
  },
};
