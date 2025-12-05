
import axios from 'axios';

interface SitpRoute {
  id: string;
  code: string;
  name: string;
  description?: string;
}

interface SitpStop {
  id: string;
  code: string;
  name: string;
  latitude: number;
  longitude: number;
  routes?: string[];
}

interface SitpBus {
  id: string;
  plate: string;
  route: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  timestamp?: Date;
}

interface SitpSchedule {
  routeId: string;
  stopId: string;
  arrivalTime: string;
  departureTime: string;
  frequency?: number;
}

class SitpApiService {
  private baseUrl: string;
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheDuration: number;

  constructor() {
    // URL base actualizada - usando endpoints modernos de TransMilenio/SITP
    this.baseUrl = process.env.SITP_API_URL || 'https://www.transmilenio.gov.co/publicaciones/151410';
    this.cache = new Map();
    this.cacheDuration = 5 * 60 * 1000; // 5 minutos
  }

  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}_${JSON.stringify(params || {})}`;
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getRoutes(filters?: { code?: string; name?: string }): Promise<SitpRoute[]> {
    const cacheKey = this.getCacheKey('routes', filters);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Simulación de rutas - en producción conectar con API real
      const routes: SitpRoute[] = [
        { id: '1', code: 'A01', name: 'Portal Norte - Alcalá', description: 'Ruta alimentadora' },
        { id: '2', code: 'B12', name: 'Portal Sur - Usme', description: 'Ruta alimentadora' },
        { id: '3', code: 'C40', name: 'Portal 80 - Suba', description: 'Ruta alimentadora' },
        { id: '4', code: 'D21', name: 'Portal Américas - Kennedy', description: 'Ruta alimentadora' },
      ];

      let filtered = routes;
      if (filters?.code) {
        filtered = filtered.filter(r => r.code.includes(filters.code!));
      }
      if (filters?.name) {
        filtered = filtered.filter(r => 
          r.name.toLowerCase().includes(filters.name!.toLowerCase())
        );
      }

      this.setCache(cacheKey, filtered);
      return filtered;
    } catch (error) {
      console.error('Error fetching SITP routes:', error);
      throw new Error('Failed to fetch routes');
    }
  }

  async getStops(filters?: { routeId?: string; nearLat?: number; nearLon?: number; radius?: number }): Promise<SitpStop[]> {
    const cacheKey = this.getCacheKey('stops', filters);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Simulación de paradas - en producción conectar con API real
      const stops: SitpStop[] = [
        { id: '1', code: 'P001', name: 'Portal Norte', latitude: 4.7526, longitude: -74.0340, routes: ['A01', 'A02'] },
        { id: '2', code: 'P002', name: 'Calle 170', latitude: 4.7510, longitude: -74.0350, routes: ['A01'] },
        { id: '3', code: 'P003', name: 'Toberín', latitude: 4.7480, longitude: -74.0360, routes: ['A01', 'C40'] },
        { id: '4', code: 'P004', name: 'Alcalá', latitude: 4.7450, longitude: -74.0370, routes: ['A01'] },
      ];

      let filtered = stops;
      if (filters?.routeId) {
        filtered = filtered.filter(s => s.routes?.includes(filters.routeId!));
      }
      
      if (filters?.nearLat && filters?.nearLon && filters?.radius) {
        filtered = filtered.filter(s => {
          const distance = this.calculateDistance(
            filters.nearLat!,
            filters.nearLon!,
            s.latitude,
            s.longitude
          );
          return distance <= filters.radius!;
        });
      }

      this.setCache(cacheKey, filtered);
      return filtered;
    } catch (error) {
      console.error('Error fetching SITP stops:', error);
      throw new Error('Failed to fetch stops');
    }
  }

  async getBusLocations(routeId?: string): Promise<SitpBus[]> {
    const cacheKey = this.getCacheKey('buses', { routeId });
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Simulación de ubicaciones de buses en tiempo real
      const buses: SitpBus[] = [
        { id: '1', plate: 'ABC123', route: 'A01', latitude: 4.7500, longitude: -74.0345, speed: 35, heading: 180, timestamp: new Date() },
        { id: '2', plate: 'DEF456', route: 'A01', latitude: 4.7470, longitude: -74.0365, speed: 40, heading: 180, timestamp: new Date() },
        { id: '3', plate: 'GHI789', route: 'B12', latitude: 4.5500, longitude: -74.1200, speed: 30, heading: 90, timestamp: new Date() },
      ];

      let filtered = buses;
      if (routeId) {
        filtered = filtered.filter(b => b.route === routeId);
      }

      this.setCache(cacheKey, filtered);
      return filtered;
    } catch (error) {
      console.error('Error fetching bus locations:', error);
      throw new Error('Failed to fetch bus locations');
    }
  }

  async getSchedule(routeId: string, stopId: string): Promise<SitpSchedule[]> {
    const cacheKey = this.getCacheKey('schedule', { routeId, stopId });
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Simulación de horarios
      const schedules: SitpSchedule[] = [
        { routeId, stopId, arrivalTime: '06:00', departureTime: '06:02', frequency: 10 },
        { routeId, stopId, arrivalTime: '06:10', departureTime: '06:12', frequency: 10 },
        { routeId, stopId, arrivalTime: '06:20', departureTime: '06:22', frequency: 10 },
      ];

      this.setCache(cacheKey, schedules);
      return schedules;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      throw new Error('Failed to fetch schedule');
    }
  }

  async getNearbyStops(latitude: number, longitude: number, radius: number = 500): Promise<SitpStop[]> {
    return this.getStops({ nearLat: latitude, nearLon: longitude, radius });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const sitpApi = new SitpApiService();
export type { SitpRoute, SitpStop, SitpBus, SitpSchedule };
