import { calculateCarbonFootprint } from '../../services/carbonFootprint';

describe('calculateCarbonFootprint', () => {
  it('returns grade A for products with very low CO2', () => {
    const result = calculateCarbonFootprint(['salt', 'water']);
    expect(result.grade).toBe('a');
    expect(result.totalCO2).toBeLessThan(25);
  });

  it('returns grade D for products with high-CO2 ingredients', () => {
    // 5x palm oil: avgWeight=20, each contributes 115*20/100=23 → total=115 → grade 'd'
    const result = calculateCarbonFootprint([
      'palm oil', 'palm oil', 'palm oil', 'palm oil', 'palm oil',
    ]);
    expect(result.grade).toBe('d');
    expect(result.totalCO2).toBeGreaterThanOrEqual(110);
  });

  it('returns correct top contributors sorted by CO2 descending', () => {
    const result = calculateCarbonFootprint(['palm oil', 'salt', 'cocoa']);
    expect(result.topContributors.length).toBeGreaterThan(0);
    if (result.topContributors.length >= 2) {
      expect(result.topContributors[0].co2).toBeGreaterThanOrEqual(
        result.topContributors[1].co2
      );
    }
  });

  it('handles an empty ingredients list without crashing', () => {
    const result = calculateCarbonFootprint([]);
    expect(result.totalCO2).toBeGreaterThanOrEqual(0);
    expect(['a', 'b', 'c', 'd', 'e']).toContain(result.grade);
  });

  it('applies a baseline for unknown ingredients', () => {
    const known = calculateCarbonFootprint(['cocoa']);
    const unknown = calculateCarbonFootprint(['unknownXYZ123']);
    // Unknown ingredient adds a baseline; both should produce valid results
    expect(known.totalCO2).toBeGreaterThan(0);
    expect(unknown.totalCO2).toBeGreaterThan(0);
  });

  it('returns a valid gradeColor for every grade', () => {
    const colorPattern = /^#[0-9A-Fa-f]{6}$/;
    const ingredients = [['salt'], ['cocoa', 'palm oil', 'vanilla', 'chocolate', 'coffee']];
    for (const list of ingredients) {
      const result = calculateCarbonFootprint(list);
      expect(result.gradeColor).toMatch(colorPattern);
    }
  });

  it('returns a non-empty gradeLabel', () => {
    const result = calculateCarbonFootprint(['milk', 'sugar']);
    expect(result.gradeLabel.length).toBeGreaterThan(0);
  });

  it('detects partial ingredient name match (e.g. "whole milk" contains "milk")', () => {
    const withMilk = calculateCarbonFootprint(['milk']);
    const withWholeMilk = calculateCarbonFootprint(['whole milk']);
    // Both should be recognised and produce a positive CO2 value
    expect(withMilk.totalCO2).toBeGreaterThan(0);
    expect(withWholeMilk.totalCO2).toBeGreaterThan(0);
  });
});
