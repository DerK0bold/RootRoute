import AsyncStorage from '@react-native-async-storage/async-storage';
import { OpenFoodFactsProduct } from './openFoodFacts';

export interface ScanHistoryItem {
  barcode: string;
  productName: string;
  brand?: string;
  imageUrl?: string;
  scannedAt: string;
  nutriscore?: string;
  ecoscore?: string;
}

const STORAGE_KEY = '@foodtrace_scan_history';

export async function addToHistory(product: OpenFoodFactsProduct): Promise<void> {
  try {
    const existing = await getHistory();
    const newItem: ScanHistoryItem = {
      barcode: product.code,
      productName: product.product_name_de || product.product_name || 'Unbekanntes Produkt',
      brand: product.brands,
      imageUrl: product.image_front_url || product.image_url,
      scannedAt: new Date().toISOString(),
      nutriscore: product.nutriscore_grade,
      ecoscore: product.ecoscore_grade,
    };

    const filtered = existing.filter((item) => item.barcode !== product.code);
    const updated = [newItem, ...filtered].slice(0, 50);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (_) {}
}

export async function getHistory(): Promise<ScanHistoryItem[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (_) {
    return [];
  }
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
