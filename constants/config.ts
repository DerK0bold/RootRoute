// ============================================================
// Root Route AI - Konfiguration
// Setze den Key in .env als EXPO_PUBLIC_GEMINI_API_KEY
// ============================================================
export const GEMINI_API_KEY = (process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '').trim();
export const HAS_GEMINI_API_KEY = GEMINI_API_KEY.length > 0;
