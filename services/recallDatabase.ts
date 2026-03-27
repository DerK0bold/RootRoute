export interface RecallEntry {
  id: string;
  productName: string;
  brand: string;
  reason: string;
  date: string;
  severity: 'critical' | 'warning';
  affectedBarcodes?: string[];
  affectedBrands?: string[];
  action: string;
  authority: string;
  affectedProductNames?: string[];
}

// Simulated recall database (in production: fetch from BLV/RAPEX API)
const RECALL_DATABASE: RecallEntry[] = [
  {
    id: 'RC-2024-001',
    productName: 'Excellence 70% Kakao',
    brand: 'Lindt',
    reason: 'Mögliche Kontamination mit nicht deklarierten Erdnüssen – Allergie-Risiko für Nussallergiker',
    date: '15.11.2024',
    severity: 'critical',
    affectedBarcodes: ['3046920022981'],
    action: 'Produkt nicht verzehren. Rückgabe im Laden oder Entsorgung empfohlen.',
    authority: 'BLV – Bundesamt für Lebensmittelsicherheit',
  },
  {
    id: 'RC-2024-007',
    productName: 'Verschiedene Schokoladenprodukte',
    brand: 'DemoChoc AG',
    reason: 'Erhöhte Mineralölwerte (MOSH/MOAH) in der Verpackung nachgewiesen',
    date: '22.10.2024',
    severity: 'warning',
    affectedBrands: ['DemoChoc AG'],
    action: 'Vorsichtshalber nicht an Kinder unter 3 Jahren geben.',
    authority: 'Kantonales Lebensmittelinspektorat Zürich',
  },
  {
    id: 'RC-2024-012',
    productName: 'Bio-Sprossen Mix',
    brand: 'FreshDemo Farm',
    reason: 'Salmonellen-Kontamination nachgewiesen (Charge CH-2024-44)',
    date: '08.09.2024',
    severity: 'critical',
    affectedBrands: ['FreshDemo Farm'],
    action: 'Sofort entsorgen. Nicht verzehren. Arzt aufsuchen bei Symptomen.',
    authority: 'Swissmedic & BLV',
  },
  {
    id: 'RC-2025-003',
    productName: 'Granola Crisp Original',
    brand: 'GranolaDemo',
    reason: 'Mögliche Fremdkörper (Plastikpartikel) in einzelnen Chargen gefunden',
    date: '03.02.2025',
    severity: 'warning',
    affectedBrands: ['GranolaDemo'],
    action: 'Produkt auf Fremdkörper prüfen vor dem Verzehr.',
    authority: 'BLV – Bundesamt für Lebensmittelsicherheit',
  },
  {
    id: 'RC-2026-TONY',
    productName: 'El Tony Mate & Ginger',
    brand: 'El Tony',
    reason: 'Falsche Etikettierung: Inhaltsstoff "Ingwer-Konzentrat" nicht korrekt fett gedruckt (Allergen-Hinweis).',
    date: '27.03.2026',
    severity: 'warning',
    affectedBrands: ['El Tony'],
    affectedProductNames: ['Ginger', 'Ingwer'],
    action: 'Nur für Personen mit schweren Ingwer-Allergien relevant. Produkt ansonsten sicher.',
    authority: 'Kantonsapotheker Luzern',
  },
];

export function checkProductForRecall(
  barcode: string,
  brand?: string,
  productName?: string
): RecallEntry | null {
  for (const recall of RECALL_DATABASE) {
    if (recall.affectedBarcodes?.includes(barcode)) return recall;
    if (
      brand &&
      recall.affectedBrands?.some((b) =>
        brand.toLowerCase().includes(b.toLowerCase())
      )
    ) {
      // If affectedProductNames matches, or if no product names are specified (brand-wide)
      if (!recall.affectedProductNames || recall.affectedProductNames.some(kw => productName?.toLowerCase().includes(kw.toLowerCase()))) {
        return recall;
      }
    }
  }
  return null;
}
