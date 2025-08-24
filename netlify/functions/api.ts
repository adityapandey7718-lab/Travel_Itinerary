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
  response: (response, request, event, context) => {
    // Add CORS headers for Netlify
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Log the response for debugging
    console.log('Response sent:', {
      statusCode: response.statusCode,
      headers: response.getHeaders()
    });
    
    return response;
  },
  // Ensure binary responses are handled properly
  binary: ['application/json', 'text/plain', 'text/html']
});
