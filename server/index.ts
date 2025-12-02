import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { registerOpenSIPSRoutes } from "./routes-opensips";
import { registerAsteriskRoutes } from "./routes-asterisk";
import { registerMetaWhatsAppRoutes } from "./routes-meta-whatsapp";
import { registerEmbedWidgetRoutes } from "./routes-embed-widgets";
import { registerVoIPExtensionRoutes } from "./routes-voip-extensions";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize OpenSIPS server
  try {
    const { openSIPSService } = await import("./services/OpenSIPSService");
    log("Starting OpenSIPS server...", "opensips");
    await openSIPSService.startServer();
    log("OpenSIPS server started successfully", "opensips");
  } catch (error: any) {
    log(`Failed to start OpenSIPS server: ${error.message}`, "opensips");
  }

  await registerRoutes(httpServer, app);

  // Import and register API key generation routes
  const { registerApiKeyGenerationRoutes } = await import("./routes-api-keygen");
  registerApiKeyGenerationRoutes(app);

  // Import and register V1 API routes
  const { registerV1ApiRoutes } = await import("./routes-v1-api");
  registerV1ApiRoutes(app);

  // Import and register embed widget routes
  const { registerEmbedWidgetRoutes } = await import("./routes-embed-widgets");
  registerEmbedWidgetRoutes(app);

  // Import and register Retell routes
  const { registerRetellRoutes } = await import("./routes-retell");
  registerRetellRoutes(app);

  // Import and register Asterisk VoIP routes
  const { registerAsteriskRoutes } = await import("./routes-asterisk");
  registerAsteriskRoutes(app);

  // Import and register API key management routes
  const { registerApiKeyRoutes } = await import("./routes-api-keys");
  registerApiKeyRoutes(app);

  // Import and register Meta WhatsApp routes
  const { registerMetaWhatsAppRoutes } = await import("./routes-meta-whatsapp");
  registerMetaWhatsAppRoutes(app);

  registerOpenSIPSRoutes(app);
  registerVoIPExtensionRoutes(app);

  // Start recurring call processor (runs every minute)
  const { voipExtensionService } = await import('./services/VoIPExtensionService');
  setInterval(() => {
    voipExtensionService.processPendingRecurringCalls().catch(console.error);
  }, 60000); // Check every minute

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();