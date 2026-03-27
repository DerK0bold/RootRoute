import { OpenFoodFactsProduct } from '../services/openFoodFacts';

/**
 * Local Product Database.
 * This serves two purposes for the hackathon:
 * 1. It acts as a fast cache for the most common demo products.
 * 2. It enriches the standard Open Food Facts data with detailed 
 *    ingredient origins and percentages that aren't usually available in the public API.
 */
export const PRODUCT_DATABASE: Record<string, OpenFoodFactsProduct> = {

  // --- Toblerone ---
  '7612100040789': {
    code: '7612100040789',
    product_name: 'Toblerone Milk Chocolate',
    product_name_de: 'Toblerone Milchschokolade',
    brands: 'Toblerone, Mondelez',
    categories: 'Chocolates, Confectionery, Swiss chocolate, Milk chocolate',
    image_front_url: 'https://images.openfoodfacts.org/images/products/761/210/004/0789/front_de.400.jpg',
    image_url: 'https://images.openfoodfacts.org/images/products/761/210/004/0789/front_de.400.jpg',
    ingredients_text_de:
      'Zucker, Vollmilchpulver, Kakaobutter, Kakaomasse, Butterreinfett, Honig (1,7%), Mandelmehl (1,4%), Eiklar, Emulgator (Sojalecithin), Vanilleextrakt',
    
    // We manually defined the origins for these ingredients to showcase the supply chain transparency.
    ingredients: [
      { id: 'en:sugar',            text: 'Zucker',           percent: 42, origins: 'Brasilien, Indien' },
      { id: 'en:whole-milk-powder', text: 'Vollmilchpulver', percent: 18, origins: 'Schweiz, Deutschland' },
      { id: 'en:cocoa-butter',     text: 'Kakaobutter',      percent: 14, origins: 'Elfenbeinküste, Ghana' },
      { id: 'en:cocoa-mass',       text: 'Kakaomasse',       percent: 13, origins: 'Elfenbeinküste, Ecuador' },
      { id: 'en:butter',           text: 'Butterreinfett',   percent: 5,  origins: 'Schweiz' },
      { id: 'en:honey',            text: 'Honig',            percent: 1.7, origins: 'Schweiz' },
      { id: 'en:almond-flour',     text: 'Mandelmehl',       percent: 1.4, origins: 'USA, Spanien' },
      { id: 'en:egg-white',        text: 'Eiklar',           percent: 1,  origins: 'Schweiz, Deutschland' },
      { id: 'en:soy-lecithin',     text: 'Sojalecithin',     percent: 0.5, origins: 'USA, Brasilien' },
      { id: 'en:vanilla-extract',  text: 'Vanilleextrakt',   percent: 0.1, origins: 'Madagaskar' },
    ],
    origins: 'Schweiz',
    origins_tags: ['en:switzerland'],
    manufacturing_places: 'Bern, Schweiz',
    countries_tags: ['en:switzerland', 'en:germany', 'en:austria'],
    nutriments: {
      'energy-kcal_100g': 535,
      'energy-kj_100g': 2238,
      energy_100g: 2238,
      fat_100g: 30.0,
      sugars_100g: 54.0,
      proteins_100g: 7.7,
      salt_100g: 0.10,
      fiber_100g: 1.1,
    },
    nutriscore_grade: 'e',
    ecoscore_grade: 'd',
    labels_tags: ['en:swiss-made', 'en:no-artificial-colours'],
    packaging: 'Karton, Alufolie',
  },

  // --- Ovomaltine ---
  '7610200050505': {
    code: '7610200050505',
    product_name: 'Ovomaltine Crunchy Cream',
    product_name_de: 'Ovomaltine Crunchy Cream',
    brands: 'Ovomaltine, Wander AG',
    categories: 'Spreads, Chocolate spreads, Malt spreads',
    image_front_url: 'https://images.openfoodfacts.org/images/products/761/020/005/0505/front_de.400.jpg',
    image_url: 'https://images.openfoodfacts.org/images/products/761/020/005/0505/front_de.400.jpg',
    ingredients_text_de:
      'Zucker, Palmöl, Malzextrakt (aus Gerste) (15%), Magermilchpulver, entöltes Kakaopulver, Molkenpulver, pflanzliche Öle (Raps, Sonnenblume), Vollmilchpulver, Kakaomasse, Emulgator (Sojalecithin), Salz, Vitamine (B1, B2, B6, C, D, Niacin, Folsäure), Mineralstoffe (Calcium, Magnesium, Eisen)',
    ingredients: [
      { id: 'en:sugar',            text: 'Zucker',           percent: 35, origins: 'Deutschland, Frankreich' },
      { id: 'en:palm-oil',         text: 'Palmöl',           percent: 18, origins: 'Indonesien, Malaysia' },
      { id: 'en:barley-malt',      text: 'Malzextrakt (Gerste)', percent: 15, origins: 'Deutschland, Schweiz' },
      { id: 'en:skimmed-milk-powder', text: 'Magermilchpulver', percent: 8, origins: 'Schweiz, Deutschland' },
      { id: 'en:cocoa-powder',     text: 'Kakaopulver',      percent: 7,  origins: 'Elfenbeinküste, Ghana' },
      { id: 'en:whey-powder',      text: 'Molkenpulver',     percent: 6,  origins: 'Deutschland, Niederlande' },
      { id: 'en:rapeseed-oil',     text: 'Rapsöl',           percent: 4,  origins: 'Deutschland, Schweiz' },
      { id: 'en:sunflower-oil',    text: 'Sonnenblumenöl',   percent: 3,  origins: 'Ukraine, Russland' },
      { id: 'en:whole-milk-powder', text: 'Vollmilchpulver', percent: 2,  origins: 'Schweiz' },
      { id: 'en:cocoa-mass',       text: 'Kakaomasse',       percent: 1,  origins: 'Elfenbeinküste' },
      { id: 'en:soy-lecithin',     text: 'Sojalecithin',     percent: 0.5, origins: 'USA, Brasilien' },
      { id: 'en:salt',             text: 'Salz',             percent: 0.3, origins: 'Schweiz' },
    ],
    origins: 'Schweiz',
    origins_tags: ['en:switzerland'],
    manufacturing_places: 'Neuenegg, Schweiz',
    countries_tags: ['en:switzerland', 'en:germany'],
    nutriments: {
      'energy-kcal_100g': 498,
      'energy-kj_100g': 2083,
      energy_100g: 2083,
      fat_100g: 24.0,
      sugars_100g: 47.0,
      proteins_100g: 8.5,
      salt_100g: 0.35,
      fiber_100g: 2.1,
    },
    nutriscore_grade: 'd',
    ecoscore_grade: 'c',
    labels_tags: ['en:swiss-made'],
    packaging: 'Glas',
  },

  // --- Granola (Nestlé Fitness) ---
  '7613037897478': {
    code: '7613037897478',
    product_name: 'Nestlé Fitness Granola',
    product_name_de: 'Nestlé Fitness Granola',
    brands: 'Nestlé, Fitness',
    categories: 'Cereals, Granola, Breakfast cereals, Muesli',
    image_front_url: 'https://images.openfoodfacts.org/images/products/761/303/789/7478/front_de.400.jpg',
    image_url: 'https://images.openfoodfacts.org/images/products/761/303/789/7478/front_de.400.jpg',
    ingredients_text_de:
      'Haferflocken (54%), Weizenvollkornmehl, Zucker, Palmöl, Honig (3%), Weizenmehl, Salz, Emulgator (Sojalecithin), Vitamine (E, Niacin, B5, B6, B2, B1, Folsäure, B12), Mineralstoffe (Eisen, Zink)',
    ingredients: [
      { id: 'en:oats',             text: 'Haferflocken',     percent: 54, origins: 'Deutschland, Russland' },
      { id: 'en:whole-wheat-flour', text: 'Weizenvollkornmehl', percent: 12, origins: 'Deutschland, Frankreich' },
      { id: 'en:sugar',            text: 'Zucker',           percent: 10, origins: 'Deutschland, Frankreich' },
      { id: 'en:palm-oil',         text: 'Palmöl',           percent: 8,  origins: 'Indonesien, Malaysia' },
      { id: 'en:honey',            text: 'Honig',            percent: 3,  origins: 'Schweiz, Deutschland' },
      { id: 'en:wheat-flour',      text: 'Weizenmehl',       percent: 6,  origins: 'Schweiz, Deutschland' },
      { id: 'en:salt',             text: 'Salz',             percent: 0.5, origins: 'Schweiz' },
      { id: 'en:soy-lecithin',     text: 'Sojalecithin',     percent: 0.3, origins: 'USA, Brasilien' },
    ],
    origins: 'Schweiz, Deutschland',
    origins_tags: ['en:switzerland', 'en:germany'],
    manufacturing_places: 'Konolfingen, Schweiz',
    countries_tags: ['en:switzerland', 'en:germany', 'en:austria'],
    nutriments: {
      'energy-kcal_100g': 388,
      'energy-kj_100g': 1623,
      energy_100g: 1623,
      fat_100g: 6.8,
      sugars_100g: 21.0,
      proteins_100g: 9.0,
      salt_100g: 0.55,
      fiber_100g: 6.5,
    },
    nutriscore_grade: 'b',
    ecoscore_grade: 'c',
    labels_tags: ['en:swiss-made', 'en:vegetarian'],
    packaging: 'Karton, Plastikbeutel',
  },

  // --- Lindt Excellence 70% ---
  '3046920022981': {
    code: '3046920022981',
    product_name: 'Lindt Excellence 70% Cacao',
    product_name_de: 'Lindt Excellence 70% Kakao',
    brands: 'Lindt',
    categories: 'Dark chocolate, Chocolates, Confectionery',
    image_front_url: 'https://images.openfoodfacts.org/images/products/304/692/002/2981/front_de.400.jpg',
    image_url: 'https://images.openfoodfacts.org/images/products/304/692/002/2981/front_de.400.jpg',
    ingredients_text_de:
      'Kakaomasse (70%), Zucker, Kakaobutter, Bourbon-Vanille-Schoten',
    ingredients: [
      { id: 'en:cocoa-mass',   text: 'Kakaomasse',          percent: 70, origins: 'Elfenbeinküste, Ecuador, Ghana' },
      { id: 'en:sugar',        text: 'Zucker',              percent: 25, origins: 'Deutschland, Frankreich' },
      { id: 'en:cocoa-butter', text: 'Kakaobutter',         percent: 4,  origins: 'Elfenbeinküste, Ghana' },
      { id: 'en:vanilla',      text: 'Bourbon-Vanilleschoten', percent: 0.5, origins: 'Madagaskar' },
    ],
    origins: 'Schweiz',
    origins_tags: ['en:switzerland', 'en:ivory-coast', 'en:ecuador'],
    manufacturing_places: 'Kilchberg, Schweiz',
    countries_tags: ['en:switzerland', 'en:germany', 'en:france'],
    nutriments: {
      'energy-kcal_100g': 560,
      'energy-kj_100g': 2343,
      energy_100g: 2343,
      fat_100g: 42.0,
      sugars_100g: 25.0,
      proteins_100g: 8.0,
      salt_100g: 0.01,
      fiber_100g: 10.0,
    },
    nutriscore_grade: 'd',
    ecoscore_grade: 'c',
    labels_tags: ['en:swiss-made', 'en:no-artificial-additives', 'en:vegan'],
    packaging: 'Karton, Alufolie',
  },

  // --- Nutella ---
  '3017620422003': {
    code: '3017620422003',
    product_name: 'Nutella',
    product_name_de: 'Nutella',
    brands: 'Nutella, Ferrero',
    categories: 'Spreads, Hazelnut spreads, Chocolate spreads, Confectionery',
    image_front_url: 'https://images.openfoodfacts.org/images/products/301/762/042/2003/front_de.400.jpg',
    image_url: 'https://images.openfoodfacts.org/images/products/301/762/042/2003/front_de.400.jpg',
    ingredients_text_de:
      'Zucker, Palmöl, Haselnüsse (13%), Magermilchpulver (8,7%), fettarmes Kakaopulver (7,4%), Molkenpulver, Emulgator (Sojalecithin), Vanillin',
    ingredients: [
      { id: 'en:sugar',            text: 'Zucker',           percent: 57, origins: 'Deutschland, Frankreich, Brasilien' },
      { id: 'en:palm-oil',         text: 'Palmöl',           percent: 17, origins: 'Indonesien, Malaysia' },
      { id: 'en:hazelnuts',        text: 'Haselnüsse',       percent: 13, origins: 'Türkei, Italien' },
      { id: 'en:skimmed-milk-powder', text: 'Magermilchpulver', percent: 8.7, origins: 'Deutschland, Niederlande' },
      { id: 'en:cocoa-powder',     text: 'Kakaopulver',      percent: 7.4, origins: 'Elfenbeinküste, Ghana' },
      { id: 'en:whey-powder',      text: 'Molkenpulver',     percent: 2,  origins: 'Deutschland, Niederlande' },
      { id: 'en:soy-lecithin',     text: 'Sojalecithin',     percent: 0.5, origins: 'USA, Brasilien' },
      { id: 'en:vanillin',         text: 'Vanillin',         percent: 0.1, origins: 'China, Deutschland (synthetisch)' },
    ],
    origins: 'Deutschland, Italien',
    origins_tags: ['en:germany', 'en:italy', 'en:turkey', 'en:indonesia'],
    manufacturing_places: 'Allgäu, Deutschland; Villers-Écalles, Frankreich',
    countries_tags: ['en:germany', 'en:france', 'en:italy', 'en:switzerland', 'en:austria'],
    nutriments: {
      'energy-kcal_100g': 539,
      'energy-kj_100g': 2255,
      energy_100g: 2255,
      fat_100g: 30.9,
      sugars_100g: 56.3,
      proteins_100g: 6.3,
      salt_100g: 0.11,
      fiber_100g: 3.4,
    },
    nutriscore_grade: 'e',
    ecoscore_grade: 'd',
    labels_tags: ['en:no-artificial-colours', 'en:no-artificial-flavours'],
    packaging: 'Glas',
  },

  // --- Ricola ---
  '7610818001037': {
    code: '7610818001037',
    product_name: 'Ricola Original Swiss Herb Candy',
    product_name_de: 'Ricola Original Kräuter-Zucker',
    brands: 'Ricola',
    categories: 'Confectionery, Candy, Sweets, Herb candy',
    image_front_url: 'https://images.openfoodfacts.org/images/products/761/081/800/1037/front_de.400.jpg',
    image_url: 'https://images.openfoodfacts.org/images/products/761/081/800/1037/front_de.400.jpg',
    ingredients_text_de:
      'Zucker, Glukosesirup, Schweizer Bergkräuter (2,6%): Malve, Pfefferminze, Thymian, Salbei, Spitzwegerich, Schlüsselblume, Bibernelle, natürliche Aromen, Antioxidationsmittel (Ascorbinsäure)',
    ingredients: [
      { id: 'en:sugar',          text: 'Zucker',           percent: 68, origins: 'Deutschland, Schweiz' },
      { id: 'en:glucose-syrup',  text: 'Glukosesirup',     percent: 27, origins: 'Deutschland, Frankreich' },
      { id: 'en:herbs',          text: 'Schweizer Bergkräuter', percent: 2.6, origins: 'Schweiz (Alpen)' },
      { id: 'en:peppermint',     text: 'Pfefferminze',     percent: 0.5, origins: 'Schweiz, Deutschland' },
      { id: 'en:thyme',          text: 'Thymian',          percent: 0.4, origins: 'Schweiz, Frankreich' },
      { id: 'en:sage',           text: 'Salbei',           percent: 0.3, origins: 'Schweiz, Italien' },
      { id: 'en:ascorbic-acid',  text: 'Ascorbinsäure',    percent: 0.1, origins: 'China, Deutschland' },
    ],
    origins: 'Schweiz',
    origins_tags: ['en:switzerland'],
    manufacturing_places: 'Laufen, Schweiz',
    countries_tags: ['en:switzerland', 'en:germany', 'en:austria'],
    nutriments: {
      'energy-kcal_100g': 390,
      'energy-kj_100g': 1630,
      energy_100g: 1630,
      fat_100g: 0.1,
      sugars_100g: 95.0,
      proteins_100g: 0.0,
      salt_100g: 0.01,
      fiber_100g: 0.0,
    },
    nutriscore_grade: 'e',
    ecoscore_grade: 'b',
    labels_tags: ['en:swiss-made', 'en:vegan', 'en:gluten-free'],
    packaging: 'Papier, Karton',
  },
};

/**
 * Main helper to find a product in our local "enriched" database.
 */
export function getProductFromDatabase(barcode: string): OpenFoodFactsProduct | null {
  return PRODUCT_DATABASE[barcode] ?? null;
}

