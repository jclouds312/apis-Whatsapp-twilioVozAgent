import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import crypto from "crypto";

export function registerApiKeyRoutes(app: Express) {
  // GET /api/v1/keys - Get all API keys for user
  app.get("/api/v1/keys", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) return res.status(400).json({ error: "Missing userId" });

      const keys = await storage.getApiKeysByUser(userId);
      res.json({ success: true, keys });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/keys/create - Create new API key
  app.post("/api/v1/keys/create", async (req: Request, res: Response) => {
    try {
      const { userId, service, name } = req.body;

      // Generate secure random key
      const key = crypto.randomBytes(32).toString("hex");
      const secret = crypto.randomBytes(32).toString("hex");

      const newKey = await storage.createApiKey({
        userId,
        service,
        key,
        secret,
        isActive: true,
        metadata: { name, createdBy: "api_key_manager", plan: "professional" },
      });

      await storage.createSystemLog({
        userId,
        eventType: "api_key_created",
        service: "system",
        message: `New API key created for ${service}`,
        status: "success",
        metadata: { keyId: newKey.id, service },
      });

      res.json({
        success: true,
        key: newKey,
        message: "API key created successfully",
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/keys/:id/toggle - Toggle API key active status
  app.post("/api/v1/keys/:id/toggle", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const key = await storage.getApiKey(id);
      if (!key) return res.status(404).json({ error: "Key not found" });

      const updated = await storage.updateApiKey(id, {
        isActive: !key.isActive,
      });

      await storage.createSystemLog({
        userId: key.userId,
        eventType: "api_key_toggled",
        service: "system",
        message: `API key ${updated?.isActive ? "activated" : "deactivated"}`,
        status: "success",
        metadata: { keyId: id },
      });

      res.json({ success: true, key: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE /api/v1/keys/:id - Delete API key
  app.delete("/api/v1/keys/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const key = await storage.getApiKey(id);
      if (!key) return res.status(404).json({ error: "Key not found" });

      await storage.deleteApiKey(id);

      await storage.createSystemLog({
        userId: key.userId,
        eventType: "api_key_deleted",
        service: "system",
        message: "API key deleted",
        status: "success",
        metadata: { keyId: id },
      });

      res.json({ success: true, message: "Key deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/v1/keys/:id/stats - Get key usage statistics
  app.get("/api/v1/keys/:id/stats", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const key = await storage.getApiKey(id);
      if (!key) return res.status(404).json({ error: "Key not found" });

      res.json({
        success: true,
        stats: {
          keyId: id,
          totalRequests: key.metadata?.totalRequests || 0,
          lastUsed: key.lastUsed,
          createdAt: key.createdAt,
          isActive: key.isActive,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/keys/:id/increment-usage - Increment usage count
  app.post("/api/v1/keys/:id/increment-usage", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const key = await storage.getApiKey(id);
      if (!key) return res.status(404).json({ error: "Key not found" });

      const currentMeta = key.metadata as Record<string, any> || {};
      const totalRequests = (parseInt((currentMeta.totalRequests as string) || "0") + 1).toString();
      const updated = await storage.updateApiKey(id, {
        lastUsed: new Date(),
        metadata: { ...currentMeta, totalRequests },
      });

      res.json({ success: true, updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/keys/voip/generate - Generate VoIP-specific API key
  app.post("/api/v1/keys/voip/generate", async (req: Request, res: Response) => {
    try {
      const { userId, name, permissions = ["call", "sip", "recording"] } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "Missing userId" });
      }

      const crypto = await import("crypto");
      const key = crypto.randomBytes(32).toString("hex");
      const secret = crypto.randomBytes(32).toString("hex");

      const newKey = await storage.createApiKey({
        userId,
        service: "voip",
        key,
        secret,
        isActive: true,
        metadata: {
          name: name || "VoIP API Key",
          createdBy: "voip_key_manager",
          plan: "professional",
          permissions,
          opensips_enabled: true,
          twilio_integration: true,
        },
      });

      await storage.createSystemLog({
        userId,
        eventType: "voip_api_key_created",
        service: "voip",
        message: `VoIP API key created: ${name || "Unnamed"}`,
        status: "success",
        metadata: { keyId: newKey.id, permissions },
      });

      res.json({
        success: true,
        key: newKey,
        message: "VoIP API key created successfully",
        usage: {
          example: `curl -H "Authorization: Bearer ${key}" https://your-domain.com/api/v1/opensips/status`,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
