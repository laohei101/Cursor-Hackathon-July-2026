import { SAFETY_DB } from "./safetyDatabase";
import { containsPhrase, normalizeLabel, tokenizeIngredients } from "./normalize";
import {
  AnalysisResult,
  Ingredient,
  IngredientFinding,
  LEVEL_RANK,
  Level,
  Stage,
  StageRule,
} from "./types";

/** Resolve the rule that applies to an ingredient at a given stage. */
function ruleForStage(ing: Ingredient, stage: Stage): StageRule {
  return ing.stages?.[stage] ?? ing.default;
}

/** Highest-severity level in a list (empty → safe). */
function worstLevel(levels: Level[]): Level {
  return levels.reduce<Level>(
    (worst, l) => (LEVEL_RANK[l] > LEVEL_RANK[worst] ? l : worst),
    "safe"
  );
}

function headlineFor(level: Level, findingCount: number): string {
  switch (level) {
    case "avoid":
      return findingCount > 1
        ? "Not recommended — contains ingredients to avoid"
        : "Not recommended for this stage";
    case "caution":
      return "Use with caution — check the details";
    case "unknown":
      return "Limited evidence — proceed thoughtfully";
    case "safe":
    default:
      return "No known concerns for this stage";
  }
}

export interface AnalyzeInput {
  ingredientsText: string;
  stage: Stage;
  productName?: string;
  barcode?: string;
}

/**
 * Core verdict computation. Deterministic and explainable: every flagged
 * ingredient carries its own stage-specific reasoning and named sources.
 */
export function analyze({
  ingredientsText,
  stage,
  productName,
  barcode,
}: AnalyzeInput): AnalysisResult {
  const normalized = normalizeLabel(ingredientsText);

  const findings: IngredientFinding[] = [];
  const cleared: IngredientFinding[] = [];
  const matchedAliasSpans = new Set<string>();

  for (const ing of SAFETY_DB) {
    // Find the first alias that appears in the label.
    let matched: string | null = null;
    for (const alias of ing.aliases) {
      if (containsPhrase(normalized, alias)) {
        matched = alias;
        break;
      }
    }
    if (!matched) continue;

    matchedAliasSpans.add(matched);
    const rule = ruleForStage(ing, stage);
    const finding: IngredientFinding = {
      id: ing.id,
      name: ing.name,
      category: ing.category,
      level: rule.level,
      summary: ing.summary,
      note: rule.note,
      threshold: ing.threshold,
      sources: ing.sources,
      matchedText: matched,
    };
    if (rule.level === "safe") {
      cleared.push(finding);
    } else {
      findings.push(finding);
    }
  }

  // Sort flagged findings by severity (most severe first).
  findings.sort((a, b) => LEVEL_RANK[b.level] - LEVEL_RANK[a.level]);

  const overall = worstLevel(findings.map((f) => f.level));

  // Coverage signal: how many label tokens matched nothing in our DB.
  const tokens = tokenizeIngredients(normalized);
  const unrecognized = tokens.filter(
    (t) => ![...matchedAliasSpans].some((alias) => t.includes(alias))
  );

  return {
    stage,
    overall,
    headline: headlineFor(overall, findings.length),
    findings,
    cleared,
    unrecognizedCount: unrecognized.length,
    unrecognized: unrecognized.slice(0, 24),
    productName,
    barcode,
  };
}
