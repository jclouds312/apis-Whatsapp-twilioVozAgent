import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { whatsAppBot } from "./whatsapp-bot";
import { whatsAppBusinessAPI } from "./whatsapp-business-api";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
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

  return httpServer;
}
