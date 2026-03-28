// Mock AsyncStorage so the native module is not required in the test environment
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
  mergeItem: jest.fn().mockResolvedValue(undefined),
  getAllKeys: jest.fn().mockResolvedValue([]),
  multiGet: jest.fn().mockResolvedValue([]),
  multiSet: jest.fn().mockResolvedValue(undefined),
  multiRemove: jest.fn().mockResolvedValue(undefined),
}));

import { getTrustScore, getLevel } from '../../services/gamification';
import type { GamificationData } from '../../services/gamification';

function makeData(overrides: Partial<GamificationData>): GamificationData {
  return {
    totalScans: 0,
    ecoAScans: 0,
    nutriAScans: 0,
    maxCountriesInProduct: 0,
    achievements: [],
    ...overrides,
  };
}

describe('getTrustScore', () => {
  it('returns 0 for a brand-new user', () => {
    expect(getTrustScore(makeData({}))).toBe(0);
  });

  it('increases with more scans', () => {
    const score5 = getTrustScore(makeData({ totalScans: 5 }));
    const score10 = getTrustScore(makeData({ totalScans: 10 }));
    expect(score10).toBeGreaterThan(score5);
  });

  it('increases with more achievements', () => {
    const noAch = getTrustScore(makeData({ totalScans: 5, achievements: [] }));
    const withAch = getTrustScore(
      makeData({
        totalScans: 5,
        achievements: [
          { id: 'first_scan', title: 'Erster Scan', description: 'x', emoji: '🔍', unlockedAt: '' },
        ],
      })
    );
    expect(withAch).toBeGreaterThan(noAch);
  });

  it('is capped at 100', () => {
    const score = getTrustScore(makeData({ totalScans: 1000, achievements: Array(50).fill({ id: 'x', title: '', description: '', emoji: '' }) }));
    expect(score).toBeLessThanOrEqual(100);
  });

  it('never returns a negative value', () => {
    expect(getTrustScore(makeData({ totalScans: 0 }))).toBeGreaterThanOrEqual(0);
  });
});

describe('getLevel', () => {
  it('returns Einsteiger for score 0', () => {
    expect(getLevel(0).label).toBe('Einsteiger');
  });

  it('returns Entdecker for score 25', () => {
    expect(getLevel(25).label).toBe('Entdecker');
  });

  it('returns Fortgeschritten for score 55', () => {
    expect(getLevel(55).label).toBe('Fortgeschritten');
  });

  it('returns Experte for score 85', () => {
    expect(getLevel(85).label).toBe('Experte');
  });

  it('returns a valid hex color for every level', () => {
    const colorPattern = /^#[0-9A-Fa-f]{6}$/;
    [0, 25, 55, 85].forEach((score) => {
      expect(getLevel(score).color).toMatch(colorPattern);
    });
  });

  it('includes a non-empty emoji for every level', () => {
    [0, 25, 55, 85].forEach((score) => {
      expect(getLevel(score).emoji.length).toBeGreaterThan(0);
    });
  });
});
