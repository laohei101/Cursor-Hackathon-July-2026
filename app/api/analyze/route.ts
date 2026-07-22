import { NextRequest, NextResponse } from "next/server";
import { analyze } from "@/lib/verdictEngine";
import { STAGES, Stage } from "@/lib/types";

const VALID_STAGES = new Set(STAGES.map((s) => s.id));

/** Ingredients + stage → explainable safety verdict. */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { ingredientsText, stage, productName, barcode } = (body ?? {}) as {
    ingredientsText?: string;
    stage?: string;
    productName?: string;
    barcode?: string;
  };

  if (!ingredientsText || ingredientsText.trim().length < 2) {
    return NextResponse.json(
      { error: "Please provide ingredient text to analyze." },
      { status: 400 }
    );
  }
  if (!stage || !VALID_STAGES.has(stage as Stage)) {
    return NextResponse.json(
      { error: "A valid life stage is required." },
      { status: 400 }
    );
  }

  const result = analyze({
    ingredientsText,
    stage: stage as Stage,
    productName,
    barcode,
  });

  return NextResponse.json(result);
}
