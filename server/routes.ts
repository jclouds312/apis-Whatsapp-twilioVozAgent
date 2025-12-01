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
      const data = insertWhatsappMessageSchema.parse(req.body);
      const message = await storage.createWhatsappMessage(data);
      
      // Log the action
      await storage.createSystemLog({
        userId: data.userId,
        eventType: "message_sent",
        service: "whatsapp",
        message: `Message sent to ${data.recipientPhone}`,
        status: "success",
        metadata: { messageId: message.id, phone: data.recipientPhone },
      });

      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  app.post("/api/whatsapp/webhook", async (req: Request, res: Response) => {
    try {
      const { from, to, body, mediaUrl } = req.body;
      
      // Find user by phone number (would need an association in real app)
      // For now, we'll log the webhook
      await storage.createSystemLog({
        eventType: "webhook_received",
        service: "whatsapp",
        message: `Webhook received from ${from}`,
        status: "info",
        metadata: { from, to, hasMedia: !!mediaUrl },
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to process webhook" });
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
      const data = insertTwilioCallSchema.parse(req.body);
      const call = await storage.createTwilioCall(data);

      await storage.createSystemLog({
        userId: data.userId,
        eventType: "call_initiated",
        service: "twilio",
        message: `Call initiated to ${data.toNumber}`,
        status: "success",
        metadata: { callId: call.id, toNumber: data.toNumber },
      });

      res.status(201).json(call);
    } catch (error) {
      res.status(400).json({ error: "Invalid call data" });
    }
  });

  app.post("/api/twilio/webhook", async (req: Request, res: Response) => {
    try {
      const { CallSid, CallStatus, From, To } = req.body;

      const call = await storage.getTwilioCallByCallSid(CallSid);
      if (call) {
        await storage.updateTwilioCall(call.id, { status: CallStatus });
      }

      await storage.createSystemLog({
        eventType: "call_status_update",
        service: "twilio",
        message: `Call ${CallSid} status: ${CallStatus}`,
        status: "info",
        metadata: { callSid: CallSid, status: CallStatus },
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to process webhook" });
    }
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

  // ============= HEALTH CHECK =============
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  return httpServer;
}
