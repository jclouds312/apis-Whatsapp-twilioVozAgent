
# SITP API Integration

Esta integración moderniza el antiguo API de SITP (Sistema Integrado de Transporte Público de Bogotá) de 2013 con código actualizado usando TypeScript, Express y React.

## Características

### Backend (Node.js/TypeScript)

- **Servicio Moderno**: `/server/services/sitp.ts`
  - Sistema de caché con expiración de 5 minutos
  - Manejo de errores robusto
  - Soporte para filtros y búsquedas
  - Cálculo de distancias geográficas

- **Endpoints API REST**: `/server/routes/sitp.ts`
  - `GET /api/sitp/routes` - Obtener rutas (filtrar por código/nombre)
  - `GET /api/sitp/routes/:id` - Obtener ruta específica
  - `GET /api/sitp/stops` - Obtener paradas
  - `GET /api/sitp/stops/nearby` - Paradas cercanas (lat, lon, radius)
  - `GET /api/sitp/stops/:id` - Parada específica
  - `GET /api/sitp/buses` - Ubicaciones de buses en tiempo real
  - `GET /api/sitp/schedule` - Horarios de rutas/paradas
  - `POST /api/sitp/cache/clear` - Limpiar caché

### Frontend (React/TypeScript)

- **Interfaz de Usuario**: `/client/src/pages/SitpTransit.tsx`
  - Vista de rutas con búsqueda
  - Mapa de paradas
  - Seguimiento de buses en tiempo real
  - Diseño responsive con Tailwind CSS
  - Componentes de shadcn/ui

## Uso

### Buscar Rutas
```typescript
const response = await fetch('/api/sitp/routes?code=A01');
const routes = await response.json();
```

### Encontrar Paradas Cercanas
```typescript
const response = await fetch('/api/sitp/stops/nearby?lat=4.7500&lon=-74.0345&radius=500');
const stops = await response.json();
```

### Rastrear Buses
```typescript
const response = await fetch('/api/sitp/buses?routeId=A01');
const buses = await response.json();
```

## Datos de Ejemplo

Actualmente usa datos simulados para demostración. Para conectar con APIs reales:

1. Configurar `SITP_API_URL` en variables de entorno
2. Actualizar métodos en `server/services/sitp.ts` para usar endpoints reales
3. Implementar autenticación si es necesaria

## Mejoras vs Versión Original (2013)

- ✅ TypeScript para type-safety
- ✅ Sistema de caché moderno
- ✅ API RESTful actualizada
- ✅ Interfaz de usuario moderna
- ✅ Soporte para búsquedas geoespaciales
- ✅ Manejo de errores mejorado
- ✅ Código mantenible y escalable

## Próximos Pasos

1. Conectar con API oficial de TransMilenio/SITP
2. Agregar mapa interactivo con Leaflet o Google Maps
3. Implementar notificaciones en tiempo real con WebSockets
4. Agregar favoritos y historial de búsquedas
5. Soporte offline con Service Workers
