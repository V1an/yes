import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameStateSchema, insertProxyStatsSchema } from "@shared/schema";
import { setupProxyRoutes } from "./proxy-routes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup the main proxy routes
  setupProxyRoutes(app);
  // Optional: Keep some simple API endpoints for status monitoring
  app.get("/proxy-status", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getRecentProxyStats();
      res.json({
        status: "operational",
        timestamp: new Date().toISOString(),
        recentStats: stats
      });
    } catch (error) {
      res.status(500).json({ 
        status: "error", 
        message: "Failed to get proxy stats",
        timestamp: new Date().toISOString()
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
