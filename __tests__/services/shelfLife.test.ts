import { predictShelfLife } from '../../services/shelfLife';
import type { OpenFoodFactsProduct } from '../../services/openFoodFacts';

function makeProduct(overrides: Partial<OpenFoodFactsProduct>): OpenFoodFactsProduct {
  return {
    code: '0000000000000',
    product_name: '',
    ...overrides,
  };
}

describe('predictShelfLife', () => {
  it('predicts short shelf life for fish products', () => {
    const result = predictShelfLife(makeProduct({ categories: 'fish, seafood' }));
    expect(result.days).toBeLessThanOrEqual(3);
    expect(result.icon).toBe('🐟');
  });

  it('predicts short shelf life for meat products', () => {
    const result = predictShelfLife(makeProduct({ categories: 'meat, beef' }));
    expect(result.days).toBeLessThanOrEqual(5);
    expect(result.icon).toBe('🥩');
  });

  it('predicts long shelf life for chocolate', () => {
    const result = predictShelfLife(
      makeProduct({ categories: 'chocolate, confectionery', product_name: 'Lindt 70%' })
    );
    expect(result.days).toBeGreaterThanOrEqual(180);
    expect(result.icon).toBe('🍫');
  });

  it('predicts long shelf life for cereals/granola', () => {
    const result = predictShelfLife(
      makeProduct({ categories: 'cereal, granola', product_name: 'Granola Swiss' })
    );
    expect(result.days).toBeGreaterThanOrEqual(90);
    expect(result.icon).toBe('🥣');
  });

  it('uses nutriment fallback for high-sugar unrecognised product', () => {
    const result = predictShelfLife(
      makeProduct({
        categories: 'unknown category',
        nutriments: { sugars_100g: 60 },
      })
    );
    expect(result.days).toBeGreaterThanOrEqual(180);
  });

  it('uses nutriment fallback for high-fat unrecognised product', () => {
    const result = predictShelfLife(
      makeProduct({
        categories: 'unknown category',
        nutriments: { fat_100g: 30 },
      })
    );
    expect(result.days).toBeGreaterThanOrEqual(90);
  });

  it('returns a default for completely unknown products', () => {
    const result = predictShelfLife(makeProduct({ categories: '' }));
    expect(result.days).toBeGreaterThan(0);
    expect(result.label.length).toBeGreaterThan(0);
    expect(result.storageTip.length).toBeGreaterThan(0);
  });

  it('returns a valid color string', () => {
    const colorPattern = /^#[0-9A-Fa-f]{6}$/;
    const result = predictShelfLife(makeProduct({ categories: 'fish' }));
    expect(result.color).toMatch(colorPattern);
  });

  it('matches by product name when category is empty', () => {
    const result = predictShelfLife(
      makeProduct({ categories: '', product_name: 'Joghurt Erdbeer' })
    );
    expect(result.days).toBeGreaterThanOrEqual(14);
  });
});
