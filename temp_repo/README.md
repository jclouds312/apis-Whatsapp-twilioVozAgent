# 🚀 NexusCore v4.0 - API Command Center

**Unified Communication Platform** for Twilio Voice, WhatsApp, Retell AI Voice Agents, and CRM Integration.

## 📱 Main Company Number
**+1 (862) 277-0131**

This number serves as:
- ✅ Main company phone line (Twilio Voice)
- ✅ WhatsApp Business official number
- ✅ Twilio VoIP extension for USA calls

---

## ✨ Features

### 🔗 Communication Services
- **WhatsApp Web.js Bot** - QR-code based WhatsApp automation
- **WhatsApp Business Cloud API** - Meta's official WhatsApp Business Platform
- **Twilio Voice** - Voice calling and IVR systems
- **Twilio VoIP** - Internet-based calling extensions
- **Retell AI** - AI-powered voice agents

### 💼 Business Tools
- **CRM Integration** - Salesforce, HubSpot, and custom CRM connectors
- **API Key Management** - Secure credential storage and rotation
- **Workflow Automation** - Trigger-based automation engine
- **System Logs** - Comprehensive activity tracking
- **Exposed APIs** - Create custom API endpoints

### 🎨 Frontend Dashboard
- Real-time service status monitoring
- Interactive API console
- QR code scanner for WhatsApp
- Call logs and message history
- Contact management
- Workflow designer

---

## 🛠️ Installation

### Prerequisites
- Node.js 20+
- PostgreSQL database (auto-configured on Replit)
- Twilio account
- Meta Business account (for WhatsApp)

### Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

3. **Push database schema**
   ```bash
   npm run db:push
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

---

## 📡 API Endpoints

### Health Check
- `GET /api/health` - System status and service health

### WhatsApp Bot (Web.js)
- `POST /api/whatsapp/connect` - Initialize WhatsApp bot
- `GET /api/whatsapp/qr` - Get QR code for authentication
- `GET /api/whatsapp/status` - Bot connection status
- `POST /api/whatsapp/send` - Send message
- `GET /api/whatsapp/chats` - Get all chats
- `POST /api/whatsapp/disconnect` - Disconnect bot

### WhatsApp Business Cloud API
- `POST /api/whatsapp-business/send-text` - Send text message
- `POST /api/whatsapp-business/send-template` - Send message template
- `POST /api/whatsapp-business/send-media` - Send media (image/video/document)
- `GET /api/whatsapp-business/status` - Configuration status
- `GET /api/whatsapp-business/webhook` - Webhook verification
- `POST /api/whatsapp-business/webhook` - Receive incoming messages

### WhatsApp OTP Service
- `POST /api/whatsapp-otp/send` - Send OTP code
- `POST /api/whatsapp-otp/verify` - Verify OTP code
- `POST /api/whatsapp-otp/resend` - Resend OTP
- `GET /api/whatsapp-otp/status/:sessionId` - Check session status
- `GET /api/whatsapp-otp/config-status` - Service configuration status

### Configuration
- `GET /api/config` - Get all service configurations

---

## 🔐 Environment Variables

### Required Configuration

#### Main Number
```env
MAIN_PHONE_NUMBER=+18622770131
TWILIO_MAIN_NUMBER=+18622770131
WHATSAPP_BUSINESS_NUMBER=+18622770131
```

#### Twilio
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+18622770131
```

#### WhatsApp Business
```env
WA_PHONE_NUMBER_ID=your_phone_number_id
WA_ACCESS_TOKEN=your_access_token
WA_WEBHOOK_VERIFY_TOKEN=your_verify_token
```

See `.env.example` for complete configuration options.

---

## 🏗️ Architecture

### Backend Stack
- **Express.js** - REST API server
- **PostgreSQL + Drizzle ORM** - Database layer
- **WhatsApp Web.js** - WhatsApp automation
- **Axios** - HTTP client for external APIs

### Frontend Stack
- **React 19** - UI framework
- **Wouter** - Lightweight routing
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS v4** - Styling
- **Radix UI** - Accessible components
- **Framer Motion** - Animations

### Database Schema
- **Users** - Authentication and authorization
- **Services** - Connected service credentials
- **API Keys** - Secure key management
- **WhatsApp Messages** - Message history
- **Twilio Calls** - Call logs
- **Workflows** - Automation rules
- **CRM Contacts** - Contact management
- **System Logs** - Activity tracking
- **Exposed APIs** - Custom endpoints

---

## 📝 Development Scripts

```bash
npm run dev          # Start development server (frontend + backend)
npm run dev:client   # Start frontend only
npm run build        # Build for production
npm run start        # Run production server
npm run db:push      # Push schema changes to database
npm run check        # TypeScript type checking
```

---

## 🔒 Security Best Practices

1. **Never commit `.env` file** - Contains sensitive credentials
2. **Rotate API keys regularly** - Use the API Key Manager
3. **Use webhook verification tokens** - Protect webhook endpoints
4. **Enable CORS properly** - Configure allowed origins
5. **Encrypt credentials in database** - Use ENCRYPTION_KEY
6. **Use HTTPS in production** - Required for webhooks

---

## 📞 Main Number Configuration

The number **+1 (862) 277-0131** is configured as:

1. **Twilio Main Line**: Receives incoming calls
2. **WhatsApp Business**: Official verified business number
3. **VoIP Extension**: SIP/WebRTC endpoint for browser calls

To configure:
1. Verify number ownership in Twilio console
2. Set up WhatsApp Business Profile with Meta
3. Configure TwiML apps for call routing
4. Set webhook URLs for message handling

---

## 🚀 Deployment

### Replit Deployment
1. Push code to Replit
2. Configure Secrets for environment variables
3. Run `npm run db:push` to initialize database
4. Click "Run" to start the application

### Production Checklist
- ✅ Set `NODE_ENV=production`
- ✅ Configure production database
- ✅ Set up webhook URLs
- ✅ Enable SSL/TLS
- ✅ Configure CORS origins
- ✅ Set up monitoring and logging

---

## 🆘 Troubleshooting

### WhatsApp Bot Not Connecting
- Check if Puppeteer can run in your environment
- Ensure QR code is scanned within timeout
- Verify `.wwebjs_auth` directory permissions

### Webhook Verification Failed
- Confirm `WA_WEBHOOK_VERIFY_TOKEN` matches Meta console
- Check webhook URL is publicly accessible
- Verify HTTPS is enabled

### Database Connection Error
- Ensure `DATABASE_URL` is set correctly
- Run `npm run db:push` to sync schema
- Check PostgreSQL is running

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check system logs at `/api/health`
4. Contact support team

---

**Version 4.0** - Enhanced with full PostgreSQL integration, extended API routes, and production-ready architecture.
