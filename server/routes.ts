import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import sitpRoutes from "./routes/sitp";
import voipRoutes from "./routes/voip";
import whatsappRoutes from "./routes/whatsapp";
import apiGeneratorRoutes from "./routes/api-generator";
import integrationsRoutes from "./routes/integrations";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // SITP API routes
  app.use("/api/sitp", sitpRoutes);

  // VoIP API routes
  app.use("/api/voip", voipRoutes);

  // WhatsApp API routes
  app.use("/api/whatsapp", whatsappRoutes);

  // API Generator routes
  app.use("/api/generator", apiGeneratorRoutes);

  // Integrations routes (PyVoIP, DoorPi, WhatsApp Cloud, Terraform)
  app.use("/api/integrations", integrationsRoutes);

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  return httpServer;
}