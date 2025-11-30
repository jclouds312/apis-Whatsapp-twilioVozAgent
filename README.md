# APIs Manager: Unified API Management and Orchestration Platform

APIs Manager is a comprehensive administration panel designed to centralize, manage, and automate interactions between various services and APIs. The platform provides a unified console to manage API keys, expose internal APIs, and connect workflows between services, with a primary focus on integrating and orchestrating WhatsApp Business and Twilio Voice APIs. Built with Next.js, Firebase, and Tailwind CSS.

## Project Concept

In today's digital ecosystem, businesses rely on a multitude of SaaS services and internal APIs to operate. Managing these integrations can become complex and difficult to scale. APIs Manager was born as a solution to this problem, offering a unified "command center" that allows technical and business teams to:

-   **Centralize Security**: Manage all API credentials for external services like WhatsApp Business and Twilio in a single secure location powered by Firebase.
-   **Expose and Orchestrate APIs**: Turn internal functionalities into secure, documented APIs ready for consumption by other CRMs, websites, or mobile apps. These exposed APIs can then orchestrate calls to the integrated services.
-   **Automate Business Processes**: Create logical workflows that connect different systems (e.g., a new CRM lead triggers a WhatsApp message).
-   **Gain Visibility and Control**: Monitor system activity through a real-time logging system and manage user access permissions.

## Main Features

-   **Dashboard**: Offers a bird's-eye view of the most important metrics, such as API traffic, active workflows, and recent system errors, all powered by live data from Firestore.
-   **WhatsApp & Twilio Dashboards**: Dedicated sections for managing conversations and monitoring activity for WhatsApp Business and Twilio Voice.
-   **Twilio Verify**: A dedicated interface to send and check one-time verification codes via WhatsApp.
-   **API Key Management**: A centralized and secure repository to store, view, manage, and revoke API keys for integrated services.
-   **Exposed API Console**: A tool to document, secure, and expose internal APIs, controlling their status (published, draft, obsolete) and visibility.
-   **User and Role Management**: Administer team members and assign roles to control access to different platform functionalities.
-   **System Logs**: A detailed, real-time record of all system events to facilitate error debugging and security auditing, stored in Firestore.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore, Authentication)
-   **UI**: [React](https://react.dev/), [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
-   **Generative AI**: [Google AI & Genkit](https://firebase.google.com/docs/genkit) for intelligent suggestions.

## Deploying on Vercel

This project is configured for a quick and easy deployment on [Vercel](https://vercel.com/).

1.  **Set up Firebase**: Before deploying, ensure you have a Firebase project with Firestore and Authentication enabled. You will need to populate the Firebase configuration in `src/firebase/config.ts` and your environment variables.
2.  **Configure Environment Variables**: In your Vercel project settings, you must add the following environment variables:
    
    **For WhatsApp Integration:**
    - `WHATSAPP_VERIFY_TOKEN`: A secret token of your choice for webhook verification.
    - `WHATSAPP_ACCESS_TOKEN`: The permanent access token for the WhatsApp Business API from your Meta App.
    - `WHATSAPP_PHONE_NUMBER_ID`: The Phone Number ID from your Meta App.
    
    **For Twilio Integration:**
    - `TWILIO_ACCOUNT_SID`: Your Twilio Account SID.
    - `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token.
    - `TWILIO_VERIFY_SERVICE_SID`: The Service SID from your Twilio Verify service.

3.  **Create a Git Repository**: Push the project code to a GitHub, GitLab, or Bitbucket repository.
4.  **Import the Project in Vercel**: From your Vercel dashboard, import the repository you just created. Vercel will automatically detect that it's a Next.js project.
5.  **Deploy**: Click "Deploy". Vercel will handle the rest and provide you with a URL for your live application. After deployment, use the provided URL to set up your webhook in the Meta Developer portal.
# WhatsApp Business Integration Platform v1.0.0

## 🎉 Nuevas Características

### WhatsApp Integration v2.0 - Meta SDK Completo
- ✅ **Envío de mensajes de texto** via WhatsApp Business API
- ✅ **Envío de imágenes, videos, documentos** con caption opcional
- ✅ **Plantillas de mensajes** (templates) con soporte multiidioma
- ✅ **Estados de mensajes** (enviado, entregado, leído)
- ✅ **Chat en tiempo real** con Firebase Firestore
- ✅ **Gestión de conversaciones** con panel de contacto
- ✅ **Estadísticas en vivo** de mensajes
- ✅ **Perfil de negocio** integrado
- ✅ **Webhooks** para recepción de mensajes
- ✅ **Logs de API** detallados

### 🆕 Funciones Avanzadas Meta SDK
- ✅ **Envío de ubicaciones GPS** con coordenadas y nombre
- ✅ **Envío de contactos** (tarjetas vCard)
- ✅ **Mensajes interactivos** con botones y listas
- ✅ **Commerce/Catálogos** - Gestión de productos
- ✅ **Envío de productos** desde catálogo
- ✅ **Analytics conversacionales** con métricas detalladas
- ✅ **Calidad y límites** - Monitoreo de rating y throughput
- ✅ **Gestión de templates** - Crear y eliminar templates
- ✅ **Media upload/download** - Gestión completa de archivos
- ✅ **Actualización de perfil** de negocio
- ✅ **Gestión de webhooks** - Suscripciones automáticas
- ✅ **CRM distribuible** - Sistema completo para publicar como servicio

## 🚀 Mejoras de Interfaz

### Chat Mejorado
- Indicadores de estado de mensaje (reloj, check, doble check)
- Timestamps en cada mensaje
- Soporte para envío de imágenes
- Mejores animaciones y transiciones
- Avatar personalizado por usuario

### Widget de Envío Rápido
- 3 modos de envío: Templates, Texto, Imágenes
- Selector de idioma para templates
- Generador de comandos cURL
- Validación mejorada de inputs
- Estados de carga y error

### Panel de Estadísticas
- Tasa de éxito de mensajes
- Estadísticas de últimas 24 horas
- Gráficos en tiempo real
- Logs de actividad reciente

## 📋 Requisitos de Configuración

### Variables de Entorno Necesarias

```env
# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=882779844920111
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
WHATSAPP_VERIFY_TOKEN=your_verify_token

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

## 🔧 Configuración del Webhook

1. **URL del Webhook**: `https://your-repl-url.replit.app/api/whatsapp`
2. **Token de Verificación**: Usar `WHATSAPP_VERIFY_TOKEN`
3. **Campos a Suscribir**:
   - messages
   - message_deliveries
   - message_reads
   - messaging_postbacks

## 📊 Funcionalidades de API

### Endpoints Disponibles

- `POST /api/whatsapp` - Webhook para recibir mensajes
- `GET /api/whatsapp` - Verificación del webhook

### Actions del Servidor

- `sendWhatsAppMessage()` - Enviar mensaje de texto
- `sendWhatsAppImage()` - Enviar imagen con caption
- `sendWhatsAppTemplate()` - Enviar template
- `sendWhatsAppInteractiveButtons()` - Enviar botones interactivos
- `getBusinessProfile()` - Obtener perfil de negocio
- `getPhoneNumberInfo()` - Info del número de teléfono
- `getMessageTemplates()` - Listar templates disponibles
- `getMessageStats()` - Estadísticas de mensajes
- `markMessageAsRead()` - Marcar mensaje como leído

## 🎨 Tecnologías Utilizadas

- **Next.js 15.3.3** - Framework React con Turbopack
- **Firebase** - Base de datos en tiempo real
- **WhatsApp Business API v22.0** - Mensajería
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes UI
- **Framer Motion** - Animaciones
- **Recharts** - Gráficos

## 🔐 Seguridad

- Autenticación con Firebase Auth
- Validación de webhooks con tokens
- Firestore Security Rules configuradas
- Rate limiting en API calls
- Logs detallados de todas las operaciones

## 📱 Uso

1. Configura las variables de entorno
2. Ejecuta `npm install`
3. Inicia el servidor: `npm run dev`
4. Accede a `/dashboard/whatsapp`
5. Configura el webhook en Meta Developer Console
6. ¡Comienza a enviar mensajes!

## 🐛 Troubleshooting

### El webhook no recibe mensajes
- Verifica que el `WHATSAPP_VERIFY_TOKEN` sea correcto
- Asegúrate de que la URL del webhook esté accesible públicamente
- Revisa los logs en `/dashboard/logs`

### Los mensajes no se envían
- Verifica el `WHATSAPP_ACCESS_TOKEN`
- Confirma que el número de teléfono esté verificado
- Revisa el formato del número del destinatario (sin + ni espacios)

### Errores de conexión con Firebase
- Verifica todas las variables `NEXT_PUBLIC_FIREBASE_*`
- Confirma que las reglas de Firestore permitan lectura/escritura
- Revisa la consola de Firebase para errores

## 📝 Notas de la Versión 1.0.0

- Primera versión estable de la integración WhatsApp
- Interfaz completamente funcional
- Soporte completo para mensajes multimedia
- Sistema de estadísticas en tiempo real
- Documentación completa
- Mejoras de rendimiento y UX

## 🚀 Próximas Características

- [ ] Soporte para audio y video
- [ ] Mensajes programados
- [ ] Respuestas automáticas con IA
- [ ] Exportación de conversaciones
- [ ] Multi-agente support
- [ ] Analytics avanzados

---

**Version**: 1.0.0  
**Last Updated**: 2025  
**License**: MIT
