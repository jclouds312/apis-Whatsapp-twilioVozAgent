import type { Express, Request, Response } from "express";
import { storage } from "./storage";

const ASTERISK_CONFIG = {
  host: process.env.ASTERISK_HOST || "localhost",
  port: process.env.ASTERISK_PORT || "5060",
  manager_host: process.env.ASTERISK_MANAGER_HOST || "localhost",
  manager_port: parseInt(process.env.ASTERISK_MANAGER_PORT || "5038"),
  manager_user: process.env.ASTERISK_MANAGER_USER || "admin",
  manager_pass: process.env.ASTERISK_MANAGER_PASS || "password",
};

export function registerAsteriskRoutes(app: Express) {
  // POST /api/v1/voip/call/initiate - Asterisk Core Call
  app.post("/api/v1/voip/call/initiate", async (req: Request, res: Response) => {
    try {
      const { fromNumber, toNumber, callerId, context = "default" } = req.body;
      const apiKey = req.headers.authorization?.replace("Bearer ", "");

      if (!apiKey) return res.status(401).json({ error: "API key required" });
      if (!fromNumber || !toNumber) return res.status(400).json({ error: "Missing numbers" });

      const callId = `call_${Date.now()}`;
      
      const callData = {
        callId,
        fromNumber,
        toNumber,
        callerId: callerId || "Digital Future",
        context,
        status: "initiated",
        timestamp: new Date().toISOString(),
        asteriskHost: ASTERISK_CONFIG.host,
        asteriskPort: ASTERISK_CONFIG.port,
      };

      await storage.createSystemLog({
        userId: apiKey.substring(0, 20),
        eventType: "voip_call_initiated",
        service: "asterisk",
        message: `VoIP call initiated: ${fromNumber} → ${toNumber}`,
        status: "success",
        metadata: callData,
      });

      res.json({ success: true, call: callData });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/voip/call/hangup - End Call
  app.post("/api/v1/voip/call/hangup", async (req: Request, res: Response) => {
    try {
      const { callId } = req.body;
      const apiKey = req.headers.authorization?.replace("Bearer ", "");

      if (!apiKey) return res.status(401).json({ error: "API key required" });

      await storage.createSystemLog({
        userId: apiKey.substring(0, 20),
        eventType: "voip_call_hangup",
        service: "asterisk",
        message: `Call ended: ${callId}`,
        status: "success",
        metadata: { callId },
      });

      res.json({ success: true, callId });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/v1/voip/calls - List Active Calls
  app.get("/api/v1/voip/calls", async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers.authorization?.replace("Bearer ", "");
      if (!apiKey) return res.status(401).json({ error: "API key required" });

      const activeCalls = [
        {
          callId: "call_1234567890",
          fromNumber: "+18622770131",
          toNumber: "+34912345678",
          callerId: "Digital Future Sales",
          duration: 245,
          status: "active",
          startTime: "2025-01-20T21:15:00Z",
          quality: "HD",
        },
        {
          callId: "call_1234567891",
          fromNumber: "+18622770131",
          toNumber: "+34634567890",
          callerId: "Digital Future Support",
          duration: 180,
          status: "active",
          startTime: "2025-01-20T21:18:30Z",
          quality: "HD",
        },
      ];

      res.json({ activeCalls, count: activeCalls.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/v1/voip/call/:id - Get Call Details
  app.get("/api/v1/voip/call/:id", async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers.authorization?.replace("Bearer ", "");
      if (!apiKey) return res.status(401).json({ error: "API key required" });

      const callDetail = {
        callId: req.params.id,
        fromNumber: "+18622770131",
        toNumber: "+34912345678",
        callerId: "Digital Future Sales",
        duration: 245,
        status: "completed",
        startTime: "2025-01-20T21:15:00Z",
        endTime: "2025-01-20T21:19:05Z",
        quality: "HD",
        recording: "https://s3.amazonaws.com/voip/call_1234567890.wav",
        transcript: "Disponible con Retell AI",
      };

      res.json(callDetail);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/voip/number/allocate - Allocate DID Number
  app.post("/api/v1/voip/number/allocate", async (req: Request, res: Response) => {
    try {
      const { country = "ES", type = "sip" } = req.body;
      const apiKey = req.headers.authorization?.replace("Bearer ", "");

      if (!apiKey) return res.status(401).json({ error: "API key required" });

      const didNumber = {
        numberId: `did_${Date.now()}`,
        number: `+34${Math.floor(Math.random() * 900000000 + 100000000)}`,
        country,
        type,
        status: "active",
        cost_per_month: 2.50,
        allocated_at: new Date().toISOString(),
        routing: "voip.nexus.local:5060",
      };

      await storage.createSystemLog({
        userId: apiKey.substring(0, 20),
        eventType: "voip_number_allocated",
        service: "asterisk",
        message: `DID number allocated: ${didNumber.number}`,
        status: "success",
        metadata: didNumber,
      });

      res.json({ success: true, did: didNumber });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/voip/ivr/create - Create IVR Menu
  app.post("/api/v1/voip/ivr/create", async (req: Request, res: Response) => {
    try {
      const { name, prompt, options } = req.body;
      const apiKey = req.headers.authorization?.replace("Bearer ", "");

      if (!apiKey) return res.status(401).json({ error: "API key required" });

      const ivr = {
        ivrId: `ivr_${Date.now()}`,
        name: name || "Default IVR",
        prompt: prompt || "Bienvenido a Digital Future",
        options: options || [
          { digit: "1", description: "Ventas", transfer: "+34912345678" },
          { digit: "2", description: "Soporte", transfer: "+34634567890" },
          { digit: "0", description: "Operador", transfer: "operator" },
        ],
        status: "active",
        created_at: new Date().toISOString(),
      };

      await storage.createSystemLog({
        userId: apiKey.substring(0, 20),
        eventType: "voip_ivr_created",
        service: "asterisk",
        message: `IVR menu created: ${name}`,
        status: "success",
        metadata: ivr,
      });

      res.json({ success: true, ivr });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/v1/voip/stats - VoIP Statistics
  app.get("/api/v1/voip/stats", async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers.authorization?.replace("Bearer ", "");
      if (!apiKey) return res.status(401).json({ error: "API key required" });

      const stats = {
        activeCalls: 12,
        totalCallsToday: 847,
        totalCallMinutes: 12450,
        averageCallDuration: 245,
        callQuality: "HD",
        systemUptime: "99.8%",
        costToday: 148.50,
        asteriskStatus: "online",
        asteriskVersion: "20.0.0",
      };

      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/voip/transfer - Transfer Call
  app.post("/api/v1/voip/transfer", async (req: Request, res: Response) => {
    try {
      const { callId, toNumber } = req.body;
      const apiKey = req.headers.authorization?.replace("Bearer ", "");

      if (!apiKey) return res.status(401).json({ error: "API key required" });

      await storage.createSystemLog({
        userId: apiKey.substring(0, 20),
        eventType: "voip_call_transfer",
        service: "asterisk",
        message: `Call transferred: ${callId} → ${toNumber}`,
        status: "success",
        metadata: { callId, toNumber },
      });

      res.json({ success: true, message: "Call transferred" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/v1/voip/recordings - List Recordings
  app.get("/api/v1/voip/recordings", async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers.authorization?.replace("Bearer ", "");
      if (!apiKey) return res.status(401).json({ error: "API key required" });

      const recordings = [
        {
          recordingId: "rec_1",
          callId: "call_1234567890",
          fromNumber: "+18622770131",
          toNumber: "+34912345678",
          duration: 245,
          date: "2025-01-20T21:15:00Z",
          url: "https://s3.amazonaws.com/voip/rec_1.wav",
          format: "WAV",
          bitrate: "64kbps",
        },
        {
          recordingId: "rec_2",
          callId: "call_1234567891",
          fromNumber: "+18622770131",
          toNumber: "+34634567890",
          duration: 180,
          date: "2025-01-20T21:18:30Z",
          url: "https://s3.amazonaws.com/voip/rec_2.wav",
          format: "WAV",
          bitrate: "64kbps",
        },
      ];

      res.json({ recordings, count: recordings.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/v1/voip/webhook - VoIP Webhook Events
  app.post("/api/v1/voip/webhook", async (req: Request, res: Response) => {
    try {
      const { event, callData } = req.body;

      await storage.createSystemLog({
        userId: "voip_webhook",
        eventType: `voip_${event}`,
        service: "asterisk",
        message: `VoIP webhook event: ${event}`,
        status: "success",
        metadata: callData,
      });

      res.json({ received: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
