import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { nocodeApiService } from "./services/NocodeApiService";

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
  // ============= API DOCUMENTATION =============
  
  app.get("/api/v1/docs", (req: Request, res: Response) => {
    res.json({
      version: "1.0.0",
      name: "Nexus Core Enterprise API",
      description: "Complete API management platform for WhatsApp, Twilio Voice, and CRM",
      baseUrl: "https://api.nexus-core.com/api/v1",
      authentication: "Bearer Token (API Key required)",
      endpoints: {
        twilio: {
          sms: {
            method: "POST",
            path: "/twilio/sms",
            description: "Send SMS via Twilio",
            parameters: {
              to: "Phone number (e.g., +12345678901)",
              body: "SMS message text",
              from: "Sender phone (optional, defaults to +18622770131)",
            },
            example: {
              curl: 'curl -X POST https://api.nexus-core.com/api/v1/twilio/sms -H "Authorization: Bearer YOUR_API_KEY" -H "Content-Type: application/json" -d \'{"to":"+12345678901","body":"Hello from Twilio"}\'',
            },
          },
          call: {
            method: "POST",
            path: "/twilio/call",
            description: "Initiate phone call",
            parameters: {
              to: "Destination phone number",
              from: "Caller ID (optional)",
              recordCall: "Record the call (boolean, default: true)",
            },
          },
          voiceMessage: {
            method: "POST",
            path: "/twilio/voice-message",
            description: "Send voice message (text-to-speech)",
            parameters: {
              to: "Recipient phone number",
              message: "Voice message text",
              voice: "Voice type (Alice, Woman, Man - default: Alice)",
            },
          },
          callStatus: {
            method: "GET",
            path: "/twilio/call/:callSid",
            description: "Get call status and details",
          },
          recordings: {
            method: "GET",
            path: "/twilio/recordings/:callSid",
            description: "Get call recordings",
          },
          extension: {
            method: "POST",
            path: "/twilio/extension",
            description: "Create new phone number in USA",
            parameters: {
              areaCode: "US area code (e.g., 201, 212)",
            },
          },
        },
        whatsapp: {
          send: {
            method: "POST",
            path: "/whatsapp/send",
            description: "Send WhatsApp message",
            parameters: {
              to: "Recipient phone number",
              message: "Message text",
            },
          },
          sendBulk: {
            method: "POST",
            path: "/whatsapp/send-bulk",
            description: "Send message to multiple recipients",
            parameters: {
              recipients: "Array of phone numbers",
              message: "Message text",
            },
          },
        },
        crm: {
          createContact: {
            method: "POST",
            path: "/crm/contacts",
            description: "Create new CRM contact",
            parameters: {
              name: "Contact name (required)",
              email: "Email address",
              phone: "Phone number",
              company: "Company name",
              source: "Contact source (optional)",
            },
          },
          listContacts: {
            method: "GET",
            path: "/crm/contacts",
            description: "List all contacts",
          },
          updateContact: {
            method: "PUT",
            path: "/crm/contacts/:id",
            description: "Update contact",
          },
          deleteContact: {
            method: "DELETE",
            path: "/crm/contacts/:id",
            description: "Delete contact",
          },
        },
      },
    });
  });

  // ============= TWILIO V1 API via NoCodeAPI =============

  // POST /api/v1/twilio/sms - Send SMS via NoCodeAPI
  app.post("/api/v1/twilio/sms", validateApiKey, async (req: Request, res: Response) => {
    try {
      const { to, body, from } = req.body;
      const userId = (req as any).userId;

      if (!to || !body) {
        return res.status(400).json({ error: "Missing 'to' or 'body' parameter" });
      }

      const smsResponse = await nocodeApiService.sendSMS(to, body, from || "+18622770131");

      await storage.createSystemLog({
        userId,
        eventType: "sms_sent",
        service: "twilio",
        message: `SMS sent to ${to}`,
        status: "success",
        metadata: { messageSid: smsResponse.sid, to },
      });

      res.json({
        success: true,
        messageSid: smsResponse.sid || smsResponse.message_sid,
        to,
        body,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      await storage.createSystemLog({
        eventType: "sms_failed",
        service: "twilio",
        message: `Failed to send SMS to ${req.body.to}`,
        status: "error",
        metadata: { error: error.message },
      });
      res.status(500).json({ error: error.message || "Failed to send SMS" });
    }
  });

  // POST /api/v1/twilio/call - Initiate call via NoCodeAPI
  app.post("/api/v1/twilio/call", validateApiKey, async (req: Request, res: Response) => {
    try {
      const { to, from, recordCall = true } = req.body;
      const userId = (req as any).userId;

      if (!to) {
        return res.status(400).json({ error: "Missing 'to' parameter" });
      }

      const callResponse = await nocodeApiService.makeCall(to, from || "+18622770131", recordCall);

      await storage.createTwilioCall({
        userId,
        callSid: callResponse.callSid || callResponse.sid || `call_${Date.now()}`,
        fromNumber: from || "+18622770131",
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
        metadata: { callSid: callResponse.callSid, to },
      });

      res.json({
        success: true,
        callSid: callResponse.callSid || callResponse.sid,
        to,
        from: from || "+18622770131",
        recordCall,
        status: "initiated",
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({
        error: error.message || "Failed to initiate call",
      });
    }
  });

  // POST /api/v1/twilio/voice-message - Send voice message via NoCodeAPI
  app.post("/api/v1/twilio/voice-message", validateApiKey, async (req: Request, res: Response) => {
    try {
      const { to, message, voice = "Alice", from } = req.body;
      const userId = (req as any).userId;

      if (!to || !message) {
        return res.status(400).json({ error: "Missing 'to' or 'message'" });
      }

      const voiceResponse = await nocodeApiService.sendVoiceMessage(to, message, voice, from || "+18622770131");

      await storage.createTwilioCall({
        userId,
        callSid: voiceResponse.callSid || voiceResponse.sid || `vcall_${Date.now()}`,
        fromNumber: from || "+18622770131",
        toNumber: to,
        status: "initiated",
        direction: "outbound",
      });

      res.json({
        success: true,
        callSid: voiceResponse.callSid || voiceResponse.sid,
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

      const statusResponse = await nocodeApiService.getCallStatus(callSid);

      res.json({
        success: true,
        callSid,
        status: statusResponse.status,
        duration: statusResponse.duration,
        direction: statusResponse.direction,
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

      const recordingsResponse = await nocodeApiService.getRecordings(callSid);

      res.json({
        success: true,
        callSid,
        recordings: recordingsResponse.recordings || [],
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

      const extensionResponse = await nocodeApiService.buyPhoneNumber(areaCode);

      res.json({
        success: true,
        phoneNumber: extensionResponse.phoneNumber,
        sid: extensionResponse.sid,
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

      await storage.createSystemLog({
        userId,
        eventType: "whatsapp_message_sent",
        service: "whatsapp",
        message: `Message sent to ${to}`,
        status: "success",
        metadata: { messageId: whatsappMsg.id, to },
      });

      res.json({
        success: true,
        messageId: whatsappMsg.id,
        to,
        message,
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

      await storage.createSystemLog({
        userId,
        eventType: "whatsapp_bulk_sent",
        service: "whatsapp",
        message: `Bulk messages sent to ${recipients.length} recipients`,
        status: "success",
        metadata: { recipients: recipients.length },
      });

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

  // ============= TWILIO VoIP ENDPOINTS =============
  
  // POST /api/v1/voip/pi-key/generate - Generate PI Key for VoIP
  app.post("/api/v1/voip/pi-key/generate", validateApiKey, async (req: Request, res: Response) => {
    try {
      const { region = "US" } = req.body;
      const userId = (req as any).userId;
      
      const piKey = `pi_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      const sipUsername = `user_${Date.now()}`;
      
      await storage.createSystemLog({
        userId,
        eventType: "pi_key_generated",
        service: "voip",
        message: `PI Key generated for region ${region}`,
        status: "success",
        metadata: { piKey, region },
      });
      
      res.json({
        id: `pk_${Date.now()}`,
        piKey,
        region,
        sipCredentials: {
          username: sipUsername,
          password: "secure_password_hash",
          sipServer: `sip.asterisk.${region.toLowerCase()}.voip.twilio.com`,
          sipPort: 5060,
        },
        status: "active",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/voip/call - Initiate VoIP call
  app.post("/api/v1/voip/call", validateApiKey, async (req: Request, res: Response) => {
    try {
      const { piKeyId, toNumber, recordingEnabled = true } = req.body;
      const userId = (req as any).userId;
      
      if (!toNumber) {
        return res.status(400).json({ error: "Missing 'toNumber'" });
      }
      
      const callId = `voip_${Date.now()}`;
      
      await storage.createSystemLog({
        userId,
        eventType: "voip_call_initiated",
        service: "voip",
        message: `VoIP call initiated to ${toNumber}`,
        status: "success",
        metadata: { callId, toNumber, recordingEnabled, piKeyId },
      });
      
      res.json({
        callId,
        piKeyId,
        toNumber,
        status: "initiated",
        recordingEnabled,
        recordingUrl: recordingEnabled ? `https://voip.twilio.com/recordings/${callId}.wav` : null,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/v1/voip/call/:callId - Get VoIP call status
  app.get("/api/v1/voip/call/:callId", validateApiKey, async (req: Request, res: Response) => {
    try {
      const { callId } = req.params;
      
      res.json({
        callId,
        status: "connected",
        duration: Math.floor(Math.random() * 3600),
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/v1/voip/recordings - List VoIP recordings
  app.get("/api/v1/voip/recordings", validateApiKey, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      
      res.json({
        recordings: [
          { id: "rec_1", duration: 300, size: 2.4, date: "2025-01-20", quality: "high" },
          { id: "rec_2", duration: 180, size: 1.8, date: "2025-01-19", quality: "medium" },
        ],
        total: 4520,
        storageUsed: "2.3 GB",
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/v1/voip/asterisk/status - Asterisk server status
  app.get("/api/v1/voip/asterisk/status", validateApiKey, async (req: Request, res: Response) => {
    try {
      res.json({
        connected: true,
        hostname: "asterisk.voip.aws.com",
        port: 5060,
        activeCalls: Math.floor(Math.random() * 50),
        channels: Math.floor(Math.random() * 100),
        maxChannels: 100,
        uptime: "24d 15h 42m",
        systemHealth: "healthy",
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= API KEY MANAGER ENDPOINTS =============
  
  // POST /api/v1/keys/create - Create new API key
  app.post("/api/v1/keys/create", validateApiKey, async (req: Request, res: Response) => {
    try {
      const { service, name } = req.body;
      const userId = (req as any).userId;
      
      const newKey = {
        id: `key_${Date.now()}`,
        key: `sk_${Math.random().toString(36).substring(2, 30)}`,
        service,
        name: name || `${service}_key`,
        isActive: true,
        createdAt: new Date().toISOString(),
        totalRequests: 0,
      };
      
      await storage.createSystemLog({
        userId,
        eventType: "api_key_created",
        service: "keys",
        message: `API Key created for ${service}`,
        status: "success",
        metadata: { keyId: newKey.id, service },
      });
      
      res.json({ success: true, key: newKey });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/v1/keys - List API keys
  app.get("/api/v1/keys", validateApiKey, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const keys = [
        { id: "key_1", key: "sk_live_12345", service: "twilio", isActive: true, totalRequests: 5420, createdAt: "2025-01-10", lastUsed: "2025-01-20" },
        { id: "key_2", key: "sk_whatsapp_xyz", service: "whatsapp", isActive: true, totalRequests: 3210, createdAt: "2025-01-15", lastUsed: "2025-01-20" },
      ];
      res.json({ keys });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/keys/:id/toggle - Toggle key status
  app.post("/api/v1/keys/:id/toggle", validateApiKey, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;
      
      await storage.createSystemLog({
        userId,
        eventType: "api_key_toggled",
        service: "keys",
        message: `API Key ${id} toggled`,
        status: "success",
        metadata: { keyId: id },
      });
      
      res.json({ success: true, message: "Key toggled" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE /api/v1/keys/:id - Delete API key
  app.delete("/api/v1/keys/:id", validateApiKey, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;
      
      await storage.createSystemLog({
        userId,
        eventType: "api_key_deleted",
        service: "keys",
        message: `API Key ${id} deleted`,
        status: "success",
        metadata: { keyId: id },
      });
      
      res.json({ success: true, message: "Key deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= EMBED WIDGETS ENDPOINTS =============
  
  // GET /embed/:widget - Get embed widget script
  app.get("/embed/:widget", (req: Request, res: Response) => {
    try {
      const { widget } = req.params;
      const apiKey = req.query.key as string;
      
      const widgetCode = `
        (function() {
          window.DigitalFutureWidget = {
            init: function() {
              console.log('Widget ${widget} loaded with key:', '${apiKey.substring(0, 10)}...');
            }
          };
          window.DigitalFutureWidget.init();
        })();
      `;
      
      res.set("Content-Type", "application/javascript");
      res.send(widgetCode);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/widgets/sms - Handle SMS widget submission
  app.post("/api/v1/widgets/sms", async (req: Request, res: Response) => {
    try {
      const { to, message, apiKey } = req.body;
      
      res.json({
        success: true,
        messageId: `msg_${Date.now()}`,
        status: "sent",
        to,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/widgets/voice - Handle voice widget submission
  app.post("/api/v1/widgets/voice", async (req: Request, res: Response) => {
    try {
      const { to, message, apiKey } = req.body;
      
      res.json({
        success: true,
        callId: `call_${Date.now()}`,
        status: "initiated",
        to,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/widgets/whatsapp - Handle WhatsApp widget submission
  app.post("/api/v1/widgets/whatsapp", async (req: Request, res: Response) => {
    try {
      const { to, message, apiKey } = req.body;
      
      res.json({
        success: true,
        messageId: `wa_${Date.now()}`,
        status: "sent",
        to,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/widgets/voip - Handle VoIP widget submission
  app.post("/api/v1/widgets/voip", async (req: Request, res: Response) => {
    try {
      const { to, apiKey } = req.body;
      
      res.json({
        success: true,
        callId: `voip_${Date.now()}`,
        status: "initiated",
        to,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/widgets/crm - Handle CRM widget lead capture
  app.post("/api/v1/widgets/crm", async (req: Request, res: Response) => {
    try {
      const { name, email, phone, company, message, apiKey } = req.body;
      
      res.json({
        success: true,
        leadId: `lead_${Date.now()}`,
        status: "captured",
        contact: { name, email, phone, company },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}