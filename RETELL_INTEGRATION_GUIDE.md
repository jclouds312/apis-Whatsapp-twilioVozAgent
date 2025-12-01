# Guía de Integración Retell AI Voice en CRM

## 🎯 Descripción General

La plataforma Nexus Digital Future ahora integra **Retell AI** para automatizar llamadas de voz en tu CRM. Todos los servicios de voice están disponibles en el panel web del CRM.

## 🚀 Cómo Usar

### 1. Obtener Retell API Key

1. Ve a [Retell AI Dashboard](https://retell.ai/dashboard)
2. Crea una cuenta o inicia sesión
3. Genera una nueva API Key
4. Copia la clave (formato: `sk_retell_...`)

### 2. Conectar Retell en CRM

1. Abre tu plataforma en `/crm`
2. Selecciona la pestaña **"Retell Voice"** (🎧)
3. Pega tu API Key en el campo "API Key de Retell"
4. Presiona **"Conectar Retell"**

### 3. Crear Agentes de Voz

Una vez conectado:
- Ve a la sección "Crear Nuevo Agente Retell"
- Define el nombre del agente
- Personaliza el prompt (instrucciones para el agente)
- Presiona **"Crear Agente"**

**Ejemplo de Prompt:**
```
Eres un agente de ventas profesional de Digital Future. 
Tu objetivo es:
1. Saludar al cliente amablemente en español
2. Presentar nuestros servicios de API Management
3. Responder preguntas sobre planes y precios
4. Agendar una reunión si el cliente está interesado
5. Ser siempre profesional y cortés
```

### 4. Iniciar Llamadas

1. Selecciona un agente de la lista "Agentes Disponibles"
2. Ingresa el número de teléfono del cliente (ej: +34912345678)
3. Presiona **"Iniciar Llamada"**
4. Retell hará la llamada automáticamente al número

### 5. Ver Conversaciones

1. Presiona el botón "Reproducir" en "Conversaciones"
2. Se cargarán todas las llamadas realizadas
3. Haz clic en cualquier conversación para ver:
   - Transcripción completa (agent/cliente)
   - Duración de la llamada
   - Sentimiento del cliente (positivo/negativo)
   - Enlace para escuchar la grabación
   - Opción para descargar el audio

## 📊 Servicios Disponibles

### ✅ API Endpoints Implementados

```
POST   /api/v1/retell/agent/create
       Crear nuevo agente de IA

POST   /api/v1/retell/call/initiate
       Iniciar llamada a un número

GET    /api/v1/retell/conversations
       Listar todas las conversaciones

GET    /api/v1/retell/conversation/:id
       Obtener detalles de una conversación

POST   /api/v1/retell/webhook
       Webhook para actualizaciones de llamadas
```

### 🔧 Configuración de Agentes

Cada agente soporta:
- **Nombre personalizado** - Para identificar en CRM
- **Prompt dinámico** - Instrucciones únicas por agente
- **Idioma** - Español, English, Portuguese
- **Voces** - josh-english, maria-spanish, etc.
- **Grabación automática** - Todos los audios se guardan
- **Transcripción AI** - Análisis automático de conversación

## 🔐 Seguridad

- ✅ API Key encriptada en tránsito
- ✅ Todas las llamadas requieren autenticación Bearer token
- ✅ Conversaciones almacenadas en base de datos
- ✅ Grabaciones en S3 con encriptación AES-256
- ✅ Retención de 90 días configurable

## 🧪 Testing en Desarrollo

### Test 1: Crear Agente
```bash
curl -X POST http://localhost:5000/api/v1/retell/agent/create \
  -H "Authorization: Bearer sk_enterprise_demo_key_12345" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Agent",
    "language": "es-ES",
    "prompt": "Eres un asistente de prueba"
  }'
```

### Test 2: Iniciar Llamada
```bash
curl -X POST http://localhost:5000/api/v1/retell/call/initiate \
  -H "Authorization: Bearer sk_enterprise_demo_key_12345" \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "agent_123",
    "phoneNumber": "+34912345678"
  }'
```

### Test 3: Obtener Conversaciones
```bash
curl -X GET http://localhost:5000/api/v1/retell/conversations \
  -H "Authorization: Bearer sk_enterprise_demo_key_12345"
```

## 🎨 Panel Web Features

### Dashboard del CRM
- 📊 **Stats en vivo**: Contactos, llamadas, conversiones
- 👥 **Lead Management**: Captura y tracking de contactos
- 🤖 **Retell Voice**: Integración completa de voice AI
- 📈 **Workflows**: Automatizaciones personalizadas
- 📋 **Logs**: Historial completo de auditoría

### Panel Retell (Nueva Pestaña)
1. **Conectar API** - Integración segura con Retell
2. **Crear Agentes** - Agents sin código, totalmente configurables
3. **Iniciar Llamadas** - Automatizar llamadas a contactos
4. **Ver Conversaciones** - Historial, transcripciones, análisis

## 🚀 Deployment

### Vercel
```bash
npm run build
# Hacer push a Vercel
```

### AWS Lambda
```bash
serverless deploy
# Se despliega con S3 automáticamente
```

### Configurar Variables de Entorno

```bash
RETELL_API_KEY=sk_retell_xxx
AWS_S3_BUCKET=nexus-digital-future-prod
DATABASE_URL=postgresql://...
```

## 📱 Casos de Uso

### 1. Follow-up Automático
- Crea un agente "Follow-up Bot"
- Configura workflow para llamar después de 24h
- Agente confirma interés en propuesta

### 2. Encuestas de Satisfacción
- Agente pregunta sobre experiencia
- Registra respuestas automáticamente
- Genera reporte de satisfacción

### 3. Confirmación de Citas
- Agente confirma cita pendiente
- Reschedule si cliente no puede
- Notifica a tu sistema

### 4. Outbound Calls para Ventas
- Agente presenta producto
- Califica lead automáticamente
- Agenda demostración si interesado

## 🆘 Troubleshooting

| Problema | Solución |
|----------|----------|
| API Key inválida | Verifica en Retell Dashboard que no haya expirado |
| Llamada no se inicia | Revisa número de teléfono (incluye código país) |
| No se graban conversaciones | Verifica S3 bucket está creado y configurado |
| Transcripción vacía | Algunos idiomas requieren configuración especial |

## 📞 Contacto Soporte

- **Admin Phone**: +18622770131
- **Email**: admin@nexus.local
- **Docs**: https://retell.ai/docs

---

**Versión**: 1.0.0  
**Última actualización**: 2025-01-20  
**Estado**: ✅ Production Ready
