import {
  parseIngredientsList,
  getNutriScoreColor,
  getEcoScoreColor,
} from '../../services/openFoodFacts';
import type { OpenFoodFactsProduct } from '../../services/openFoodFacts';

function makeProduct(overrides: Partial<OpenFoodFactsProduct>): OpenFoodFactsProduct {
  return { code: '0000000000000', product_name: 'Test', ...overrides };
}

describe('parseIngredientsList', () => {
  it('parses a comma-separated German ingredients text', () => {
    const product = makeProduct({
      ingredients_text_de: 'Zucker, Kakao, Milch, Butter, Salz',
    });
    const result = parseIngredientsList(product);
    expect(result).toContain('Zucker');
    expect(result).toContain('Kakao');
    expect(result.length).toBe(5);
  });

  it('falls back to ingredients_text when no German text is available', () => {
    const product = makeProduct({
      ingredients_text: 'Sugar, Cocoa, Milk',
    });
    const result = parseIngredientsList(product);
    expect(result).toContain('Sugar');
  });

  it('falls back to structured ingredients array when no text is present', () => {
    const product = makeProduct({
      ingredients: [
        { id: 'en:sugar', text: 'Zucker' },
        { id: 'en:cocoa', text: 'Kakao' },
      ],
    });
    const result = parseIngredientsList(product);
    expect(result).toContain('Zucker');
    expect(result).toContain('Kakao');
  });

  it('returns an empty array for a product with no ingredient data', () => {
    const product = makeProduct({});
    expect(parseIngredientsList(product)).toEqual([]);
  });

  it('strips percentage annotations from ingredient text', () => {
    const product = makeProduct({
      ingredients_text_de: 'Kakao (20%), Zucker, Milch (5%)',
    });
    const result = parseIngredientsList(product);
    result.forEach((ing) => expect(ing).not.toMatch(/\d+%/));
  });

  it('limits output to at most 20 ingredients', () => {
    const many = Array.from({ length: 30 }, (_, i) => `Zutat${i}`).join(', ');
    const product = makeProduct({ ingredients_text_de: many });
    expect(parseIngredientsList(product).length).toBeLessThanOrEqual(20);
  });
});

describe('getNutriScoreColor', () => {
  it('returns green (#038141) for grade A', () => {
    expect(getNutriScoreColor('a')).toBe('#038141');
    expect(getNutriScoreColor('A')).toBe('#038141');
  });

  it('returns red (#E63E11) for grade E', () => {
    expect(getNutriScoreColor('e')).toBe('#E63E11');
  });

  it('returns a fallback color for unknown grades', () => {
    expect(getNutriScoreColor('z')).toBe('#888');
    expect(getNutriScoreColor(undefined)).toBe('#888');
  });
});

describe('getEcoScoreColor', () => {
  it('returns green (#1E8F4E) for grade A', () => {
    expect(getEcoScoreColor('a')).toBe('#1E8F4E');
    expect(getEcoScoreColor('A')).toBe('#1E8F4E');
  });

  it('returns red (#D4141D) for grade E', () => {
    expect(getEcoScoreColor('e')).toBe('#D4141D');
  });

  it('returns fallback color for undefined grade', () => {
    expect(getEcoScoreColor(undefined)).toBe('#888');
  });
});
