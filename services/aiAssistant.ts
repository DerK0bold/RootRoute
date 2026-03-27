import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY, HAS_GEMINI_API_KEY } from '../constants/config';

/**
 * Basic structure for a chat message. 
 * 'role' tells us if it's the user or our AI assistant speaking.
 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * This interface holds all the product data we send to the AI
 * so it can provide specific answers about what the user is looking at.
 */
export interface ProductContext {
  name: string;
  brand?: string;
  ingredients?: string[];
  origins?: string[];
  nutriscore?: string;
  ecoscore?: string;
  carbonCO2?: number;
  carbonGrade?: string;
  manufacturing?: string;
  nutriments?: {
    energy?: number;
    fat?: number;
    sugars?: number;
    proteins?: number;
    salt?: number;
  };
  lotNumber?: string;
}

/**
 * These instructions define the AI's "personality". 
 * We want it to be helpful, transparent about food origins, and concise.
 */
const SYSTEM_PROMPT = `Du bist ein intelligenter KI-Assistent fuer die App Root Route - eine App zur Transparenz in der Lebensmittel-Lieferkette.

Deine Aufgaben:
- Beantworte Fragen zu Lebensmitteln, Zutaten, Herkunft und Nachhaltigkeit
- Erkläre Nutri-Score, Eco-Score und CO₂-Fussabdruck verständlich
- Gib Tipps zu gesunden und nachhaltigen Ernährungsalternativen
- Analysiere Produkte anhand bereitgestellter Daten
- Warnen bei Rückrufen oder Qualitätsproblemen
- Erkläre Lieferketten und wie Lebensmittel von der Farm zum Regal gelangen
- Unterstütze bei Fragen zu Allergenen und Inhaltsstoffen

Sprache: Antworte immer auf Deutsch, klar und verständlich. Halte Antworten präzise (2-4 Sätze), ausser der Nutzer möchte mehr Details.

Wenn dir ein Produktkontext übergeben wird, beziehe dich konkret auf dieses Produkt.

Wenn du keine Daten für die antwort findest kannst du googlen`;

let client: GoogleGenerativeAI | null = null;
const PRIMARY_MODEL = 'gemini-2.5-flash';
const FALLBACK_MODEL = 'gemini-flash-latest';

/**
 * Singleton pattern to ensure we only initialize the Gemini client once.
 */
function getClient(): GoogleGenerativeAI {
  if (!HAS_GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY_MISSING');
  }
  if (!client) {
    client = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  return client;
}

function getFriendlyGeminiError(error: unknown): string {
  const message =
    typeof error === 'object' && error !== null && 'message' in error
      ? String((error as { message?: string }).message || '')
      : String(error || '');

  const lowerMessage = message.toLowerCase();
  if (message.includes('GEMINI_API_KEY_MISSING')) {
    return 'Kein Gemini API-Key gefunden. Setze EXPO_PUBLIC_GEMINI_API_KEY in deiner .env und starte Expo mit geleertem Cache neu.';
  }
  if (lowerMessage.includes('reported as leaked') || lowerMessage.includes('api key was reported as leaked')) {
    return 'Dein Gemini API-Key wurde von Google gesperrt (als geleakt markiert). Erstelle einen neuen Key in Google AI Studio und setze ihn als EXPO_PUBLIC_GEMINI_API_KEY.';
  }
  if (lowerMessage.includes('[403')) {
    return 'Gemini-Zugriff verweigert (403). Pruefe API-Key und Berechtigungen in Google AI Studio.';
  }
  if (lowerMessage.includes('[401')) {
    return 'API-Key ungueltig (401). Bitte einen gueltigen Gemini Key verwenden.';
  }
  return `Fehler bei der KI-Anfrage: ${message || 'Unbekannter Fehler.'}`;
}

type ModelOptions = {
  model: string;
  systemInstruction?: string;
  // Google Search is optional and may be rejected depending on API/model support.
  tools?: Array<{ googleSearch: {} }>;
};

function getModelCandidates(systemInstruction?: string): ModelOptions[] {
  return [
    {
      model: PRIMARY_MODEL,
      systemInstruction,
      // @ts-ignore - Supported by Gemini, but not always reflected in SDK typings
      tools: [{ googleSearch: {} }],
    },
    {
      model: FALLBACK_MODEL,
      systemInstruction,
      // @ts-ignore - Supported by Gemini, but not always reflected in SDK typings
      tools: [{ googleSearch: {} }],
    },
    { model: PRIMARY_MODEL, systemInstruction },
    { model: FALLBACK_MODEL, systemInstruction },
  ];
}

/**
 * The main entry point for the AI chat. 
 * It takes the conversation history, the newest message, and optional product context.
 */
export async function sendMessage(
  history: ChatMessage[],
  userMessage: string,
  productContext?: ProductContext
): Promise<string> {
  let genAI: GoogleGenerativeAI;
  try {
    genAI = getClient();
  } catch (error) {
    return getFriendlyGeminiError(error);
  }

  // Prepare a text block that describes the current product for the AI.
  let contextBlock = '';
  if (productContext) {
    contextBlock = `\n\n[Aktuelles Produkt: ${productContext.name}${productContext.brand ? ` von ${productContext.brand}` : ''}` +
      (productContext.origins?.length ? ` | Herkunft: ${productContext.origins.join(', ')}` : '') +
      (productContext.manufacturing ? ` | Hergestellt in: ${productContext.manufacturing}` : '') +
      (productContext.nutriscore ? ` | Nutri-Score: ${productContext.nutriscore.toUpperCase()}` : '') +
      (productContext.ecoscore ? ` | Eco-Score: ${productContext.ecoscore.toUpperCase()}` : '') +
      (productContext.carbonCO2 ? ` | CO₂: ${productContext.carbonCO2}g/100g (${productContext.carbonGrade?.toUpperCase()})` : '') +
      (productContext.ingredients?.length ? ` | Zutaten: ${productContext.ingredients.slice(0, 10).join(', ')}` : '') +
      ']';
  }

  // Convert our app-specific history format to what the Gemini SDK expects.
  const formattedHistory = history.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  // If we have product context, we inject it into the prompt so the AI knows what we're talking about.
  const finalPrompt = productContext 
    ? `Hintergrund-Info zum aktuellen Produkt:\n${contextBlock}\n\nNutzerfrage: ${userMessage}`
    : userMessage;

  let lastError: unknown = null;
  for (const options of getModelCandidates(SYSTEM_PROMPT)) {
    try {
      const model = genAI.getGenerativeModel(options);
      const chat = model.startChat({ history: formattedHistory });
      const response = await chat.sendMessage(finalPrompt);
      return response.response.text() || 'Keine Antwort erhalten.';
    } catch (error) {
      lastError = error;
      console.warn(`Gemini call failed for model ${options.model}. Retrying with next candidate.`, error);
    }
  }

  return getFriendlyGeminiError(lastError ?? new Error('Gemini request failed for all model candidates.'));
}

async function generateContentWithFallback(
  genAI: GoogleGenerativeAI,
  prompt: string | unknown[]
) {
  let lastError: unknown = null;
  for (const options of getModelCandidates()) {
    try {
      const model = genAI.getGenerativeModel(options);
      return await model.generateContent(prompt);
    } catch (error) {
      lastError = error;
      console.warn(`Gemini call failed for model ${options.model}. Retrying with next candidate.`, error);
    }
  }

  throw lastError ?? new Error('Gemini request failed for all model candidates.');
}

export interface OcrProductResult {
  barcode?: string;
  lotNumber?: string;
  productName?: string;
  brand?: string;
  description?: string;
  traceability?: {
    origin: string;
    farm: string;
    harvestMethod: string;
    journey: {
      event: string;
      location: string;
      date: string;
      icon: string;
    }[];
  };
}

/**
 * Analysiert ein Produktbild (z.B. ein Foto der Packung) und sucht nach der Chargennummer.
 * Wir nutzen hier die multimodalen Fähigkeiten von Gemini, um die Charge und eventuell
 * eine plausible Lieferkette zu erkennen.
 */
export async function analyzeProductImage(
  base64Image: string,
  brand?: string,
  productName?: string
): Promise<OcrProductResult> {
  const genAI = getClient();

  const prompt = `Du siehst ein Foto eines Lebensmittelprodukts oder einer Charge.
Aktueller Kontext: Produkt "${productName || 'Unbekannt'}" von der Marke "${brand || 'Unbekannt'}".

1. Extrahiere die Produktionsnummer / Charge (Lot, Batch, L, Charge). Nutze dein Wissen über das Format des Herstellers (${brand}), um sie korrekt zu finden.
2. Falls du online Infos zu dieser Charge bei ${brand} findest oder basierend auf dem Produkt eine plausible Lieferkette (Journey) ableiten kannst, gib sie im Feld "traceability" zurück.
3. Die Journey sollte 3-5 Schritte enthalten (z.B. Ernte, Verarbeitung, Transport, Filiale).

Antworte NUR mit diesem JSON:
{
  "lotNumber": "Chargennummer",
  "barcode": "Barcode falls sichtbar (EAN)",
  "productName": "Produktname",
  "brand": "Marke",
  "description": "Kurzbeschreibung",
  "traceability": {
    "origin": "Region/Land",
    "farm": "Name der Farm/Kooperative",
    "harvestMethod": "Anbaumethode",
    "journey": [
      { "event": "Was passierte", "location": "Ort", "date": "Datum (geschätzt/real)", "icon": "Emoji" }
    ]
  }
}`;

  const result = await generateContentWithFallback(genAI, [
    { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
    { text: prompt },
  ]);

  // We try to find the JSON block in the AI's response.
  const text = result.response.text().trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      // Cleanup: sometimes AI returns "null" as a string instead of actual null/undefined.
      if (parsed.barcode === 'null' || parsed.barcode === '') parsed.barcode = undefined;
      return parsed;
    } catch {
      // If parsing fails, we just return the raw text as a description.
    }
  }
  return { description: text.substring(0, 200) };
}

export interface SafetyResult {
  hasWarning: boolean;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  type: 'recall' | 'allergy' | 'quality';
}

/**
 * Führt einen intelligenten Sicherheitscheck durch (Allergien + Rückrufe).
 * Hier wird Google Search aktiv genutzt, um nach echtem "Recall"-News zu suchen.
 */
export async function checkProductSafety(
  productName: string,
  brand?: string,
  ingredients?: string[]
): Promise<SafetyResult | null> {
  const genAI = getClient();

  const prompt = `Analysiere die Sicherheit dieses Lebensmittelprodukts:
Produkt: ${productName}
Marke: ${brand || 'Unbekannt'}
Zutaten: ${ingredients?.join(', ') || 'Keine Zutatenliste verfügbar'}

Aufgabe:
1. Prüfe via Google Search, ob es für dieses Produkt oder diese Marke aktuell (März 2026) Rückrufe gibt.
2. Identifiziere häufige Allergene in der Zutatenliste (Milch, Nüsse, Gluten, Eier, Soja, etc.).
3. Falls ein kritisches Risiko (Rückruf) oder ein wichtiger Allergiehinweis vorliegt, antworte im JSON Format.

Antworte NUR mit diesem JSON oder "null" falls alles okay ist:
{
  "hasWarning": true,
  "severity": "critical" | "warning",
  "title": "Kurzer Titel (z.B. Produktrückruf)",
  "message": "Detaillierte Warnung",
  "type": "recall" | "allergy" | "quality"
}`;

  try {
    const result = await generateContentWithFallback(genAI, prompt);
    const text = result.response.text().trim();
    if (text.toLowerCase() === 'null') return null;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('AI Safety Check failed:', error);
  }
  return null;
}

/**
 * Fun ideas for the user to click and start a conversation.
 */
export const QUICK_SUGGESTIONS = [
  'Was bedeutet Nutri-Score A?',
  'Wie klimafreundlich ist Schokolade?',
  'Was ist Palmöl und warum ist es problematisch?',
  'Welche Zutaten sollte ich vermeiden?',
  'Wie funktioniert ein Produkt-Rückruf?',
  'Was bedeutet Bio-zertifiziert?',
];

