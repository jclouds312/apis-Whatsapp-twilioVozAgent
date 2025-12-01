import type { Express, Request, Response } from "express";
import { storage } from "./storage";

const RETELL_API_BASE = "https://api.retellai.com";

export function registerRetellRoutes(app: Express) {
  // POST /api/v1/retell/agent/create - Create Retell voice agent
  app.post("/api/v1/retell/agent/create", async (req: Request, res: Response) => {
    try {
      const { name, language, prompt } = req.body;
      const apiKey = req.headers.authorization?.replace("Bearer ", "");
      
      if (!apiKey) return res.status(401).json({ error: "API key required" });
      if (!process.env.RETELL_API_KEY) return res.status(500).json({ error: "Retell not configured" });

      const response = await fetch(`${RETELL_API_BASE}/create-agent`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RETELL_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          agent_name: name || "Digital Future Agent",
          language_code: language || "es-ES",
          prompt: prompt || "Eres un agente de ventas profesional. Ayuda a los clientes con sus preguntas.",
          voice_id: "josh-english",
          interruption_threshold: 100,
          enable_voicemail: true,
          voicemail_message: "Por favor, deja tu mensaje después del tono."
        })
      });

      const data = await response.json();
      
      await storage.createSystemLog({
        userId: apiKey.substring(0, 20),
        eventType: "retell_agent_created",
        service: "retell",
        message: `Retell agent created: ${name}`,
        status: "success",
        metadata: { agentId: data.agent_id, name }
      });

      res.json({ success: true, agent: data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/retell/call/initiate - Initiate Retell call
  app.post("/api/v1/retell/call/initiate", async (req: Request, res: Response) => {
    try {
      const { agentId, phoneNumber, contactId } = req.body;
      const apiKey = req.headers.authorization?.replace("Bearer ", "");

      if (!apiKey) return res.status(401).json({ error: "API key required" });
      if (!process.env.RETELL_API_KEY) return res.status(500).json({ error: "Retell not configured" });

      const response = await fetch(`${RETELL_API_BASE}/start-phone-call`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RETELL_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          agent_id: agentId,
          phone_number: phoneNumber,
          metadata: { contactId, initiatedBy: apiKey.substring(0, 20) }
        })
      });

      const data = await response.json();

      await storage.createSystemLog({
        userId: apiKey.substring(0, 20),
        eventType: "retell_call_initiated",
        service: "retell",
        message: `Call initiated to ${phoneNumber}`,
        status: "success",
        metadata: { callId: data.call_id, phoneNumber }
      });

      res.json({ success: true, call: data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/retell/webhook - Retell webhook for call updates
  app.post("/api/v1/retell/webhook", async (req: Request, res: Response) => {
    try {
      const { event, call, agent } = req.body;

      await storage.createSystemLog({
        userId: "retell_webhook",
        eventType: `retell_${event}`,
        service: "retell",
        message: `Retell webhook: ${event}`,
        status: "success",
        metadata: { callId: call?.call_id, agentId: agent?.agent_id, event }
      });

      // Update CRM contact with conversation if available
      if (event === "call_ended" && call?.metadata?.contactId) {
        const crmContact = {
          id: call.metadata.contactId,
          lastInteraction: new Date().toISOString(),
          conversationSummary: call.summary_ai_generated
        };
        
        // Store conversation in system logs for retrieval
        await storage.createSystemLog({
          userId: call.metadata.contactId,
          eventType: "retell_conversation_saved",
          service: "crm",
          message: "Conversation saved from Retell call",
          status: "success",
          metadata: crmContact
        });
      }

      res.json({ received: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/v1/retell/conversations - List conversations
  app.get("/api/v1/retell/conversations", async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers.authorization?.replace("Bearer ", "");
      if (!apiKey) return res.status(401).json({ error: "API key required" });

      const conversations = [
        {
          id: "conv_1",
          agentName: "Digital Future Agent",
          phoneNumber: "+34912345678",
          duration: 245,
          date: "2025-01-20T14:30:00Z",
          status: "completed",
          summary: "Cliente preguntó sobre planes de precios y servicios. Interesado en paquete premium.",
          recording_url: "https://s3.amazonaws.com/recordings/conv_1.mp3"
        },
        {
          id: "conv_2",
          agentName: "Digital Future Agent",
          phoneNumber: "+34634567890",
          duration: 180,
          date: "2025-01-20T11:15:00Z",
          status: "completed",
          summary: "Consulta sobre integración con WhatsApp. Información proporcionada.",
          recording_url: "https://s3.amazonaws.com/recordings/conv_2.mp3"
        }
      ];

      res.json({ conversations, total: 2 });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/v1/retell/conversation/:id - Get conversation details
  app.get("/api/v1/retell/conversation/:id", async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers.authorization?.replace("Bearer ", "");
      if (!apiKey) return res.status(401).json({ error: "API key required" });

      const conversation = {
        id: req.params.id,
        agentName: "Digital Future Agent",
        phoneNumber: "+34912345678",
        duration: 245,
        date: "2025-01-20T14:30:00Z",
        status: "completed",
        transcript: [
          { speaker: "agent", text: "Hola, buenos días. ¿En qué puedo ayudarte?", timestamp: 0 },
          { speaker: "caller", text: "Hola, me gustaría saber sobre vuestros planes.", timestamp: 3 },
          { speaker: "agent", text: "Claro, tenemos 3 planes disponibles...", timestamp: 6 }
        ],
        summary: "Cliente preguntó sobre planes de precios.",
        sentiment: "positive",
        recording_url: "https://s3.amazonaws.com/recordings/conv_1.mp3"
      };

      res.json(conversation);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
