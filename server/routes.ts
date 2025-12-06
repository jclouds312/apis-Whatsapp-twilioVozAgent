import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { 
  insertContactSchema, 
  insertMessageSchema, 
  insertCallSchema,
  insertWorkflowSchema,
  insertKnowledgeDocumentSchema,
  insertAgentSessionSchema
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";

// WebSocket connections for real-time updates
const wsClients = new Set<WebSocket>();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // WebSocket server for real-time agent control
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  
  wss.on("connection", (ws) => {
    wsClients.add(ws);
    console.log("WebSocket client connected");
    
    ws.on("close", () => {
      wsClients.delete(ws);
      console.log("WebSocket client disconnected");
    });
  });

  // Broadcast to all connected WebSocket clients
  const broadcast = (data: any) => {
    const message = JSON.stringify(data);
    wsClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // ==================== Dashboard Stats ====================
  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== Contacts ====================
  app.get("/api/contacts", async (_req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/contacts/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }
      const contacts = await storage.searchContacts(query);
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contact = await storage.getContact(id);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const result = insertContactSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromZodError(result.error).message });
      }
      const contact = await storage.createContact(result.data);
      res.status(201).json(contact);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contact = await storage.updateContact(id, req.body);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteContact(id);
      if (!success) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== Messages ====================
  app.get("/api/messages", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const messages = await storage.getAllMessages(limit);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const result = insertMessageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromZodError(result.error).message });
      }
      const message = await storage.createMessage(result.data);
      
      // Broadcast to WebSocket clients
      broadcast({ type: 'new_message', data: message });
      
      res.status(201).json(message);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== Calls ====================
  app.get("/api/calls", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const calls = await storage.getAllCalls(limit);
      res.json(calls);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/calls", async (req, res) => {
    try {
      const result = insertCallSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromZodError(result.error).message });
      }
      const call = await storage.createCall(result.data);
      
      // Broadcast to WebSocket clients
      broadcast({ type: 'new_call', data: call });
      
      res.status(201).json(call);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/calls/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const call = await storage.updateCall(id, req.body);
      if (!call) {
        return res.status(404).json({ error: "Call not found" });
      }
      
      // Broadcast update
      broadcast({ type: 'call_updated', data: call });
      
      res.json(call);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== Workflows ====================
  app.get("/api/workflows", async (_req, res) => {
    try {
      const workflows = await storage.getAllWorkflows();
      res.json(workflows);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/workflows/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const workflow = await storage.getWorkflow(id);
      if (!workflow) {
        return res.status(404).json({ error: "Workflow not found" });
      }
      res.json(workflow);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/workflows", async (req, res) => {
    try {
      const result = insertWorkflowSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromZodError(result.error).message });
      }
      const workflow = await storage.createWorkflow(result.data);
      res.status(201).json(workflow);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/workflows/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const workflow = await storage.updateWorkflow(id, req.body);
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
      const id = parseInt(req.params.id);
      const success = await storage.deleteWorkflow(id);
      if (!success) {
        return res.status(404).json({ error: "Workflow not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== Knowledge Base ====================
  app.get("/api/knowledge", async (_req, res) => {
    try {
      const docs = await storage.getAllKnowledgeDocuments();
      res.json(docs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/knowledge", async (req, res) => {
    try {
      const result = insertKnowledgeDocumentSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromZodError(result.error).message });
      }
      const doc = await storage.createKnowledgeDocument(result.data);
      res.status(201).json(doc);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/knowledge/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const doc = await storage.updateKnowledgeDocument(id, req.body);
      if (!doc) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json(doc);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/knowledge/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteKnowledgeDocument(id);
      if (!success) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== Agent Sessions ====================
  app.post("/api/sessions", async (req, res) => {
    try {
      const result = insertAgentSessionSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromZodError(result.error).message });
      }
      const session = await storage.createAgentSession(result.data);
      
      broadcast({ type: 'session_started', data: session });
      
      res.status(201).json(session);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.updateAgentSession(id, req.body);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      broadcast({ type: 'session_updated', data: session });
      
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sessions/:id/end", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.endAgentSession(id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      broadcast({ type: 'session_ended', data: session });
      
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== Twilio Webhooks ====================
  // These will be called by Twilio when events occur
  
  app.post("/api/webhooks/twilio/voice/incoming", async (req, res) => {
    try {
      const { From, To, CallSid } = req.body;
      
      // Create a call record
      const call = await storage.createCall({
        direction: "inbound",
        from: From,
        to: To,
        status: "ringing",
        twilioSid: CallSid,
        startedAt: new Date(),
      });
      
      broadcast({ type: 'incoming_call', data: call });
      
      // TwiML response to handle the call
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Hello, thank you for calling Nexus AI. Please hold while we connect you to an agent.</Say>
  <Pause length="2"/>
</Response>`;
      
      res.type('text/xml');
      res.send(twiml);
    } catch (error: any) {
      console.error("Twilio voice webhook error:", error);
      res.status(500).send("Error processing call");
    }
  });

  app.post("/api/webhooks/twilio/voice/status", async (req, res) => {
    try {
      const { CallSid, CallStatus, CallDuration } = req.body;
      
      // Find and update the call
      const calls = await storage.getAllCalls();
      const call = calls.find(c => c.twilioSid === CallSid);
      
      if (call) {
        await storage.updateCall(call.id, {
          status: CallStatus,
          duration: parseInt(CallDuration || "0"),
          endedAt: new Date(),
        });
        
        broadcast({ type: 'call_status_update', data: { CallSid, CallStatus } });
      }
      
      res.sendStatus(200);
    } catch (error: any) {
      console.error("Twilio status webhook error:", error);
      res.sendStatus(500);
    }
  });

  app.post("/api/webhooks/twilio/sms/incoming", async (req, res) => {
    try {
      const { From, To, Body, MessageSid } = req.body;
      
      // Create message record
      const message = await storage.createMessage({
        type: "sms",
        direction: "inbound",
        from: From,
        to: To,
        body: Body,
        status: "received",
        twilioSid: MessageSid,
      });
      
      broadcast({ type: 'incoming_sms', data: message });
      
      // Auto-reply with TwiML
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Thank you for your message. An agent will respond shortly.</Message>
</Response>`;
      
      res.type('text/xml');
      res.send(twiml);
    } catch (error: any) {
      console.error("Twilio SMS webhook error:", error);
      res.status(500).send("Error processing SMS");
    }
  });

  app.post("/api/webhooks/whatsapp/incoming", async (req, res) => {
    try {
      const { From, To, Body, MessageSid } = req.body;
      
      // Create message record
      const message = await storage.createMessage({
        type: "whatsapp",
        direction: "inbound",
        from: From,
        to: To,
        body: Body,
        status: "received",
        twilioSid: MessageSid,
      });
      
      broadcast({ type: 'incoming_whatsapp', data: message });
      
      res.sendStatus(200);
    } catch (error: any) {
      console.error("WhatsApp webhook error:", error);
      res.sendStatus(500);
    }
  });

  return httpServer;
}
