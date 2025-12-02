
import type { Express, Request, Response } from "express";
import { openSIPSService } from "./services/OpenSIPSService";
import { openSIPSTwilioIntegration } from "./services/OpenSIPSTwilioIntegration";
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

  // POST /api/v1/opensips/call/initiate - Initiate integrated call
  app.post("/api/v1/opensips/call/initiate", async (req: Request, res: Response) => {
    try {
      const { userId, fromNumber, toNumber, useTwilio = false } = req.body;
      const apiKey = req.headers.authorization?.replace("Bearer ", "");

      if (!apiKey) return res.status(401).json({ error: "API key required" });
      if (!userId || !fromNumber || !toNumber) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const session = await openSIPSTwilioIntegration.initiateCall(
        userId,
        fromNumber,
        toNumber,
        useTwilio
      );

      res.json({
        success: true,
        session: {
          sessionId: session.sessionId,
          status: session.status,
          sipCredentials: session.sipCredentials,
          twilioCallSid: session.twilioCallSid,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/v1/opensips/call/:sessionId - Get call session details
  app.get("/api/v1/opensips/call/:sessionId", async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const apiKey = req.headers.authorization?.replace("Bearer ", "");

      if (!apiKey) return res.status(401).json({ error: "API key required" });

      const session = openSIPSTwilioIntegration.getSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.json({ success: true, session });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/opensips/call/:sessionId/end - End call session
  app.post("/api/v1/opensips/call/:sessionId/end", async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const apiKey = req.headers.authorization?.replace("Bearer ", "");

      if (!apiKey) return res.status(401).json({ error: "API key required" });

      await openSIPSTwilioIntegration.endCall(sessionId);

      res.json({ success: true, message: "Call ended" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/v1/opensips/health - Health check
  app.get("/api/v1/opensips/health", async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers.authorization?.replace("Bearer ", "");
      if (!apiKey) return res.status(401).json({ error: "API key required" });

      const health = await openSIPSTwilioIntegration.healthCheck();
      res.json(health);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
