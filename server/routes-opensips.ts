
import type { Express, Request, Response } from "express";
import { openSIPSService } from "./services/OpenSIPSService";
import { storage } from "./storage";

export function registerOpenSIPSRoutes(app: Express) {
  // POST /api/v1/opensips/start - Start OpenSIPS server
  app.post("/api/v1/opensips/start", async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers.authorization?.replace("Bearer ", "");
      if (!apiKey) return res.status(401).json({ error: "API key required" });

      const started = await openSIPSService.startServer();
      
      if (started) {
        res.json({ 
          success: true, 
          message: "OpenSIPS server started",
          status: "running" 
        });
      } else {
        res.status(500).json({ error: "Failed to start OpenSIPS server" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/opensips/stop - Stop OpenSIPS server
  app.post("/api/v1/opensips/stop", async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers.authorization?.replace("Bearer ", "");
      if (!apiKey) return res.status(401).json({ error: "API key required" });

      const stopped = await openSIPSService.stopServer();
      
      res.json({ 
        success: true, 
        message: "OpenSIPS server stopped",
        status: "stopped" 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/v1/opensips/status - Get OpenSIPS server status
  app.get("/api/v1/opensips/status", async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers.authorization?.replace("Bearer ", "");
      if (!apiKey) return res.status(401).json({ error: "API key required" });

      const status = await openSIPSService.getServerStatus();
      res.json(status);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/opensips/register-user - Register SIP user
  app.post("/api/v1/opensips/register-user", async (req: Request, res: Response) => {
    try {
      const { username, password, domain } = req.body;
      const apiKey = req.headers.authorization?.replace("Bearer ", "");

      if (!apiKey) return res.status(401).json({ error: "API key required" });
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const user = await openSIPSService.registerUser(username, password, domain);
      res.json({ success: true, user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/v1/opensips/calls - Get active calls
  app.get("/api/v1/opensips/calls", async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers.authorization?.replace("Bearer ", "");
      if (!apiKey) return res.status(401).json({ error: "API key required" });

      const calls = await openSIPSService.getActiveCalls();
      res.json({ calls, count: calls.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/opensips/generate-credentials - Generate SIP credentials
  app.post("/api/v1/opensips/generate-credentials", async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      const apiKey = req.headers.authorization?.replace("Bearer ", "");

      if (!apiKey) return res.status(401).json({ error: "API key required" });
      if (!userId) return res.status(400).json({ error: "User ID required" });

      const credentials = openSIPSService.generateSIPCredentials(userId);
      
      await storage.createSystemLog({
        userId,
        eventType: "sip_credentials_generated",
        service: "opensips",
        message: `SIP credentials generated for user ${userId}`,
        status: "success",
        metadata: { username: credentials.username },
      });

      res.json({ success: true, credentials });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
