import { OpenFoodFactsProduct } from './openFoodFacts';
import { PRODUCT_DATABASE } from '../constants/productDatabase';

/**
 * Detailed information about a specific production batch (lot).
 * This includes the journey from the farm to the store.
 */
export interface TraceabilityData {
  lotNumber: string;
  productionDate?: string;
  origin: string;
  farm: string;
  harvestMethod: string;
  coolingChainWarning?: {
    title: string;
    message: string;
    observedAt: string;
  };
  journey: {
    event: string;
    location: string;
    date: string;
    icon: string;
    coordinates?: { latitude: number; longitude: number };
  }[];
  isVerified?: boolean;
  confirmations?: number;
}

/**
 * Mock data for the hackathon. 
 * Realistically, this would come from a blockchain or a centralized ERP system.
 */
const MOCK_TRACEABILITY: Record<string, TraceabilityData> = {
  'L2024-CUC-01': {
    lotNumber: 'L2024-CUC-01',
    productionDate: '12.03.2026',
    origin: 'Berner Seeland, Schweiz',
    farm: 'Bio-Hof Müller, Kerzers',
    harvestMethod: 'Handgepflückt',
    journey: [
      { event: 'Ernte', location: 'Feld 4, Kerzers', date: '08.03.2026', icon: '🚜', coordinates: { latitude: 46.9754, longitude: 7.1895 } },
      { event: 'Qualitätskontrolle', location: 'Sammelstelle Seeland', date: '09.03.2026', icon: '🔍', coordinates: { latitude: 47.0504, longitude: 7.2491 } },
      { event: 'Verpackung', location: 'Logistikzentrum Suhr', date: '11.03.2026', icon: '🏭', coordinates: { latitude: 47.3732, longitude: 8.0772 } },
      { event: 'Anlieferung', location: 'Filiale Baden', date: '12.03.2026', icon: '🚚', coordinates: { latitude: 47.4733, longitude: 8.3080 } },
    ],
    isVerified: true,
    confirmations: 124,
  },
  'BATCH-44-LINDT': {
    lotNumber: 'BATCH-44-LINDT',
    productionDate: '01.02.2026',
    origin: 'Kilchberg, Schweiz',
    farm: 'Kooperative Elfenbeinküste (Kakao)',
    harvestMethod: 'Nachhaltiger Anbau (Rainforest Alliance)',
    journey: [
      { event: 'Kakao-Ernte', location: 'San-Pédro, Elfenbeinküste', date: '10.11.2025', icon: '🌴', coordinates: { latitude: 4.7485, longitude: -6.6364 } },
      { event: 'Transport', location: 'Hafen Abidjan', date: '20.11.2025', icon: '🚢', coordinates: { latitude: 5.3096, longitude: -4.0127 } },
      { event: 'Verarbeitung', location: 'Schokoladenfabrik Kilchberg', date: '15.01.2026', icon: '🏭', coordinates: { latitude: 47.3228, longitude: 8.5539 } },
      { event: 'Auslieferung', location: 'Region Aargau', date: '01.02.2026', icon: '🚚', coordinates: { latitude: 47.3904, longitude: 8.0457 } },
    ],
    isVerified: true,
    confirmations: 89,
  },
  'L-TONY-24-001': {
    lotNumber: 'L-TONY-24-001',
    productionDate: '05.03.2026',
    origin: 'Oberkirch (LU), Schweiz',
    farm: 'Mate-Kooperative, Misiones (Argentinien)',
    harvestMethod: 'Schonende Kaltwasserextraktion (Cold Brew)',
    journey: [
      { event: 'Mate-Ernte', location: 'Misiones, Argentinien', date: '10.10.2025', icon: '🌿', coordinates: { latitude: -27.3671, longitude: -55.8961 } },
      { event: 'Transport (Schiff)', location: 'Atlantik / Hafen Rotterdam', date: '15.11.2025', icon: '🚢', coordinates: { latitude: 51.9225, longitude: 4.47917 } },
      { event: 'Ankunft & Mahlen', location: 'Luzern, Schweiz', date: '10.12.2025', icon: '🏭', coordinates: { latitude: 47.0502, longitude: 8.3093 } },
      { event: 'Kaltwasser-Extraktion', location: 'Produktion Oberkirch', date: '04.03.2026', icon: '🧊', coordinates: { latitude: 47.1539, longitude: 8.1185 } },
      { event: 'Abfüllung & Labeling', location: 'Abfüllanlage LU', date: '05.03.2026', icon: '🥫', coordinates: { latitude: 47.0502, longitude: 8.3093 } },
      { event: 'Auslieferung', location: 'Zentralschweiz', date: '08.03.2026', icon: '🚚', coordinates: { latitude: 47.3769, longitude: 8.5417 } },
    ],
    isVerified: true,
    confirmations: 256,
  },
  'L2506032': {
    lotNumber: 'L2506032',
    productionDate: '06.03.2026',
    origin: 'Luzern, Schweiz',
    farm: 'Regionaler Frischeverbund Zentralschweiz',
    harvestMethod: 'Gekuehlte Sammelernte',
    coolingChainWarning: {
      title: 'Stoerung in der Kuehlkette erkannt',
      message: 'Zwischen Umschlagzentrum und letzter Meile wurde fuer 48 Minuten ein Temperaturanstieg auf 11.2°C gemessen.',
      observedAt: '06.03.2026 03:40',
    },
    journey: [
      { event: 'Ernte', location: 'Region Sempachersee', date: '04.03.2026', icon: '🚜', coordinates: { latitude: 47.1244, longitude: 8.1946 } },
      { event: 'Vorkuehlung', location: 'Kuehlhaus Sursee', date: '05.03.2026', icon: '❄️', coordinates: { latitude: 47.1731, longitude: 8.1111 } },
      { event: 'Verladung', location: 'Hub Zofingen', date: '06.03.2026', icon: '📦', coordinates: { latitude: 47.2880, longitude: 7.9459 } },
      { event: 'Anlieferung', location: 'Filiale Baden', date: '06.03.2026', icon: '🚚', coordinates: { latitude: 47.4733, longitude: 8.3080 } },
    ],
    isVerified: false,
    confirmations: 12,
  },
};

function normalizeLotNumber(value: string): string {
  return (value || '')
    .toUpperCase()
    .replace(/^LOT[:\-\s]*/i, '')
    .replace(/[^A-Z0-9-]/g, '')
    .trim();
}

/**
 * Searches for traceability data based on a given lot number (batch).
 */
export function getTraceability(lotNumber: string): TraceabilityData | null {
  const normalized = normalizeLotNumber(lotNumber);
  const direct = MOCK_TRACEABILITY[lotNumber];
  if (direct) return direct;

  const key = Object.keys(MOCK_TRACEABILITY).find((k) => normalizeLotNumber(k) === normalized);
  return key ? MOCK_TRACEABILITY[key] : null;
}

/**
 * Maps a lot number to a barcode for the demo.
 * This helps us link a scanned lot back to the general product information.
 */
export function getBarcodeFromLot(lotNumber: string): string | null {
  const normalized = normalizeLotNumber(lotNumber);
  if (normalized.includes('CUC')) return '7612100040789';
  if (normalized.includes('LINDT')) return '3046920022981';
  if (normalized.includes('TONY')) return '7640161170014';
  if (normalized === 'L2506032') return '7612100040789';
  if (normalized === 'L2590069') return '7640161170069'; // Ginger
  if (normalized === 'L2590059') return '7640161170274'; // Mint
  return null;
}

/**
 * Calculates a Trust Score (0-100) specifically for a product batch.
 * Factors include:
 * - Data completeness (number of journey steps)
 * - Formal verification status
 * - Community confirmations (crowd intelligence)
 * - Price transparency
 */
export function calculateTrustScore(data: TraceabilityData | null, hasPriceBreakdown: boolean): number {
  if (!data) return 15; // Baseline trust for products where we only have general info

  let score = 30; // Starting point if we have any batch data

  // Completeness: Does the user see a full story?
  if (data.journey.length >= 3) score += 20;

  // Reliability: Is the data officially verified (e.g., via IoT or certified partners)?
  if (data.isVerified) score += 30;

  // Social Proof: Have other users confirmed this data?
  if (data.confirmations && data.confirmations > 50) score += 10;

  // Transparency: Do we know how the price is composed?
  if (hasPriceBreakdown) score += 10;

  return Math.min(100, score);
}

