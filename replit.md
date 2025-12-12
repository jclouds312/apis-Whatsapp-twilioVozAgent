# NexusCore Enterprise - VoIP & Messaging Platform

## Overview
Plataforma empresarial para gestión de comunicaciones VoIP, WhatsApp y agentes de IA. Integra Twilio para llamadas y SMS, WhatsApp Business API, y sistema CRM.

## Stack Tecnológico
- **Frontend**: React 19, Tailwind CSS, Wouter (routing), TanStack Query
- **Backend**: Express.js, TypeScript
- **Base de Datos**: PostgreSQL con Drizzle ORM
- **APIs Externas**: Twilio (via NoCodeAPI), WhatsApp Business

## Configuración de Credenciales

### Variables de Entorno Configuradas
- `DATABASE_URL`: Conexión a PostgreSQL (automática)
- `NOCODEAPI_TWILIO_ENDPOINT`: https://v1.nocodeapi.com/john474n/twilio/jbngLoZWwbtslepf
- `TWILIO_PHONE_NUMBER`: +18622770131

**NOTA**: Las credenciales de Twilio se manejan a través de NoCodeAPI en lugar de la integración directa de Replit.

## API Endpoints

### Twilio
- `POST /api/twilio/send-sms` - Enviar SMS
- `POST /api/twilio/make-call` - Realizar llamada
- `GET /api/twilio/calls` - Historial de llamadas
- `GET /api/config/twilio` - Estado de configuración

### WhatsApp
- `POST /api/whatsapp/send-message` - Enviar mensaje
- `GET /api/whatsapp/messages` - Historial de mensajes

### CRM
- `GET /api/crm/contacts` - Listar contactos
- `POST /api/crm/contacts` - Crear contacto
- `PATCH /api/crm/contacts/:id` - Actualizar contacto
- `DELETE /api/crm/contacts/:id` - Eliminar contacto

### VoIP Extensions
- `GET /api/voip/extensions` - Listar extensiones
- `POST /api/voip/extensions` - Crear extensión
- `PATCH /api/voip/extensions/:id` - Actualizar extensión
- `DELETE /api/voip/extensions/:id` - Eliminar extensión

### API Keys
- `GET /api/api-keys` - Listar todas las API keys
- `POST /api/api-keys` - Crear API key
- `DELETE /api/api-keys/:id` - Eliminar API key

### Webhooks
- `POST /api/webhooks/twilio/voice` - Webhook de voz Twilio
- `POST /api/webhooks/twilio/status` - Webhook de estado de llamadas

## Estructura de Base de Datos
- `users` - Usuarios del sistema
- `services` - Servicios conectados (Twilio, WhatsApp)
- `api_keys` - API keys para integraciones
- `whatsapp_messages` - Historial de mensajes WhatsApp
- `twilio_calls` - Historial de llamadas
- `workflows` - Flujos de trabajo automatizados
- `crm_contacts` - Contactos del CRM
- `system_logs` - Logs del sistema
- `voip_extensions` - Extensiones VoIP
- `exposed_apis` - APIs expuestas

## Comandos
- `npm run dev` - Desarrollo (frontend + backend)
- `npm run build` - Build para producción
- `npm run db:push` - Sincronizar esquema de DB

## Deploy en Vercel
El proyecto incluye `vercel.json` configurado para deployment.
