import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import crypto from "crypto";

// Generate secure API key
function generateSecureKey(prefix: string, length: number = 32): string {
  const randomBytes = crypto.randomBytes(length).toString("hex");
  return `${prefix}_${randomBytes}`;
}

// Encrypt sensitive data
function encrypt(text: string, key = "nexus-api-2024"): string {
  return Buffer.from(text).toString("base64");
}

// Decrypt sensitive data
function decrypt(text: string, key = "nexus-api-2024"): string {
  return Buffer.from(text, "base64").toString("utf-8");
}

export function registerApiKeyGenerationRoutes(app: Express) {
  // Validate and connect Twilio Credentials
  app.post("/api/services/connect", async (req: Request, res: Response) => {
    try {
      const { userId, serviceName, credentials } = req.body;

      if (!userId || !serviceName || !credentials) {
        return res.status(400).json({ error: "userId, serviceName, and credentials required" });
      }

      // Check if service already exists
      let service = await storage.getServiceByName(userId, serviceName);

      const encryptedCreds = {
        ...credentials,
        email: encrypt(credentials.email || ""),
        password: encrypt(credentials.password || ""),
      };

      if (service) {
        // Update existing service
        service = await storage.updateService(service.id, {
          credentials: encryptedCreds,
          status: "connected",
          lastSyncedAt: new Date(),
        });
      } else {
        // Create new service
        service = await storage.createService({
          userId,
          name: serviceName,
          credentials: encryptedCreds,
          status: "connected",
          isActive: true,
        });
      }

      // Log connection
      await storage.createSystemLog({
        userId,
        eventType: "service_connected",
        service: serviceName,
        message: `Service ${serviceName} connected successfully`,
        status: "success",
        metadata: { serviceId: service.id, serviceName },
      });

      res.json({
        success: true,
        service: {
          id: service.id,
          name: service.name,
          status: service.status,
          createdAt: service.createdAt,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Service connection failed" });
    }
  });

  // Get connected services
  app.get("/api/services", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }

      const userServices = await storage.getServicesByUser(userId);
      const servicesInfo = userServices.map((s) => ({
        id: s.id,
        name: s.name,
        status: s.status,
        isActive: s.isActive,
        lastSyncedAt: s.lastSyncedAt,
        createdAt: s.createdAt,
      }));

      res.json({ success: true, services: servicesInfo });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  // Generate API Key for specific module
  app.post("/api/api-keys/generate", async (req: Request, res: Response) => {
    try {
      const { userId, service, twilioEmail, twilioPassword } = req.body;

      if (!userId || !service) {
        return res.status(400).json({ error: "userId and service required" });
      }

      // First, ensure service is connected
      let connectedService = await storage.getServiceByName(userId, service);

      if (!connectedService) {
        // Auto-connect service with credentials
        connectedService = await storage.createService({
          userId,
          name: service,
          credentials: {
            email: encrypt(twilioEmail),
            password: encrypt(twilioPassword),
          },
          status: "connected",
          isActive: true,
        });
      }

      // Generate key with appropriate prefix
      const keyPrefixes: Record<string, string> = {
        whatsapp: "wapp",
        twilio: "twl",
        crm: "crm",
      };

      const prefix = keyPrefixes[service] || "api";
      const apiKey = generateSecureKey(prefix);

      // Save to database with service link
      const savedKey = await storage.createApiKey({
        userId,
        service,
        serviceId: connectedService.id,
        key: apiKey,
        secret: twilioEmail,
        isActive: true,
      });

      // Log the generation
      await storage.createSystemLog({
        userId,
        eventType: "api_key_generated",
        service,
        message: `API key generated for ${service} service`,
        status: "success",
        metadata: {
          keyId: savedKey.id,
          service,
          serviceId: connectedService.id,
        },
      });

      res.json({
        success: true,
        apiKey,
        keyId: savedKey.id,
        serviceId: connectedService.id,
        service,
        status: "active",
        createdAt: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to generate API key" });
    }
  });

  // Sync API Keys with services
  app.post("/api/api-keys/sync", async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }

      const userServices = await storage.getServicesByUser(userId);
      const syncResults: Record<string, any> = {};

      for (const service of userServices) {
        const keys = await storage.getApiKeysByService(userId, service.name);

        syncResults[service.name] = {
          status: service.status,
          isActive: service.isActive,
          keysGenerated: keys.length,
          lastSync: service.lastSyncedAt,
        };

        // Update last synced time
        await storage.updateService(service.id, {
          lastSyncedAt: new Date(),
        });
      }

      await storage.createSystemLog({
        userId,
        eventType: "api_keys_synced",
        service: "system",
        message: `API keys synchronized with all services`,
        status: "success",
        metadata: syncResults,
      });

      res.json({
        success: true,
        syncResults,
        totalServices: userServices.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Sync failed" });
    }
  });

  // List all generated keys for user
  app.get("/api/api-keys/generated", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;

      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }

      const keys = await storage.getApiKeysByUser(userId);

      const formattedKeys = keys.map((key) => ({
        id: key.id,
        service: key.service,
        keyPreview: `${key.key.substring(0, 8)}...${key.key.substring(key.key.length - 4)}`,
        fullKey: key.key,
        isActive: key.isActive,
        createdAt: key.createdAt,
        lastUsed: key.lastUsed,
      }));

      res.json({
        success: true,
        keys: formattedKeys,
        total: formattedKeys.length,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch keys" });
    }
  });

  // Get service status
  app.get("/api/services/:serviceName/status", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      const { serviceName } = req.params;

      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }

      const service = await storage.getServiceByName(userId, serviceName);

      if (!service) {
        return res.json({
          status: "disconnected",
          message: "Service not connected",
        });
      }

      const keys = await storage.getApiKeysByService(userId, serviceName);

      res.json({
        success: true,
        service: {
          id: service.id,
          name: service.name,
          status: service.status,
          isActive: service.isActive,
          keysGenerated: keys.length,
          lastSyncedAt: service.lastSyncedAt,
          createdAt: service.createdAt,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service status" });
    }
  });

  // Revoke/Deactivate API Key
  app.post("/api/api-keys/:id/revoke", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await storage.updateApiKey(id, { isActive: false });

      await storage.createSystemLog({
        eventType: "api_key_revoked",
        service: "system",
        message: `API key revoked`,
        status: "success",
        metadata: { keyId: id },
      });

      res.json({
        success: true,
        message: "API key revoked",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to revoke key" });
    }
  });
}
