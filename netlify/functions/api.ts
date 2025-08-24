import serverless from "serverless-http";

import { createServer } from "../../server";

const app = createServer();

// Add debugging middleware
app.use((req, res, next) => {
  console.log('Netlify function received request:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  });
  next();
});

export const handler = serverless(app);
