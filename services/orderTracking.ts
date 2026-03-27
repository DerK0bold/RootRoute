export interface Coordinate {
  latitude: number;
  longitude: number;
}

/**
 * An event in the tracking timeline.
 * Includes IoT data like temperature and humidity for modern supply chain monitoring.
 */
export interface TrackingEvent {
  id: string;
  status: 'completed' | 'active' | 'pending';
  title: string;
  description: string;
  location: string;
  timestamp: string;
  icon: string;
  coordinate?: Coordinate;
  temperature?: number;
  humidity?: number;
}

export interface Order {
  orderId: string;
  retailer: string;
  retailerLogo: string;
  productName: string;
  estimatedDelivery: string;
  currentStatus: string;
  events: TrackingEvent[];
  destination: Coordinate;
}

/**
 * Configuration for different retailers to make the simulation look realistic.
 * We map specific prefixes to retailers like Migros or Coop.
 */
type RetailerConfig = {
  name: string;
  logo: string;
  prefixes: string[];
  logisticsCenter: { name: string; coord: Coordinate };
  transitCoord: Coordinate;
};

const RETAILERS: RetailerConfig[] = [
  {
    name: 'Migros',
    logo: '🛒',
    prefixes: ['MIG', 'M-'],
    logisticsCenter: { name: 'Migros Verteilzentrum, Suhr AG', coord: { latitude: 47.3689, longitude: 8.0763 } },
    transitCoord: { latitude: 47.4200, longitude: 8.2100 },
  },
  {
    name: 'Coop',
    logo: '🏪',
    prefixes: ['COOP', 'C-'],
    logisticsCenter: { name: 'Coop Logistikzentrum, Pratteln BL', coord: { latitude: 47.5196, longitude: 7.6934 } },
    transitCoord: { latitude: 47.4950, longitude: 8.0500 },
  },
  {
    name: 'Post CH',
    logo: '📮',
    prefixes: ['POST', 'CH', '98', '99', '00'],
    logisticsCenter: { name: 'Sortierzentrum Post, Härkingen SO', coord: { latitude: 47.3133, longitude: 7.8289 } },
    transitCoord: { latitude: 47.3900, longitude: 8.0900 },
  },
  {
    name: 'DHL',
    logo: '📦',
    prefixes: ['DHL', '1Z', 'JD'],
    logisticsCenter: { name: 'DHL Hub, Zürich Flughafen', coord: { latitude: 47.4546, longitude: 8.5652 } },
    transitCoord: { latitude: 47.4400, longitude: 8.4200 },
  },
  {
    name: 'Amazon',
    logo: '🟠',
    prefixes: ['AMZ', 'TBA', '114'],
    logisticsCenter: { name: 'Amazon Logistikzentrum, Wintersingen BL', coord: { latitude: 47.5000, longitude: 7.8500 } },
    transitCoord: { latitude: 47.4800, longitude: 8.1200 },
  },
];

/**
 * Tries to find out which retailer handles the order based on the tracking ID.
 */
function detectRetailer(orderId: string): RetailerConfig {
  const upper = orderId.toUpperCase();
  for (const retailer of RETAILERS) {
    if (retailer.prefixes.some((p) => upper.startsWith(p))) {
      return retailer;
    }
  }
  // Default to Swiss Post if we don't recognize the ID format.
  return RETAILERS[2];
}

/**
 * Deterministic "random" generator. 
 * This ensures that the same Order-ID always results in the same tracking status,
 * making the app feel consistent for the user.
 */
function pseudoRandom(seed: string, index: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return Math.abs((hash + index * 2654435761) % 100) / 100;
}

/**
 * Generates a full order tracking object from just an ID.
 * This is the heart of the simulation!
 */
export function generateOrderFromId(orderId: string): Order {
  const retailer = detectRetailer(orderId);
  const now = new Date();

  // Progress determines if the package is in the warehouse, in transit, or delivered.
  const progress = pseudoRandom(orderId, 1);

  // Formatting helpers for the timeline
  const hoursAgo = (h: number) =>
    new Date(now.getTime() - h * 60 * 60 * 1000).toLocaleString('de-CH');
  const hoursFromNow = (h: number) =>
    new Date(now.getTime() + h * 60 * 60 * 1000).toLocaleDateString('de-CH', {
      weekday: 'long', day: 'numeric', month: 'long',
    });

  const destination: Coordinate = { latitude: 47.4761, longitude: 8.3072 }; // Target: Baden

  /**
   * Generates realistic IoT sensor values.
   * Temp and humidity are slightly randomized but stay within plausible ranges.
   */
  const getSimulatedIoT = (baseTemp: number, varTemp: number, hum: number) => ({
    temperature: Number((baseTemp + pseudoRandom(orderId, 10) * varTemp).toFixed(1)),
    humidity: Math.round(hum + pseudoRandom(orderId, 11) * 5),
  });

  let events: TrackingEvent[];
  let currentStatus: string;

  // We split the simulation into three stages: Warehouse -> Moving -> Delivered
  if (progress < 0.25) {
    currentStatus = 'Im Verteilzentrum';
    events = [
      { id: '1', status: 'completed', title: 'Bestellung eingegangen', description: `Deine Bestellung wurde bei ${retailer.name} erfasst.`, location: `${retailer.name} Online-Shop`, timestamp: hoursAgo(6), icon: '✅', coordinate: retailer.logisticsCenter.coord },
      { id: '2', status: 'active', title: 'Im Verteilzentrum', description: 'Dein Paket wird gerade bearbeitet und für den Versand vorbereitet.', location: retailer.logisticsCenter.name, timestamp: hoursAgo(1), icon: '📦', coordinate: retailer.logisticsCenter.coord, ...getSimulatedIoT(4.0, 1.2, 45) },
      { id: '3', status: 'pending', title: 'In Zustellung', description: 'Das Paket wird an den Zusteller übergeben.', location: 'Unterwegs zu dir', timestamp: hoursFromNow(4), icon: '🚚', coordinate: retailer.transitCoord },
      { id: '4', status: 'pending', title: 'Zugestellt', description: 'Paket erfolgreich zugestellt.', location: 'Deine Adresse', timestamp: hoursFromNow(8), icon: '🏠', coordinate: destination },
    ];
  } else if (progress < 0.7) {
    currentStatus = 'In Zustellung';
    events = [
      { id: '1', status: 'completed', title: 'Bestellung eingegangen', description: `Deine Bestellung wurde bei ${retailer.name} erfasst.`, location: `${retailer.name} Online-Shop`, timestamp: hoursAgo(8), icon: '✅', coordinate: retailer.logisticsCenter.coord },
      { id: '2', status: 'completed', title: 'Im Verteilzentrum bearbeitet', description: 'Paket wurde aus dem Lager geholt und versandfertig gemacht.', location: retailer.logisticsCenter.name, timestamp: hoursAgo(4), icon: '📦', coordinate: retailer.logisticsCenter.coord, ...getSimulatedIoT(3.8, 0.5, 42) },
      { id: '3', status: 'active', title: 'In Zustellung', description: 'Dein Paket ist unterwegs! Voraussichtliche Ankunft heute.', location: `Lieferwagen, Richtung ${destination.latitude > retailer.transitCoord.latitude ? 'Baden' : 'Zürich'}`, timestamp: hoursAgo(1), icon: '🚚', coordinate: retailer.transitCoord, ...getSimulatedIoT(4.2, 2.1, 48) },
      { id: '4', status: 'pending', title: 'Zugestellt', description: 'Paket erfolgreich zugestellt.', location: 'Deine Adresse', timestamp: hoursFromNow(2), icon: '🏠', coordinate: destination },
    ];
  } else {
    currentStatus = 'Zugestellt';
    events = [
      { id: '1', status: 'completed', title: 'Bestellung eingegangen', description: `Deine Bestellung wurde bei ${retailer.name} erfasst.`, location: `${retailer.name} Online-Shop`, timestamp: hoursAgo(24), icon: '✅', coordinate: retailer.logisticsCenter.coord },
      { id: '2', status: 'completed', title: 'Im Verteilzentrum bearbeitet', description: 'Paket versandfertig gemacht.', location: retailer.logisticsCenter.name, timestamp: hoursAgo(16), icon: '📦', coordinate: retailer.logisticsCenter.coord, ...getSimulatedIoT(3.5, 0.8, 40) },
      { id: '3', status: 'completed', title: 'In Zustellung', description: 'Paket war unterwegs zu dir.', location: retailer.logisticsCenter.name, timestamp: hoursAgo(8), icon: '🚚', coordinate: retailer.transitCoord, ...getSimulatedIoT(5.1, 1.5, 52) },
      { id: '4', status: 'active', title: 'Zugestellt ✓', description: 'Dein Paket wurde erfolgreich zugestellt.', location: 'Deine Adresse, Baden', timestamp: hoursAgo(1), icon: '🏠', coordinate: destination, ...getSimulatedIoT(18.5, 3.0, 35) },
    ];
  }

  return {
    orderId,
    retailer: retailer.name,
    retailerLogo: retailer.logo,
    productName: 'Online-Bestellung',
    estimatedDelivery: hoursFromNow(progress < 0.7 ? 4 : 0),
    currentStatus,
    events,
    destination,
  };
}

// Simple in-memory storage to keep track of generated orders during the session.
const savedOrders: Record<string, Order> = {};

export function saveOrder(order: Order): void {
  savedOrders[order.orderId] = order;
}

export function getOrder(orderId: string): Order | undefined {
  return savedOrders[orderId];
}

/**
 * Main helper to find an order or create it if it doesn't exist yet.
 */
export function getOrCreateOrder(orderId: string): Order {
  if (!savedOrders[orderId]) {
    savedOrders[orderId] = generateOrderFromId(orderId);
  }
  return savedOrders[orderId];
}

export function getAllOrders(): Order[] {
  return Object.values(savedOrders);
}

