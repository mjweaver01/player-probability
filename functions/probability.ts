import { Handler } from '@netlify/functions';
import { forecastProbability } from '../server/probability';

const handler: Handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    let playerName: string | undefined;

    if (event.httpMethod === 'GET') {
      playerName = event.queryStringParameters?.playerName;
    } else if (event.httpMethod === 'POST' && event.body) {
      const body = JSON.parse(event.body);
      playerName = body.playerName;
    }

    if (!playerName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Player name is required" }),
      };
    }

    const forecast = await forecastProbability(playerName);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(forecast),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "An error occurred while processing the request" }),
    };
  }
};

export { handler }; 