import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import axios from "axios";

// NoCodeAPI Twilio endpoint
const NOCODE_API_URL = "https://v1.nocodeapi.com/john474n/twilio/jbngLoZWwbtslepf";

// Middleware to validate API key
async function validateApiKey(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization header" });
  }

  const key = authHeader.substring(7);
  const apiKey = await storage.getApiKeyByKey(key);

  if (!apiKey || !apiKey.isActive) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  (req as any).apiKey = apiKey;
  (req as any).userId = apiKey.userId;
  next();
}

export function registerV1ApiRoutes(app: Express) {
  // ============= TWILIO V1 API via NoCodeAPI =============

  // POST /api/v1/twilio/call - Initiate call via NoCodeAPI
  app.post("/api/v1/twilio/call", validateApiKey, async (req: Request, res: Response) => {
    try {
      const { to, recordCall = true } = req.body;
      const userId = (req as any).userId;

      if (!to) {
        return res.status(400).json({ error: "Missing 'to' parameter" });
      }

      const callResponse = await axios.post(NOCODE_API_URL, {
        action: "initiate_call",
        to,
        recordCall,
      });

      await storage.createTwilioCall({
        userId,
        callSid: callResponse.data.callSid || `call_${Date.now()}`,
        fromNumber: "+18622770131",
        toNumber: to,
        status: "initiated",
        direction: "outbound",
      });

      await storage.createSystemLog({
        userId,
        eventType: "call_initiated",
        service: "twilio",
        message: `Call initiated to ${to}`,
        status: "success",
        metadata: { callSid: callResponse.data.callSid, to },
      });

      res.json({
        success: true,
        callSid: callResponse.data.callSid,
        to,
        from: "+18622770131",
        recordCall,
        status: "initiated",
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({
        error: error.message || "Failed to initiate call",
        details: error.response?.data,
      });
    }
  });

  // POST /api/v1/twilio/sms - Send SMS via NoCodeAPI
  app.post("/api/v1/twilio/sms", validateApiKey, async (req: Request, res: Response) => {
    try {
      const { to, message } = req.body;
      const userId = (req as any).userId;

      if (!to || !message) {
        return res.status(400).json({ error: "Missing 'to' or 'message'" });
      }

      const smsResponse = await axios.post(NOCODE_API_URL, {
        action: "send_sms",
        to,
        message,
      });

      await storage.createSystemLog({
        userId,
        eventType: "sms_sent",
        service: "twilio",
        message: `SMS sent to ${to}`,
        status: "success",
        metadata: { messageSid: smsResponse.data.sid, to },
      });

      res.json({
        success: true,
        messageSid: smsResponse.data.sid,
        to,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to send SMS" });
    }
  });

  // POST /api/v1/twilio/voice-message - Send voice message via NoCodeAPI
  app.post("/api/v1/twilio/voice-message", validateApiKey, async (req: Request, res: Response) => {
    try {
      const { to, message, voice = "Alice" } = req.body;
      const userId = (req as any).userId;

      if (!to || !message) {
        return res.status(400).json({ error: "Missing 'to' or 'message'" });
      }

      const voiceResponse = await axios.post(NOCODE_API_URL, {
        action: "send_voice_message",
        to,
        message,
        voice,
      });

      await storage.createTwilioCall({
        userId,
        callSid: voiceResponse.data.callSid || `vcall_${Date.now()}`,
        fromNumber: "+18622770131",
        toNumber: to,
        status: "initiated",
        direction: "outbound",
      });

      res.json({
        success: true,
        callSid: voiceResponse.data.callSid,
        to,
        message,
        voice,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to send voice message" });
    }
  });

  // GET /api/v1/twilio/call/:callSid - Get call status via NoCodeAPI
  app.get("/api/v1/twilio/call/:callSid", validateApiKey, async (req: Request, res: Response) => {
    try {
      const { callSid } = req.params;

      const statusResponse = await axios.post(NOCODE_API_URL, {
        action: "get_call_status",
        callSid,
      });

      res.json({
        success: true,
        callSid,
        status: statusResponse.data.status,
        duration: statusResponse.data.duration,
        direction: statusResponse.data.direction,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch call status" });
    }
  });

  // GET /api/v1/twilio/recordings/:callSid - Get call recordings via NoCodeAPI
  app.get("/api/v1/twilio/recordings/:callSid", validateApiKey, async (req: Request, res: Response) => {
    try {
      const { callSid } = req.params;

      const recordingsResponse = await axios.post(NOCODE_API_URL, {
        action: "get_recordings",
        callSid,
      });

      res.json({
        success: true,
        callSid,
        recordings: recordingsResponse.data.recordings || [],
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch recordings" });
    }
  });

  // POST /api/v1/twilio/extension - Create new phone extension via NoCodeAPI
  app.post("/api/v1/twilio/extension", validateApiKey, async (req: Request, res: Response) => {
    try {
      const { areaCode = "201" } = req.body;

      const extensionResponse = await axios.post(NOCODE_API_URL, {
        action: "create_phone_number",
        areaCode,
      });

      res.json({
        success: true,
        phoneNumber: extensionResponse.data.phoneNumber,
        sid: extensionResponse.data.sid,
        areaCode,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to create extension" });
    }
  });

  // ============= WHATSAPP V1 API =============

  // POST /api/v1/whatsapp/send - Send WhatsApp message
  app.post("/api/v1/whatsapp/send", validateApiKey, async (req: Request, res: Response) => {
    try {
      const { to, message } = req.body;
      const userId = (req as any).userId;

      if (!to || !message) {
        return res.status(400).json({ error: "Missing 'to' or 'message'" });
      }

      const whatsappMsg = await storage.createWhatsappMessage({
        userId,
        phoneNumber: process.env.WHATSAPP_PHONE_ID || "358606843717195",
        recipientPhone: to,
        message,
        status: "sent",
        direction: "outbound",
      });

      res.json({
        success: true,
        messageId: whatsappMsg.id,
        to,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to send message" });
    }
  });

  // POST /api/v1/whatsapp/send-bulk - Send bulk WhatsApp messages
  app.post("/api/v1/whatsapp/send-bulk", validateApiKey, async (req: Request, res: Response) => {
    try {
      const { recipients, message } = req.body;
      const userId = (req as any).userId;

      if (!recipients || !Array.isArray(recipients) || !message) {
        return res.status(400).json({ error: "Missing 'recipients' array or 'message'" });
      }

      const results = [];
      for (const to of recipients) {
        const msg = await storage.createWhatsappMessage({
          userId,
          phoneNumber: process.env.WHATSAPP_PHONE_ID || "358606843717195",
          recipientPhone: to,
          message,
          status: "sent",
          direction: "outbound",
        });
        results.push({ to, messageId: msg.id, status: "sent" });
      }

      res.json({
        success: true,
        totalSent: recipients.length,
        results,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Bulk send failed" });
    }
  });

  // ============= CRM V1 API =============

  // POST /api/v1/crm/contacts - Create contact
  app.post("/api/v1/crm/contacts", validateApiKey, async (req: Request, res: Response) => {
    try {
      const { name, email, phone, company, source } = req.body;
      const userId = (req as any).userId;

      if (!name) {
        return res.status(400).json({ error: "Missing 'name'" });
      }

      const contact = await storage.createCrmContact({
        userId,
        name,
        email,
        phone,
        company,
        source: source || "api",
        status: "new",
      });

      res.status(201).json({
        success: true,
        contact,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to create contact" });
    }
  });

  // GET /api/v1/crm/contacts - Get contacts
  app.get("/api/v1/crm/contacts", validateApiKey, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const contacts = await storage.getCrmContactsByUser(userId);

      res.json({
        success: true,
        contacts,
        total: contacts.length,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  // PUT /api/v1/crm/contacts/:id - Update contact
  app.put("/api/v1/crm/contacts/:id", validateApiKey, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const contact = await storage.updateCrmContact(id, req.body);

      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }

      res.json({
        success: true,
        contact,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to update contact" });
    }
  });

  // DELETE /api/v1/crm/contacts/:id - Delete contact
  app.delete("/api/v1/crm/contacts/:id", validateApiKey, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await storage.updateCrmContact(id, { status: "deleted" });

      res.json({
        success: true,
        message: "Contact deleted",
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to delete contact" });
    }
  });
}
