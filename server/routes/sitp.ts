
import { Router } from 'express';
import { sitpApi } from '../services/sitp';

const router = Router();

// Obtener todas las rutas o filtrar por código/nombre
router.get('/routes', async (req, res) => {
  try {
    const { code, name } = req.query;
    const routes = await sitpApi.getRoutes({
      code: code as string,
      name: name as string,
    });
    res.json(routes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

// Obtener una ruta específica
router.get('/routes/:id', async (req, res) => {
  try {
    const routes = await sitpApi.getRoutes();
    const route = routes.find(r => r.id === req.params.id);
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.json(route);
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({ error: 'Failed to fetch route' });
  }
});

// Obtener paradas
router.get('/stops', async (req, res) => {
  try {
    const { routeId, lat, lon, radius } = req.query;
    const stops = await sitpApi.getStops({
      routeId: routeId as string,
      nearLat: lat ? parseFloat(lat as string) : undefined,
      nearLon: lon ? parseFloat(lon as string) : undefined,
      radius: radius ? parseFloat(radius as string) : undefined,
    });
    res.json(stops);
  } catch (error) {
    console.error('Error fetching stops:', error);
    res.status(500).json({ error: 'Failed to fetch stops' });
  }
});

// Obtener paradas cercanas
router.get('/stops/nearby', async (req, res) => {
  try {
    const { lat, lon, radius } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const stops = await sitpApi.getNearbyStops(
      parseFloat(lat as string),
      parseFloat(lon as string),
      radius ? parseFloat(radius as string) : 500
    );
    res.json(stops);
  } catch (error) {
    console.error('Error fetching nearby stops:', error);
    res.status(500).json({ error: 'Failed to fetch nearby stops' });
  }
});

// Obtener una parada específica
router.get('/stops/:id', async (req, res) => {
  try {
    const stops = await sitpApi.getStops();
    const stop = stops.find(s => s.id === req.params.id);
    if (!stop) {
      return res.status(404).json({ error: 'Stop not found' });
    }
    res.json(stop);
  } catch (error) {
    console.error('Error fetching stop:', error);
    res.status(500).json({ error: 'Failed to fetch stop' });
  }
});

// Obtener ubicaciones de buses en tiempo real
router.get('/buses', async (req, res) => {
  try {
    const { routeId } = req.query;
    const buses = await sitpApi.getBusLocations(routeId as string);
    res.json(buses);
  } catch (error) {
    console.error('Error fetching bus locations:', error);
    res.status(500).json({ error: 'Failed to fetch bus locations' });
  }
});

// Obtener horarios
router.get('/schedule', async (req, res) => {
  try {
    const { routeId, stopId } = req.query;
    
    if (!routeId || !stopId) {
      return res.status(400).json({ error: 'Route ID and Stop ID are required' });
    }

    const schedule = await sitpApi.getSchedule(routeId as string, stopId as string);
    res.json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

// Limpiar caché
router.post('/cache/clear', async (req, res) => {
  try {
    sitpApi.clearCache();
    res.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

export default router;
