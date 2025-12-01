import type { Express, Request, Response } from "express";
import { MetaWhatsAppService } from "./services/MetaWhatsAppService";
import { storage } from "./storage";

export function registerMetaWhatsAppRoutes(app: Express) {
  // Get WABA info
  app.get("/api/v1/meta-whatsapp/waba/:wabaId", async (req: Request, res: Response) => {
    try {
      const { wabaId } = req.params;
      const token = process.env.META_WHATSAPP_TOKEN;

      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const wabaInfo = await service.getWABAInfo(wabaId);

      res.json({ success: true, data: wabaInfo });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get message templates
  app.get("/api/v1/meta-whatsapp/templates/:wabaId", async (req: Request, res: Response) => {
    try {
      const { wabaId } = req.params;
      const token = process.env.META_WHATSAPP_TOKEN;

      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const templates = await service.getMessageTemplates(wabaId);

      res.json({ success: true, templates });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get phone numbers
  app.get("/api/v1/meta-whatsapp/phone-numbers/:wabaId", async (req: Request, res: Response) => {
    try {
      const { wabaId } = req.params;
      const token = process.env.META_WHATSAPP_TOKEN;

      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const phoneNumbers = await service.getPhoneNumbers(wabaId);

      res.json({ success: true, phoneNumbers });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Send template message
  app.post("/api/v1/meta-whatsapp/send-template", async (req: Request, res: Response) => {
    try {
      const { phoneNumberId, recipientPhone, templateName, language, parameters, userId } =
        req.body;

      const token = process.env.META_WHATSAPP_TOKEN;
      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const result = await service.sendTemplateMessage(
        phoneNumberId,
        recipientPhone,
        templateName,
        language || "es",
        parameters || []
      );

      // Log to database
      if (userId) {
        await storage.createWhatsappMessage({
          userId,
          phoneNumber: phoneNumberId,
          recipientPhone,
          message: `Template: ${templateName}`,
          status: "sent",
          externalId: result.messages?.[0]?.id,
        });

        await storage.createSystemLog({
          userId,
          eventType: "whatsapp_template_sent",
          service: "whatsapp",
          message: `Template message sent to ${recipientPhone}`,
          status: "success",
          metadata: { templateName, phoneNumberId },
        });
      }

      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Send text message
  app.post("/api/v1/meta-whatsapp/send-text", async (req: Request, res: Response) => {
    try {
      const { phoneNumberId, recipientPhone, message, userId } = req.body;

      const token = process.env.META_WHATSAPP_TOKEN;
      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const result = await service.sendTextMessage(phoneNumberId, recipientPhone, message);

      // Log to database
      if (userId) {
        await storage.createWhatsappMessage({
          userId,
          phoneNumber: phoneNumberId,
          recipientPhone,
          message,
          status: "sent",
          externalId: result.messages?.[0]?.id,
        });

        await storage.createSystemLog({
          userId,
          eventType: "whatsapp_text_sent",
          service: "whatsapp",
          message: `Text message sent to ${recipientPhone}`,
          status: "success",
          metadata: { phoneNumberId },
        });
      }

      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create message template
  app.post("/api/v1/meta-whatsapp/create-template", async (req: Request, res: Response) => {
    try {
      const { wabaId, templateData, userId } = req.body;

      const token = process.env.META_WHATSAPP_TOKEN;
      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const result = await service.createMessageTemplate(wabaId, templateData);

      if (userId) {
        await storage.createSystemLog({
          userId,
          eventType: "whatsapp_template_created",
          service: "whatsapp",
          message: `New template created: ${templateData.name}`,
          status: "success",
          metadata: { templateName: templateData.name, language: templateData.language },
        });
      }

      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
