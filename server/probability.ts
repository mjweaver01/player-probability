import { z } from 'zod';
import { zodTextFormat } from 'openai/helpers/zod';
import { client, model } from './openai';
import { getAthleteImage } from './athlete';
import { generatePrompt } from './prompt';

const ForecastProbability = z.object({
  player: z.string(),
  team: z.string(),
  image: z.string(),
  probability: z.number(),
  confidence: z.number(),
  nextGame: z.string(),
  explanation: z.string(),
});

export const forecastProbability = async (playerName?: string) => {
  if (!playerName) {
    return { error: 'Player name is required' };
  }

  // Get the player's image
  const { image } = await getAthleteImage(playerName);

  try {
    // Generate OpenAI Prompt
    const prompt = generatePrompt(playerName, image);

    // Call OpenAI's Responses API to get the probability of the player appearing in their next game
    // Uses the built-in web_search_preview tool to get real-time data
    const response = await client.responses.create({
      model,
      tools: [{ type: 'web_search_preview' }],
      tool_choice: 'required',
      input: prompt,
      text: {
        format: zodTextFormat(ForecastProbability, 'forecastProbability'),
      },
    });

    // Parse the response
    let forecast = {
      player: playerName,
      team: 'No team available',
      image: image || '',
      probability: 0,
      confidence: 0,
      nextGame: 'No forecast available',
      explanation: 'No forecast available',
    };

    try {
      if (response.output_text) {
        forecast = JSON.parse(response.output_text.replace(/[\u0000-\u001F\u007F-\u009F]/g, ''));
      }
    } catch (jsonError) {
      console.error('JSON Parse Error:', jsonError);
    }

    return forecast;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return { error: 'An error occurred while processing the request' };
  }
};
