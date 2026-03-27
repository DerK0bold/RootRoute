import { OpenFoodFactsProduct } from './openFoodFacts';

export interface ShelfLifeResult {
  days: number;
  label: string;
  storageTip: string;
  icon: string;
  color: string;
}

interface CategoryConfig {
  days: number;
  tip: string;
  icon: string;
  keywords: string[];
}

const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    days: 2,
    tip: 'Sofort kühlen (0–2°C), rasch verbrauchen',
    icon: '🐟',
    keywords: ['fish', 'fisch', 'seafood', 'meeresfrüchte'],
  },
  {
    days: 3,
    tip: 'Bei max. 4°C kühlen, vor Ablauf verbrauchen',
    icon: '🥩',
    keywords: ['meat', 'fleisch', 'chicken', 'hähnchen', 'beef', 'rindfleisch', 'pork', 'schwein'],
  },
  {
    days: 5,
    tip: 'Im Gemüsefach des Kühlschranks lagern',
    icon: '🥦',
    keywords: ['vegetables', 'gemüse', 'salad', 'salat', 'fresh', 'frisch'],
  },
  {
    days: 7,
    tip: 'Bei Raumtemperatur oder kühl lagern',
    icon: '🍞',
    keywords: ['bread', 'brot', 'bakery', 'bäckerei', 'toast'],
  },
  {
    days: 14,
    tip: 'Kühl lagern unter 4°C, nach Öffnung schnell verbrauchen',
    icon: '🥛',
    keywords: ['dairy', 'milchprodukt', 'cream', 'rahm', 'quark'],
  },
  {
    days: 21,
    tip: 'Bei 2–6°C lagern, nach Öffnung innerhalb 3 Tagen verzehren',
    icon: '🫙',
    keywords: ['yogurt', 'joghurt', 'yoghurt'],
  },
  {
    days: 30,
    tip: 'Im Kühlschrank in Papier eingewickelt aufbewahren',
    icon: '🧀',
    keywords: ['cheese', 'käse', 'fromage'],
  },
  {
    days: 180,
    tip: 'Kühl und trocken lagern, nach Öffnung luftdicht verschliessen',
    icon: '🥣',
    keywords: ['cereal', 'müsli', 'granola', 'muesli', 'cornflakes', 'flakes'],
  },
  {
    days: 365,
    tip: 'Kühl und trocken lagern, vor direkter Sonneneinstrahlung schützen',
    icon: '🍫',
    keywords: ['chocolate', 'schokolade', 'confectionery', 'süssware', 'candy', 'bonbon', 'nougat'],
  },
  {
    days: 365,
    tip: 'Trocken und kühl lagern, Originalverpackung verschlossen halten',
    icon: '🍪',
    keywords: ['biscuit', 'cookie', 'keks', 'cracker', 'wafer', 'waffel'],
  },
  {
    days: 730,
    tip: 'Kühl und dunkel lagern, nach Öffnung kühlen',
    icon: '🥤',
    keywords: ['beverage', 'getränk', 'juice', 'saft', 'drink', 'water', 'wasser', 'soda', 'limonade'],
  },
  {
    days: 730,
    tip: 'Trocken und kühl lagern',
    icon: '🍝',
    keywords: ['pasta', 'nudel', 'rice', 'reis', 'grain', 'getreide'],
  },
];

function formatDays(days: number): string {
  if (days < 7) return `${days} Tage`;
  if (days < 14) return `1 Woche`;
  if (days < 30) return `${Math.round(days / 7)} Wochen`;
  if (days < 60) return `1 Monat`;
  if (days < 365) return `${Math.round(days / 30)} Monate`;
  if (days < 730) return `~1 Jahr`;
  return `~${Math.round(days / 365)} Jahre`;
}

function getDaysColor(days: number): string {
  if (days < 7) return '#EF4444';
  if (days < 30) return '#F59E0B';
  if (days < 180) return '#FECB02';
  return '#4ADE80';
}

export function predictShelfLife(product: OpenFoodFactsProduct): ShelfLifeResult {
  const categories = (product.categories || '').toLowerCase();
  const name = ((product.product_name_de || product.product_name) || '').toLowerCase();
  const combined = `${categories} ${name}`;

  for (const config of CATEGORY_CONFIGS) {
    if (config.keywords.some((kw) => combined.includes(kw))) {
      return {
        days: config.days,
        label: formatDays(config.days),
        storageTip: config.tip,
        icon: config.icon,
        color: getDaysColor(config.days),
      };
    }
  }

  // Nutriment-basierte Schätzung als Fallback
  const n = product.nutriments;
  if (n) {
    const sugar = n.sugars_100g || 0;
    const salt = n.salt_100g || 0;
    const fat = n.fat_100g || 0;

    if (sugar > 50 || salt > 2.5) {
      return { days: 365, label: '~1 Jahr', storageTip: 'Trocken und kühl lagern', icon: '🫙', color: '#4ADE80' };
    }
    if (fat > 25) {
      return { days: 180, label: '~6 Monate', storageTip: 'Kühl und trocken lagern', icon: '🫙', color: '#85BB2F' };
    }
  }

  return { days: 180, label: '~6 Monate', storageTip: 'Trocken und kühl lagern', icon: '📦', color: '#85BB2F' };
}
