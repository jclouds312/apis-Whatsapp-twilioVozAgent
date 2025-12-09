
# Configuración de Webhooks para Sincronización WhatsApp

## Cómo funciona la compatibilidad simultánea

Cuando vinculas un número de WhatsApp Business Cloud API:

✅ **Puedes usar el mismo número en:**
- Esta plataforma (vía API)
- La aplicación WhatsApp Business en tu teléfono
- WhatsApp Business Web

✅ **Sincronización automática:**
- Todos los mensajes se sincronizan entre plataformas
- Los webhooks capturan TODOS los eventos (enviados y recibidos)
- Las conversaciones se mantienen actualizadas en tiempo real

## Configurar Webhook en Meta Business

1. Ve a https://developers.facebook.com
2. Selecciona tu app de WhatsApp Business
3. Ve a WhatsApp → Configuration
4. En la sección "Webhook":
   - **Callback URL:** `https://tu-dominio.replit.app/api/whatsapp/webhook`
   - **Verify Token:** (el mismo que configuraste en .env como WEBHOOK_VERIFY_TOKEN)

5. Suscríbete a estos eventos:
   - ✅ messages (mensajes entrantes y salientes)
   - ✅ message_status (estado de entrega)
   - ✅ message_template_status_update (templates)

## Variables de Entorno Requeridas

```env
WEBHOOK_VERIFY_TOKEN=tu_token_secreto_aqui
```

## Probar el Webhook

```bash
# Verificar que el webhook está activo
curl -X GET "https://tu-dominio.replit.app/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=TU_TOKEN&hub.challenge=TEST"

# Debería devolver: TEST
```

## Flujo de Sincronización

```
Cliente envía mensaje
    ↓
WhatsApp Cloud API recibe
    ↓
Webhook notifica a tu servidor
    ↓
Mensaje se guarda en BD
    ↓
Aparece en tu plataforma Y en WhatsApp Business App
```

```
Agente responde desde WhatsApp Business App
    ↓
WhatsApp Cloud API detecta mensaje saliente
    ↓
Webhook notifica a tu servidor
    ↓
Mensaje se sincroniza en tu plataforma
```

## Limitaciones

- ⚠️ La app WhatsApp Business estándar (no API) tiene límite de 256 contactos
- ⚠️ Para más de 256 contactos, debes migrar completamente a Cloud API
- ✅ Con Cloud API puedes mantener ambas activas sin límite

## Ventajas de usar ambas plataformas

1. **Flexibilidad:** Responde desde donde estés
2. **Continuidad:** Si la plataforma está en mantenimiento, usas la app
3. **Múltiples agentes:** Algunos usan la plataforma, otros la app
4. **Backup:** Siempre tienes acceso a las conversaciones
