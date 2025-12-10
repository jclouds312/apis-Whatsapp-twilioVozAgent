import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { whatsAppBot } from "./whatsapp-bot";
import { whatsAppBusinessAPI } from "./whatsapp-business-api";
import { whatsAppOTPService } from "./whatsapp-otp";
import { logger } from "./logger";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Twilio Voice routes
  app.post("/api/twilio/voice/token", async (req, res) => {
    try {
      const { identity } = req.body;

      if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_API_KEY || !process.env.TWILIO_API_SECRET) {
        return res.status(500).json({ error: "Twilio Voice not configured" });
      }

      const AccessToken = require('twilio').jwt.AccessToken;
      const VoiceGrant = AccessToken.VoiceGrant;

      const voiceGrant = new VoiceGrant({
        outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
        incomingAllow: true,
      });

      const token = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_KEY,
        process.env.TWILIO_API_SECRET,
        { identity: identity || 'user_' + Date.now() }
      );

      token.addGrant(voiceGrant);

      res.json({ token: token.toJwt() });
    } catch (error) {
      logger.error("Error generating Twilio Voice token", "api", error);
      res.status(500).json({ error: "Failed to generate token" });
    }
  });

  app.post("/api/twilio/voice/incoming", async (req, res) => {
    try {
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial callerId="${process.env.TWILIO_PHONE_NUMBER || ''}">
    <Client>user_browser</Client>
  </Dial>
</Response>`;

      res.type('text/xml');
      res.send(twiml);
    } catch (error) {
      logger.error("Error handling incoming call", "api", error);
      res.status(500).send('Error');
    }
  });

  app.post("/api/twilio/voice/outgoing", async (req, res) => {
    try {
      const { To } = req.body;

      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial callerId="${process.env.TWILIO_PHONE_NUMBER || ''}">${To}</Dial>
</Response>`;

      res.type('text/xml');
      res.send(twiml);
    } catch (error) {
      logger.error("Error handling outgoing call", "api", error);
      res.status(500).send('Error');
    }
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        whatsappBot: whatsAppBot.getStatus(),
        whatsappBusiness: whatsAppBusinessAPI.isConfigured(),
        whatsappOTP: whatsAppOTPService.isConfigured()
      }
    });
  });
  // WhatsApp Bot Routes
  app.post("/api/whatsapp/connect", async (_req, res) => {
    try {
      await whatsAppBot.initialize();
      res.json({ success: true, message: "WhatsApp bot initializing" });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/whatsapp/qr", (_req, res) => {
    const qrCode = whatsAppBot.getQRCode();
    res.json({ qrCode });
  });

  app.get("/api/whatsapp/status", (_req, res) => {
    const status = whatsAppBot.getStatus();
    res.json(status);
  });

  app.get("/api/whatsapp/chats", async (_req, res) => {
    try {
      const chats = await whatsAppBot.getChats();
      res.json({ chats });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/whatsapp/send", async (req, res) => {
    try {
      const { to, message } = req.body;
      if (!to || !message) {
        return res.status(400).json({ success: false, error: "Missing 'to' or 'message' field" });
      }
      await whatsAppBot.sendMessage(to, message);
      res.json({ success: true, message: "Message sent" });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/whatsapp/disconnect", async (_req, res) => {
    try {
      await whatsAppBot.disconnect();
      res.json({ success: true, message: "WhatsApp bot disconnected" });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // WhatsApp Business Cloud API Routes
  app.post("/api/whatsapp-business/send-text", async (req, res) => {
    try {
      const { to, message } = req.body;
      if (!to || !message) {
        return res.status(400).json({ success: false, error: "Missing 'to' or 'message' field" });
      }
      const result = await whatsAppBusinessAPI.sendTextMessage(to, message);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/whatsapp-business/send-template", async (req, res) => {
    try {
      const { to, template } = req.body;
      if (!to || !template) {
        return res.status(400).json({ success: false, error: "Missing 'to' or 'template' field" });
      }
      const result = await whatsAppBusinessAPI.sendTemplate(to, template);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/whatsapp-business/send-media", async (req, res) => {
    try {
      const { to, media } = req.body;
      if (!to || !media) {
        return res.status(400).json({ success: false, error: "Missing 'to' or 'media' field" });
      }
      const result = await whatsAppBusinessAPI.sendMediaMessage(to, media);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/whatsapp-business/status", (_req, res) => {
    const isConfigured = whatsAppBusinessAPI.isConfigured();
    res.json({
      success: true,
      configured: isConfigured,
      message: isConfigured ? 'WhatsApp Business API is configured' : 'Missing credentials'
    });
  });

  // WhatsApp OTP Routes
  app.post("/api/whatsapp-otp/send", async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      if (!phoneNumber) {
        return res.status(400).json({ success: false, error: "Phone number is required" });
      }
      const result = await whatsAppOTPService.sendOTP(phoneNumber);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/whatsapp-otp/verify", async (req, res) => {
    try {
      const { sessionId, otp } = req.body;
      if (!sessionId || !otp) {
        return res.status(400).json({ success: false, error: "Session ID and OTP are required" });
      }
      const result = await whatsAppOTPService.verifyOTP(sessionId, otp);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/whatsapp-otp/resend", async (req, res) => {
    try {
      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json({ success: false, error: "Session ID is required" });
      }
      const result = await whatsAppOTPService.resendOTP(sessionId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/whatsapp-otp/status/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const status = whatsAppOTPService.getSessionStatus(sessionId);
      res.json({ success: true, status });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/whatsapp-otp/config-status", (_req, res) => {
    const isConfigured = whatsAppOTPService.isConfigured();
    res.json({
      success: true,
      configured: isConfigured,
      message: isConfigured ? 'WhatsApp OTP service is configured' : 'Missing credentials'
    });
  });

  // Webhook for receiving WhatsApp messages
  app.get("/api/whatsapp-business/webhook", (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === process.env.WA_WEBHOOK_VERIFY_TOKEN) {
        console.log('Webhook verified');
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(400);
    }
  });

  app.post("/api/whatsapp-business/webhook", async (req, res) => {
    try {
      const body = req.body;

      if (body.object === 'whatsapp_business_account') {
        body.entry?.forEach((entry: any) => {
          entry.changes?.forEach((change: any) => {
            if (change.field === 'messages') {
              const messages = change.value?.messages || [];
              messages.forEach((message: any) => {
                console.log('Received WhatsApp message:', message);
                // Handle incoming message here
                // You can emit events or store in database
              });
            }
          });
        });

        res.status(200).send('EVENT_RECEIVED');
      } else {
        res.sendStatus(404);
      }
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // CRM Routes
  app.get("/api/crm/contacts", async (req, res) => {
    try {
      const userId = req.user?.id || "default-user";
      const contacts = await storage.getCrmContactsByUserId(userId);
      res.json(contacts);
    } catch (error) {
      logger.error("Error fetching CRM contacts", "api", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.post("/api/crm/contacts", async (req, res) => {
    try {
      const userId = req.user?.id || "default-user";
      const contact = await storage.createCrmContact({
        ...req.body,
        userId,
      });
      res.json(contact);
    } catch (error) {
      logger.error("Error creating CRM contact", "api", error);
      res.status(500).json({ error: "Failed to create contact" });
    }
  });

  app.put("/api/crm/contacts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const contact = await storage.updateCrmContact(id, req.body);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      logger.error("Error updating CRM contact", "api", error);
      res.status(500).json({ error: "Failed to update contact" });
    }
  });

  app.delete("/api/crm/contacts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteCrmContact(id);
      if (!deleted) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json({ success: true });
    } catch (error) {
      logger.error("Error deleting CRM contact", "api", error);
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });

  // VoIP Extensions Routes
  app.get("/api/voip/extensions", async (req, res) => {
    try {
      const userId = req.user?.id || "default-user";
      const extensions = await storage.getVoipExtensionsByUserId(userId);
      res.json(extensions);
    } catch (error) {
      logger.error("Error fetching VoIP extensions", "api", error);
      res.status(500).json({ error: "Failed to fetch extensions" });
    }
  });

  app.post("/api/voip/extensions", async (req, res) => {
    try {
      const userId = req.user?.id || "default-user";
      const extension = await storage.createVoipExtension({
        ...req.body,
        userId,
      });
      res.json(extension);
    } catch (error) {
      logger.error("Error creating VoIP extension", "api", error);
      res.status(500).json({ error: "Failed to create extension" });
    }
  });

  app.put("/api/voip/extensions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const extension = await storage.updateVoipExtension(id, req.body);
      if (!extension) {
        return res.status(404).json({ error: "Extension not found" });
      }
      res.json(extension);
    } catch (error) {
      logger.error("Error updating VoIP extension", "api", error);
      res.status(500).json({ error: "Failed to update extension" });
    }
  });

  app.delete("/api/voip/extensions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteVoipExtension(id);
      if (!deleted) {
        return res.status(404).json({ error: "Extension not found" });
      }
      res.json({ success: true });
    } catch (error) {
      logger.error("Error deleting VoIP extension", "api", error);
      res.status(500).json({ error: "Failed to delete extension" });
    }
  });

  app.post("/api/voip/create-admin", async (req, res) => {
    try {
      const { phoneNumber, adminEmail } = req.body;
      const userId = req.user?.id || "default-user";

      // Crear extensión principal de admin
      const adminExtension = await storage.createVoipExtension({
        userId,
        extensionNumber: "1000",
        name: "Admin Principal",
        phoneNumber: phoneNumber || "8622770131",
        role: "admin",
        status: "available",
        permissions: {
          fullAccess: true,
          canManageExtensions: true,
          canManageWhatsApp: true,
          canExportData: true,
          canManageUsers: true,
          canViewAllCalls: true,
          canViewAllMessages: true,
        },
        credentials: {
          adminEmail: adminEmail || "alexander.medez931@outlook.com",
        },
        isActive: true,
      });

      res.json({
        success: true,
        extension: adminExtension,
        message: "Admin principal creado con privilegios completos",
      });
    } catch (error) {
      logger.error("Error creating admin extension", "api", error);
      res.status(500).json({ error: "Failed to create admin extension" });
    }
  });

  // CRM Export Routes
  app.post("/api/crm/export/voice", async (req, res) => {
    try {
      const { adminEmail, format } = req.body;
      
      const calls = await storage.getAllTwilioCalls();
      
      const exportData = {
        exportedBy: adminEmail,
        exportDate: new Date().toISOString(),
        dataType: "twilio_voice",
        totalRecords: calls.length,
        data: calls.map(call => ({
          callSid: call.id,
          from: call.from,
          to: call.to,
          status: call.status,
          duration: call.duration,
          recordingUrl: call.recordingUrl,
          createdAt: call.createdAt
        }))
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=voice_export_${Date.now()}.json`);
      res.json(exportData);
    } catch (error) {
      logger.error("Error exporting voice data", "api", error);
      res.status(500).json({ error: "Failed to export voice data" });
    }
  });

  app.post("/api/crm/export/whatsapp", async (req, res) => {
    try {
      const { adminEmail, format } = req.body;
      
      const messages = await storage.getAllWhatsAppMessages();
      
      const exportData = {
        exportedBy: adminEmail,
        exportDate: new Date().toISOString(),
        dataType: "whatsapp_messages",
        totalRecords: messages.length,
        data: messages.map(msg => ({
          messageId: msg.id,
          phoneNumber: msg.phoneNumber,
          recipientPhone: msg.recipientPhone,
          message: msg.message,
          mediaUrl: msg.mediaUrl,
          status: msg.status,
          direction: msg.direction,
          createdAt: msg.createdAt
        }))
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=whatsapp_export_${Date.now()}.json`);
      res.json(exportData);
    } catch (error) {
      logger.error("Error exporting WhatsApp data", "api", error);
      res.status(500).json({ error: "Failed to export WhatsApp data" });
    }
  });

  app.post("/api/crm/export/all", async (req, res) => {
    try {
      const { adminEmail, format } = req.body;
      
      const [calls, messages, contacts] = await Promise.all([
        storage.getAllTwilioCalls(),
        storage.getAllWhatsAppMessages(),
        storage.getAllCrmContacts()
      ]);
      
      const exportData = {
        exportedBy: adminEmail,
        exportDate: new Date().toISOString(),
        dataType: "full_crm_export",
        summary: {
          totalCalls: calls.length,
          totalMessages: messages.length,
          totalContacts: contacts.length
        },
        twilioVoice: calls,
        whatsappMessages: messages,
        crmContacts: contacts
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=full_crm_export_${Date.now()}.json`);
      res.json(exportData);
    } catch (error) {
      logger.error("Error exporting all CRM data", "api", error);
      res.status(500).json({ error: "Failed to export CRM data" });
    }
  });

  // Configuration endpoint
  app.get("/api/config", (_req, res) => {
    res.json({
      services: {
        whatsapp: {
          bot: whatsAppBot.getStatus(),
          business: {
            configured: whatsAppBusinessAPI.isConfigured(),
            apiVersion: 'v21.0'
          }
        },
        twilio: {
          configured: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
        },
        facebook: {
          configured: !!(process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET)
        }
      }
    });
  });

  // Generic error handler for API routes
  app.use('/api/*', (err: any, _req: any, res: any, _next: any) => {
    console.error('API Error:', err);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  });

  return httpServer;
}