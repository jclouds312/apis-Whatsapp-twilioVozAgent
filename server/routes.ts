import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import sitpRoutes from "./routes/sitp";
import pyvoipRoutes from "./routes/pyvoip";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // SITP API routes
  app.use("/api/sitp", sitpRoutes);

  // pyVoIP API routes
  app.use("/api/pyvoip", pyvoipRoutes);

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  return httpServer;
}