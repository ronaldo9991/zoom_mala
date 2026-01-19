import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fetchLiveRates } from "./lib/rates/fetchers";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Live rates endpoint
  app.get("/api/live-rates", async (req, res) => {
    try {
      const rates = await fetchLiveRates();
      res.json(rates);
    } catch (error: any) {
      console.error("Error fetching live rates:", error);
      res.status(500).json({
        error: "Failed to fetch live rates",
        message: error.message,
      });
    }
  });

  return httpServer;
}
