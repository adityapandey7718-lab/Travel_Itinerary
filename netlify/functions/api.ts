import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import { handleTravelPlan } from "../../server/routes/travel-plan";

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware
app.use((req, res, next) => {
  console.log('Netlify function received request:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    bodyKeys: req.body ? Object.keys(req.body) : []
  });
  next();
});

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "Netlify function is working!", timestamp: new Date().toISOString() });
});

// Direct route handling
app.post("/travel-plan", handleTravelPlan);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error in Netlify function:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    details: err.message 
  });
});

// Catch-all route for debugging
app.use('*', (req, res) => {
  console.log('Catch-all route hit:', req.method, req.url);
  res.status(404).json({ 
    success: false, 
    error: 'Route not found',
    method: req.method,
    url: req.url,
    body: req.body
  });
});

export const handler = serverless(app);
