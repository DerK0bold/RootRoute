export interface IngredientOrigin {
  name: string;
  nameDE: string;
  countries: {
    name: string;
    flag: string;
    percentage: number;
    region: string;
  }[];
  description: string;
}

export const INGREDIENT_ORIGINS: Record<string, IngredientOrigin> = {
  // Chocolate / Cocoa
  cocoa: {
    name: 'Cocoa',
    nameDE: 'Kakao',
    countries: [
      { name: 'Ivory Coast', flag: '🇨🇮', percentage: 45, region: 'West Africa' },
      { name: 'Ghana', flag: '🇬🇭', percentage: 20, region: 'West Africa' },
      { name: 'Ecuador', flag: '🇪🇨', percentage: 10, region: 'South America' },
      { name: 'Indonesia', flag: '🇮🇩', percentage: 10, region: 'Southeast Asia' },
    ],
    description: 'Kakao wird hauptsächlich in tropischen Regionen angebaut.',
  },
  'dark chocolate': {
    name: 'Dark Chocolate',
    nameDE: 'Dunkle Schokolade',
    countries: [
      { name: 'Ivory Coast', flag: '🇨🇮', percentage: 45, region: 'West Africa' },
      { name: 'Belgium', flag: '🇧🇪', percentage: 30, region: 'Europe' },
      { name: 'Switzerland', flag: '🇨🇭', percentage: 25, region: 'Europe' },
    ],
    description: 'Kakaobohnen aus Westafrika werden in Europa zu Schokolade verarbeitet.',
  },
  sugar: {
    name: 'Sugar',
    nameDE: 'Zucker',
    countries: [
      { name: 'Brazil', flag: '🇧🇷', percentage: 25, region: 'South America' },
      { name: 'India', flag: '🇮🇳', percentage: 20, region: 'South Asia' },
      { name: 'Germany', flag: '🇩🇪', percentage: 15, region: 'Europe' },
      { name: 'France', flag: '🇫🇷', percentage: 10, region: 'Europe' },
    ],
    description: 'Zucker kommt sowohl aus Zuckerrohr (tropisch) als auch aus Zuckerrüben (Europa).',
  },
  'whole milk': {
    name: 'Whole Milk',
    nameDE: 'Vollmilch',
    countries: [
      { name: 'Switzerland', flag: '🇨🇭', percentage: 40, region: 'Europe' },
      { name: 'Germany', flag: '🇩🇪', percentage: 35, region: 'Europe' },
      { name: 'Netherlands', flag: '🇳🇱', percentage: 25, region: 'Europe' },
    ],
    description: 'Milch wird lokal in Europa produziert.',
  },
  milk: {
    name: 'Milk',
    nameDE: 'Milch',
    countries: [
      { name: 'Switzerland', flag: '🇨🇭', percentage: 50, region: 'Europe' },
      { name: 'Germany', flag: '🇩🇪', percentage: 30, region: 'Europe' },
    ],
    description: 'Lokal produzierte Milch aus der Schweiz und Deutschland.',
  },
  hazelnuts: {
    name: 'Hazelnuts',
    nameDE: 'Haselnüsse',
    countries: [
      { name: 'Turkey', flag: '🇹🇷', percentage: 70, region: 'Middle East' },
      { name: 'Italy', flag: '🇮🇹', percentage: 15, region: 'Europe' },
      { name: 'Azerbaijan', flag: '🇦🇿', percentage: 8, region: 'Caucasus' },
    ],
    description: 'Die Türkei ist der weltweit grösste Haselnussproduzent.',
  },
  almonds: {
    name: 'Almonds',
    nameDE: 'Mandeln',
    countries: [
      { name: 'USA', flag: '🇺🇸', percentage: 80, region: 'North America' },
      { name: 'Spain', flag: '🇪🇸', percentage: 10, region: 'Europe' },
      { name: 'Australia', flag: '🇦🇺', percentage: 5, region: 'Oceania' },
    ],
    description: 'Kaliformien (USA) produziert den Grossteil der weltweiten Mandeln.',
  },
  cashews: {
    name: 'Cashews',
    nameDE: 'Cashewnüsse',
    countries: [
      { name: 'Vietnam', flag: '🇻🇳', percentage: 30, region: 'Southeast Asia' },
      { name: 'Nigeria', flag: '🇳🇬', percentage: 20, region: 'West Africa' },
      { name: 'India', flag: '🇮🇳', percentage: 20, region: 'South Asia' },
      { name: 'Ivory Coast', flag: '🇨🇮', percentage: 15, region: 'West Africa' },
    ],
    description: 'Cashews werden in tropischen Ländern angebaut und verarbeitet.',
  },
  peanuts: {
    name: 'Peanuts',
    nameDE: 'Erdnüsse',
    countries: [
      { name: 'China', flag: '🇨🇳', percentage: 40, region: 'East Asia' },
      { name: 'India', flag: '🇮🇳', percentage: 15, region: 'South Asia' },
      { name: 'Nigeria', flag: '🇳🇬', percentage: 10, region: 'West Africa' },
      { name: 'USA', flag: '🇺🇸', percentage: 10, region: 'North America' },
    ],
    description: 'China ist der grösste Erdnussproduzent der Welt.',
  },
  wheat: {
    name: 'Wheat',
    nameDE: 'Weizen',
    countries: [
      { name: 'China', flag: '🇨🇳', percentage: 18, region: 'East Asia' },
      { name: 'India', flag: '🇮🇳', percentage: 14, region: 'South Asia' },
      { name: 'Russia', flag: '🇷🇺', percentage: 12, region: 'Eastern Europe' },
      { name: 'USA', flag: '🇺🇸', percentage: 8, region: 'North America' },
      { name: 'France', flag: '🇫🇷', percentage: 6, region: 'Europe' },
    ],
    description: 'Weizen ist eines der wichtigsten Getreide weltweit.',
  },
  flour: {
    name: 'Wheat Flour',
    nameDE: 'Weizenmehl',
    countries: [
      { name: 'Germany', flag: '🇩🇪', percentage: 40, region: 'Europe' },
      { name: 'France', flag: '🇫🇷', percentage: 25, region: 'Europe' },
      { name: 'Switzerland', flag: '🇨🇭', percentage: 20, region: 'Europe' },
    ],
    description: 'Mehl wird aus lokalem europäischem Weizen gemahlen.',
  },
  'palm oil': {
    name: 'Palm Oil',
    nameDE: 'Palmöl',
    countries: [
      { name: 'Indonesia', flag: '🇮🇩', percentage: 55, region: 'Southeast Asia' },
      { name: 'Malaysia', flag: '🇲🇾', percentage: 30, region: 'Southeast Asia' },
      { name: 'Thailand', flag: '🇹🇭', percentage: 5, region: 'Southeast Asia' },
    ],
    description: 'Palmöl ist umstritten wegen Entwaldung in Südostasien.',
  },
  'sunflower oil': {
    name: 'Sunflower Oil',
    nameDE: 'Sonnenblumenöl',
    countries: [
      { name: 'Ukraine', flag: '🇺🇦', percentage: 40, region: 'Eastern Europe' },
      { name: 'Russia', flag: '🇷🇺', percentage: 30, region: 'Eastern Europe' },
      { name: 'Argentina', flag: '🇦🇷', percentage: 10, region: 'South America' },
    ],
    description: 'Die Ukraine und Russland dominieren den weltweiten Sonnenblumenölmarkt.',
  },
  vanilla: {
    name: 'Vanilla',
    nameDE: 'Vanille',
    countries: [
      { name: 'Madagascar', flag: '🇲🇬', percentage: 80, region: 'East Africa' },
      { name: 'Indonesia', flag: '🇮🇩', percentage: 10, region: 'Southeast Asia' },
      { name: 'Mexico', flag: '🇲🇽', percentage: 5, region: 'North America' },
    ],
    description: 'Madagaskar produziert den Grossteil der weltweiten Vanille.',
  },
  coffee: {
    name: 'Coffee',
    nameDE: 'Kaffee',
    countries: [
      { name: 'Brazil', flag: '🇧🇷', percentage: 35, region: 'South America' },
      { name: 'Vietnam', flag: '🇻🇳', percentage: 20, region: 'Southeast Asia' },
      { name: 'Colombia', flag: '🇨🇴', percentage: 10, region: 'South America' },
      { name: 'Ethiopia', flag: '🇪🇹', percentage: 8, region: 'East Africa' },
    ],
    description: 'Brasilien ist der grösste Kaffeeproduzent der Welt.',
  },
  'whole grain oats': {
    name: 'Oats',
    nameDE: 'Haferflocken',
    countries: [
      { name: 'Russia', flag: '🇷🇺', percentage: 20, region: 'Eastern Europe' },
      { name: 'Canada', flag: '🇨🇦', percentage: 15, region: 'North America' },
      { name: 'Finland', flag: '🇫🇮', percentage: 10, region: 'Northern Europe' },
      { name: 'Germany', flag: '🇩🇪', percentage: 10, region: 'Europe' },
    ],
    description: 'Hafer wird hauptsächlich in gemässigten Klimazonen angebaut.',
  },
  oats: {
    name: 'Oats',
    nameDE: 'Hafer',
    countries: [
      { name: 'Russia', flag: '🇷🇺', percentage: 20, region: 'Eastern Europe' },
      { name: 'Canada', flag: '🇨🇦', percentage: 15, region: 'North America' },
      { name: 'Germany', flag: '🇩🇪', percentage: 10, region: 'Europe' },
    ],
    description: 'Hafer gedeiht besonders gut in kühlen, feuchten Klimazonen.',
  },
  rice: {
    name: 'Rice',
    nameDE: 'Reis',
    countries: [
      { name: 'China', flag: '🇨🇳', percentage: 30, region: 'East Asia' },
      { name: 'India', flag: '🇮🇳', percentage: 20, region: 'South Asia' },
      { name: 'Indonesia', flag: '🇮🇩', percentage: 10, region: 'Southeast Asia' },
      { name: 'Thailand', flag: '🇹🇭', percentage: 8, region: 'Southeast Asia' },
    ],
    description: 'Reis ist das wichtigste Grundnahrungsmittel in Asien.',
  },
  salt: {
    name: 'Salt',
    nameDE: 'Salz',
    countries: [
      { name: 'Switzerland', flag: '🇨🇭', percentage: 60, region: 'Europe' },
      { name: 'Germany', flag: '🇩🇪', percentage: 30, region: 'Europe' },
    ],
    description: 'Salz wird aus Salzbergwerken oder durch Meerwasserverdunstung gewonnen.',
  },
  'soy lecithin': {
    name: 'Soy Lecithin',
    nameDE: 'Sojalecithin',
    countries: [
      { name: 'USA', flag: '🇺🇸', percentage: 35, region: 'North America' },
      { name: 'Brazil', flag: '🇧🇷', percentage: 30, region: 'South America' },
      { name: 'Argentina', flag: '🇦🇷', percentage: 20, region: 'South America' },
    ],
    description: 'Sojalecithin ist ein Emulgator aus Sojabohnen.',
  },
  soy: {
    name: 'Soy',
    nameDE: 'Soja',
    countries: [
      { name: 'USA', flag: '🇺🇸', percentage: 35, region: 'North America' },
      { name: 'Brazil', flag: '🇧🇷', percentage: 30, region: 'South America' },
      { name: 'Argentina', flag: '🇦🇷', percentage: 20, region: 'South America' },
    ],
    description: 'Soja wird hauptsächlich in Nord- und Südamerika angebaut.',
  },
  'skimmed milk': {
    name: 'Skimmed Milk',
    nameDE: 'Magermilch',
    countries: [
      { name: 'Germany', flag: '🇩🇪', percentage: 40, region: 'Europe' },
      { name: 'Netherlands', flag: '🇳🇱', percentage: 30, region: 'Europe' },
      { name: 'Switzerland', flag: '🇨🇭', percentage: 20, region: 'Europe' },
    ],
    description: 'Magermilch stammt aus europäischer Milchwirtschaft.',
  },
  butter: {
    name: 'Butter',
    nameDE: 'Butter',
    countries: [
      { name: 'Germany', flag: '🇩🇪', percentage: 35, region: 'Europe' },
      { name: 'France', flag: '🇫🇷', percentage: 25, region: 'Europe' },
      { name: 'Switzerland', flag: '🇨🇭', percentage: 20, region: 'Europe' },
    ],
    description: 'Europäische Butter aus regionaler Milchwirtschaft.',
  },
  eggs: {
    name: 'Eggs',
    nameDE: 'Eier',
    countries: [
      { name: 'Switzerland', flag: '🇨🇭', percentage: 55, region: 'Europe' },
      { name: 'Germany', flag: '🇩🇪', percentage: 30, region: 'Europe' },
    ],
    description: 'Eier kommen hauptsächlich aus der lokalen Landwirtschaft.',
  },
  tomatoes: {
    name: 'Tomatoes',
    nameDE: 'Tomaten',
    countries: [
      { name: 'Italy', flag: '🇮🇹', percentage: 30, region: 'Europe' },
      { name: 'Spain', flag: '🇪🇸', percentage: 20, region: 'Europe' },
      { name: 'China', flag: '🇨🇳', percentage: 15, region: 'East Asia' },
    ],
    description: 'Tomaten kommen hauptsächlich aus dem Mittelmeerraum.',
  },
  'olive oil': {
    name: 'Olive Oil',
    nameDE: 'Olivenöl',
    countries: [
      { name: 'Spain', flag: '🇪🇸', percentage: 45, region: 'Europe' },
      { name: 'Italy', flag: '🇮🇹', percentage: 25, region: 'Europe' },
      { name: 'Greece', flag: '🇬🇷', percentage: 20, region: 'Europe' },
      { name: 'Tunisia', flag: '🇹🇳', percentage: 5, region: 'North Africa' },
    ],
    description: 'Olivenöl stammt aus dem Mittelmeerraum.',
  },

  // ── Kakao-Produkte ────────────────────────────────────────────────────────
  chocolate: {
    name: 'Chocolate',
    nameDE: 'Schokolade',
    countries: [
      { name: 'Ivory Coast', flag: '🇨🇮', percentage: 40, region: 'West Africa' },
      { name: 'Belgium', flag: '🇧🇪', percentage: 30, region: 'Europe' },
      { name: 'Switzerland', flag: '🇨🇭', percentage: 20, region: 'Europe' },
      { name: 'Germany', flag: '🇩🇪', percentage: 10, region: 'Europe' },
    ],
    description: 'Kakaobohnen aus Westafrika werden in Europa zu Schokolade verarbeitet.',
  },
  'milk chocolate': {
    name: 'Milk Chocolate',
    nameDE: 'Milchschokolade',
    countries: [
      { name: 'Ivory Coast', flag: '🇨🇮', percentage: 35, region: 'West Africa' },
      { name: 'Switzerland', flag: '🇨🇭', percentage: 35, region: 'Europe' },
      { name: 'Belgium', flag: '🇧🇪', percentage: 20, region: 'Europe' },
    ],
    description: 'Milchschokolade vereint afrikanischen Kakao mit europäischer Milch.',
  },
  'cocoa butter': {
    name: 'Cocoa Butter',
    nameDE: 'Kakaobutter',
    countries: [
      { name: 'Ivory Coast', flag: '🇨🇮', percentage: 45, region: 'West Africa' },
      { name: 'Ghana', flag: '🇬🇭', percentage: 25, region: 'West Africa' },
      { name: 'Indonesia', flag: '🇮🇩', percentage: 15, region: 'Southeast Asia' },
    ],
    description: 'Kakaobutter ist das Fett aus der Kakaobohne.',
  },
  'cocoa mass': {
    name: 'Cocoa Mass',
    nameDE: 'Kakaomasse',
    countries: [
      { name: 'Ivory Coast', flag: '🇨🇮', percentage: 45, region: 'West Africa' },
      { name: 'Ghana', flag: '🇬🇭', percentage: 25, region: 'West Africa' },
      { name: 'Ecuador', flag: '🇪🇨', percentage: 15, region: 'South America' },
    ],
    description: 'Kakaomasse entsteht beim Mahlen von Kakaobohnen.',
  },
  'cocoa powder': {
    name: 'Cocoa Powder',
    nameDE: 'Kakaopulver',
    countries: [
      { name: 'Ivory Coast', flag: '🇨🇮', percentage: 45, region: 'West Africa' },
      { name: 'Ghana', flag: '🇬🇭', percentage: 20, region: 'West Africa' },
      { name: 'Netherlands', flag: '🇳🇱', percentage: 20, region: 'Europe' },
    ],
    description: 'Kakaopulver entsteht durch Entfettung der Kakaomasse.',
  },

  // ── Milchprodukte ─────────────────────────────────────────────────────────
  cream: {
    name: 'Cream',
    nameDE: 'Rahm',
    countries: [
      { name: 'Switzerland', flag: '🇨🇭', percentage: 50, region: 'Europe' },
      { name: 'Germany', flag: '🇩🇪', percentage: 35, region: 'Europe' },
      { name: 'Austria', flag: '🇦🇹', percentage: 15, region: 'Europe' },
    ],
    description: 'Rahm ist ein regionaler Milchrohstoff aus der Alpenwirtschaft.',
  },
  'whipping cream': {
    name: 'Whipping Cream',
    nameDE: 'Schlagrahm',
    countries: [
      { name: 'Switzerland', flag: '🇨🇭', percentage: 50, region: 'Europe' },
      { name: 'Germany', flag: '🇩🇪', percentage: 35, region: 'Europe' },
      { name: 'Austria', flag: '🇦🇹', percentage: 15, region: 'Europe' },
    ],
    description: 'Schlagrahm stammt aus regionaler europäischer Milchwirtschaft.',
  },
  yogurt: {
    name: 'Yogurt',
    nameDE: 'Joghurt',
    countries: [
      { name: 'Switzerland', flag: '🇨🇭', percentage: 55, region: 'Europe' },
      { name: 'Germany', flag: '🇩🇪', percentage: 30, region: 'Europe' },
      { name: 'Austria', flag: '🇦🇹', percentage: 15, region: 'Europe' },
    ],
    description: 'Joghurt wird aus lokaler Milch durch Fermentation hergestellt.',
  },
  cheese: {
    name: 'Cheese',
    nameDE: 'Käse',
    countries: [
      { name: 'Switzerland', flag: '🇨🇭', percentage: 45, region: 'Europe' },
      { name: 'Germany', flag: '🇩🇪', percentage: 30, region: 'Europe' },
      { name: 'France', flag: '🇫🇷', percentage: 15, region: 'Europe' },
    ],
    description: 'Käse ist ein traditionelles europäisches Milchprodukt.',
  },
  whey: {
    name: 'Whey',
    nameDE: 'Molke',
    countries: [
      { name: 'Germany', flag: '🇩🇪', percentage: 40, region: 'Europe' },
      { name: 'Netherlands', flag: '🇳🇱', percentage: 30, region: 'Europe' },
      { name: 'Switzerland', flag: '🇨🇭', percentage: 20, region: 'Europe' },
    ],
    description: 'Molke ist ein Nebenprodukt der Käseherstellung.',
  },
  'whey powder': {
    name: 'Whey Powder',
    nameDE: 'Molkenpulver',
    countries: [
      { name: 'Germany', flag: '🇩🇪', percentage: 40, region: 'Europe' },
      { name: 'Netherlands', flag: '🇳🇱', percentage: 30, region: 'Europe' },
      { name: 'USA', flag: '🇺🇸', percentage: 20, region: 'North America' },
    ],
    description: 'Getrocknetes Molkenprotein aus europäischer Käseproduktion.',
  },
  'milk powder': {
    name: 'Milk Powder',
    nameDE: 'Milchpulver',
    countries: [
      { name: 'Germany', flag: '🇩🇪', percentage: 35, region: 'Europe' },
      { name: 'Netherlands', flag: '🇳🇱', percentage: 25, region: 'Europe' },
      { name: 'New Zealand', flag: '🇳🇿', percentage: 20, region: 'Oceania' },
    ],
    description: 'Milchpulver entsteht durch Trocknung von Frischmilch.',
  },
  lactose: {
    name: 'Lactose',
    nameDE: 'Laktose',
    countries: [
      { name: 'Germany', flag: '🇩🇪', percentage: 45, region: 'Europe' },
      { name: 'Netherlands', flag: '🇳🇱', percentage: 30, region: 'Europe' },
      { name: 'Ireland', flag: '🇮🇪', percentage: 15, region: 'Europe' },
    ],
    description: 'Laktose (Milchzucker) wird aus Molke gewonnen.',
  },

  // ── Getreide & Stärke ─────────────────────────────────────────────────────
  corn: {
    name: 'Corn / Maize',
    nameDE: 'Mais',
    countries: [
      { name: 'USA', flag: '🇺🇸', percentage: 35, region: 'North America' },
      { name: 'China', flag: '🇨🇳', percentage: 25, region: 'East Asia' },
      { name: 'Brazil', flag: '🇧🇷', percentage: 10, region: 'South America' },
      { name: 'Argentina', flag: '🇦🇷', percentage: 8, region: 'South America' },
    ],
    description: 'Mais ist eines der am meisten angebauten Getreide weltweit.',
  },
  maize: {
    name: 'Maize',
    nameDE: 'Mais',
    countries: [
      { name: 'USA', flag: '🇺🇸', percentage: 35, region: 'North America' },
      { name: 'China', flag: '🇨🇳', percentage: 25, region: 'East Asia' },
      { name: 'Brazil', flag: '🇧🇷', percentage: 10, region: 'South America' },
    ],
    description: 'Mais wird weltweit als Nahrungs- und Futtermittel genutzt.',
  },
  'corn starch': {
    name: 'Corn Starch',
    nameDE: 'Maisstärke',
    countries: [
      { name: 'USA', flag: '🇺🇸', percentage: 45, region: 'North America' },
      { name: 'China', flag: '🇨🇳', percentage: 25, region: 'East Asia' },
      { name: 'Germany', flag: '🇩🇪', percentage: 15, region: 'Europe' },
    ],
    description: 'Maisstärke wird als Verdickungsmittel und Bindemittel eingesetzt.',
  },
  'potato starch': {
    name: 'Potato Starch',
    nameDE: 'Kartoffelstärke',
    countries: [
      { name: 'Germany', flag: '🇩🇪', percentage: 40, region: 'Europe' },
      { name: 'Netherlands', flag: '🇳🇱', percentage: 30, region: 'Europe' },
      { name: 'France', flag: '🇫🇷', percentage: 15, region: 'Europe' },
    ],
    description: 'Kartoffelstärke stammt aus europäischem Kartoffelanbau.',
  },
  starch: {
    name: 'Starch',
    nameDE: 'Stärke',
    countries: [
      { name: 'USA', flag: '🇺🇸', percentage: 30, region: 'North America' },
      { name: 'Germany', flag: '🇩🇪', percentage: 25, region: 'Europe' },
      { name: 'France', flag: '🇫🇷', percentage: 20, region: 'Europe' },
    ],
    description: 'Stärke wird aus Mais, Weizen oder Kartoffeln gewonnen.',
  },
  'modified starch': {
    name: 'Modified Starch',
    nameDE: 'Modifizierte Stärke',
    countries: [
      { name: 'USA', flag: '🇺🇸', percentage: 35, region: 'North America' },
      { name: 'Germany', flag: '🇩🇪', percentage: 25, region: 'Europe' },
      { name: 'Netherlands', flag: '🇳🇱', percentage: 20, region: 'Europe' },
    ],
    description: 'Modifizierte Stärke wird chemisch oder physikalisch verändert.',
  },
  barley: {
    name: 'Barley',
    nameDE: 'Gerste',
    countries: [
      { name: 'Russia', flag: '🇷🇺', percentage: 15, region: 'Eastern Europe' },
      { name: 'Australia', flag: '🇦🇺', percentage: 13, region: 'Oceania' },
      { name: 'France', flag: '🇫🇷', percentage: 10, region: 'Europe' },
      { name: 'Germany', flag: '🇩🇪', percentage: 10, region: 'Europe' },
    ],
    description: 'Gerste ist ein wichtiges Brot- und Braugetreide in Europa.',
  },
  rye: {
    name: 'Rye',
    nameDE: 'Roggen',
    countries: [
      { name: 'Russia', flag: '🇷🇺', percentage: 30, region: 'Eastern Europe' },
      { name: 'Germany', flag: '🇩🇪', percentage: 20, region: 'Europe' },
      { name: 'Poland', flag: '🇵🇱', percentage: 15, region: 'Europe' },
      { name: 'Belarus', flag: '🇧🇾', percentage: 10, region: 'Eastern Europe' },
    ],
    description: 'Roggen gedeiht gut in kühlen, feuchten Klimazonen Nordeuropas.',
  },
  spelt: {
    name: 'Spelt',
    nameDE: 'Dinkel',
    countries: [
      { name: 'Germany', flag: '🇩🇪', percentage: 50, region: 'Europe' },
      { name: 'Switzerland', flag: '🇨🇭', percentage: 25, region: 'Europe' },
      { name: 'Austria', flag: '🇦🇹', percentage: 15, region: 'Europe' },
    ],
    description: 'Dinkel ist ein altes Getreidekorn aus der DACH-Region.',
  },
  potatoes: {
    name: 'Potatoes',
    nameDE: 'Kartoffeln',
    countries: [
      { name: 'Germany', flag: '🇩🇪', percentage: 30, region: 'Europe' },
      { name: 'Switzerland', flag: '🇨🇭', percentage: 20, region: 'Europe' },
      { name: 'Netherlands', flag: '🇳🇱', percentage: 15, region: 'Europe' },
      { name: 'France', flag: '🇫🇷', percentage: 10, region: 'Europe' },
    ],
    description: 'Kartoffeln werden vor allem in Europa regional angebaut.',
  },

  // ── Öle & Fette ──────────────────────────────────────────────────────────
  'rapeseed oil': {
    name: 'Rapeseed Oil',
    nameDE: 'Rapsöl',
    countries: [
      { name: 'Germany', flag: '🇩🇪', percentage: 35, region: 'Europe' },
      { name: 'France', flag: '🇫🇷', percentage: 20, region: 'Europe' },
      { name: 'Canada', flag: '🇨🇦', percentage: 15, region: 'North America' },
      { name: 'Poland', flag: '🇵🇱', percentage: 10, region: 'Europe' },
    ],
    description: 'Rapsöl ist das beliebteste Speiseöl in Deutschland und der Schweiz.',
  },
  'canola oil': {
    name: 'Canola Oil',
    nameDE: 'Rapsöl (Canola)',
    countries: [
      { name: 'Canada', flag: '🇨🇦', percentage: 40, region: 'North America' },
      { name: 'Germany', flag: '🇩🇪', percentage: 25, region: 'Europe' },
      { name: 'France', flag: '🇫🇷', percentage: 15, region: 'Europe' },
    ],
    description: 'Canola ist eine gezüchtete Rapssorte mit niedrigem Erucasäure-Gehalt.',
  },
  'coconut oil': {
    name: 'Coconut Oil',
    nameDE: 'Kokosöl',
    countries: [
      { name: 'Indonesia', flag: '🇮🇩', percentage: 40, region: 'Southeast Asia' },
      { name: 'Philippines', flag: '🇵🇭', percentage: 30, region: 'Southeast Asia' },
      { name: 'India', flag: '🇮🇳', percentage: 15, region: 'South Asia' },
    ],
    description: 'Kokosöl stammt aus den Tropen Südostasiens.',
  },
  'vegetable oil': {
    name: 'Vegetable Oil',
    nameDE: 'Pflanzenöl',
    countries: [
      { name: 'Germany', flag: '🇩🇪', percentage: 25, region: 'Europe' },
      { name: 'Indonesia', flag: '🇮🇩', percentage: 25, region: 'Southeast Asia' },
      { name: 'USA', flag: '🇺🇸', percentage: 20, region: 'North America' },
    ],
    description: 'Pflanzenöl ist eine Mischung aus verschiedenen pflanzlichen Ölen.',
  },

  // ── Süssmittel ───────────────────────────────────────────────────────────
  honey: {
    name: 'Honey',
    nameDE: 'Honig',
    countries: [
      { name: 'Switzerland', flag: '🇨🇭', percentage: 30, region: 'Europe' },
      { name: 'Germany', flag: '🇩🇪', percentage: 25, region: 'Europe' },
      { name: 'China', flag: '🇨🇳', percentage: 20, region: 'East Asia' },
      { name: 'Argentina', flag: '🇦🇷', percentage: 10, region: 'South America' },
    ],
    description: 'Honig stammt idealerweise aus lokalem Imkereien.',
  },
  'glucose syrup': {
    name: 'Glucose Syrup',
    nameDE: 'Glukosesirup',
    countries: [
      { name: 'Germany', flag: '🇩🇪', percentage: 35, region: 'Europe' },
      { name: 'France', flag: '🇫🇷', percentage: 25, region: 'Europe' },
      { name: 'USA', flag: '🇺🇸', percentage: 20, region: 'North America' },
    ],
    description: 'Glukosesirup wird aus Maisstärke oder Weizenstärke hergestellt.',
  },
  glucose: {
    name: 'Glucose',
    nameDE: 'Glukose',
    countries: [
      { name: 'Germany', flag: '🇩🇪', percentage: 35, region: 'Europe' },
      { name: 'France', flag: '🇫🇷', percentage: 25, region: 'Europe' },
      { name: 'USA', flag: '🇺🇸', percentage: 20, region: 'North America' },
    ],
    description: 'Glukose wird aus Stärke durch enzymatische Spaltung gewonnen.',
  },
  fructose: {
    name: 'Fructose',
    nameDE: 'Fruktose',
    countries: [
      { name: 'USA', flag: '🇺🇸', percentage: 40, region: 'North America' },
      { name: 'Germany', flag: '🇩🇪', percentage: 25, region: 'Europe' },
      { name: 'Netherlands', flag: '🇳🇱', percentage: 15, region: 'Europe' },
    ],
    description: 'Fruktose kommt natürlich in Obst vor und wird auch industriell gewonnen.',
  },
  'maple syrup': {
    name: 'Maple Syrup',
    nameDE: 'Ahornsirup',
    countries: [
      { name: 'Canada', flag: '🇨🇦', percentage: 75, region: 'North America' },
      { name: 'USA', flag: '🇺🇸', percentage: 20, region: 'North America' },
    ],
    description: 'Ahornsirup kommt zu über 70 % aus Kanada (Québec).',
  },
  'agave syrup': {
    name: 'Agave Syrup',
    nameDE: 'Agavensirup',
    countries: [
      { name: 'Mexico', flag: '🇲🇽', percentage: 80, region: 'North America' },
      { name: 'South Africa', flag: '🇿🇦', percentage: 10, region: 'Southern Africa' },
    ],
    description: 'Agavensirup wird aus der Agave-Pflanze hauptsächlich in Mexiko gewonnen.',
  },

  // ── Früchte ──────────────────────────────────────────────────────────────
  lemon: {
    name: 'Lemon',
    nameDE: 'Zitrone',
    countries: [
      { name: 'India', flag: '🇮🇳', percentage: 20, region: 'South Asia' },
      { name: 'Mexico', flag: '🇲🇽', percentage: 15, region: 'North America' },
      { name: 'China', flag: '🇨🇳', percentage: 12, region: 'East Asia' },
      { name: 'Argentina', flag: '🇦🇷', percentage: 10, region: 'South America' },
      { name: 'Spain', flag: '🇪🇸', percentage: 10, region: 'Europe' },
    ],
    description: 'Zitronen kommen aus wärmeren Klimazonen im Mittelmeerraum und den Tropen.',
  },
  'lemon juice': {
    name: 'Lemon Juice',
    nameDE: 'Zitronensaft',
    countries: [
      { name: 'Spain', flag: '🇪🇸', percentage: 30, region: 'Europe' },
      { name: 'Argentina', flag: '🇦🇷', percentage: 25, region: 'South America' },
      { name: 'India', flag: '🇮🇳', percentage: 15, region: 'South Asia' },
    ],
    description: 'Zitronensaft wird hauptsächlich in der Lebensmittelindustrie aus Konzentraten hergestellt.',
  },
  apple: {
    name: 'Apple',
    nameDE: 'Apfel',
    countries: [
      { name: 'Switzerland', flag: '🇨🇭', percentage: 25, region: 'Europe' },
      { name: 'Germany', flag: '🇩🇪', percentage: 20, region: 'Europe' },
      { name: 'Italy', flag: '🇮🇹', percentage: 15, region: 'Europe' },
      { name: 'Austria', flag: '🇦🇹', percentage: 10, region: 'Europe' },
    ],
    description: 'Äpfel wachsen in der gemässigten Klimazone Europas.',
  },
  strawberry: {
    name: 'Strawberry',
    nameDE: 'Erdbeere',
    countries: [
      { name: 'Spain', flag: '🇪🇸', percentage: 30, region: 'Europe' },
      { name: 'Poland', flag: '🇵🇱', percentage: 15, region: 'Europe' },
      { name: 'Germany', flag: '🇩🇪', percentage: 10, region: 'Europe' },
      { name: 'USA', flag: '🇺🇸', percentage: 10, region: 'North America' },
    ],
    description: 'Erdbeeren werden hauptsächlich in Spanien und Polen für den EU-Markt angebaut.',
  },
  raspberry: {
    name: 'Raspberry',
    nameDE: 'Himbeere',
    countries: [
      { name: 'Russia', flag: '🇷🇺', percentage: 25, region: 'Eastern Europe' },
      { name: 'Poland', flag: '🇵🇱', percentage: 20, region: 'Europe' },
      { name: 'Serbia', flag: '🇷🇸', percentage: 20, region: 'Europe' },
    ],
    description: 'Himbeeren kommen vor allem aus Osteuropa.',
  },
  banana: {
    name: 'Banana',
    nameDE: 'Banane',
    countries: [
      { name: 'Ecuador', flag: '🇪🇨', percentage: 25, region: 'South America' },
      { name: 'Philippines', flag: '🇵🇭', percentage: 10, region: 'Southeast Asia' },
      { name: 'Colombia', flag: '🇨🇴', percentage: 10, region: 'South America' },
      { name: 'Costa Rica', flag: '🇨🇷', percentage: 8, region: 'Central America' },
    ],
    description: 'Bananen werden vor allem in Süd- und Mittelamerika für den Export angebaut.',
  },
  coconut: {
    name: 'Coconut',
    nameDE: 'Kokosnuss',
    countries: [
      { name: 'Indonesia', flag: '🇮🇩', percentage: 30, region: 'Southeast Asia' },
      { name: 'Philippines', flag: '🇵🇭', percentage: 25, region: 'Southeast Asia' },
      { name: 'India', flag: '🇮🇳', percentage: 20, region: 'South Asia' },
    ],
    description: 'Kokosnüsse wachsen in tropischen Küstenregionen.',
  },
  raisins: {
    name: 'Raisins',
    nameDE: 'Rosinen',
    countries: [
      { name: 'USA', flag: '🇺🇸', percentage: 30, region: 'North America' },
      { name: 'Turkey', flag: '🇹🇷', percentage: 25, region: 'Middle East' },
      { name: 'Iran', flag: '🇮🇷', percentage: 15, region: 'Middle East' },
    ],
    description: 'Rosinen stammen hauptsächlich aus Weinbaugebieten Nordamerikas und dem Nahen Osten.',
  },
  dates: {
    name: 'Dates',
    nameDE: 'Datteln',
    countries: [
      { name: 'Egypt', flag: '🇪🇬', percentage: 20, region: 'North Africa' },
      { name: 'Saudi Arabia', flag: '🇸🇦', percentage: 18, region: 'Middle East' },
      { name: 'Iran', flag: '🇮🇷', percentage: 15, region: 'Middle East' },
      { name: 'UAE', flag: '🇦🇪', percentage: 12, region: 'Middle East' },
    ],
    description: 'Datteln wachsen in den Trockenregionen des Nahen Ostens und Nordafrikas.',
  },

  // ── Gewürze & Kräuter ────────────────────────────────────────────────────
  pepper: {
    name: 'Pepper',
    nameDE: 'Pfeffer',
    countries: [
      { name: 'Vietnam', flag: '🇻🇳', percentage: 40, region: 'Southeast Asia' },
      { name: 'Indonesia', flag: '🇮🇩', percentage: 15, region: 'Southeast Asia' },
      { name: 'India', flag: '🇮🇳', percentage: 12, region: 'South Asia' },
      { name: 'Brazil', flag: '🇧🇷', percentage: 10, region: 'South America' },
    ],
    description: 'Vietnam ist der grösste Pfefferproduzent der Welt.',
  },
  'black pepper': {
    name: 'Black Pepper',
    nameDE: 'Schwarzer Pfeffer',
    countries: [
      { name: 'Vietnam', flag: '🇻🇳', percentage: 40, region: 'Southeast Asia' },
      { name: 'Indonesia', flag: '🇮🇩', percentage: 15, region: 'Southeast Asia' },
      { name: 'India', flag: '🇮🇳', percentage: 12, region: 'South Asia' },
    ],
    description: 'Schwarzer Pfeffer stammt überwiegend aus Vietnam.',
  },
  cinnamon: {
    name: 'Cinnamon',
    nameDE: 'Zimt',
    countries: [
      { name: 'Indonesia', flag: '🇮🇩', percentage: 40, region: 'Southeast Asia' },
      { name: 'China', flag: '🇨🇳', percentage: 25, region: 'East Asia' },
      { name: 'Sri Lanka', flag: '🇱🇰', percentage: 20, region: 'South Asia' },
    ],
    description: 'Echter Zimt (Ceylon) kommt aus Sri Lanka; Cassia-Zimt aus Asien.',
  },
  paprika: {
    name: 'Paprika',
    nameDE: 'Paprika (Gewürz)',
    countries: [
      { name: 'Hungary', flag: '🇭🇺', percentage: 30, region: 'Europe' },
      { name: 'Spain', flag: '🇪🇸', percentage: 25, region: 'Europe' },
      { name: 'China', flag: '🇨🇳', percentage: 15, region: 'East Asia' },
    ],
    description: 'Paprika-Gewürz stammt hauptsächlich aus Ungarn und Spanien.',
  },
  turmeric: {
    name: 'Turmeric',
    nameDE: 'Kurkuma',
    countries: [
      { name: 'India', flag: '🇮🇳', percentage: 80, region: 'South Asia' },
      { name: 'Pakistan', flag: '🇵🇰', percentage: 10, region: 'South Asia' },
    ],
    description: 'Indien produziert über 80 % des weltweiten Kurkumas.',
  },
  ginger: {
    name: 'Ginger',
    nameDE: 'Ingwer',
    countries: [
      { name: 'India', flag: '🇮🇳', percentage: 35, region: 'South Asia' },
      { name: 'China', flag: '🇨🇳', percentage: 25, region: 'East Asia' },
      { name: 'Nigeria', flag: '🇳🇬', percentage: 10, region: 'West Africa' },
    ],
    description: 'Ingwer wird in tropischen und subtropischen Klimazonen angebaut.',
  },
  nutmeg: {
    name: 'Nutmeg',
    nameDE: 'Muskatnuss',
    countries: [
      { name: 'Indonesia', flag: '🇮🇩', percentage: 75, region: 'Southeast Asia' },
      { name: 'Grenada', flag: '🇬🇩', percentage: 15, region: 'Caribbean' },
    ],
    description: 'Indonesien, v. a. die Banda-Inseln, ist das Zentrum der Muskatnussproduktion.',
  },
  cardamom: {
    name: 'Cardamom',
    nameDE: 'Kardamom',
    countries: [
      { name: 'Guatemala', flag: '🇬🇹', percentage: 50, region: 'Central America' },
      { name: 'India', flag: '🇮🇳', percentage: 35, region: 'South Asia' },
    ],
    description: 'Guatemala ist der grösste Kardamom-Exporteur der Welt.',
  },
  garlic: {
    name: 'Garlic',
    nameDE: 'Knoblauch',
    countries: [
      { name: 'China', flag: '🇨🇳', percentage: 75, region: 'East Asia' },
      { name: 'India', flag: '🇮🇳', percentage: 6, region: 'South Asia' },
      { name: 'Spain', flag: '🇪🇸', percentage: 4, region: 'Europe' },
    ],
    description: 'China dominiert die weltweite Knoblauchproduktion.',
  },
  onion: {
    name: 'Onion',
    nameDE: 'Zwiebel',
    countries: [
      { name: 'China', flag: '🇨🇳', percentage: 25, region: 'East Asia' },
      { name: 'India', flag: '🇮🇳', percentage: 20, region: 'South Asia' },
      { name: 'USA', flag: '🇺🇸', percentage: 8, region: 'North America' },
      { name: 'Germany', flag: '🇩🇪', percentage: 5, region: 'Europe' },
    ],
    description: 'Zwiebeln werden weltweit angebaut, mit Schwerpunkt in Asien.',
  },

  // ── Nüsse & Samen ────────────────────────────────────────────────────────
  walnuts: {
    name: 'Walnuts',
    nameDE: 'Walnüsse',
    countries: [
      { name: 'China', flag: '🇨🇳', percentage: 50, region: 'East Asia' },
      { name: 'USA', flag: '🇺🇸', percentage: 25, region: 'North America' },
      { name: 'Iran', flag: '🇮🇷', percentage: 8, region: 'Middle East' },
    ],
    description: 'Walnüsse stammen hauptsächlich aus China und Kalifornien.',
  },
  pistachios: {
    name: 'Pistachios',
    nameDE: 'Pistazien',
    countries: [
      { name: 'Iran', flag: '🇮🇷', percentage: 45, region: 'Middle East' },
      { name: 'USA', flag: '🇺🇸', percentage: 40, region: 'North America' },
      { name: 'Turkey', flag: '🇹🇷', percentage: 8, region: 'Middle East' },
    ],
    description: 'Pistazien kommen vor allem aus dem Iran und den USA (Kalifornien).',
  },
  sesame: {
    name: 'Sesame',
    nameDE: 'Sesam',
    countries: [
      { name: 'Sudan', flag: '🇸🇩', percentage: 20, region: 'East Africa' },
      { name: 'Myanmar', flag: '🇲🇲', percentage: 15, region: 'Southeast Asia' },
      { name: 'India', flag: '🇮🇳', percentage: 10, region: 'South Asia' },
      { name: 'Ethiopia', flag: '🇪🇹', percentage: 10, region: 'East Africa' },
    ],
    description: 'Sesam wird in tropischen und subtropischen Regionen angebaut.',
  },
  'sunflower seeds': {
    name: 'Sunflower Seeds',
    nameDE: 'Sonnenblumenkerne',
    countries: [
      { name: 'Ukraine', flag: '🇺🇦', percentage: 35, region: 'Eastern Europe' },
      { name: 'Russia', flag: '🇷🇺', percentage: 25, region: 'Eastern Europe' },
      { name: 'Argentina', flag: '🇦🇷', percentage: 10, region: 'South America' },
    ],
    description: 'Sonnenblumenkerne kommen hauptsächlich aus der Ukraine und Russland.',
  },
  'pumpkin seeds': {
    name: 'Pumpkin Seeds',
    nameDE: 'Kürbiskerne',
    countries: [
      { name: 'Austria', flag: '🇦🇹', percentage: 40, region: 'Europe' },
      { name: 'China', flag: '🇨🇳', percentage: 20, region: 'East Asia' },
      { name: 'Ukraine', flag: '🇺🇦', percentage: 10, region: 'Eastern Europe' },
    ],
    description: 'Die Steiermark (Österreich) ist berühmt für ihre Kürbiskernproduktion.',
  },
  'chia seeds': {
    name: 'Chia Seeds',
    nameDE: 'Chiasamen',
    countries: [
      { name: 'Bolivia', flag: '🇧🇴', percentage: 35, region: 'South America' },
      { name: 'Argentina', flag: '🇦🇷', percentage: 30, region: 'South America' },
      { name: 'Mexico', flag: '🇲🇽', percentage: 15, region: 'North America' },
    ],
    description: 'Chiasamen stammen ursprünglich aus Südamerika und Mexiko.',
  },
  flaxseed: {
    name: 'Flaxseed',
    nameDE: 'Leinsamen',
    countries: [
      { name: 'Canada', flag: '🇨🇦', percentage: 35, region: 'North America' },
      { name: 'Russia', flag: '🇷🇺', percentage: 20, region: 'Eastern Europe' },
      { name: 'Kazakhstan', flag: '🇰🇿', percentage: 15, region: 'Central Asia' },
    ],
    description: 'Kanada ist der grösste Leinsamenexporteur der Welt.',
  },

  // ── Hülsenfrüchte ─────────────────────────────────────────────────────────
  lentils: {
    name: 'Lentils',
    nameDE: 'Linsen',
    countries: [
      { name: 'Canada', flag: '🇨🇦', percentage: 35, region: 'North America' },
      { name: 'India', flag: '🇮🇳', percentage: 25, region: 'South Asia' },
      { name: 'Turkey', flag: '🇹🇷', percentage: 10, region: 'Middle East' },
    ],
    description: 'Linsen gehören zu den ältesten Kulturpflanzen der Menschheit.',
  },
  chickpeas: {
    name: 'Chickpeas',
    nameDE: 'Kichererbsen',
    countries: [
      { name: 'India', flag: '🇮🇳', percentage: 50, region: 'South Asia' },
      { name: 'Australia', flag: '🇦🇺', percentage: 15, region: 'Oceania' },
      { name: 'Turkey', flag: '🇹🇷', percentage: 10, region: 'Middle East' },
    ],
    description: 'Kichererbsen sind ein wichtiges Nahrungsmittel in Südasien und dem Mittelmeerraum.',
  },
  'kidney beans': {
    name: 'Kidney Beans',
    nameDE: 'Kidneybohnen',
    countries: [
      { name: 'India', flag: '🇮🇳', percentage: 20, region: 'South Asia' },
      { name: 'China', flag: '🇨🇳', percentage: 15, region: 'East Asia' },
      { name: 'USA', flag: '🇺🇸', percentage: 12, region: 'North America' },
    ],
    description: 'Kidneybohnen werden weltweit in tropischen Regionen angebaut.',
  },
  peas: {
    name: 'Peas',
    nameDE: 'Erbsen',
    countries: [
      { name: 'Canada', flag: '🇨🇦', percentage: 30, region: 'North America' },
      { name: 'Russia', flag: '🇷🇺', percentage: 20, region: 'Eastern Europe' },
      { name: 'Germany', flag: '🇩🇪', percentage: 10, region: 'Europe' },
    ],
    description: 'Erbsen sind ein wichtiges Hülsenfruchtkulturgut in gemässigten Klimazonen.',
  },

  // ── Proteine & Fleisch ────────────────────────────────────────────────────
  chicken: {
    name: 'Chicken',
    nameDE: 'Hühnchen',
    countries: [
      { name: 'Switzerland', flag: '🇨🇭', percentage: 50, region: 'Europe' },
      { name: 'Germany', flag: '🇩🇪', percentage: 25, region: 'Europe' },
      { name: 'Brazil', flag: '🇧🇷', percentage: 10, region: 'South America' },
    ],
    description: 'Schweizer Geflügel stammt aus lokaler, kontrollierter Haltung.',
  },
  beef: {
    name: 'Beef',
    nameDE: 'Rindfleisch',
    countries: [
      { name: 'Switzerland', flag: '🇨🇭', percentage: 55, region: 'Europe' },
      { name: 'Austria', flag: '🇦🇹', percentage: 20, region: 'Europe' },
      { name: 'Germany', flag: '🇩🇪', percentage: 15, region: 'Europe' },
    ],
    description: 'Rindfleisch kommt hauptsächlich aus der regionalen Alpenwirtschaft.',
  },
  pork: {
    name: 'Pork',
    nameDE: 'Schweinefleisch',
    countries: [
      { name: 'Switzerland', flag: '🇨🇭', percentage: 60, region: 'Europe' },
      { name: 'Germany', flag: '🇩🇪', percentage: 25, region: 'Europe' },
    ],
    description: 'Schweinefleisch stammt aus regionaler europäischer Schweinehaltung.',
  },
  tuna: {
    name: 'Tuna',
    nameDE: 'Thunfisch',
    countries: [
      { name: 'Indonesia', flag: '🇮🇩', percentage: 20, region: 'Southeast Asia' },
      { name: 'Japan', flag: '🇯🇵', percentage: 15, region: 'East Asia' },
      { name: 'Philippines', flag: '🇵🇭', percentage: 10, region: 'Southeast Asia' },
      { name: 'Maldives', flag: '🇲🇻', percentage: 8, region: 'South Asia' },
    ],
    description: 'Thunfisch wird vor allem im Indo-Pazifik gefangen.',
  },
  salmon: {
    name: 'Salmon',
    nameDE: 'Lachs',
    countries: [
      { name: 'Norway', flag: '🇳🇴', percentage: 55, region: 'Northern Europe' },
      { name: 'Chile', flag: '🇨🇱', percentage: 25, region: 'South America' },
      { name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', percentage: 10, region: 'Northern Europe' },
    ],
    description: 'Norwegen ist der weltweit führende Produzent von Zuchtlachs.',
  },

  // ── Additive & Hilfsstoffe ───────────────────────────────────────────────
  yeast: {
    name: 'Yeast',
    nameDE: 'Hefe',
    countries: [
      { name: 'Germany', flag: '🇩🇪', percentage: 35, region: 'Europe' },
      { name: 'France', flag: '🇫🇷', percentage: 25, region: 'Europe' },
      { name: 'Netherlands', flag: '🇳🇱', percentage: 20, region: 'Europe' },
    ],
    description: 'Hefe wird industriell aus Melasse in Europa hergestellt.',
  },
  'yeast extract': {
    name: 'Yeast Extract',
    nameDE: 'Hefeextrakt',
    countries: [
      { name: 'Germany', flag: '🇩🇪', percentage: 40, region: 'Europe' },
      { name: 'Netherlands', flag: '🇳🇱', percentage: 30, region: 'Europe' },
      { name: 'UK', flag: '🇬🇧', percentage: 15, region: 'Europe' },
    ],
    description: 'Hefeextrakt wird als natürlicher Geschmacksverstärker eingesetzt.',
  },
  pectin: {
    name: 'Pectin',
    nameDE: 'Pektin',
    countries: [
      { name: 'Germany', flag: '🇩🇪', percentage: 40, region: 'Europe' },
      { name: 'Denmark', flag: '🇩🇰', percentage: 30, region: 'Europe' },
      { name: 'USA', flag: '🇺🇸', percentage: 15, region: 'North America' },
    ],
    description: 'Pektin wird aus Apfeltrester oder Zitrusschalen gewonnen.',
  },
  gelatin: {
    name: 'Gelatin',
    nameDE: 'Gelatine',
    countries: [
      { name: 'Germany', flag: '🇩🇪', percentage: 35, region: 'Europe' },
      { name: 'France', flag: '🇫🇷', percentage: 25, region: 'Europe' },
      { name: 'Brazil', flag: '🇧🇷', percentage: 15, region: 'South America' },
    ],
    description: 'Gelatine wird aus tierischen Knochen und Häuten hergestellt.',
  },
  'citric acid': {
    name: 'Citric Acid',
    nameDE: 'Zitronensäure',
    countries: [
      { name: 'China', flag: '🇨🇳', percentage: 60, region: 'East Asia' },
      { name: 'Germany', flag: '🇩🇪', percentage: 15, region: 'Europe' },
      { name: 'Brazil', flag: '🇧🇷', percentage: 10, region: 'South America' },
    ],
    description: 'Zitronensäure wird industriell durch Fermentation von Zucker mit Schimmelpilzen hergestellt.',
  },
  'ascorbic acid': {
    name: 'Ascorbic Acid (Vitamin C)',
    nameDE: 'Ascorbinsäure (Vitamin C)',
    countries: [
      { name: 'China', flag: '🇨🇳', percentage: 80, region: 'East Asia' },
      { name: 'Germany', flag: '🇩🇪', percentage: 10, region: 'Europe' },
    ],
    description: 'Industrielle Ascorbinsäure wird überwiegend in China synthetisch hergestellt.',
  },
  lecithin: {
    name: 'Lecithin',
    nameDE: 'Lecithin',
    countries: [
      { name: 'USA', flag: '🇺🇸', percentage: 35, region: 'North America' },
      { name: 'Brazil', flag: '🇧🇷', percentage: 30, region: 'South America' },
      { name: 'Germany', flag: '🇩🇪', percentage: 15, region: 'Europe' },
    ],
    description: 'Lecithin als Emulgator stammt meist aus Soja oder Sonnenblumen.',
  },
  'sunflower lecithin': {
    name: 'Sunflower Lecithin',
    nameDE: 'Sonnenblumenlecithin',
    countries: [
      { name: 'Ukraine', flag: '🇺🇦', percentage: 40, region: 'Eastern Europe' },
      { name: 'Russia', flag: '🇷🇺', percentage: 25, region: 'Eastern Europe' },
      { name: 'Germany', flag: '🇩🇪', percentage: 15, region: 'Europe' },
    ],
    description: 'Sonnenblumenlecithin ist eine sojaallergenfreie Alternative zu Sojalecithin.',
  },
  'baking soda': {
    name: 'Baking Soda',
    nameDE: 'Natron',
    countries: [
      { name: 'USA', flag: '🇺🇸', percentage: 40, region: 'North America' },
      { name: 'Germany', flag: '🇩🇪', percentage: 30, region: 'Europe' },
      { name: 'France', flag: '🇫🇷', percentage: 15, region: 'Europe' },
    ],
    description: 'Natron (Natriumbicarbonat) wird synthetisch oder aus Natursole gewonnen.',
  },
  'baking powder': {
    name: 'Baking Powder',
    nameDE: 'Backpulver',
    countries: [
      { name: 'Germany', flag: '🇩🇪', percentage: 40, region: 'Europe' },
      { name: 'France', flag: '🇫🇷', percentage: 20, region: 'Europe' },
      { name: 'USA', flag: '🇺🇸', percentage: 15, region: 'North America' },
    ],
    description: 'Backpulver wird in Europa industriell hergestellt.',
  },
  vinegar: {
    name: 'Vinegar',
    nameDE: 'Essig',
    countries: [
      { name: 'Germany', flag: '🇩🇪', percentage: 40, region: 'Europe' },
      { name: 'France', flag: '🇫🇷', percentage: 20, region: 'Europe' },
      { name: 'Italy', flag: '🇮🇹', percentage: 15, region: 'Europe' },
      { name: 'China', flag: '🇨🇳', percentage: 10, region: 'East Asia' },
    ],
    description: 'Essig wird durch Fermentation von Alkohol mit Essigsäurebakterien hergestellt.',
  },

  // ── Gemüse ────────────────────────────────────────────────────────────────
  carrot: {
    name: 'Carrot',
    nameDE: 'Karotte',
    countries: [
      { name: 'China', flag: '🇨🇳', percentage: 45, region: 'East Asia' },
      { name: 'Uzbekistan', flag: '🇺🇿', percentage: 10, region: 'Central Asia' },
      { name: 'Germany', flag: '🇩🇪', percentage: 8, region: 'Europe' },
    ],
    description: 'Karotten werden weltweit, besonders in gemässigten Klimazonen, angebaut.',
  },
  spinach: {
    name: 'Spinach',
    nameDE: 'Spinat',
    countries: [
      { name: 'China', flag: '🇨🇳', percentage: 90, region: 'East Asia' },
      { name: 'Germany', flag: '🇩🇪', percentage: 3, region: 'Europe' },
    ],
    description: 'China produziert den Grossteil des weltweiten Spinats.',
  },
  'bell pepper': {
    name: 'Bell Pepper',
    nameDE: 'Paprika (Gemüse)',
    countries: [
      { name: 'Spain', flag: '🇪🇸', percentage: 25, region: 'Europe' },
      { name: 'Netherlands', flag: '🇳🇱', percentage: 15, region: 'Europe' },
      { name: 'China', flag: '🇨🇳', percentage: 15, region: 'East Asia' },
      { name: 'Mexico', flag: '🇲🇽', percentage: 10, region: 'North America' },
    ],
    description: 'Paprika-Gemüse kommt hauptsächlich aus Spanien und den Niederlanden.',
  },
  mushrooms: {
    name: 'Mushrooms',
    nameDE: 'Pilze',
    countries: [
      { name: 'China', flag: '🇨🇳', percentage: 70, region: 'East Asia' },
      { name: 'Italy', flag: '🇮🇹', percentage: 8, region: 'Europe' },
      { name: 'USA', flag: '🇺🇸', percentage: 5, region: 'North America' },
    ],
    description: 'Der Grossteil der weltweit kultivierten Pilze stammt aus China.',
  },
  peppermint: {
    name: 'Peppermint',
    nameDE: 'Pfefferminze',
    countries: [
      { name: 'Schweiz', flag: '🇨🇭', percentage: 40, region: 'Europe' },
      { name: 'Deutschland', flag: '🇩🇪', percentage: 30, region: 'Europe' },
    ],
    description: 'Pfefferminze wird häufig in Europa für Tee und Bonbons angebaut.',
  },
  thyme: {
    name: 'Thyme',
    nameDE: 'Thymian',
    countries: [
      { name: 'Spanien', flag: '🇪🇸', percentage: 40, region: 'Europe' },
      { name: 'Marokko', flag: '🇲🇦', percentage: 30, region: 'North Africa' },
      { name: 'Schweiz', flag: '🇨🇭', percentage: 10, region: 'Europe' },
    ],
    description: 'Thymian ist ein typisches Kraut aus dem Mittelmeerraum.',
  },
  sage: {
    name: 'Sage',
    nameDE: 'Salbei',
    countries: [
      { name: 'Albanien', flag: '🇦🇱', percentage: 40, region: 'Europe' },
      { name: 'Italien', flag: '🇮🇹', percentage: 20, region: 'Europe' },
      { name: 'Schweiz', flag: '🇨🇭', percentage: 10, region: 'Europe' },
    ],
    description: 'Salbei wächst bevorzugt in trockenen und warmen Regionen.',
  },
  herbs: {
    name: 'Swiss Mountain Herbs',
    nameDE: 'Schweizer Bergkräuter',
    countries: [
      { name: 'Schweiz', flag: '🇨🇭', percentage: 100, region: 'Europe' },
    ],
    description: 'Traditionelle Kräuter, die in den Schweizer Alpen angebaut und geerntet werden.',
  },
  vanillin: {
    name: 'Vanillin',
    nameDE: 'Vanillin',
    countries: [
      { name: 'China', flag: '🇨🇳', percentage: 60, region: 'East Asia' },
      { name: 'Deutschland', flag: '🇩🇪', percentage: 20, region: 'Europe' },
    ],
    description: 'Vanillin wird grossteils synthetisch oder biotechnologisch hergestellt.',
  },
  'whole milk powder': {
    name: 'Whole Milk Powder',
    nameDE: 'Vollmilchpulver',
    countries: [
      { name: 'Schweiz', flag: '🇨🇭', percentage: 40, region: 'Europe' },
      { name: 'Deutschland', flag: '🇩🇪', percentage: 30, region: 'Europe' },
    ],
    description: 'Vollmilchpulver entsteht durch Wasserentzug aus frischer Vollmilch.',
  },
  'almond flour': {
    name: 'Almond Flour',
    nameDE: 'Mandelmehl',
    countries: [
      { name: 'USA', flag: '🇺🇸', percentage: 70, region: 'North America' },
      { name: 'Spanien', flag: '🇪🇸', percentage: 20, region: 'Europe' },
    ],
    description: 'Mandelmehl wird aus fein gemahlenen Mandeln gewonnen.',
  },
  'egg white': {
    name: 'Egg White',
    nameDE: 'Eiklar',
    countries: [
      { name: 'Schweiz', flag: '🇨🇭', percentage: 50, region: 'Europe' },
      { name: 'Deutschland', flag: '🇩🇪', percentage: 30, region: 'Europe' },
    ],
    description: 'Eiklar stammt meist aus regionaler Eierproduktion.',
  },
  mate: {
    name: 'Mate',
    nameDE: 'Mate',
    countries: [
      { name: 'Argentinien', flag: '🇦🇷', percentage: 50, region: 'South America' },
      { name: 'Brasilien', flag: '🇧🇷', percentage: 40, region: 'South America' },
      { name: 'Paraguay', flag: '🇵🇾', percentage: 10, region: 'South America' },
    ],
    description: 'Mate-Tee wird traditionell in Südamerika (vor allem Argentinien und Brasilien) angebaut und geerntet.',
  },
  'cane sugar': {
    name: 'Cane Sugar',
    nameDE: 'Rohrzucker',
    countries: [
      { name: 'Brasilien', flag: '🇧🇷', percentage: 40, region: 'South America' },
      { name: 'Indien', flag: '🇮🇳', percentage: 20, region: 'South Asia' },
      { name: 'Kolumbien', flag: '🇨🇴', percentage: 10, region: 'South America' },
    ],
    description: 'Rohrzucker wird aus Zuckerrohr in tropischen Klimazonen gewonnen.',
  },
  guarana: {
    name: 'Guarana',
    nameDE: 'Guarana',
    countries: [
      { name: 'Brasilien', flag: '🇧🇷', percentage: 95, region: 'South America' },
    ],
    description: 'Guarana ist reich an natürlichem Koffein und stammt ursprünglich aus dem Amazonasgebiet.',
  },
  caffeine: {
    name: 'Caffeine',
    nameDE: 'Koffein',
    countries: [
      { name: 'Deutschland', flag: '🇩🇪', percentage: 30, region: 'Europe' },
      { name: 'China', flag: '🇨🇳', percentage: 30, region: 'East Asia' },
    ],
    description: 'Koffein für Getränke wird entweder natürlich extrahiert oder industriell synthetisiert.',
  },
  'carbon dioxide': {
    name: 'Carbon Dioxide',
    nameDE: 'Kohlensäure',
    countries: [
      { name: 'Schweiz', flag: '🇨🇭', percentage: 50, region: 'Europe' },
      { name: 'Deutschland', flag: '🇩🇪', percentage: 50, region: 'Europe' },
    ],
    description: 'Kohlensäure (CO2) für Getränke wird bei der Abfüllung meist aus lokaler Produktion zugesetzt.',
  },
  water: {
    name: 'Water',
    nameDE: 'Wasser',
    countries: [
      { name: 'Schweiz', flag: '🇨🇭', percentage: 50, region: 'Europe' },
      { name: 'Deutschland', flag: '🇩🇪', percentage: 50, region: 'Europe' },
    ],
    description: 'Trinkwasser für die Getränkeproduktion wird lokal aus eigenen Quellen oder dem Grundwasser bezogen.',
  },
};

export function findIngredientOrigin(ingredientName: string): IngredientOrigin | null {
  const lower = ingredientName.toLowerCase().trim();

  // Direct match
  if (INGREDIENT_ORIGINS[lower]) return INGREDIENT_ORIGINS[lower];

  // Partial match
  for (const [key, value] of Object.entries(INGREDIENT_ORIGINS)) {
    const nameDeLower = value.nameDE.toLowerCase();
    if (lower.includes(key) || key.includes(lower) || lower.includes(nameDeLower) || nameDeLower.includes(lower)) {
      return value;
    }
  }

  return null;
}
