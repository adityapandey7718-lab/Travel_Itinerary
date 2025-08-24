import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleTravelPlan } from "./routes/travel-plan";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Debug middleware
  app.use((req, res, next) => {
    console.log('Server received request:', {
      method: req.method,
      url: req.url,
      contentType: req.headers['content-type'],
      bodySize: req.body ? Object.keys(req.body).length : 0
    });
    next();
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Travel planning API
  app.post("/api/travel-plan", handleTravelPlan);

  return app;
}
