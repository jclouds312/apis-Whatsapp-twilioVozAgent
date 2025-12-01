# Nexus Core - Enterprise API Platform

## Overview
Unified enterprise API management and orchestration platform that centralizes control of WhatsApp Business, Twilio Voice, and CRM systems. Provides full API functionality with secure key management, widget embedding, and admin capabilities.

## Current Status: ✅ PRODUCTION READY

### Latest Features (Current Session)
- ✅ Complete Twilio Voice + SMS API integration (unified endpoint)
- ✅ CRM + Twilio integration with code examples
- ✅ Embed widgets for SMS, Voice, and WhatsApp (for website embedding)
- ✅ API Key Generator with persistent database storage
- ✅ 12 production-ready V1 API endpoints
- ✅ Complete API documentation and code snippets
- ✅ WhatsApp bulk messaging capability
- ✅ Call recording and voice message features

## Architecture

### Database (PostgreSQL)
- 10+ tables with comprehensive data model
- Services table for credential storage
- API Keys table for secure token management
- WhatsApp Messages, Twilio Calls, CRM Contacts tables
- System Logs for full audit trail

### Backend Services
- **Express.js** API server
- **Drizzle ORM** for database operations
- **Twilio SDK** integration via NoCodeAPI
- **Meta WhatsApp SDK** integration
- **Axios** for HTTP requests
- Comprehensive error handling and logging

### Frontend
- **React** with TypeScript
- **Wouter** for routing
- **Tailwind CSS** for styling
- **Shadcn UI** components
- **React Query** for data fetching
- Responsive design (mobile + desktop)

### Key APIs Implemented

#### Twilio V1 APIs
- `POST /api/v1/twilio/sms` - Send SMS messages
- `POST /api/v1/twilio/call` - Initiate phone calls
- `POST /api/v1/twilio/voice-message` - Send voice messages
- `GET /api/v1/twilio/call/:callSid` - Get call status
- `GET /api/v1/twilio/recordings/:callSid` - Get call recordings
- `POST /api/v1/twilio/extension` - Create phone extensions

#### WhatsApp V1 APIs
- `POST /api/v1/whatsapp/send` - Send individual messages
- `POST /api/v1/whatsapp/send-bulk` - Send bulk messages

#### CRM V1 APIs
- `POST /api/v1/crm/contacts` - Create contact
- `GET /api/v1/crm/contacts` - List contacts
- `PUT /api/v1/crm/contacts/:id` - Update contact
- `DELETE /api/v1/crm/contacts/:id` - Delete contact

#### Embed Widgets
- `GET /embed/twilio-sms-widget.js` - SMS embed widget
- `GET /embed/voice-widget.js` - Voice message embed widget
- `GET /embed/whatsapp-widget.js` - WhatsApp embed widget

## Pages & Routes

### Admin Interface
- `/` - Overview dashboard
- `/api-key-generator` - Generate and manage API keys
- `/twilio-voice` - Unified Twilio SMS + Voice interface
- `/crm-integration` - CRM contact management with Twilio integration
- `/embed-widgets` - Widget embedding documentation
- `/api-docs` - Complete API documentation
- `/logs` - System audit logs
- `/settings` - Configuration

### Services
- `/whatsapp` - WhatsApp manager
- `/twilio` - Twilio voice controls
- `/verify` - Phone verification
- `/crm` - CRM management
- `/retell` - AI agent integration

## Credentials & Secrets

### Stored Secrets
- `META_WHATSAPP_TOKEN` - Meta WhatsApp API token
- `WHATSAPP_PHONE_ID` - WhatsApp business phone ID
- `META_APP_ID` - Meta app ID
- `META_APP_SECRET` - Meta app secret

### NoCodeAPI Integration
- Twilio SMS and Voice via: `https://v1.nocodeapi.com/john474n/twilio/jbngLoZWwbtslepf`

### Admin Phone
- **+18622770131** - Configured for Twilio and WhatsApp

## Development Highlights

### Code Organization
- `/server/routes-v1-api.ts` - All V1 API endpoints
- `/server/routes-api-keygen.ts` - API key generation routes
- `/server/routes-embed-widgets.ts` - Widget embed routes
- `/server/services/TwilioService.ts` - Twilio integration
- `/server/services/WhatsAppService.ts` - WhatsApp integration
- `/server/services/NocodeApiService.ts` - NoCodeAPI wrapper
- `/client/src/pages/` - All UI pages

### UI Components
- API Key Generator - With card-based display
- Twilio Voice & SMS - Unified interface
- CRM Integration - Contact management + Twilio actions
- Embed Widgets - Installation documentation
- API Documentation - Code examples with copy-to-clipboard

## User Preferences & Design

### Visual Style
- Dark "Digital Future" aesthetic
- Gradient colors: Blue → Purple → Pink
- Green accents for WhatsApp
- Red accents for Twilio
- Professional card-based layouts
- Responsive design

### Interaction Patterns
- Toast notifications for feedback
- Loading states with spinners
- Copy-to-clipboard for code
- Tab-based organization
- Modal forms and inputs
- Status badges and indicators

## How to Use

### 1. Generate API Keys
1. Go to `/api-key-generator`
2. Connect Twilio credentials
3. Generate keys for WhatsApp, Twilio, CRM
4. Keys are stored in database automatically

### 2. Send Messages
- **SMS**: Use `/api/v1/twilio/sms` with phone number and message
- **Voice**: Use `/api/v1/twilio/voice-message` with text-to-speech
- **WhatsApp**: Use `/api/v1/whatsapp/send` for individual or bulk

### 3. Manage Contacts
1. Go to `/crm-integration`
2. Create new contacts with details
3. Send SMS/Voice/WhatsApp to contacts
4. Use provided code examples for integration

### 4. Embed Widgets in Websites
1. Go to `/embed-widgets`
2. Copy the widget code (SMS, Voice, or WhatsApp)
3. Replace API key and domain
4. Paste into your HTML

## Important Notes

### Security
- API keys are encrypted in database
- All endpoints require Bearer token authentication
- NoCodeAPI endpoint is secure
- Environment variables for sensitive data
- Audit logs track all actions

### Limitations
- Twilio integration via NoCodeAPI (not direct SDK)
- WhatsApp requires Meta app configuration
- SMS/Voice require Twilio account with credits

### Future Enhancements
- Direct Twilio SDK integration (currently via NoCodeAPI)
- Advanced filtering and segmentation for CRM
- Webhook event system
- Analytics and reporting
- SMS templates and scheduling

## Dependencies

### Core
- express, typescript, drizzle-orm, zod
- @neondatabase/serverless, postgres
- react, wouter, tailwindcss
- lucide-react, sonner (toast)
- twilio, axios

### UI
- @radix-ui/* (all 30+ components)
- @tailwindcss/vite
- tailwindcss-animate
- framer-motion

## Configuration

```typescript
// Admin phone
const ADMIN_PHONE = "+18622770131";

// API version
const apiVersion = "v18.0";

// Base URLs
const NOCODE_API_BASE = "https://v1.nocodeapi.com/john474n/twilio/jbngLoZWwbtslepf";
const WHATSAPP_GRAPH_API = "https://graph.instagram.com/v18.0";
```

## Testing

All endpoints can be tested via:
- `/api-docs` - View documentation and examples
- Browser DevTools - Test API calls
- Embed widgets in test HTML files
- CRM integration panel for contact operations

---

**Last Updated**: December 1, 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
