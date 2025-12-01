import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { createTwilioService } from "./services/TwilioService";
import { createWhatsAppService } from "./services/WhatsAppService";

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
  // ============= WHATSAPP V1 API =============

  // POST /api/v1/whatsapp/send - Send WhatsApp message
  app.post(
    "/api/v1/whatsapp/send",
    validateApiKey,
    async (req: Request, res: Response) => {
      try {
        const { to, message, mediaUrl } = req.body;
        const userId = (req as any).userId;

        if (!to || !message) {
          return res.status(400).json({ error: "Missing 'to' or 'message'" });
        }

        const whatsappService = createWhatsAppService();
        if (!whatsappService) {
          return res.status(500).json({ error: "WhatsApp service not configured" });
        }

        let result;
        if (mediaUrl) {
          result = await whatsappService.sendImage(to, mediaUrl, message, userId);
        } else {
          result = await whatsappService.sendMessage(to, message, userId);
        }

        res.json({
          success: true,
          messageId: result.messages[0].id,
          to,
          timestamp: new Date().toISOString(),
        });
      } catch (error: any) {
        res.status(500).json({
          error: error.message || "Failed to send message",
          details: error.response?.data,
        });
      }
    }
  );

  // POST /api/v1/whatsapp/send-bulk - Send bulk WhatsApp messages
  app.post(
    "/api/v1/whatsapp/send-bulk",
    validateApiKey,
    async (req: Request, res: Response) => {
      try {
        const { recipients, message } = req.body;
        const userId = (req as any).userId;

        if (!recipients || !Array.isArray(recipients) || !message) {
          return res
            .status(400)
            .json({ error: "Missing 'recipients' array or 'message'" });
        }

        const whatsappService = createWhatsAppService();
        if (!whatsappService) {
          return res.status(500).json({ error: "WhatsApp service not configured" });
        }

        const results = await whatsappService.sendBulkMessages(
          recipients,
          message,
          userId
        );

        res.json({
          success: true,
          totalSent: recipients.length,
          results,
          timestamp: new Date().toISOString(),
        });
      } catch (error: any) {
        res.status(500).json({ error: error.message || "Bulk send failed" });
      }
    }
  );

  // GET /api/v1/whatsapp/status/:messageId - Get message status
  app.get(
    "/api/v1/whatsapp/status/:messageId",
    validateApiKey,
    async (req: Request, res: Response) => {
      try {
        const { messageId } = req.params;
        const whatsappService = createWhatsAppService();

        if (!whatsappService) {
          return res.status(500).json({ error: "WhatsApp service not configured" });
        }

        const status = await whatsappService.getMessageStatus(messageId);
        res.json(status);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // ============= TWILIO V1 API =============

  // POST /api/v1/twilio/call - Initiate call
  app.post(
    "/api/v1/twilio/call",
    validateApiKey,
    async (req: Request, res: Response) => {
      try {
        const { to, recordCall = true } = req.body;
        const userId = (req as any).userId;

        if (!to) {
          return res.status(400).json({ error: "Missing 'to' parameter" });
        }

        const twilioService = createTwilioService();
        if (!twilioService) {
          return res.status(500).json({ error: "Twilio service not configured" });
        }

        const call = await twilioService.initiateCall(to, userId, recordCall);

        res.json({
          success: true,
          callSid: call.sid,
          to,
          from: call.from,
          recordCall,
          status: "initiated",
          timestamp: new Date().toISOString(),
        });
      } catch (error: any) {
        res.status(500).json({
          error: error.message || "Failed to initiate call",
        });
      }
    }
  );

  // POST /api/v1/twilio/sms - Send SMS
  app.post(
    "/api/v1/twilio/sms",
    validateApiKey,
    async (req: Request, res: Response) => {
      try {
        const { to, message } = req.body;
        const userId = (req as any).userId;

        if (!to || !message) {
          return res.status(400).json({ error: "Missing 'to' or 'message'" });
        }

        const twilioService = createTwilioService();
        if (!twilioService) {
          return res.status(500).json({ error: "Twilio service not configured" });
        }

        const sms = await twilioService.sendSMS(to, message, userId);

        res.json({
          success: true,
          messageSid: sms.sid,
          to,
          timestamp: new Date().toISOString(),
        });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // POST /api/v1/twilio/voice-message - Send voice message
  app.post(
    "/api/v1/twilio/voice-message",
    validateApiKey,
    async (req: Request, res: Response) => {
      try {
        const { to, message, voice = "Alice" } = req.body;
        const userId = (req as any).userId;

        if (!to || !message) {
          return res.status(400).json({ error: "Missing 'to' or 'message'" });
        }

        const twilioService = createTwilioService();
        if (!twilioService) {
          return res.status(500).json({ error: "Twilio service not configured" });
        }

        const call = await twilioService.sendVoiceMessage(to, message, userId, voice);

        res.json({
          success: true,
          callSid: call.sid,
          to,
          message,
          voice,
          timestamp: new Date().toISOString(),
        });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // GET /api/v1/twilio/call/:callSid - Get call status
  app.get(
    "/api/v1/twilio/call/:callSid",
    validateApiKey,
    async (req: Request, res: Response) => {
      try {
        const { callSid } = req.params;
        const twilioService = createTwilioService();

        if (!twilioService) {
          return res.status(500).json({ error: "Twilio service not configured" });
        }

        const call = await twilioService.getCallStatus(callSid);
        res.json({
          callSid: call.sid,
          status: call.status,
          duration: call.duration,
          direction: call.direction,
          timestamp: new Date().toISOString(),
        });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // GET /api/v1/twilio/recordings/:callSid - Get call recordings
  app.get(
    "/api/v1/twilio/recordings/:callSid",
    validateApiKey,
    async (req: Request, res: Response) => {
      try {
        const { callSid } = req.params;
        const twilioService = createTwilioService();

        if (!twilioService) {
          return res.status(500).json({ error: "Twilio service not configured" });
        }

        const recordings = await twilioService.getCallRecordings(callSid);
        res.json({
          callSid,
          recordings: recordings.map((r) => ({
            sid: r.sid,
            duration: r.duration,
            dateCreated: r.dateCreated,
          })),
        });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // POST /api/v1/twilio/extension - Create new extension
  app.post(
    "/api/v1/twilio/extension",
    validateApiKey,
    async (req: Request, res: Response) => {
      try {
        const { areaCode = "201" } = req.body;
        const twilioService = createTwilioService();

        if (!twilioService) {
          return res.status(500).json({ error: "Twilio service not configured" });
        }

        const phoneNumber = await twilioService.createPhoneNumber(areaCode);

        res.json({
          success: true,
          phoneNumber: phoneNumber.phoneNumber,
          sid: phoneNumber.sid,
          areaCode,
          timestamp: new Date().toISOString(),
        });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // ============= CRM V1 API =============

  // POST /api/v1/crm/contacts - Create contact
  app.post(
    "/api/v1/crm/contacts",
    validateApiKey,
    async (req: Request, res: Response) => {
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
        res.status(500).json({ error: error.message });
      }
    }
  );

  // GET /api/v1/crm/contacts - Get contacts
  app.get(
    "/api/v1/crm/contacts",
    validateApiKey,
    async (req: Request, res: Response) => {
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
    }
  );

  // PUT /api/v1/crm/contacts/:id - Update contact
  app.put(
    "/api/v1/crm/contacts/:id",
    validateApiKey,
    async (req: Request, res: Response) => {
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
        res.status(500).json({ error: error.message });
      }
    }
  );
}
