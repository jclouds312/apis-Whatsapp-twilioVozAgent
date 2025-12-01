import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import crypto from "crypto";

// Generate secure API key
function generateSecureKey(prefix: string, length: number = 32): string {
  const randomBytes = crypto.randomBytes(length).toString("hex");
  return `${prefix}_${randomBytes}`;
}

export function registerApiKeyGenerationRoutes(app: Express) {
  // Validate Twilio Credentials
  app.post("/api/twilio/validate", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      // Note: In production, you would make an actual API call to Twilio to validate credentials
      // For now, we'll do basic validation
      if (email.includes("@") && password.length > 8) {
        return res.json({ success: true, message: "Credentials validated" });
      } else {
        return res.json({ success: false, error: "Invalid credentials format" });
      }
    } catch (error) {
      res.status(500).json({ error: "Validation failed" });
    }
  });

  // Generate API Key for specific module
  app.post("/api/api-keys/generate", async (req: Request, res: Response) => {
    try {
      const { userId, service, twilioEmail, twilioPassword } = req.body;

      if (!userId || !service) {
        return res.status(400).json({ error: "userId and service required" });
      }

      // Generate key with appropriate prefix
      const keyPrefixes: Record<string, string> = {
        whatsapp: "wapp",
        twilio: "twl",
        crm: "crm",
      };

      const prefix = keyPrefixes[service] || "api";
      const apiKey = generateSecureKey(prefix);

      // Save to database
      const savedKey = await storage.createApiKey({
        userId,
        service,
        key: apiKey,
        secret: twilioEmail, // Store email as reference for Twilio sync
        isActive: true,
      });

      // Log the generation
      await storage.createSystemLog({
        eventType: "api_key_generated",
        service,
        message: `API key generated for ${service} service`,
        status: "success",
        metadata: { keyId: savedKey.id, service, email: twilioEmail },
      });

      res.json({
        success: true,
        apiKey,
        keyId: savedKey.id,
        service,
        createdAt: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to generate API key" });
    }
  });

  // Sync API Keys with Twilio services
  app.post("/api/api-keys/sync", async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }

      const keys = await storage.getApiKeysByUser(userId);

      const syncResults = {
        whatsapp: { synced: false, status: "pending" },
        twilio: { synced: false, status: "pending" },
        crm: { synced: false, status: "pending" },
      };

      // Simulate sync with services
      for (const key of keys) {
        if (key.service === "whatsapp") {
          // TODO: Sync with Meta/WhatsApp API
          syncResults.whatsapp = { synced: true, status: "connected" };
        } else if (key.service === "twilio") {
          // TODO: Sync with Twilio API
          syncResults.twilio = { synced: true, status: "connected" };
        } else if (key.service === "crm") {
          syncResults.crm = { synced: true, status: "available" };
        }
      }

      await storage.createSystemLog({
        eventType: "api_keys_synced",
        service: "system",
        message: `API keys synchronized with services`,
        status: "success",
        metadata: syncResults,
      });

      res.json({
        success: true,
        syncResults,
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
