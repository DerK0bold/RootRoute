/**
 * CO2-intensity per 100g of ingredient (g CO2-equivalent).
 * These values are estimates that take into account:
 * - Agriculture (farming methods)
 * - Transport to Switzerland/Central Europe
 * - Processing / Manufacturing
 */
const CO2_PER_INGREDIENT: Record<string, number> = {
  // Local (CH/DE/AT/FR) – very short transport routes, usually lower footprint
  milk: 18,
  'whole milk': 18,
  'skimmed milk': 16,
  butter: 48,
  eggs: 22,
  salt: 3,
  flour: 13,
  wheat: 13,
  'wheat flour': 13,
  'sunflower oil': 28,
  'olive oil': 38,
  tomatoes: 15,
  oats: 18,
  'whole grain oats': 18,

  // Europe (medium distance, truck transport)
  sugar: 32,
  hazelnuts: 42,
  almonds: 58,
  'skimmed milk powder': 32,

  // Tropical / Remote (Shipping + intensive tropical agriculture)
  cocoa: 92,
  'dark chocolate': 82,
  chocolate: 80,
  'palm oil': 115, // High value due to deforestation risks
  vanilla: 98,
  coffee: 88,
  cashews: 72,
  peanuts: 48,
  rice: 42,
  soy: 36,
  'soy lecithin': 36,
  lecithin: 36,
};

export interface CarbonResult {
  totalCO2: number; // g CO2 per 100g of finished product
  grade: 'a' | 'b' | 'c' | 'd' | 'e';
  gradeColor: string;
  gradeLabel: string;
  topContributors: { name: string; co2: number }[];
}

/**
 * Fuzzy search for an ingredient co2 value. 
 * Checks for exact matches first, then partial matches.
 */
function getCO2ForIngredient(name: string): number | null {
  const lower = name.toLowerCase().trim();
  if (CO2_PER_INGREDIENT[lower] !== undefined) return CO2_PER_INGREDIENT[lower];
  
  // Example: "skimmed milk powder" contains "milk", but we want the most specific match.
  // This simple loop helps us find partial matches if we don't have the exact term.
  for (const [key, val] of Object.entries(CO2_PER_INGREDIENT)) {
    if (lower.includes(key) || key.includes(lower)) return val;
  }
  return null;
}

/**
 * Calculates a rough estimate of the carbon footprint based on the ingredients list.
 * Since we usually don't have exact percentages for every ingredient, 
 * we distribute the weight evenly or use a baseline.
 */
export function calculateCarbonFootprint(ingredients: string[]): CarbonResult {
  const contributors: { name: string; co2: number }[] = [];
  let total = 0;

  // We assume each ingredient contributes an equal share to the 100g total
  // (though in reality, the first ingredients weigh much more).
  const avgWeight = ingredients.length > 0 ? 100 / Math.max(ingredients.length, 5) : 10;

  for (const ing of ingredients) {
    const co2PerHundred = getCO2ForIngredient(ing);
    if (co2PerHundred !== null) {
      const contribution = (co2PerHundred * avgWeight) / 100;
      contributors.push({ name: ing, co2: Math.round(contribution * 10) / 10 });
      total += contribution;
    } else {
      // If we don't know the ingredient, we use a middle-of-the-road baseline
      // so we don't underestimate the footprint.
      total += 1.5; 
    }
  }

  total = Math.round(total);

  // Map the total CO2 value to a human-readable grade (A-E), similar to Nutri-Score.
  let grade: 'a' | 'b' | 'c' | 'd' | 'e';
  let gradeColor: string;
  let gradeLabel: string;

  if (total < 25) {
    grade = 'a'; gradeColor = '#1E8F4E'; gradeLabel = 'Sehr klimafreundlich';
  } else if (total < 55) {
    grade = 'b'; gradeColor = '#56a93a'; gradeLabel = 'Klimafreundlich';
  } else if (total < 110) {
    grade = 'c'; gradeColor = '#FFCA00'; gradeLabel = 'Durchschnittlich';
  } else if (total < 220) {
    grade = 'd'; gradeColor = '#FF6B00'; gradeLabel = 'Klimabelastend';
  } else {
    grade = 'e'; gradeColor = '#D4141D'; gradeLabel = 'Sehr klimabelastend';
  }

  // Sort by highest CO2 impact so the user knows what to look out for.
  const topContributors = contributors
    .sort((a, b) => b.co2 - a.co2)
    .slice(0, 3);

  return { totalCO2: total, grade, gradeColor, gradeLabel, topContributors };
}
