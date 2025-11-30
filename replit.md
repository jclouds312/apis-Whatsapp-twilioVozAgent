# APIs Manager - Project Documentation

## Overview
APIs Manager is a comprehensive Next.js application designed to centralize, manage, and automate interactions between various services and APIs. It serves as a unified command center for managing API keys, exposing internal APIs, and orchestrating workflows between services, with primary focus on WhatsApp Business and Twilio Voice integrations.

**Current State:** Successfully imported and configured for Replit environment
**Last Updated:** November 30, 2025

## Tech Stack
- **Framework:** Next.js 15.3.3 (App Router with Turbopack)
- **Language:** TypeScript
- **Backend & Database:** Firebase (Firestore, Authentication)
- **UI Libraries:** React 18, shadcn/ui, Tailwind CSS, Radix UI
- **Generative AI:** Google AI with Genkit for intelligent suggestions
- **External Services:** Twilio, WhatsApp Business API

## Project Structure
```
src/
├── ai/                    # AI flows using Genkit
│   ├── flows/            # AI workflow implementations
│   ├── dev.ts            # Genkit dev server
│   └── genkit.ts         # Genkit configuration
├── app/                   # Next.js App Router pages
│   ├── api/              # API routes (WhatsApp webhook, etc.)
│   ├── dashboard/        # Dashboard pages (CRM, WhatsApp, Twilio, etc.)
│   ├── globals.css       # Global styles
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── dashboard/       # Dashboard-specific components
│   └── charts/          # Chart components
├── firebase/            # Firebase client setup
├── hooks/               # Custom React hooks
└── lib/                 # Utilities and schemas
```

## Replit Configuration

### Development Environment
- **Port:** 5000 (required for Replit webview)
- **Host:** 0.0.0.0 (allows external connections)
- **Dev Command:** `npm run dev`
- **Workflow:** "Next.js Development Server" configured and running

### Deployment Configuration
- **Target:** Autoscale (stateless web application)
- **Build:** `npm run build`
- **Start:** `npm start` (runs on port 5000)

## Key Features
1. **Unified Dashboard:** Real-time metrics for API traffic, workflows, and system health
2. **WhatsApp Management:** Conversation handling and message orchestration
3. **Twilio Integration:** Voice calls and SMS verification via Twilio Verify
4. **API Key Management:** Secure credential storage for integrated services
5. **Exposed API Console:** Document and manage internal APIs
6. **User & Role Management:** Team access control
7. **System Logs:** Real-time event tracking and debugging
8. **AI-Powered Suggestions:** Workflow optimization using Google AI/Genkit

## Environment Variables Required

### Firebase Configuration
Already configured in `src/firebase/config.ts` with project credentials.

### WhatsApp Business API
- `WHATSAPP_VERIFY_TOKEN` - Webhook verification token
- `WHATSAPP_ACCESS_TOKEN` - WhatsApp Business API access token
- `WHATSAPP_PHONE_NUMBER_ID` - Phone number ID from Meta App

### Twilio
- `TWILIO_ACCOUNT_SID` - Twilio Account SID
- `TWILIO_AUTH_TOKEN` - Twilio authentication token
- `TWILIO_VERIFY_SERVICE_SID` - Twilio Verify service SID

### Google AI (for Genkit)
- May require `GOOGLE_API_KEY` or service account credentials for AI features

## Important Notes
- Firebase configuration is already set up in the codebase
- The application uses Firebase Firestore for data persistence
- Genkit AI features require Google AI API access
- Next.js dev server automatically accepts connections from Replit's proxy
- TypeScript and ESLint errors are currently ignored during builds (configured in next.config.ts)

## Recent Changes
- **Nov 30, 2025:** Initial Replit import and configuration
  - Updated dev server to run on port 5000 with 0.0.0.0 binding
  - Configured Next.js workflow for Replit environment
  - Set up deployment configuration for autoscale
  - Removed invalid Next.js config option (allowedOrigins)
  - All dependencies installed successfully

## Additional Scripts
- `npm run genkit:dev` - Start Genkit AI development server
- `npm run genkit:watch` - Start Genkit with auto-reload
- `npm run lint` - Run ESLint
- `npm run typecheck` - Type check without emitting files

## Development Workflow
1. Environment is ready to use immediately
2. Access the application via the Replit webview
3. Set required environment variables for WhatsApp/Twilio integration
4. The Firebase project is already configured and ready
5. AI features require Google AI API key configuration
