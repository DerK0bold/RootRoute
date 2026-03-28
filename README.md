# Root Route

**Root Route** ist eine mobile App zur Transparenz in der Lebensmittel-Lieferkette. Nutzer können Produkte scannen und sofort erfahren, wo ihre Lebensmittel herkommen – von der Farm bis ins Regal.

---

## Features

| Feature | Beschreibung |
|---------|-------------|
| **Barcode-Scanner** | Scannt EAN/UPC-Codes direkt mit der Kamera |
| **OCR / KI-Scan** | Foto der Packung → Gemini KI erkennt Produkt & Charge automatisch |
| **Lieferketten-Transparenz** | Vollständige Journey vom Feld bis zur Filiale mit GPS-Koordinaten |
| **Lebensmittelsicherheit** | KI-gestützte Rückruf- und Allergieprüfung in Echtzeit |
| **Nachhaltigkeit** | Nutri-Score, Eco-Score und CO₂-Fussabdruck pro Produkt |
| **KI-Assistent** | Chatbot auf Basis von Google Gemini 2.5 Flash für Fragen zu Inhaltsstoffen & Herkunft |
| **Lieferverfolgung** | Pakete von Migros, Coop, DHL, Post CH etc. tracken |
| **Vorratsschrank** | Produkte mit Ablaufdatum verwalten und Haltbarkeit überwachen |
| **Gamification** | Punkte, Achievements und Community-Rangliste für nachhaltiges Einkaufen |

---

## Tech Stack

| Kategorie | Technologie |
|-----------|-------------|
| Framework | React Native 0.81 + Expo SDK 54 |
| Routing | Expo Router (file-based, Stack + Tabs) |
| Sprache | TypeScript 5.9 (Strict Mode) |
| KI | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| Karten | react-native-maps (Google Maps Provider) |
| Kamera | expo-camera (Barcode + Bild) |
| Storage | AsyncStorage (lokale Persistenz) |
| Tests | Jest + jest-expo + @testing-library/react-native |
| Externe APIs | Open Food Facts, Google Generative AI |

---

## Voraussetzungen

| Voraussetzung | Mindestversion | Hinweis |
|---------------|---------------|---------|
| **Node.js** | ≥ 18 | [nodejs.org](https://nodejs.org) |
| **npm** | ≥ 9 | wird mit Node.js mitgeliefert |
| **Expo Go** (Smartphone) | aktuell | siehe unten |

---

## App auf dem Smartphone starten (Expo Go)

Die einfachste Möglichkeit, die App auf einem echten Gerät zu testen, ist **Expo Go** – keine Xcode oder Android Studio nötig.

**Schritt 1 – Expo Go installieren:**

| Plattform | Download |
|-----------|---------|
| **iOS** (iPhone/iPad) | App Store → nach „Expo Go" suchen |
| **Android** | Google Play Store → nach „Expo Go" suchen |

**Schritt 2 – Gleiches Netzwerk:** Smartphone und Entwicklungsrechner müssen im **selben Netzwerk** sein. Am zuverlässigsten funktioniert es, wenn der Entwicklungsrechner mit dem **persönlichen Hotspot des Smartphones** verbunden ist.

**Schritt 3 – QR-Code scannen:**
- Nach `npm start` erscheint im Terminal ein QR-Code
- **iOS:** Mit der normalen Kamera-App scannen → Link öffnen → Expo Go startet
- **Android:** In der Expo Go App auf „Scan QR code" tippen und scannen

> **Hinweis Kamera-Funktion:** Das Barcode-Scannen und die OCR-Funktion benötigen eine echte Kamera. Im Web-Browser (`npm run web`) sind diese Funktionen eingeschränkt.

---

## Setup & Start

```bash
# 1. Repository klonen
git clone <repo-url>
cd cucumber-app

# 2. Abhängigkeiten installieren
npm install

# 3. Umgebungsvariablen konfigurieren
cp .env.example .env
# .env öffnen und EXPO_PUBLIC_GEMINI_API_KEY setzen

# 4. App starten
npm start           # Expo Dev-Server → QR-Code für Expo Go anzeigen
npm run android     # Direkt auf Android-Emulator / per USB verbundenem Gerät
npm run ios         # Direkt auf iOS-Simulator / Gerät (nur macOS + Xcode)
npm run web         # Im Web-Browser öffnen (Kamera eingeschränkt)
```

---

## Umgebungsvariablen

Kopiere `.env.example` → `.env` und setze folgende Werte:

| Variable | Pflicht | Beschreibung |
|----------|---------|-------------|
| `EXPO_PUBLIC_GEMINI_API_KEY` | Ja | Google Gemini API-Key für KI-Funktionen |

> **Hinweis:** Das `EXPO_PUBLIC_`-Prefix macht den Key im Expo-Bundle sichtbar. Für Produktion sollte die KI-Anfrage über einen eigenen Backend-Proxy laufen.

---

## Projektstruktur

```
cucumber-app/
├── app/                        # Expo Router – alle Screens
│   ├── (tabs)/                 # Tab-Navigation (6 Tabs)
│   │   ├── index.tsx           # Scanner (Haupt-Tab)
│   │   ├── tracking.tsx        # Lieferverfolgung
│   │   ├── history.tsx         # Scan-Verlauf & Gamification
│   │   ├── pantry.tsx          # Vorratsschrank
│   │   ├── community.tsx       # Community-Rangliste
│   │   └── ai.tsx              # KI-Assistent Chat
│   ├── product/[barcode].tsx   # Produktdetails (dynamische Route)
│   ├── productAi/[barcode].tsx # KI-Produktanalyse
│   ├── tracking/[orderId].tsx  # Lieferdetails
│   └── liveMap.tsx             # Lieferketten-Karte (Modal)
├── services/                   # Business-Logik & API-Integration
│   ├── aiAssistant.ts          # Google Gemini Integration (Chat, OCR, Safety)
│   ├── openFoodFacts.ts        # Open Food Facts API
│   ├── traceabilityService.ts  # Lieferketten-Daten
│   ├── carbonFootprint.ts      # CO₂-Berechnung
│   ├── shelfLife.ts            # Haltbarkeitsvorhersage
│   ├── scanHistory.ts          # Scan-Verlauf (AsyncStorage)
│   ├── pantryService.ts        # Vorratsverwaltung
│   ├── gamification.ts         # Achievements & Trust Score
│   ├── recallDatabase.ts       # Rückrufdatenbank
│   └── notifications.ts        # Push-Benachrichtigungen
├── constants/
│   ├── config.ts               # API-Key Konfiguration
│   ├── productDatabase.ts      # Lokale Produktdaten (CH-Marken)
│   └── ingredientOrigins.ts    # Herkunftsdaten für Zutaten
├── __tests__/                  # Unit Tests
│   └── services/               # Tests für alle Service-Funktionen
├── .env.example                # Umgebungsvariablen-Vorlage
└── app.json                    # Expo-Konfiguration
```

---

## Tests ausführen

```bash
# Alle Tests
npm test

# Tests mit Watcher (Entwicklung)
npm run test:watch

# Test-Coverage Report
npm run test:coverage
```

Die Tests befinden sich in `__tests__/services/` und decken die zentralen Business-Logic-Funktionen ab:

| Testdatei | Getestete Funktionen |
|-----------|---------------------|
| `carbonFootprint.test.ts` | `calculateCarbonFootprint` – CO₂-Berechnung, Grading |
| `shelfLife.test.ts` | `predictShelfLife` – Haltbarkeit nach Kategorie & Nährwerten |
| `gamification.test.ts` | `getTrustScore`, `getLevel` – Punkte & Rang-Logik |
| `openFoodFacts.test.ts` | `parseIngredientsList`, `getNutriScoreColor`, `getEcoScoreColor` |

---

## Architektur

```
┌─────────────────────────────────────────┐
│              Expo Router (UI)            │
│  Tabs: Scanner │ Tracking │ KI │ ...    │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│            Services Layer               │
│  aiAssistant │ openFoodFacts │ ...      │
└──────┬───────────────┬──────────────────┘
       │               │
┌──────▼──────┐  ┌─────▼──────────────────┐
│ Google      │  │  Open Food Facts API   │
│ Gemini API  │  │  (öffentlich, kostenlos) │
└─────────────┘  └────────────────────────┘
```

### Design-Entscheidungen

- **Kein State-Management-Framework**: Die App nutzt React `useState`/`useEffect` lokal. Für produktionsreife Skalierung wäre Zustand oder Redux empfohlen.
- **Lokale Produktdatenbank**: Schweizer Marken (Toblerone, Ovomaltine, Lindt etc.) sind lokal gespeichert für Offline-Zugriff und Demo-Zwecke.
- **Gemini Fallback-Strategie**: Die KI versucht nacheinander `gemini-2.5-flash` mit Google Search, dann ohne Google Search, dann `gemini-flash-latest`.

---

## Sicherheit & Datenschutz

- **API-Key**: Wird ausschliesslich aus `.env` geladen (nie hartcodiert). `.env` ist in `.gitignore` aufgeführt.
- **Lokale Daten**: Scan-Verlauf, Vorrat und Gamification-Daten werden nur lokal auf dem Gerät gespeichert (AsyncStorage).
- **Keine Nutzerdaten**: Die App sammelt keine persönlichen Daten und sendet keine Nutzerdaten an externe Server.
- **Kamera-Berechtigung**: Wird nur on-demand angefragt, wenn der Nutzer aktiv den Scanner öffnet.

---

## Bekannte Einschränkungen (Hackathon-MVP)

- Lieferketten-Daten sind mockbasiert; in Produktion über ERP/Blockchain-Integration
- Rückrufdatenbank ist lokal; in Produktion über offizielle API (z. B. RASFF der EU)
- Community-Rangliste nutzt Demo-Daten

---

## Lizenz

Dieses Projekt wurde für den TIE International Hackathon 2026 entwickelt.
