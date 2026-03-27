export interface OpenFoodFactsProduct {
  code: string;
  product_name: string;
  product_name_de?: string;
  brands?: string;
  categories?: string;
  image_url?: string;
  image_front_url?: string;
  ingredients_text?: string;
  ingredients_text_de?: string;
  ingredients?: Array<{
    id: string;
    text: string;
    percent?: number;
    origins?: string;
  }>;
  origins?: string;
  origins_tags?: string[];
  manufacturing_places?: string;
  countries_tags?: string[];
  nutriments?: {
    energy_100g?: number;
    'energy-kcal_100g'?: number;
    'energy-kj_100g'?: number;
    fat_100g?: number;
    sugars_100g?: number;
    proteins_100g?: number;
    salt_100g?: number;
    fiber_100g?: number;
  };
  nutriscore_grade?: string;
  ecoscore_grade?: string;
  labels_tags?: string[];
  packaging?: string;
}

export interface ProductResult {
  found: boolean;
  product?: OpenFoodFactsProduct;
  error?: string;
}

import { getProductFromDatabase } from '../constants/productDatabase';

export async function fetchProductByBarcode(barcode: string): Promise<ProductResult> {
  // Zuerst in der lokalen Datenbank suchen
  const local = getProductFromDatabase(barcode);
  if (local) {
    return { found: true, product: local };
  }

  // Fallback: Open Food Facts API für unbekannte Barcodes
  try {
    const BASE_URL = 'https://world.openfoodfacts.org/api/v2';
    const response = await fetch(
      `${BASE_URL}/product/${barcode}?fields=code,product_name,product_name_de,brands,categories,image_url,image_front_url,ingredients_text,ingredients_text_de,ingredients,origins,origins_tags,manufacturing_places,countries_tags,nutriments,nutriscore_grade,ecoscore_grade,labels_tags,packaging`,
      { headers: { 'User-Agent': 'RootRoute/1.0 (hackathon@badenbackt.ch)' } }
    );

    if (!response.ok) {
      return { found: false, error: `HTTP ${response.status}` };
    }

    const data = await response.json();

    if (data.status === 1 && data.product) {
      return { found: true, product: data.product };
    }

    return { found: false, error: 'Product not found in database' };
  } catch (error) {
    return { found: false, error: 'Network error - check your connection' };
  }
}

export async function searchProductsByName(name: string): Promise<ProductResult> {
  try {
    const encoded = encodeURIComponent(name);
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encoded}&json=1&page_size=1&fields=code,product_name,product_name_de,brands,categories,image_url,image_front_url,nutriscore_grade,ecoscore_grade`,
      { headers: { 'User-Agent': 'RootRoute/1.0 (hackathon@badenbackt.ch)' } }
    );
    if (!response.ok) return { found: false, error: `HTTP ${response.status}` };
    const data = await response.json();
    if (data.products && data.products.length > 0) {
      return { found: true, product: data.products[0] };
    }
    return { found: false, error: 'Kein Produkt gefunden' };
  } catch {
    return { found: false, error: 'Netzwerkfehler' };
  }
}

export function parseIngredientsList(product: OpenFoodFactsProduct): string[] {
  const text = product.ingredients_text_de || product.ingredients_text || '';

  if (!text) {
    if (product.ingredients && product.ingredients.length > 0) {
      return product.ingredients.map((i) => i.text).filter(Boolean);
    }
    return [];
  }

  return text
    .replace(/\([^)]*%[^)]*\)/g, '')
    .replace(/_/g, '')
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && !/^\d/.test(s))
    .slice(0, 20);
}

export function getNutriScoreColor(grade?: string): string {
  const colors: Record<string, string> = {
    a: '#038141',
    b: '#85BB2F',
    c: '#FECB02',
    d: '#EE8100',
    e: '#E63E11',
  };
  return colors[grade?.toLowerCase() || ''] || '#888';
}

export function getEcoScoreColor(grade?: string): string {
  const colors: Record<string, string> = {
    a: '#1E8F4E',
    b: '#56a93a',
    c: '#FFCA00',
    d: '#FF6B00',
    e: '#D4141D',
  };
  return colors[grade?.toLowerCase() || ''] || '#888';
}
