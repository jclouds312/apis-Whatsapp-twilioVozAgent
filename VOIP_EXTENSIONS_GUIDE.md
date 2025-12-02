
# VoIP Extensions & Recurring Calls Guide

## Descripción General

Sistema completo de gestión de extensiones VoIP y llamadas recurrentes integrado con OpenSIPS y Twilio.

## Características

- ✅ Creación y gestión de extensiones VoIP
- ✅ Credenciales SIP automáticas
- ✅ Llamadas desde extensiones
- ✅ Llamadas recurrentes programadas
- ✅ Desvío de llamadas
- ✅ Buzón de voz
- ✅ Autenticación por API Key

## API Endpoints

### 1. Crear Extensión

```bash
POST /api/v1/voip/extensions/create
Authorization: Bearer sk_voip_abc123...
Content-Type: application/json

{
  "userId": "user_123",
  "extensionNumber": "1001",
  "displayName": "Juan Pérez"
}
```

**Response:**
```json
{
  "success": true,
  "extension": {
    "id": "ext_1234567890_abc123",
    "extensionNumber": "1001",
    "displayName": "Juan Pérez",
    "sipCredentials": {
      "username": "user_1234567890",
      "password": "SecurePass123!",
      "domain": "sip.nexus-core.com",
      "sipUri": "sip:user_1234567890@sip.nexus-core.com"
    },
    "status": "active",
    "forwardingEnabled": false,
    "voicemailEnabled": true
  }
}
```

### 2. Obtener Extensiones de Usuario

```bash
GET /api/v1/voip/extensions/user/user_123
Authorization: Bearer sk_voip_abc123...
```

**Response:**
```json
{
  "success": true,
  "extensions": [
    {
      "id": "ext_1234567890_abc123",
      "extensionNumber": "1001",
      "displayName": "Juan Pérez",
      "status": "active",
      "forwardingEnabled": false,
      "voicemailEnabled": true,
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

### 3. Actualizar Extensión

```bash
PUT /api/v1/voip/extensions/ext_1234567890_abc123
Authorization: Bearer sk_voip_abc123...
Content-Type: application/json

{
  "displayName": "Juan Pérez Updated",
  "forwardingEnabled": true,
  "forwardingNumber": "+1234567890"
}
```

### 4. Realizar Llamada desde Extensión

```bash
POST /api/v1/voip/extensions/ext_1234567890_abc123/call
Authorization: Bearer sk_voip_abc123...
Content-Type: application/json

{
  "toNumber": "+0987654321",
  "useTwilio": true
}
```

**Response:**
```json
{
  "success": true,
  "call": {
    "sessionId": "session_1234567890_abc123",
    "status": "ringing",
    "fromNumber": "sip:user_1234567890@sip.nexus-core.com",
    "toNumber": "+0987654321",
    "twilioCallSid": "CAxxxxxxxxxxxx"
  }
}
```

### 5. Crear Llamada Recurrente

```bash
POST /api/v1/voip/extensions/ext_1234567890_abc123/recurring-calls
Authorization: Bearer sk_voip_abc123...
Content-Type: application/json

{
  "destinationNumber": "+1234567890",
  "schedule": {
    "frequency": "daily",
    "time": "09:00",
    "timezone": "America/New_York"
  }
}
```

**Response:**
```json
{
  "success": true,
  "recurringCall": {
    "id": "rc_1234567890_abc123",
    "extensionId": "ext_1234567890_abc123",
    "destinationNumber": "+1234567890",
    "schedule": {
      "frequency": "daily",
      "time": "09:00",
      "timezone": "America/New_York"
    },
    "enabled": true,
    "nextExecution": "2025-01-16T14:00:00Z"
  }
}
```

### 6. Llamadas Recurrentes Semanales

```bash
POST /api/v1/voip/extensions/ext_1234567890_abc123/recurring-calls
Content-Type: application/json

{
  "destinationNumber": "+1234567890",
  "schedule": {
    "frequency": "weekly",
    "time": "10:30",
    "dayOfWeek": 1,
    "timezone": "America/Los_Angeles"
  }
}
```

### 7. Llamadas Recurrentes Mensuales

```bash
POST /api/v1/voip/extensions/ext_1234567890_abc123/recurring-calls
Content-Type: application/json

{
  "destinationNumber": "+1234567890",
  "schedule": {
    "frequency": "monthly",
    "time": "15:00",
    "dayOfMonth": 15,
    "timezone": "Europe/Madrid"
  }
}
```

### 8. Obtener Llamadas Recurrentes de Extensión

```bash
GET /api/v1/voip/extensions/ext_1234567890_abc123/recurring-calls
Authorization: Bearer sk_voip_abc123...
```

### 9. Actualizar Llamada Recurrente

```bash
PUT /api/v1/voip/recurring-calls/rc_1234567890_abc123
Authorization: Bearer sk_voip_abc123...
Content-Type: application/json

{
  "enabled": false,
  "destinationNumber": "+9876543210"
}
```

### 10. Eliminar Llamada Recurrente

```bash
DELETE /api/v1/voip/recurring-calls/rc_1234567890_abc123
Authorization: Bearer sk_voip_abc123...
```

### 11. Eliminar Extensión

```bash
DELETE /api/v1/voip/extensions/ext_1234567890_abc123
Authorization: Bearer sk_voip_abc123...
```

### 12. Listar Todas las Extensiones (Admin)

```bash
GET /api/v1/voip/extensions
Authorization: Bearer sk_voip_abc123...
```

## Configuración de Softphone

Para usar una extensión creada, configura tu softphone SIP con:

- **Usuario:** `user_1234567890`
- **Contraseña:** `SecurePass123!`
- **Dominio:** `sip.nexus-core.com`
- **Servidor:** `0.0.0.0:5060`
- **Protocolo:** UDP/TCP

## Frecuencias de Llamadas Recurrentes

| Frecuencia | Descripción | Parámetros Requeridos |
|------------|-------------|-----------------------|
| `daily` | Todos los días a la misma hora | `time` |
| `weekly` | Cada semana en un día específico | `time`, `dayOfWeek` (0=Domingo, 1=Lunes, ..., 6=Sábado) |
| `monthly` | Cada mes en un día específico | `time`, `dayOfMonth` (1-31) |

## Características de Extensiones

### Desvío de Llamadas
```json
{
  "forwardingEnabled": true,
  "forwardingNumber": "+1234567890"
}
```

### Buzón de Voz
```json
{
  "voicemailEnabled": true
}
```

### Estados de Extensión
- `active`: Extensión activa y lista
- `inactive`: Extensión desactivada
- `busy`: Extensión en llamada

## Procesamiento Automático

El sistema procesa automáticamente las llamadas recurrentes cada minuto, verificando si hay llamadas programadas para ejecutar.

## Logs del Sistema

Todos los eventos se registran en la base de datos:

- `voip_extension_created`
- `voip_extension_updated`
- `voip_extension_deleted`
- `recurring_call_created`
- `recurring_call_updated`
- `recurring_call_deleted`
- `recurring_call_executed`

## Seguridad

- Todas las rutas requieren autenticación mediante API Key
- Las credenciales SIP se generan automáticamente
- Contraseñas seguras con 16 caracteres
- Registro completo de auditoría

## Ejemplo de Flujo Completo

```bash
# 1. Crear extensión
curl -X POST https://your-domain.com/api/v1/voip/extensions/create \
  -H "Authorization: Bearer sk_voip_abc123..." \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123",
    "extensionNumber": "1001",
    "displayName": "Sales Department"
  }'

# 2. Configurar llamada recurrente diaria
curl -X POST https://your-domain.com/api/v1/voip/extensions/ext_xxx/recurring-calls \
  -H "Authorization: Bearer sk_voip_abc123..." \
  -H "Content-Type: application/json" \
  -d '{
    "destinationNumber": "+1234567890",
    "schedule": {
      "frequency": "daily",
      "time": "09:00",
      "timezone": "America/New_York"
    }
  }'

# 3. Realizar llamada manual
curl -X POST https://your-domain.com/api/v1/voip/extensions/ext_xxx/call \
  -H "Authorization: Bearer sk_voip_abc123..." \
  -H "Content-Type: application/json" \
  -d '{
    "toNumber": "+0987654321",
    "useTwilio": true
  }'
```

## Soporte

Para problemas o preguntas:
- Email: support@nexus-core.com
- Docs: https://docs.nexus-core.com/voip-extensions
