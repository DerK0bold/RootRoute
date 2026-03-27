import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PantryItem {
  id: string; // Internal unique ID
  barcode: string;
  name: string;
  brand?: string;
  imageUrl?: string;
  addedAt: string;
  expiryDate: string; // ISO string
  daysLeft: number;
}

const PANTRY_STORAGE_KEY = '@foodtrace_pantry';

export async function addToPantry(
  barcode: string,
  name: string,
  brand: string | undefined,
  imageUrl: string | undefined,
  expiryDays: number
): Promise<void> {
  try {
    const existing = await getPantryItems();
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);

    const newItem: PantryItem = {
      id: Math.random().toString(36).substring(7),
      barcode,
      name,
      brand,
      imageUrl,
      addedAt: new Date().toISOString(),
      expiryDate: expiryDate.toISOString(),
      daysLeft: expiryDays
    };

    const updated = [...existing, newItem];
    await AsyncStorage.setItem(PANTRY_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error adding to pantry:', error);
    throw error;
  }
}

export async function getPantryItems(): Promise<PantryItem[]> {
  try {
    const data = await AsyncStorage.getItem(PANTRY_STORAGE_KEY);
    if (!data) return [];
    
    const items: PantryItem[] = JSON.parse(data);
    
    // Update daysLeft dynamically
    const now = new Date();
    return items.map(item => {
      const expiry = new Date(item.expiryDate);
      const diffTime = expiry.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { ...item, daysLeft: diffDays };
    }).sort((a, b) => a.daysLeft - b.daysLeft);
  } catch (error) {
    console.error('Error getting pantry items:', error);
    return [];
  }
}

export async function removeFromPantry(id: string): Promise<void> {
  try {
    const items = await getPantryItems();
    const updated = items.filter(item => item.id !== id);
    await AsyncStorage.setItem(PANTRY_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error removing from pantry:', error);
  }
}
