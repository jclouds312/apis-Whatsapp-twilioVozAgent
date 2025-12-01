# Embed Widgets Documentation

Este documento muestra cómo incrustar widgets de SMS, Voice y WhatsApp en tus webs.

## Quick Start

### 1. SMS Widget
Incrustar un widget para enviar SMS:

```html
<html>
<head>
    <title>SMS Widget Demo</title>
</head>
<body>
    <!-- Contenedor para el widget -->
    <div id="nexus-sms-widget"></div>

    <!-- Script del widget (reemplaza TU_API_KEY) -->
    <script src="https://tu-app.replit.dev/embed/twilio-sms-widget.js?key=TU_API_KEY"></script>
</body>
</html>
```

### 2. Voice Message Widget
Incrustar un widget para enviar mensajes de voz:

```html
<html>
<head>
    <title>Voice Widget Demo</title>
</head>
<body>
    <!-- Contenedor para el widget -->
    <div id="nexus-voice-widget"></div>

    <!-- Script del widget (reemplaza TU_API_KEY) -->
    <script src="https://tu-app.replit.dev/embed/voice-widget.js?key=TU_API_KEY"></script>
</body>
</html>
```

### 3. WhatsApp Widget
Incrustar un widget para enviar mensajes de WhatsApp:

```html
<html>
<head>
    <title>WhatsApp Widget Demo</title>
</head>
<body>
    <!-- Contenedor para el widget -->
    <div id="nexus-whatsapp-widget"></div>

    <!-- Script del widget (reemplaza TU_API_KEY) -->
    <script src="https://tu-app.replit.dev/embed/whatsapp-widget.js?key=TU_API_KEY"></script>
</body>
</html>
```

## Cómo obtener tu API Key

1. Ve a la sección "API Key Generator" en tu panel
2. Conecta tu cuenta de Twilio (para SMS/Voice)
3. Genera una API key para cada servicio
4. Copia la clave y úsala en los widgets

## Uso Avanzado

### Múltiples Widgets en la misma página

```html
<!DOCTYPE html>
<html>
<head>
    <title>Multi-Widget Demo</title>
    <style>
        .widget-container {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
    </style>
</head>
<body>
    <h1>Contact Us</h1>
    
    <div class="widget-container">
        <div id="nexus-sms-widget"></div>
        <div id="nexus-voice-widget"></div>
        <div id="nexus-whatsapp-widget"></div>
    </div>

    <!-- Cargar todos los widgets -->
    <script src="https://tu-app.replit.dev/embed/twilio-sms-widget.js?key=YOUR_API_KEY"></script>
    <script src="https://tu-app.replit.dev/embed/voice-widget.js?key=YOUR_API_KEY"></script>
    <script src="https://tu-app.replit.dev/embed/whatsapp-widget.js?key=YOUR_API_KEY"></script>
</body>
</html>
```

### Personalización

Para personalizar los widgets, puedes editar el CSS en los archivos de origen:
- `/embed/twilio-sms-widget.js` - Widget de SMS
- `/embed/voice-widget.js` - Widget de Voice
- `/embed/whatsapp-widget.js` - Widget de WhatsApp

## Características de cada Widget

### SMS Widget
- Validación de número de teléfono
- Contador de caracteres
- Indicador de estado
- Manejo de errores

### Voice Widget
- Selector de voz (Alice, Woman, Man)
- Mensajes ilimitados
- Envío de voz con grabación automática
- Indicador de estado

### WhatsApp Widget
- Formato de WhatsApp
- Mensajes ilimitados
- Envío instantáneo
- Indicador de estado

## Seguridad

⚠️ **IMPORTANTE**: Los widgets cargan la API key en el cliente. Asegúrate de:
1. Usar HTTPS siempre
2. Crear API keys con permisos limitados
3. Cambiar las keys regularmente
4. Monitorear el uso en los logs

## Troubleshooting

### El widget no aparece
- Verifica que el contenedor (ej: `<div id="nexus-sms-widget"></div>`) exista
- Comprueba que la API key sea válida
- Revisa la consola del navegador para errores

### Los mensajes no se envían
- Verifica que la API key tenga permisos correctos
- Comprueba que el teléfono tenga el formato correcto (ej: +12345678901)
- Revisa los logs en tu panel de admin

## Ejemplos Completos

### Sitio web de contact form

```html
<!DOCTYPE html>
<html>
<head>
    <title>Contact Us</title>
    <style>
        body { font-family: Arial; margin: 40px; }
        .contact-section { margin-top: 30px; }
        h2 { color: #333; }
    </style>
</head>
<body>
    <h1>Contáctanos</h1>
    
    <div class="contact-section">
        <h2>📱 Envía un SMS</h2>
        <div id="nexus-sms-widget"></div>
    </div>
    
    <div class="contact-section">
        <h2>💬 Envía un Mensaje de Voz</h2>
        <div id="nexus-voice-widget"></div>
    </div>
    
    <div class="contact-section">
        <h2>📲 Envía por WhatsApp</h2>
        <div id="nexus-whatsapp-widget"></div>
    </div>

    <!-- Cargar widgets -->
    <script src="https://tu-app.replit.dev/embed/twilio-sms-widget.js?key=YOUR_API_KEY"></script>
    <script src="https://tu-app.replit.dev/embed/voice-widget.js?key=YOUR_API_KEY"></script>
    <script src="https://tu-app.replit.dev/embed/whatsapp-widget.js?key=YOUR_API_KEY"></script>
</body>
</html>
```

## API Endpoints

Los widgets usan estos endpoints internamente:

- `POST /api/v1/twilio/sms` - Enviar SMS
- `POST /api/v1/twilio/voice-message` - Enviar mensaje de voz
- `POST /api/v1/whatsapp/send` - Enviar WhatsApp

Todos requieren autenticación con Bearer token.

---

¿Preguntas? Revisa la documentación completa en `/api-docs`
