import { handleTravelPlan } from "../../server/routes/travel-plan";

export const handler = async (event, context) => {
  console.log('Netlify function received event:', {
    method: event.httpMethod,
    path: event.path,
    rawPath: event.rawPath,
    pathParameters: event.pathParameters,
    headers: event.headers,
    body: event.body
  });

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Handle travel plan request
  if (event.httpMethod === 'POST') {
    try {
      // Parse the request body
      const body = JSON.parse(event.body || '{}');
      console.log('Parsed body:', body);

      // Create mock request and response objects
      const req = {
        body,
        method: event.httpMethod,
        url: event.path,
        headers: event.headers
      };

      const res = {
        status: (code) => ({
          json: (data) => ({
            statusCode: code,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
          })
        }),
        json: (data) => ({
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(data)
        })
      };

      // Call the travel plan handler and capture the response
      let responseData = null;
      let statusCode = 200;
      
      const mockRes = {
        status: (code) => {
          statusCode = code;
          return {
            json: (data) => {
              responseData = data;
            }
          };
        },
        json: (data) => {
          responseData = data;
        }
      };

      await handleTravelPlan(req, mockRes);
      
      // Return the captured response
      return {
        statusCode: statusCode,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(responseData || { success: false, error: 'No response data' })
      };
      
    } catch (error) {
      console.error('Error in travel plan handler:', error);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Failed to generate travel plan',
          details: error.message
        })
      };
    }
  }

  // Default response
  return {
    statusCode: 404,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: false,
      error: 'Route not found',
      path: event.path,
      method: event.httpMethod
    })
  };
};
