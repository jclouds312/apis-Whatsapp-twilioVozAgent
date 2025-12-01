import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertApiKeySchema,
  insertWhatsappMessageSchema,
  insertTwilioCallSchema,
  insertWorkflowSchema,
  insertCrmContactSchema,
  insertSystemLogSchema,
  insertExposedApiSchema,
} from "@shared/schema";
import { createTwilioService } from "./services/TwilioService";
import { createWhatsAppService } from "./services/WhatsAppService";
import { handleWhatsAppWebhook, handleTwilioWebhook } from "./webhooks";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ============= API KEYS ROUTES =============
  app.get("/api/api-keys", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) return res.status(400).json({ error: "userId required" });

      const keys = await storage.getApiKeysByUser(userId);
      res.json(keys);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch API keys" });
    }
  });

  app.post("/api/api-keys", async (req: Request, res: Response) => {
    try {
      const data = insertApiKeySchema.parse(req.body);
      const apiKey = await storage.createApiKey(data);
      res.status(201).json(apiKey);
    } catch (error) {
      res.status(400).json({ error: "Invalid API key data" });
    }
  });

  app.put("/api/api-keys/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const updated = await storage.updateApiKey(id, req.body);
      if (!updated) return res.status(404).json({ error: "API key not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update API key" });
    }
  });

  app.delete("/api/api-keys/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteApiKey(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete API key" });
    }
  });

  // ============= WHATSAPP MESSAGES ROUTES =============
  app.get("/api/whatsapp/messages", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) return res.status(400).json({ error: "userId required" });

      const messages = await storage.getWhatsappMessagesByUser(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/whatsapp/messages", async (req: Request, res: Response) => {
    try {
      const { userId, recipientPhone, message: messageText } = req.body;
      
      if (!process.env.WHATSAPP_PHONE_ID || !process.env.WHATSAPP_ACCESS_TOKEN) {
        return res.status(400).json({ error: "WhatsApp credentials not configured" });
      }

      const whatsappService = createWhatsAppService(
        process.env.WHATSAPP_PHONE_ID,
        process.env.WHATSAPP_ACCESS_TOKEN,
        process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || ""
      );

      const response = await whatsappService.sendMessage(recipientPhone, messageText, userId);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error: "Failed to send WhatsApp message" });
    }
  });

  app.post("/api/whatsapp/webhook", handleWhatsAppWebhook);

  app.get("/api/whatsapp/webhook", (req: Request, res: Response) => {
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    
    if (token === process.env.WHATSAPP_WEBHOOK_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.status(403).json({ error: "Invalid token" });
    }
  });

  // ============= TWILIO CALLS ROUTES =============
  app.get("/api/twilio/calls", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) return res.status(400).json({ error: "userId required" });

      const calls = await storage.getTwilioCallsByUser(userId);
      res.json(calls);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch calls" });
    }
  });

  app.post("/api/twilio/calls", async (req: Request, res: Response) => {
    try {
      const { userId, toNumber, retellAgentId } = req.body;

      if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        return res.status(400).json({ error: "Twilio credentials not configured" });
      }

      const twilioService = createTwilioService(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
        process.env.TWILIO_PHONE_NUMBER || "+18622770131"
      );

      const call = await twilioService.initiateCall(toNumber, userId, retellAgentId);
      res.status(201).json(call);
    } catch (error) {
      res.status(400).json({ error: "Failed to initiate call" });
    }
  });

  app.post("/api/twilio/webhook", handleTwilioWebhook);

  app.post("/api/twilio/twiml", (req: Request, res: Response) => {
    res.set("Content-Type", "text/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say voice="alice">Thank you for calling. Your call is being processed.</Say>
        <Gather numDigits="1" action="/api/twilio/gather" method="POST">
          <Say>Press 1 for support, or 2 to repeat this message.</Say>
        </Gather>
      </Response>
    `);
  });

  // ============= WORKFLOWS ROUTES =============
  app.get("/api/workflows", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) return res.status(400).json({ error: "userId required" });

      const workflows = await storage.getWorkflowsByUser(userId);
      res.json(workflows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch workflows" });
    }
  });

  app.post("/api/workflows", async (req: Request, res: Response) => {
    try {
      const data = insertWorkflowSchema.parse(req.body);
      const workflow = await storage.createWorkflow(data);
      res.status(201).json(workflow);
    } catch (error) {
      res.status(400).json({ error: "Invalid workflow data" });
    }
  });

  app.put("/api/workflows/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const updated = await storage.updateWorkflow(id, req.body);
      if (!updated) return res.status(404).json({ error: "Workflow not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update workflow" });
    }
  });

  app.delete("/api/workflows/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteWorkflow(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete workflow" });
    }
  });

  // ============= CRM CONTACTS ROUTES =============
  app.get("/api/crm/contacts", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) return res.status(400).json({ error: "userId required" });

      const contacts = await storage.getCrmContactsByUser(userId);
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.post("/api/crm/contacts", async (req: Request, res: Response) => {
    try {
      const data = insertCrmContactSchema.parse(req.body);
      const contact = await storage.createCrmContact(data);

      await storage.createSystemLog({
        userId: data.userId,
        eventType: "contact_created",
        service: "crm",
        message: `Contact created: ${data.name}`,
        status: "success",
        metadata: { contactId: contact.id, name: data.name },
      });

      res.status(201).json(contact);
    } catch (error) {
      res.status(400).json({ error: "Invalid contact data" });
    }
  });

  app.put("/api/crm/contacts/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const updated = await storage.updateCrmContact(id, req.body);
      if (!updated) return res.status(404).json({ error: "Contact not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update contact" });
    }
  });

  // ============= SYSTEM LOGS ROUTES =============
  app.get("/api/system-logs", async (req: Request, res: Response) => {
    try {
      const userId = (req.query.userId as string) || null;
      const logs = await storage.getSystemLogs(userId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  });

  // ============= EXPOSED APIS ROUTES =============
  app.get("/api/exposed-apis", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) return res.status(400).json({ error: "userId required" });

      const apis = await storage.getExposedApisByUser(userId);
      res.json(apis);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch APIs" });
    }
  });

  app.post("/api/exposed-apis", async (req: Request, res: Response) => {
    try {
      const data = insertExposedApiSchema.parse(req.body);
      const api = await storage.createExposedApi(data);
      res.status(201).json(api);
    } catch (error) {
      res.status(400).json({ error: "Invalid API data" });
    }
  });

  app.put("/api/exposed-apis/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const updated = await storage.updateExposedApi(id, req.body);
      if (!updated) return res.status(404).json({ error: "API not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update API" });
    }
  });

  app.delete("/api/exposed-apis/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteExposedApi(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete API" });
    }
  });

  // ============= AUTH ROUTES =============
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      const user = await storage.createUser({ username, email, password, role: "user" });
      res.status(201).json({ user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
      res.status(400).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      res.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    } catch (error) {
      res.status(400).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/google", async (req: Request, res: Response) => {
    try {
      const { googleId, email } = req.body;
      let user = await storage.getUserByGoogleId(googleId);
      if (!user) {
        user = await storage.createUser({
          username: email.split("@")[0],
          email,
          googleId,
          role: "user",
        });
      }
      res.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    } catch (error) {
      res.status(400).json({ error: "Google login failed" });
    }
  });

  // ============= PUBLIC API v1 ROUTES =============
  // WhatsApp Send Message API
  app.post("/api/v1/whatsapp/send", async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers.authorization?.replace("Bearer ", "");
      if (!apiKey) return res.status(401).json({ error: "Missing API key" });

      const { to, message, type = "text" } = req.body;

      if (!process.env.WHATSAPP_PHONE_ID || !process.env.WHATSAPP_ACCESS_TOKEN) {
        return res.status(503).json({ error: "WhatsApp service not configured" });
      }

      const whatsappService = createWhatsAppService(
        process.env.WHATSAPP_PHONE_ID,
        process.env.WHATSAPP_ACCESS_TOKEN,
        process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || ""
      );

      const result = await whatsappService.sendMessage(to, message, "api-v1-call");

      res.json({
        success: true,
        messageId: result.messages?.[0]?.id || "pending",
        status: "sent",
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to send message" });
    }
  });

  // Twilio Initiate Call API
  app.post("/api/v1/twilio/call", async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers.authorization?.replace("Bearer ", "");
      if (!apiKey) return res.status(401).json({ error: "Missing API key" });

      const { to, from = "+18622770131", message } = req.body;

      if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        return res.status(503).json({ error: "Twilio service not configured" });
      }

      const twilioService = createTwilioService(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
        from
      );

      const call = await twilioService.initiateCall(to, "api-v1-call");

      res.json({
        success: true,
        callSid: call.sid,
        status: "initiated",
        duration: 0,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to initiate call" });
    }
  });

  // CRM Contacts API - GET all contacts
  app.get("/api/v1/crm/contacts", async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers.authorization?.replace("Bearer ", "");
      if (!apiKey) return res.status(401).json({ error: "Missing API key" });

      const contacts = await storage.getCrmContactsByUser("api-v1-call");
      res.json({
        success: true,
        contacts,
        total: contacts.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  // CRM Contacts API - POST create contact
  app.post("/api/v1/crm/contacts", async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers.authorization?.replace("Bearer ", "");
      if (!apiKey) return res.status(401).json({ error: "Missing API key" });

      const { name, email, phone, company, tags } = req.body;

      const contact = await storage.createCrmContact({
        userId: "api-v1-call",
        name,
        email,
        phone,
        company,
        tags: tags || [],
        status: "active",
      });

      await storage.createSystemLog({
        eventType: "crm_contact_created",
        service: "crm",
        message: `Contact created via API: ${name}`,
        status: "success",
        metadata: { contactId: contact.id, name, email },
      });

      res.status(201).json({
        success: true,
        contact,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(400).json({ error: "Failed to create contact" });
    }
  });

  // CRM Contacts API - PUT update contact
  app.put("/api/v1/crm/contacts/:id", async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers.authorization?.replace("Bearer ", "");
      if (!apiKey) return res.status(401).json({ error: "Missing API key" });

      const { id } = req.params;
      const updates = req.body;

      const contact = await storage.updateCrmContact(id, updates);

      res.json({
        success: true,
        contact,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(400).json({ error: "Failed to update contact" });
    }
  });

  // CRM Contacts API - DELETE contact
  app.delete("/api/v1/crm/contacts/:id", async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers.authorization?.replace("Bearer ", "");
      if (!apiKey) return res.status(401).json({ error: "Missing API key" });

      await storage.deleteCrmContact(req.params.id);

      res.json({
        success: true,
        message: "Contact deleted",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete contact" });
    }
  });

  // API Documentation endpoint
  app.get("/api/v1/docs", (req: Request, res: Response) => {
    res.json({
      api: "Nexus Core v1",
      version: "1.0.0",
      baseUrl: "https://api.nexus-core.com",
      authentication: "Bearer token in Authorization header",
      endpoints: {
        whatsapp: {
          send: {
            method: "POST",
            path: "/api/v1/whatsapp/send",
            description: "Send WhatsApp message",
            params: { to: "recipient phone", message: "message text", type: "text|template" },
          },
        },
        twilio: {
          call: {
            method: "POST",
            path: "/api/v1/twilio/call",
            description: "Initiate phone call",
            params: { to: "recipient phone", from: "from number", message: "voice message" },
          },
        },
        crm: {
          contacts: {
            method: "GET|POST|PUT|DELETE",
            path: "/api/v1/crm/contacts",
            description: "Manage CRM contacts",
          },
        },
      },
    });
  });

  // ============= HEALTH CHECK =============
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({
      status: "ok",
      whatsappConfigured: !!process.env.WHATSAPP_PHONE_ID,
      twilioConfigured: !!process.env.TWILIO_ACCOUNT_SID,
      adminPhone: "+18622770131",
      apiVersion: "v1.0.0",
      apiUrl: "https://api.nexus-core.com",
    });
  });

  return httpServer;
}
