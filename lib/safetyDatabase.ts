import type { Ingredient } from "./types";

/**
 * Expecta safety database (seed).
 *
 * This is the proprietary asset the product deepens over time. Each entry encodes
 * medical caution: where sources disagree we default to the more conservative read,
 * and absence of evidence is marked `unknown` rather than `safe`.
 *
 * Sources are named organizations, not blog posts:
 *   ACOG        — American College of Obstetricians and Gynecologists
 *   FDA         — U.S. Food and Drug Administration
 *   CDC         — Centers for Disease Control and Prevention
 *   LactMed     — NIH Drugs and Lactation Database
 *   MotherToBaby — OTIS teratogen information service
 *   EWG         — Environmental Working Group (cosmetics)
 *
 * NOTE: informational only, not a substitute for a clinician's advice.
 */
export const SAFETY_DB: Ingredient[] = [
  // ─────────────────────────────── SKINCARE ───────────────────────────────
  {
    id: "retinoids",
    name: "Retinoids (Vitamin A derivatives)",
    aliases: [
      "retinol",
      "retinoid",
      "retinoic acid",
      "tretinoin",
      "retin-a",
      "retinaldehyde",
      "retinyl palmitate",
      "retinyl acetate",
      "adapalene",
      "isotretinoin",
      "accutane",
      "differin",
    ],
    category: "skincare",
    summary:
      "Topical and oral vitamin-A derivatives linked to birth defects; oral forms are strongly teratogenic.",
    threshold: "Avoid topical; oral retinoids are contraindicated.",
    default: {
      level: "avoid",
      note: "Discontinue retinoids while trying to conceive and throughout pregnancy. Oral isotretinoin requires a documented pregnancy-prevention program.",
    },
    stages: {
      breastfeeding: {
        level: "caution",
        note: "Topical retinoids are likely low-risk while nursing, but apply away from the chest and avoid the baby's skin contact. Oral retinoids should still be avoided.",
      },
    },
    sources: [
      { org: "ACOG", label: "Skin conditions during pregnancy" },
      { org: "FDA", label: "Isotretinoin (iPLEDGE) pregnancy warning" },
    ],
  },
  {
    id: "salicylic_acid",
    name: "Salicylic acid",
    aliases: ["salicylic acid", "bha", "beta hydroxy acid", "willow bark extract"],
    category: "skincare",
    summary:
      "Common acne exfoliant; low-dose topical use is considered acceptable, high-dose or oral use is not.",
    threshold: "Rinse-off / low % leave-on is generally fine; avoid high-strength peels.",
    default: {
      level: "caution",
      note: "Low-concentration topical salicylic acid (cleansers, ~2%) is generally considered safe. Avoid high-percentage chemical peels and oral salicylates.",
    },
    stages: {
      trimester_3: {
        level: "caution",
        note: "Keep to low-concentration topical use. Oral salicylates (aspirin-class) are separately restricted in the third trimester.",
      },
    },
    sources: [
      { org: "ACOG", label: "Acne treatment in pregnancy" },
      { org: "EWG", label: "Salicylic acid cosmetic guidance" },
    ],
  },
  {
    id: "benzoyl_peroxide",
    name: "Benzoyl peroxide",
    aliases: ["benzoyl peroxide"],
    category: "skincare",
    summary: "Topical acne agent with minimal systemic absorption.",
    threshold: "Topical use considered acceptable.",
    default: {
      level: "safe",
      note: "Minimal absorption through skin; considered an acceptable acne option during pregnancy and nursing.",
    },
    sources: [{ org: "ACOG", label: "Acne treatment in pregnancy" }],
  },
  {
    id: "hydroquinone",
    name: "Hydroquinone",
    aliases: ["hydroquinone"],
    category: "skincare",
    summary: "Skin-lightening agent with unusually high systemic absorption (~35–45%).",
    default: {
      level: "caution",
      note: "High skin absorption relative to other topicals. No proven harm, but most clinicians advise pausing until after pregnancy and nursing given limited safety data.",
    },
    sources: [{ org: "MotherToBaby", label: "Hydroquinone fact sheet" }],
  },
  {
    id: "niacinamide",
    name: "Niacinamide",
    aliases: ["niacinamide", "nicotinamide", "vitamin b3"],
    category: "skincare",
    summary: "Well-tolerated topical form of vitamin B3.",
    default: {
      level: "safe",
      note: "Considered a safe, gentle active for brightening and barrier support throughout pregnancy and nursing.",
    },
    sources: [{ org: "EWG", label: "Niacinamide cosmetic guidance" }],
  },
  {
    id: "hyaluronic_acid",
    name: "Hyaluronic acid",
    aliases: ["hyaluronic acid", "sodium hyaluronate"],
    category: "skincare",
    summary: "Hydrating humectant naturally present in the body.",
    default: {
      level: "safe",
      note: "No known pregnancy or nursing concerns; a reliable swap for restricted actives.",
    },
    sources: [{ org: "EWG", label: "Hyaluronic acid cosmetic guidance" }],
  },
  {
    id: "azelaic_acid",
    name: "Azelaic acid",
    aliases: ["azelaic acid"],
    category: "skincare",
    summary: "Acne and pigmentation treatment often recommended during pregnancy.",
    default: {
      level: "safe",
      note: "Frequently recommended as a pregnancy-safe alternative to retinoids for acne and melasma.",
    },
    sources: [{ org: "ACOG", label: "Acne treatment in pregnancy" }],
  },
  {
    id: "oxybenzone",
    name: "Oxybenzone (chemical UV filter)",
    aliases: ["oxybenzone", "benzophenone-3"],
    category: "skincare",
    summary: "Chemical sunscreen filter with hormone-disruption questions.",
    default: {
      level: "caution",
      note: "Absorbs into the bloodstream and has raised endocrine-disruption questions. Prefer mineral sunscreens (zinc oxide, titanium dioxide) while pregnant or nursing.",
    },
    sources: [{ org: "EWG", label: "Oxybenzone sunscreen guidance" }],
  },
  {
    id: "zinc_oxide",
    name: "Zinc oxide / Titanium dioxide (mineral SPF)",
    aliases: ["zinc oxide", "titanium dioxide"],
    category: "skincare",
    summary: "Mineral (physical) sunscreen filters that sit on the skin surface.",
    default: {
      level: "safe",
      note: "The preferred sunscreen filters during pregnancy and nursing — they are not meaningfully absorbed.",
    },
    sources: [{ org: "EWG", label: "Mineral sunscreen guidance" }],
  },
  {
    id: "phthalates",
    name: "Phthalates",
    aliases: ["phthalate", "diethyl phthalate", "dbp", "dep", "fragrance"],
    category: "additive",
    summary: "Plasticizers and fragrance carriers flagged as endocrine disruptors.",
    default: {
      level: "caution",
      note: "Associated with hormone disruption in studies; often hidden under 'fragrance/parfum'. Prefer phthalate-free, fragrance-free formulations where possible.",
    },
    sources: [{ org: "EWG", label: "Phthalates in personal care" }],
  },

  // ──────────────────────────── FOOD & BEVERAGE ───────────────────────────
  {
    id: "caffeine",
    name: "Caffeine",
    aliases: ["caffeine", "coffee", "espresso", "guarana", "green tea extract"],
    category: "beverage",
    summary: "Stimulant that crosses the placenta and passes into breast milk.",
    threshold: "Under ~200 mg/day in pregnancy (about one 12 oz coffee).",
    default: {
      level: "caution",
      note: "Keep total caffeine under about 200 mg/day (roughly one 12 oz coffee). Remember to count tea, cola, chocolate and energy drinks.",
    },
    stages: {
      breastfeeding: {
        level: "caution",
        note: "Moderate intake is generally fine while nursing; very high intake can make some babies fussy or wakeful. Under ~300 mg/day is a common guideline.",
      },
    },
    sources: [
      { org: "ACOG", label: "Moderate caffeine consumption during pregnancy" },
      { org: "LactMed", label: "Caffeine and lactation" },
    ],
  },
  {
    id: "alcohol",
    name: "Alcohol (ethanol)",
    aliases: ["alcohol", "ethanol", "ethyl alcohol", "wine", "beer", "liquor", "denatured alcohol"],
    category: "beverage",
    summary: "No amount is established as safe to drink during pregnancy.",
    default: {
      level: "avoid",
      note: "No known safe amount during pregnancy; associated with fetal alcohol spectrum disorders. Best avoided entirely.",
    },
    stages: {
      breastfeeding: {
        level: "caution",
        note: "Occasional single drinks are considered compatible with nursing if you wait ~2 hours per drink before feeding. Alcohol in skincare/food additives at trace levels is not a concern.",
      },
    },
    sources: [
      { org: "CDC", label: "Alcohol use in pregnancy" },
      { org: "ACOG", label: "Alcohol and breastfeeding" },
    ],
  },
  {
    id: "high_mercury_fish",
    name: "High-mercury fish",
    aliases: ["shark", "swordfish", "king mackerel", "tilefish", "marlin", "bigeye tuna"],
    category: "food",
    summary: "Large predatory fish accumulate methylmercury, which harms fetal brain development.",
    default: {
      level: "avoid",
      note: "Avoid high-mercury fish during pregnancy and nursing. Choose low-mercury options (salmon, sardines, light canned tuna in moderation) for beneficial omega-3s.",
    },
    sources: [{ org: "FDA", label: "Advice about eating fish" }],
  },
  {
    id: "listeria_risk",
    name: "Unpasteurized / ready-to-eat deli foods",
    aliases: [
      "unpasteurized",
      "raw milk",
      "soft cheese",
      "brie",
      "feta",
      "queso fresco",
      "deli meat",
      "cold cuts",
      "pate",
      "smoked salmon",
      "lox",
    ],
    category: "food",
    summary: "Listeria-risk foods; infection can cause miscarriage or stillbirth.",
    default: {
      level: "caution",
      note: "Risk of Listeria. Choose pasteurized dairy, and heat deli meats/hot dogs until steaming before eating during pregnancy.",
    },
    stages: {
      breastfeeding: {
        level: "safe",
        note: "Listeria precautions are a pregnancy concern; these foods are generally fine again while nursing.",
      },
    },
    sources: [{ org: "CDC", label: "Listeria and pregnancy" }],
  },
  {
    id: "raw_fish_egg",
    name: "Raw or undercooked fish/eggs/meat",
    aliases: ["raw fish", "sushi", "sashimi", "raw egg", "runny egg", "tartare", "undercooked"],
    category: "food",
    summary: "Raw animal proteins carry Listeria, Salmonella and parasite risk.",
    default: {
      level: "caution",
      note: "Cook fish, eggs and meat thoroughly during pregnancy to avoid foodborne infection. Fully-cooked sushi rolls are fine.",
    },
    stages: {
      breastfeeding: {
        level: "safe",
        note: "These are pregnancy-era precautions; raw preparations are generally fine again while nursing.",
      },
    },
    sources: [{ org: "FDA", label: "Food safety for pregnant women" }],
  },
  {
    id: "licorice",
    name: "Licorice (glycyrrhizin)",
    aliases: ["licorice", "liquorice", "glycyrrhizin", "glycyrrhizic acid"],
    category: "food",
    summary: "Real licorice root can affect blood pressure and fetal development at high intake.",
    default: {
      level: "caution",
      note: "High intake of real (glycyrrhizin-containing) licorice has been linked to preterm birth and effects on the developing baby. Occasional small amounts are usually fine; avoid regular large amounts.",
    },
    sources: [{ org: "MotherToBaby", label: "Licorice fact sheet" }],
  },
  {
    id: "aspartame",
    name: "Aspartame",
    aliases: ["aspartame"],
    category: "additive",
    summary: "Common low-calorie sweetener.",
    default: {
      level: "safe",
      note: "Considered safe in normal amounts during pregnancy and nursing (except for people with phenylketonuria/PKU).",
    },
    sources: [{ org: "FDA", label: "Aspartame and food additives" }],
  },

  // ─────────────────────────────── MEDICINE ───────────────────────────────
  {
    id: "ibuprofen",
    name: "Ibuprofen / NSAIDs",
    aliases: ["ibuprofen", "naproxen", "advil", "motrin", "aleve", "nsaid", "diclofenac", "ketoprofen"],
    category: "medicine",
    summary: "Anti-inflammatory painkillers restricted especially later in pregnancy.",
    default: {
      level: "caution",
      note: "Generally avoided in pregnancy where possible. The FDA advises against NSAIDs from 20 weeks onward due to fetal kidney and heart risks. Ask your clinician before use.",
    },
    stages: {
      trimester_3: {
        level: "avoid",
        note: "Avoid NSAIDs in the third trimester — risk of premature closure of the fetal ductus arteriosus and low amniotic fluid. Acetaminophen is the usual alternative.",
      },
      breastfeeding: {
        level: "safe",
        note: "Ibuprofen is considered compatible with breastfeeding — very little passes into milk.",
      },
    },
    sources: [
      { org: "FDA", label: "NSAID use after 20 weeks of pregnancy" },
      { org: "LactMed", label: "Ibuprofen and lactation" },
    ],
  },
  {
    id: "acetaminophen",
    name: "Acetaminophen (paracetamol)",
    aliases: ["acetaminophen", "paracetamol", "tylenol", "panadol"],
    category: "medicine",
    summary: "First-line pain/fever reliever in pregnancy.",
    threshold: "Lowest effective dose, shortest duration.",
    default: {
      level: "safe",
      note: "Generally the preferred pain and fever reliever in pregnancy and nursing. Use the lowest effective dose for the shortest time, and follow your clinician's advice.",
    },
    sources: [
      { org: "ACOG", label: "Acetaminophen use in pregnancy" },
      { org: "LactMed", label: "Acetaminophen and lactation" },
    ],
  },
  {
    id: "aspirin",
    name: "Aspirin (acetylsalicylic acid)",
    aliases: ["aspirin", "acetylsalicylic acid", "asa"],
    category: "medicine",
    summary: "Blood-thinning painkiller; low-dose is sometimes prescribed in pregnancy.",
    default: {
      level: "caution",
      note: "Full-dose aspirin is generally avoided. Low-dose aspirin is sometimes prescribed (e.g. for preeclampsia prevention) — only take it if your clinician has directed you to.",
    },
    stages: {
      trimester_3: {
        level: "avoid",
        note: "Full-dose aspirin is avoided in the third trimester (bleeding and ductus arteriosus risk). Continue prescribed low-dose aspirin only under medical direction.",
      },
    },
    sources: [{ org: "ACOG", label: "Low-dose aspirin in pregnancy" }],
  },
  {
    id: "pseudoephedrine",
    name: "Pseudoephedrine / phenylephrine (decongestants)",
    aliases: ["pseudoephedrine", "phenylephrine", "sudafed", "decongestant"],
    category: "medicine",
    summary: "Oral decongestants that can narrow blood vessels.",
    default: {
      level: "caution",
      note: "Oral decongestants are usually avoided in the first trimester and used cautiously later. Saline sprays are a safer first step. Check with your clinician.",
    },
    stages: {
      breastfeeding: {
        level: "caution",
        note: "Pseudoephedrine can reduce milk supply. Occasional use may be acceptable but watch supply; ask about alternatives.",
      },
    },
    sources: [
      { org: "MotherToBaby", label: "Decongestants fact sheet" },
      { org: "LactMed", label: "Pseudoephedrine and lactation" },
    ],
  },

  // ────────────────────────── SUPPLEMENTS & HERBS ─────────────────────────
  {
    id: "folic_acid",
    name: "Folic acid / folate",
    aliases: ["folic acid", "folate", "methylfolate", "vitamin b9"],
    category: "supplement",
    summary: "Essential B vitamin that prevents neural tube defects.",
    default: {
      level: "safe",
      note: "Recommended — not just safe. At least 400 mcg/day before and during early pregnancy reduces the risk of neural tube defects.",
    },
    sources: [{ org: "CDC", label: "Folic acid recommendations" }],
  },
  {
    id: "dha",
    name: "DHA / omega-3 (fish oil)",
    aliases: ["dha", "omega-3", "omega 3", "fish oil", "docosahexaenoic acid"],
    category: "supplement",
    summary: "Fatty acid supporting fetal brain and eye development.",
    default: {
      level: "safe",
      note: "Beneficial during pregnancy and nursing. Choose purified supplements to minimize mercury exposure.",
    },
    sources: [{ org: "ACOG", label: "Nutrition during pregnancy" }],
  },
  {
    id: "vitamin_a_high",
    name: "High-dose Vitamin A (retinyl/preformed)",
    aliases: ["vitamin a", "retinyl palmitate", "preformed vitamin a", "cod liver oil"],
    category: "supplement",
    summary: "Preformed vitamin A is teratogenic at high doses.",
    threshold: "Keep under ~3,000 mcg RAE (10,000 IU)/day.",
    default: {
      level: "caution",
      note: "High doses of preformed vitamin A can cause birth defects. Beta-carotene is fine, but avoid high-dose vitamin A and cod liver oil supplements. Prenatal-vitamin levels are safe.",
    },
    sources: [{ org: "MotherToBaby", label: "Vitamin A fact sheet" }],
  },
  {
    id: "sage",
    name: "Sage (as a supplement/tea)",
    aliases: ["sage", "salvia officinalis"],
    category: "herb",
    summary: "Culinary amounts are fine; concentrated amounts can affect milk supply.",
    default: {
      level: "caution",
      note: "Food amounts are fine. Concentrated sage supplements/teas are traditionally used to reduce milk supply, so avoid them if you want to maintain supply.",
    },
    stages: {
      conceiving: {
        level: "safe",
        note: "Culinary sage is fine when trying to conceive.",
      },
      trimester_1: {
        level: "caution",
        note: "Avoid concentrated sage supplements and essential oil; culinary amounts are fine.",
      },
    },
    sources: [{ org: "LactMed", label: "Sage and lactation" }],
  },
  {
    id: "fenugreek",
    name: "Fenugreek",
    aliases: ["fenugreek", "trigonella"],
    category: "herb",
    summary: "Galactagogue herb — a concern in pregnancy, sometimes used while nursing.",
    default: {
      level: "caution",
      note: "Avoid medicinal doses in pregnancy (may stimulate the uterus). Culinary spice amounts are fine.",
    },
    stages: {
      breastfeeding: {
        level: "caution",
        note: "Sometimes used to boost milk supply, but evidence is mixed and it can cause GI upset in mother and baby. Discuss with a lactation consultant.",
      },
    },
    sources: [{ org: "LactMed", label: "Fenugreek and lactation" }],
  },
  {
    id: "essential_oils_strong",
    name: "Strong essential oils (clary sage, rosemary, wintergreen)",
    aliases: ["clary sage", "rosemary oil", "wintergreen", "camphor", "pennyroyal", "essential oil"],
    category: "herb",
    summary: "Certain concentrated essential oils are not recommended in pregnancy.",
    default: {
      level: "caution",
      note: "Some concentrated essential oils (clary sage, rosemary, wintergreen, camphor, pennyroyal) are traditionally avoided in pregnancy. Diluted, occasional aromatherapy of gentler oils is generally considered fine.",
    },
    sources: [{ org: "MotherToBaby", label: "Herbal products in pregnancy" }],
  },
];
