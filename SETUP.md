
# NexusCore - Guía de Configuración

## 🚀 Instalación

1. **Instalar dependencias**
```bash
npm install
```

2. **Configurar variables de entorno**
Copia `.env.example` a `.env` y completa las credenciales:
```bash
cp .env.example .env
```

## 📱 WhatsApp Integration

### WhatsApp Web.js Bot
- **No requiere configuración adicional**
- Usa autenticación local con QR code
- Los datos de sesión se guardan en `.wwebjs_auth/`

### WhatsApp Business Cloud API
Configura en `.env`:
```
WA_PHONE_NUMBER_ID=tu_phone_number_id
WA_ACCESS_TOKEN=tu_access_token
WA_WEBHOOK_VERIFY_TOKEN=tu_verify_token
```

## 📞 Twilio Configuration

Configura en `.env`:
```
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_PHONE_NUMBER=tu_numero_twilio
```

## 🌐 Facebook SDK

Configura en `.env`:
```
FACEBOOK_APP_ID=tu_app_id
FACEBOOK_APP_SECRET=tu_app_secret
FACEBOOK_ACCESS_TOKEN=tu_access_token
```

## 🔧 Desarrollo

```bash
# Iniciar en modo desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 📡 Endpoints Disponibles

### Health Check
- `GET /api/health` - Estado del sistema

### WhatsApp Bot
- `POST /api/whatsapp/connect` - Iniciar bot
- `GET /api/whatsapp/qr` - Obtener código QR
- `GET /api/whatsapp/status` - Estado del bot
- `POST /api/whatsapp/send` - Enviar mensaje
- `POST /api/whatsapp/disconnect` - Desconectar bot

### WhatsApp Business API
- `POST /api/whatsapp-business/send-text` - Enviar mensaje de texto
- `POST /api/whatsapp-business/send-template` - Enviar plantilla
- `POST /api/whatsapp-business/send-media` - Enviar multimedia
- `GET /api/whatsapp-business/status` - Estado de configuración

## 🔐 Seguridad

- Las credenciales se manejan mediante variables de entorno
- CORS habilitado para el frontend
- Webhooks con tokens de verificación

## 📊 Monitoreo

El dashboard en `/` muestra:
- Estado de todas las integraciones
- Métricas en tiempo real
- Salud del sistema
