
# OpenSIPS-Twilio VoIP Integration

Esta guía explica cómo usar el servidor OpenSIPS integrado con Twilio para servicios de VoIP.

## Arquitectura

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Cliente   │ ───> │   OpenSIPS   │ ───> │   Twilio    │
│   SIP/Web   │      │  SIP Server  │      │  Voice API  │
└─────────────┘      └──────────────┘      └─────────────┘
```

## Configuración Inicial

### 1. Inicializar OpenSIPS

```bash
bash opensips-init.sh
```

### 2. Iniciar el Servidor

```bash
curl -X POST http://localhost:5000/api/v1/opensips/start \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### 3. Verificar Estado

```bash
curl http://localhost:5000/api/v1/opensips/status \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Uso de la API

### Generar Credenciales SIP

```bash
curl -X POST http://localhost:5000/api/v1/opensips/generate-credentials \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "credentials": {
    "username": "user_1234567890",
    "password": "secure_password",
    "domain": "sip.nexus-core.com",
    "sipUri": "sip:user_1234567890@sip.nexus-core.com",
    "proxyServer": "0.0.0.0:5060",
    "transportProtocol": "UDP"
  }
}
```

### Iniciar Llamada

```bash
curl -X POST http://localhost:5000/api/v1/opensips/call/initiate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "fromNumber": "+1234567890",
    "toNumber": "+0987654321",
    "useTwilio": true
  }'
```

**Respuesta:**
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

### Obtener Detalles de Llamada

```bash
curl http://localhost:5000/api/v1/opensips/call/SESSION_ID \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Finalizar Llamada

```bash
curl -X POST http://localhost:5000/api/v1/opensips/call/SESSION_ID/end \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Health Check

```bash
curl http://localhost:5000/api/v1/opensips/health \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Respuesta:**
```json
{
  "opensipsStatus": "running",
  "activeCalls": 5,
  "serverUptime": true
}
```

## Configuración de Cliente SIP

### Usando softphone (ej: Linphone, Zoiper)

1. **Servidor SIP:** `sip.nexus-core.com` o `0.0.0.0:5060`
2. **Usuario:** El username generado
3. **Contraseña:** El password generado
4. **Transporte:** UDP o TCP
5. **Puerto:** 5060

### Usando WebRTC

```javascript
// Ejemplo con JsSIP
const socket = new JsSIP.WebSocketInterface('ws://0.0.0.0:5060');

const configuration = {
  sockets: [socket],
  uri: 'sip:user_1234567890@sip.nexus-core.com',
  password: 'secure_password'
};

const ua = new JsSIP.UA(configuration);
ua.start();

// Hacer llamada
const session = ua.call('sip:+0987654321@sip.nexus-core.com', {
  mediaConstraints: { audio: true, video: false }
});
```

## Integración con Twilio

La integración permite:

1. **Registro SIP:** OpenSIPS maneja el registro de usuarios
2. **Enrutamiento:** OpenSIPS enruta llamadas
3. **PSTN Gateway:** Twilio conecta con red telefónica pública
4. **Grabación:** Twilio maneja grabaciones de llamadas
5. **Analytics:** Ambos sistemas reportan estadísticas

## Características

- ✅ Registro SIP estándar (RFC 3261)
- ✅ Soporte UDP y TCP
- ✅ Dialog management
- ✅ Estadísticas en tiempo real
- ✅ Integración opcional con Twilio
- ✅ Credenciales SIP auto-generadas
- ✅ Health monitoring
- ✅ Logging centralizado

## Troubleshooting

### El servidor no inicia

```bash
# Verificar logs
tail -f opensips/logs/opensips.log

# Verificar procesos
ps aux | grep opensips

# Reiniciar
curl -X POST http://localhost:5000/api/v1/opensips/stop
curl -X POST http://localhost:5000/api/v1/opensips/start
```

### No se pueden registrar usuarios

```bash
# Verificar que el puerto está abierto
netstat -tulpn | grep 5060

# Verificar configuración
cat opensips/opensips.cfg
```

### Llamadas no se conectan

1. Verificar credenciales SIP
2. Verificar que el cliente puede alcanzar el servidor
3. Revisar logs de OpenSIPS
4. Verificar integración con Twilio si está habilitada

## Próximos Pasos

- [ ] Agregar soporte TLS/SRTP
- [ ] Implementar load balancing
- [ ] Agregar recording nativo
- [ ] Dashboard de monitoreo
- [ ] Auto-scaling basado en carga
