import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { randomUUID } from "crypto";
import axios from "axios";

const NOCODEAPI_TWILIO_ENDPOINT = process.env.NOCODEAPI_TWILIO_ENDPOINT;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ============= HEALTH CHECK =============
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ============= USERS =============
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= API KEYS =============
  app.get("/api/api-keys", async (req, res) => {
    try {
      const apiKeys = await storage.getAllApiKeys();
      res.json(apiKeys);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/api-keys/:userId", async (req, res) => {
    try {
      const apiKeys = await storage.getApiKeys(req.params.userId);
      res.json(apiKeys);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/api-keys", async (req, res) => {
    try {
      const apiKey = await storage.createApiKey({
        ...req.body,
        key: req.body.key || `sk_${randomUUID().replace(/-/g, '')}`,
      });
      res.status(201).json(apiKey);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/api-keys/:id", async (req, res) => {
    try {
      const apiKey = await storage.updateApiKey(req.params.id, req.body);
      if (!apiKey) {
        return res.status(404).json({ error: "API Key not found" });
      }
      res.json(apiKey);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/api-keys/:id", async (req, res) => {
    try {
      await storage.deleteApiKey(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= TWILIO SMS =============
  app.post("/api/twilio/send-sms", async (req, res) => {
    try {
      const { to, body, from } = req.body;
      
      if (!NOCODEAPI_TWILIO_ENDPOINT) {
        return res.status(500).json({ error: "Twilio API not configured" });
      }

      const response = await axios.post(`${NOCODEAPI_TWILIO_ENDPOINT}/sendSMS`, {
        body,
        to,
        from: from || TWILIO_PHONE_NUMBER
      });

      await storage.createSystemLog({
        eventType: "sms_sent",
        service: "twilio",
        message: `SMS sent to ${to}`,
        status: "success",
        metadata: { to, body: body.substring(0, 50) }
      });

      res.json({ success: true, data: response.data });
    } catch (error: any) {
      await storage.createSystemLog({
        eventType: "sms_failed",
        service: "twilio",
        message: error.message,
        status: "error"
      });
      res.status(500).json({ error: error.message });
    }
  });

  // ============= TWILIO VOICE CALLS =============
  app.post("/api/twilio/make-call", async (req, res) => {
    try {
      const { to, from, message } = req.body;
      
      if (!NOCODEAPI_TWILIO_ENDPOINT) {
        return res.status(500).json({ error: "Twilio API not configured" });
      }

      const response = await axios.post(`${NOCODEAPI_TWILIO_ENDPOINT}/makeCall`, {
        to,
        from: from || TWILIO_PHONE_NUMBER,
        twiml: `<Response><Say>${message || 'Hello from NexusCore'}</Say></Response>`
      });

      const callSid = response.data?.sid || `call_${randomUUID()}`;
      
      const call = await storage.createTwilioCall({
        userId: req.body.userId || "system",
        callSid,
        fromNumber: from || TWILIO_PHONE_NUMBER || "",
        toNumber: to,
        status: "initiated",
        direction: "outbound"
      });

      await storage.createSystemLog({
        eventType: "call_initiated",
        service: "twilio",
        message: `Call initiated to ${to}`,
        status: "success",
        metadata: { to, callSid }
      });

      res.json({ success: true, call, data: response.data });
    } catch (error: any) {
      await storage.createSystemLog({
        eventType: "call_failed",
        service: "twilio",
        message: error.message,
        status: "error"
      });
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/twilio/calls", async (req, res) => {
    try {
      const userId = req.query.userId as string || "system";
      const calls = await storage.getTwilioCalls(userId);
      res.json(calls);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= WHATSAPP =============
  app.post("/api/whatsapp/send-message", async (req, res) => {
    try {
      const { to, message, userId } = req.body;

      const waMessage = await storage.createWhatsappMessage({
        userId: userId || "system",
        phoneNumber: TWILIO_PHONE_NUMBER || "",
        recipientPhone: to,
        message,
        status: "pending",
        direction: "outbound"
      });

      if (NOCODEAPI_TWILIO_ENDPOINT) {
        try {
          await axios.post(`${NOCODEAPI_TWILIO_ENDPOINT}/sendSMS`, {
            body: message,
            to: `whatsapp:${to}`,
            from: `whatsapp:${TWILIO_PHONE_NUMBER}`
          });
          await storage.updateWhatsappMessageStatus(waMessage.id, "sent");
        } catch (err) {
          await storage.updateWhatsappMessageStatus(waMessage.id, "failed");
        }
      }

      await storage.createSystemLog({
        userId: userId || "system",
        eventType: "whatsapp_message_sent",
        service: "whatsapp",
        message: `Message sent to ${to}`,
        status: "success"
      });

      res.json({ success: true, message: waMessage });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/whatsapp/messages", async (req, res) => {
    try {
      const userId = req.query.userId as string || "system";
      const messages = await storage.getWhatsappMessages(userId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= CRM CONTACTS =============
  app.get("/api/crm/contacts", async (req, res) => {
    try {
      const userId = req.query.userId as string || "system";
      const contacts = await storage.getCrmContacts(userId);
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/crm/contacts", async (req, res) => {
    try {
      const contact = await storage.createCrmContact(req.body);
      res.status(201).json(contact);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/crm/contacts/:id", async (req, res) => {
    try {
      const contact = await storage.updateCrmContact(req.params.id, req.body);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/crm/contacts/:id", async (req, res) => {
    try {
      await storage.deleteCrmContact(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= VOIP EXTENSIONS =============
  app.get("/api/voip/extensions", async (req, res) => {
    try {
      const userId = req.query.userId as string || "system";
      const extensions = await storage.getVoipExtensions(userId);
      res.json(extensions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/voip/extensions", async (req, res) => {
    try {
      const extension = await storage.createVoipExtension(req.body);
      res.status(201).json(extension);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/voip/extensions/:id", async (req, res) => {
    try {
      const extension = await storage.updateVoipExtension(req.params.id, req.body);
      if (!extension) {
        return res.status(404).json({ error: "Extension not found" });
      }
      res.json(extension);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/voip/extensions/:id", async (req, res) => {
    try {
      await storage.deleteVoipExtension(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= WORKFLOWS =============
  app.get("/api/workflows", async (req, res) => {
    try {
      const userId = req.query.userId as string || "system";
      const workflows = await storage.getWorkflows(userId);
      res.json(workflows);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/workflows", async (req, res) => {
    try {
      const workflow = await storage.createWorkflow(req.body);
      res.status(201).json(workflow);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/workflows/:id", async (req, res) => {
    try {
      const workflow = await storage.updateWorkflow(req.params.id, req.body);
      if (!workflow) {
        return res.status(404).json({ error: "Workflow not found" });
      }
      res.json(workflow);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/workflows/:id", async (req, res) => {
    try {
      await storage.deleteWorkflow(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= SYSTEM LOGS =============
  app.get("/api/logs", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const limit = parseInt(req.query.limit as string) || 100;
      const logs = await storage.getSystemLogs(userId, limit);
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= SERVICES =============
  app.get("/api/services", async (req, res) => {
    try {
      const userId = req.query.userId as string || "system";
      const services = await storage.getServices(userId);
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/services", async (req, res) => {
    try {
      const service = await storage.createService(req.body);
      res.status(201).json(service);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/services/:id", async (req, res) => {
    try {
      const service = await storage.updateService(req.params.id, req.body);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= EXPOSED APIS =============
  app.get("/api/exposed-apis", async (req, res) => {
    try {
      const userId = req.query.userId as string || "system";
      const apis = await storage.getExposedApis(userId);
      res.json(apis);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/exposed-apis", async (req, res) => {
    try {
      const api = await storage.createExposedApi(req.body);
      res.status(201).json(api);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/exposed-apis/:id", async (req, res) => {
    try {
      await storage.deleteExposedApi(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= TWILIO WEBHOOKS =============
  app.post("/api/webhooks/twilio/voice", (req, res) => {
    res.type("text/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>Bienvenido a NexusCore Enterprise. Su llamada está siendo procesada.</Say>
      </Response>`);
  });

  app.post("/api/webhooks/twilio/status", async (req, res) => {
    try {
      const { CallSid, CallStatus } = req.body;
      const call = await storage.getTwilioCallBySid(CallSid);
      if (call) {
        await storage.updateTwilioCall(call.id, { status: CallStatus });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= CONFIG & STATUS =============
  app.get("/api/config/twilio", (req, res) => {
    res.json({
      configured: !!NOCODEAPI_TWILIO_ENDPOINT,
      phoneNumber: TWILIO_PHONE_NUMBER || null
    });
  });

  return httpServer;
}
