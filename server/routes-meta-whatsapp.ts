import type { Express, Request, Response } from "express";
import { MetaWhatsAppService } from "./services/MetaWhatsAppService";
import { storage } from "./storage";

export function registerMetaWhatsAppRoutes(app: Express) {
  const getToken = () => process.env.META_WHATSAPP_TOKEN;
  const getWABAId = () => process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;

  // ============= WABA OPERATIONS =============
  app.get("/api/v1/meta-whatsapp/waba/:wabaId", async (req: Request, res: Response) => {
    try {
      const { wabaId } = req.params;
      const token = getToken();
      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const wabaInfo = await service.getWABAInfo(wabaId);
      res.json({ success: true, data: wabaInfo });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= ASSIGNED USERS =============
  app.get("/api/v1/meta-whatsapp/assigned-users/:wabaId", async (req: Request, res: Response) => {
    try {
      const { wabaId } = req.params;
      const token = getToken();
      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const users = await service.getAssignedUsers(wabaId);
      res.json({ success: true, users });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/v1/meta-whatsapp/assigned-users/:wabaId", async (req: Request, res: Response) => {
    try {
      const { wabaId } = req.params;
      const { userId, role } = req.body;
      const token = getToken();
      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const result = await service.assignUser(wabaId, userId, role || "ADMIN");
      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/v1/meta-whatsapp/assigned-users/:wabaId/:userId", async (req: Request, res: Response) => {
    try {
      const { wabaId, userId } = req.params;
      const token = getToken();
      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const result = await service.removeAssignedUser(wabaId, userId);
      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= PHONE NUMBERS =============
  app.get("/api/v1/meta-whatsapp/phone-numbers/:wabaId", async (req: Request, res: Response) => {
    try {
      const { wabaId } = req.params;
      const token = getToken();
      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const phoneNumbers = await service.getPhoneNumbers(wabaId);
      res.json({ success: true, phoneNumbers });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= MESSAGE TEMPLATES =============
  app.get("/api/v1/meta-whatsapp/templates/:wabaId", async (req: Request, res: Response) => {
    try {
      const { wabaId } = req.params;
      const token = getToken();
      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const templates = await service.getMessageTemplates(wabaId);
      res.json({ success: true, templates });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/v1/meta-whatsapp/templates/:wabaId", async (req: Request, res: Response) => {
    try {
      const { wabaId } = req.params;
      const { templateData, userId } = req.body;
      const token = getToken();
      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const result = await service.createMessageTemplate(wabaId, templateData);

      if (userId) {
        await storage.createSystemLog({
          userId,
          eventType: "whatsapp_template_created",
          service: "whatsapp",
          message: `Template created: ${templateData.name}`,
          status: "success",
          metadata: { templateName: templateData.name },
        });
      }

      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/v1/meta-whatsapp/templates/:wabaId/:templateName", async (req: Request, res: Response) => {
    try {
      const { wabaId, templateName } = req.params;
      const token = getToken();
      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const result = await service.deleteMessageTemplate(wabaId, templateName);
      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= SUBSCRIBED APPS =============
  app.get("/api/v1/meta-whatsapp/subscribed-apps/:wabaId", async (req: Request, res: Response) => {
    try {
      const { wabaId } = req.params;
      const token = getToken();
      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const apps = await service.getSubscribedApps(wabaId);
      res.json({ success: true, apps });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/v1/meta-whatsapp/subscribed-apps/:wabaId", async (req: Request, res: Response) => {
    try {
      const { wabaId } = req.params;
      const { appId } = req.body;
      const token = getToken();
      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const result = await service.subscribeApp(wabaId, appId);
      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/v1/meta-whatsapp/subscribed-apps/:wabaId/:appId", async (req: Request, res: Response) => {
    try {
      const { wabaId, appId } = req.params;
      const token = getToken();
      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const result = await service.unsubscribeApp(wabaId, appId);
      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= EXTENDED CREDITS =============
  app.get("/api/v1/meta-whatsapp/extended-credits/:businessId", async (req: Request, res: Response) => {
    try {
      const { businessId } = req.params;
      const token = getToken();
      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const credits = await service.getExtendedCredits(businessId);
      res.json({ success: true, credits });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/v1/meta-whatsapp/credit-sharing/:extendedCreditId", async (req: Request, res: Response) => {
    try {
      const { extendedCreditId } = req.params;
      const { creditData } = req.body;
      const token = getToken();
      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const result = await service.shareWhatsAppCredit(extendedCreditId, creditData);
      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/v1/meta-whatsapp/allocation-config/:allocationConfigId", async (req: Request, res: Response) => {
    try {
      const { allocationConfigId } = req.params;
      const token = getToken();
      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const config = await service.getAllocationConfig(allocationConfigId);
      res.json({ success: true, config });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/v1/meta-whatsapp/allocation-config/:allocationConfigId", async (req: Request, res: Response) => {
    try {
      const { allocationConfigId } = req.params;
      const token = getToken();
      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const result = await service.deleteAllocationConfig(allocationConfigId);
      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/v1/meta-whatsapp/credit-allocation-configs/:extendedCreditId", async (req: Request, res: Response) => {
    try {
      const { extendedCreditId } = req.params;
      const token = getToken();
      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const configs = await service.getOwningCreditAllocationConfigs(extendedCreditId);
      res.json({ success: true, configs });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= MESSAGING =============
  app.post("/api/v1/meta-whatsapp/send-template", async (req: Request, res: Response) => {
    try {
      const { phoneNumberId, recipientPhone, templateName, language, parameters, userId } = req.body;
      const token = getToken();
      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const result = await service.sendTemplateMessage(
        phoneNumberId,
        recipientPhone,
        templateName,
        language || "es",
        parameters || []
      );

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
          message: `Template sent to ${recipientPhone}`,
          status: "success",
          metadata: { templateName },
        });
      }

      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/v1/meta-whatsapp/send-text", async (req: Request, res: Response) => {
    try {
      const { phoneNumberId, recipientPhone, message, userId } = req.body;
      const token = getToken();
      if (!token) return res.status(500).json({ error: "WhatsApp token not configured" });

      const service = new MetaWhatsAppService(token);
      const result = await service.sendTextMessage(phoneNumberId, recipientPhone, message);

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
          message: `Text sent to ${recipientPhone}`,
          status: "success",
          metadata: { phoneNumberId },
        });
      }

      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
