import serverless from "serverless-http";
import { createServer } from "../../server";

// Create the Express app
const app = createServer();

// Export the serverless handler with proper configuration
export const handler = serverless(app, {
  // Ensure proper request/response handling
  request: (request, event, context) => {
    // Log the request for debugging
    console.log('Request received:', {
      method: request.method,
      url: request.url,
      headers: request.headers
    });
    return request;
  },
  // Ensure binary responses are handled properly
  binary: ['application/json', 'text/plain', 'text/html']
});
