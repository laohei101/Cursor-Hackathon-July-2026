// Core domain types for Expecta's pregnancy & nursing safety engine.

/** Life stages whose safety thresholds differ. Ordered from pre-pregnancy through nursing. */
export type Stage =
  | "conceiving"
  | "trimester_1"
  | "trimester_2"
  | "trimester_3"
  | "breastfeeding";

export const STAGES: { id: Stage; label: string; short: string }[] = [
  { id: "conceiving", label: "Trying to conceive", short: "Conceiving" },
  { id: "trimester_1", label: "First trimester", short: "1st tri" },
  { id: "trimester_2", label: "Second trimester", short: "2nd tri" },
  { id: "trimester_3", label: "Third trimester", short: "3rd tri" },
  { id: "breastfeeding", label: "Breastfeeding", short: "Nursing" },
];

/**
 * Safety levels, ordered by severity. `unknown` sits between safe and caution:
 * absence of evidence is treated with mild caution, never as a green light.
 */
export type Level = "safe" | "unknown" | "caution" | "avoid";

export const LEVEL_RANK: Record<Level, number> = {
  safe: 0,
  unknown: 1,
  caution: 2,
  avoid: 3,
};

export type Category =
  | "skincare"
  | "food"
  | "beverage"
  | "medicine"
  | "supplement"
  | "additive"
  | "herb";

/** A verdict for one ingredient in the context of one stage. */
export interface StageRule {
  level: Level;
  /** Plain-language reasoning a mother can act on, specific to this stage. */
  note: string;
}

/** A single ingredient entry in the proprietary safety database. */
export interface Ingredient {
  id: string;
  /** Canonical display name. */
  name: string;
  /** Lower-cased strings used to detect this ingredient in a label. */
  aliases: string[];
  category: Category;
  /** One-line general description of the concern (stage-independent). */
  summary: string;
  /** Optional dose context ("under 200mg/day", "topical, rinse-off"). */
  threshold?: string;
  /** Fallback rule applied to any stage not explicitly overridden. */
  default: StageRule;
  /** Stage-specific overrides. */
  stages?: Partial<Record<Stage, StageRule>>;
  /** Evidence provenance shown in the reasoning panel. */
  sources: Source[];
}

export interface Source {
  org: string;
  label: string;
}

/** A matched ingredient resolved against a specific stage. */
export interface IngredientFinding {
  id: string;
  name: string;
  category: Category;
  level: Level;
  summary: string;
  note: string;
  threshold?: string;
  sources: Source[];
  /** The exact substring from the label that triggered the match. */
  matchedText: string;
}

export interface AnalysisResult {
  stage: Stage;
  overall: Level;
  headline: string;
  /** Flagged ingredients (caution/avoid/unknown), most severe first. */
  findings: IngredientFinding[];
  /** Recognized-and-safe ingredients — shown as reassurance. */
  cleared: IngredientFinding[];
  /** Count of tokens we could not classify (coverage gap signal). */
  unrecognizedCount: number;
  unrecognized: string[];
  productName?: string;
  barcode?: string;
}
