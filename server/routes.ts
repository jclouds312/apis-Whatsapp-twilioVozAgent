import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { whatsAppBot } from "./whatsapp-bot";
import { whatsAppBusinessAPI } from "./whatsapp-business-api";
import { whatsAppOTPService } from "./whatsapp-otp";
import { log } from "./logger"; // Assuming a logger utility is available

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

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
      log.error("Error fetching CRM contacts:", error);
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
      log.error("Error creating CRM contact:", error);
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
      log.error("Error updating CRM contact:", error);
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
      log.error("Error deleting CRM contact:", error);
      res.status(500).json({ error: "Failed to delete contact" });
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