import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * We're using AsyncStorage to keep track of the user's progress locally.
 * This is where we store things like total scans and unlocked achievements.
 */
const STORAGE_KEY = '@foodtrace_gamification';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlockedAt?: string;
}

export interface GamificationData {
  totalScans: number;
  ecoAScans: number;
  nutriAScans: number;
  maxCountriesInProduct: number;
  achievements: Achievement[];
}

/**
 * Deciding which achievements are available in the app.
 * Each has a unique ID so we can check if the user has already earned it.
 */
export const ALL_ACHIEVEMENTS: Omit<Achievement, 'unlockedAt'>[] = [
  {
    id: 'first_scan',
    emoji: '🔍',
    title: 'Erster Scan',
    description: 'Erstes Produkt gescannt',
  },
  {
    id: 'five_scans',
    emoji: '⭐',
    title: 'Fleissiger Scanner',
    description: '5 Produkte gescannt',
  },
  {
    id: 'ten_scans',
    emoji: '🌟',
    title: 'Profi-Scanner',
    description: '10 Produkte gescannt',
  },
  {
    id: 'eco_warrior',
    emoji: '🌱',
    title: 'Öko-Warrior',
    description: 'Produkt mit Eco-Score A entdeckt',
  },
  {
    id: 'health_hero',
    emoji: '💚',
    title: 'Health Hero',
    description: 'Produkt mit Nutri-Score A entdeckt',
  },
  {
    id: 'world_explorer',
    emoji: '🌍',
    title: 'Weltentdecker',
    description: 'Produkt mit Zutaten aus 5+ Ländern gescannt',
  },
];

/**
 * Fetches the user's current progress from local storage.
 * If they're new, we return a fresh starting set of data.
 */
export async function getGamificationData(): Promise<GamificationData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to load gamification data:', error);
  }
  return {
    totalScans: 0,
    ecoAScans: 0,
    nutriAScans: 0,
    maxCountriesInProduct: 0,
    achievements: [],
  };
}

/**
 * Every time a product is scanned, we call this to update the stats 
 * and see if any new achievements have been "hit".
 */
export async function recordProductScan(
  nutriscore?: string,
  ecoscore?: string,
  countriesCount?: number
): Promise<Achievement[]> {
  const data = await getGamificationData();

  // 1. Update the raw statistics
  data.totalScans += 1;
  if (ecoscore?.toLowerCase() === 'a') data.ecoAScans += 1;
  if (nutriscore?.toLowerCase() === 'a') data.nutriAScans += 1;
  if (countriesCount && countriesCount > data.maxCountriesInProduct) {
    data.maxCountriesInProduct = countriesCount;
  }

  const newlyUnlocked: Achievement[] = [];

  // 2. Check each possible achievement to see if requirements are met
  for (const ach of ALL_ACHIEVEMENTS) {
    const alreadyUnlocked = data.achievements.some((a) => a.id === ach.id);
    if (alreadyUnlocked) continue;

    let shouldUnlock = false;
    // Logic for each specific achievement type
    if (ach.id === 'first_scan' && data.totalScans >= 1) shouldUnlock = true;
    if (ach.id === 'five_scans' && data.totalScans >= 5) shouldUnlock = true;
    if (ach.id === 'ten_scans' && data.totalScans >= 10) shouldUnlock = true;
    if (ach.id === 'eco_warrior' && data.ecoAScans >= 1) shouldUnlock = true;
    if (ach.id === 'health_hero' && data.nutriAScans >= 1) shouldUnlock = true;
    if (ach.id === 'world_explorer' && data.maxCountriesInProduct >= 5) shouldUnlock = true;

    if (shouldUnlock) {
      const unlocked: Achievement = { ...ach, unlockedAt: new Date().toISOString() };
      data.achievements.push(unlocked);
      newlyUnlocked.push(unlocked);
    }
  }

  // 3. Save the updated data back to storage
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return newlyUnlocked;
}

/**
 * Calculates a 'Trust Score' for the user based on their activity.
 * More scans and achievements = higher score.
 */
export function getTrustScore(data: GamificationData): number {
  return Math.min(100, data.totalScans * 7 + data.achievements.length * 6);
}

/**
 * Maps a numeric score to a human-readable rank/level.
 */
export function getLevel(score: number): { label: string; emoji: string; color: string } {
  if (score >= 85) return { label: 'Experte', emoji: '🏆', color: '#F59E0B' };
  if (score >= 55) return { label: 'Fortgeschritten', emoji: '⭐', color: '#60A5FA' };
  if (score >= 25) return { label: 'Entdecker', emoji: '🌱', color: '#4ADE80' };
  return { label: 'Einsteiger', emoji: '🔍', color: '#9CA3AF' };
}

export const TOTAL_ACHIEVEMENTS = ALL_ACHIEVEMENTS.length;

