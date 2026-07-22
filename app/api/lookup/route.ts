import { NextRequest, NextResponse } from "next/server";
import { SEED_PRODUCTS } from "@/lib/seedProducts";

/**
 * Barcode → product lookup.
 *
 * Resolution order:
 *   1. Proprietary seed catalog (curated coverage; also keeps scanning demoable
 *      when outbound network is restricted).
 *   2. Open Food Facts (free, no key), proxied so the client never talks to a
 *      third party directly.
 *
 * Returns the product name and ingredient text, which the client then sends to
 * /api/analyze.
 */
export async function GET(req: NextRequest) {
  const barcode = req.nextUrl.searchParams.get("barcode")?.trim();
  if (!barcode || !/^\d{6,14}$/.test(barcode)) {
    return NextResponse.json(
      { error: "A valid numeric barcode is required." },
      { status: 400 }
    );
  }

  // 1) Proprietary seed catalog takes precedence over open data.
  const seed = SEED_PRODUCTS[barcode];
  if (seed) {
    return NextResponse.json({
      found: true,
      barcode,
      productName: seed.productName,
      ingredientsText: seed.ingredientsText,
      image: null,
      categories: seed.categories ?? null,
      hasIngredients: seed.ingredientsText.trim().length > 0,
      source: "expecta",
    });
  }

  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}.json?fields=product_name,brands,ingredients_text,ingredients_text_en,image_front_small_url,categories`,
      {
        headers: { "User-Agent": "Expecta/0.1 (pregnancy-safety-scanner)" },
        // Cache lookups briefly to keep repeated scans snappy.
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Product database is temporarily unavailable." },
        { status: 502 }
      );
    }

    const data = await res.json();
    if (data.status !== 1 || !data.product) {
      return NextResponse.json(
        {
          found: false,
          barcode,
          message:
            "We don't have this product yet. You can type or photograph its ingredients instead — and your scan helps us fill the gap.",
        },
        { status: 200 }
      );
    }

    const p = data.product;
    const ingredients: string =
      p.ingredients_text_en || p.ingredients_text || "";

    return NextResponse.json({
      found: true,
      barcode,
      productName: [p.brands, p.product_name].filter(Boolean).join(" ").trim(),
      ingredientsText: ingredients,
      image: p.image_front_small_url || null,
      categories: p.categories || null,
      hasIngredients: ingredients.trim().length > 0,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Lookup failed. Check your connection and try again." },
      { status: 500 }
    );
  }
}
