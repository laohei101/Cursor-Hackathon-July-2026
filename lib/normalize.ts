/**
 * Ingredient-label normalization.
 *
 * Product labels are messy: parentheses, "may contain", percentages, INCI names,
 * localized separators. We normalize to a lower-cased string and a token list so
 * the matcher can find ingredients by alias regardless of surrounding noise.
 */

/** Collapse a raw label into a clean, lower-cased searchable string. */
export function normalizeLabel(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ") // drop parenthetical INCI/latin names
    .replace(/[••*]/g, " ") // bullets
    .replace(/\d+(\.\d+)?\s*%/g, " ") // percentages
    .replace(/[^a-z0-9\s,.;/&-]/g, " ") // strip odd punctuation
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Split a normalized label into candidate ingredient phrases.
 * Separators on real labels are commas, semicolons, periods, and " and ".
 */
export function tokenizeIngredients(normalized: string): string[] {
  return normalized
    .split(/[,;.]|\band\b|\bcontains\b|\bmay contain\b/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
}

/** Whether `needle` appears in `haystack` on word boundaries. */
export function containsPhrase(haystack: string, needle: string): boolean {
  if (!needle) return false;
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // For short aliases (<=4 chars, e.g. "asa", "bha") require whole-word match
  // to avoid false positives inside longer words.
  const boundary = needle.length <= 4 ? `\\b${escaped}\\b` : escaped;
  return new RegExp(boundary, "i").test(haystack);
}
