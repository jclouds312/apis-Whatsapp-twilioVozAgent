
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bus, MapPin, Clock, Route, RefreshCw } from 'lucide-react';

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

export default function SitpTransit() {
  const [routes, setRoutes] = useState<SitpRoute[]>([]);
  const [stops, setStops] = useState<SitpStop[]>([]);
  const [buses, setBuses] = useState<SitpBus[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sitp/routes');
      const data = await response.json();
      setRoutes(data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStops = async (routeId?: string) => {
    setLoading(true);
    try {
      const url = routeId 
        ? `/api/sitp/stops?routeId=${routeId}`
        : '/api/sitp/stops';
      const response = await fetch(url);
      const data = await response.json();
      setStops(data);
    } catch (error) {
      console.error('Error fetching stops:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBuses = async (routeId?: string) => {
    setLoading(true);
    try {
      const url = routeId 
        ? `/api/sitp/buses?routeId=${routeId}`
        : '/api/sitp/buses';
      const response = await fetch(url);
      const data = await response.json();
      setBuses(data);
    } catch (error) {
      console.error('Error fetching buses:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    try {
      await fetch('/api/sitp/cache/clear', { method: 'POST' });
      await Promise.all([fetchRoutes(), fetchStops(), fetchBuses()]);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  useEffect(() => {
    fetchRoutes();
    fetchStops();
    fetchBuses();
  }, []);

  useEffect(() => {
    if (selectedRoute) {
      fetchStops(selectedRoute);
      fetchBuses(selectedRoute);
    }
  }, [selectedRoute]);

  const filteredRoutes = routes.filter(route =>
    route.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">SITP Transit System</h1>
          <p className="text-muted-foreground">Sistema Integrado de Transporte Público - Bogotá</p>
        </div>
        <Button onClick={clearCache} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      <Tabs defaultValue="routes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="routes">
            <Route className="mr-2 h-4 w-4" />
            Routes
          </TabsTrigger>
          <TabsTrigger value="stops">
            <MapPin className="mr-2 h-4 w-4" />
            Stops
          </TabsTrigger>
          <TabsTrigger value="buses">
            <Bus className="mr-2 h-4 w-4" />
            Live Buses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search Routes</CardTitle>
              <CardDescription>Find SITP routes by code or name</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Search by route code or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  <div className="col-span-full text-center py-8">Loading...</div>
                ) : (
                  filteredRoutes.map((route) => (
                    <Card 
                      key={route.id}
                      className={`cursor-pointer transition-colors ${
                        selectedRoute === route.code ? 'border-primary' : ''
                      }`}
                      onClick={() => setSelectedRoute(route.code)}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{route.code}</span>
                          <Badge variant="secondary">Route</Badge>
                        </CardTitle>
                        <CardDescription>{route.name}</CardDescription>
                      </CardHeader>
                      {route.description && (
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{route.description}</p>
                        </CardContent>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stops" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bus Stops</CardTitle>
              <CardDescription>
                {selectedRoute 
                  ? `Showing stops for route ${selectedRoute}`
                  : 'All SITP bus stops'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  <div className="col-span-full text-center py-8">Loading...</div>
                ) : (
                  stops.map((stop) => (
                    <Card key={stop.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="text-sm">{stop.code}</span>
                          <MapPin className="h-4 w-4" />
                        </CardTitle>
                        <CardDescription>{stop.name}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Lat:</span>
                            <span>{stop.latitude.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Lon:</span>
                            <span>{stop.longitude.toFixed(4)}</span>
                          </div>
                          {stop.routes && stop.routes.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {stop.routes.map((route) => (
                                <Badge key={route} variant="outline" className="text-xs">
                                  {route}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Bus Locations</CardTitle>
              <CardDescription>
                {selectedRoute 
                  ? `Tracking buses on route ${selectedRoute}`
                  : 'Real-time bus positions'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  <div className="col-span-full text-center py-8">Loading...</div>
                ) : buses.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No buses currently tracked
                  </div>
                ) : (
                  buses.map((bus) => (
                    <Card key={bus.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="text-sm">{bus.plate}</span>
                          <Bus className="h-4 w-4" />
                        </CardTitle>
                        <CardDescription>Route {bus.route}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Position:</span>
                            <span>{bus.latitude.toFixed(4)}, {bus.longitude.toFixed(4)}</span>
                          </div>
                          {bus.speed && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Speed:</span>
                              <span>{bus.speed} km/h</span>
                            </div>
                          )}
                          {bus.timestamp && (
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Updated:</span>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{new Date(bus.timestamp).toLocaleTimeString()}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
