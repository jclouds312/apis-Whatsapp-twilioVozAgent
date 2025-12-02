
# VoIP API Integration Guide

## Descripción General

Este sistema integra OpenSIPS como servidor SIP primario con Twilio para servicios de voz completos, todo protegido por autenticación de API Key.

## Arquitectura

```
┌─────────────────┐
│   Cliente Web   │
└────────┬────────┘
         │ API Key
         ▼
┌─────────────────┐      ┌──────────────┐      ┌─────────────┐
│  API Gateway    │─────▶│   OpenSIPS   │─────▶│   Twilio    │
│  (Validation)   │      │  SIP Server  │      │  Voice API  │
└─────────────────┘      └──────────────┘      └─────────────┘
         │
         ▼
┌─────────────────┐
│    Database     │
│  (Logs & Keys)  │
└─────────────────┘
```

## 1. Generar API Key de VoIP

### Endpoint
```bash
POST /api/v1/keys/voip/generate
```

### Request Body
```json
{
  "userId": "user_123",
  "name": "Production VoIP Key",
  "permissions": ["call", "sip", "recording"]
}
```

### Response
```json
{
  "success": true,
  "key": {
    "id": "key_1234567890",
    "key": "sk_voip_abc123...",
    "service": "voip",
    "metadata": {
      "opensips_enabled": true,
      "twilio_integration": true,
      "permissions": ["call", "sip", "recording"]
    }
  }
}
```

## 2. Usar API Key en Llamadas

### Iniciar Servidor OpenSIPS
```bash
curl -X POST https://your-domain.com/api/v1/opensips/start \
  -H "Authorization: Bearer sk_voip_abc123..." \
  -H "Content-Type: application/json"
```

### Generar Credenciales SIP
```bash
curl -X POST https://your-domain.com/api/v1/opensips/generate-credentials \
  -H "Authorization: Bearer sk_voip_abc123..." \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123"
  }'
```

**Response:**
```json
{
  "success": true,
  "credentials": {
    "username": "user_1234567890",
    "password": "secure_password",
    "domain": "sip.nexus-core.com",
    "sipUri": "sip:user_1234567890@sip.nexus-core.com",
    "proxyServer": "0.0.0.0:5060"
  }
}
```

### Iniciar Llamada (OpenSIPS + Twilio)
```bash
curl -X POST https://your-domain.com/api/v1/opensips/call/initiate \
  -H "Authorization: Bearer sk_voip_abc123..." \
  -H "Content-Type: application/json" \
  -d '{
    "fromNumber": "+1234567890",
    "toNumber": "+0987654321",
    "useTwilio": true
  }'
```

**Response:**
```json
{
  "success": true,
  "session": {
    "sessionId": "session_1234567890_abc123",
    "status": "ringing",
    "sipCredentials": {
      "username": "user_1234567890",
      "domain": "sip.nexus-core.com"
    },
    "twilioCallSid": "CAxxxxxxxxxxxx"
  }
}
```

### Verificar Estado de Llamada
```bash
curl https://your-domain.com/api/v1/opensips/call/session_1234567890_abc123 \
  -H "Authorization: Bearer sk_voip_abc123..."
```

### Finalizar Llamada
```bash
curl -X POST https://your-domain.com/api/v1/opensips/call/session_1234567890_abc123/end \
  -H "Authorization: Bearer sk_voip_abc123..."
```

## 3. Health Check
```bash
curl https://your-domain.com/api/v1/opensips/health \
  -H "Authorization: Bearer sk_voip_abc123..."
```

**Response:**
```json
{
  "opensipsStatus": "running",
  "activeCalls": 5,
  "serverUptime": true
}
```

## 4. Gestión de API Keys

### Listar Keys
```bash
GET /api/v1/keys?userId=user_123
```

### Desactivar Key
```bash
POST /api/v1/keys/:id/toggle
```

### Eliminar Key
```bash
DELETE /api/v1/keys/:id
```

## 5. Seguridad

- Todas las API keys se validan en cada request
- Las keys inactivas son rechazadas automáticamente
- Se registra cada uso de la API key
- Los permisos se verifican por servicio

## 6. Códigos de Error

| Código | Descripción |
|--------|-------------|
| 401    | API key missing o inválida |
| 403    | API key sin permisos para VoIP |
| 404    | Recurso no encontrado |
| 500    | Error del servidor |

## 7. Límites y Cuotas

- Rate limiting: 100 requests/minuto por API key
- Llamadas simultáneas: 50 por usuario
- Duración máxima de llamada: 4 horas

## 8. Soporte

Para problemas o preguntas:
- Email: support@nexus-core.com
- Docs: https://docs.nexus-core.com/voip
