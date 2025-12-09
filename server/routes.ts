import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { whatsAppBot } from "./whatsapp-bot";

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

  return httpServer;
}
