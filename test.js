// netlify/functions/test.js
// Simple test function to verify Netlify functions are working

exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Netlify function is working!",
      method: event.httpMethod,
      path: event.path,
      query: event.queryStringParameters,
      timestamp: new Date().toISOString()
    }),
  };
};
