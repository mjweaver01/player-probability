import { z } from "zod";
import { Router } from "express";
import { zodTextFormat } from "openai/helpers/zod";
import { client, model } from "./openai.js";
import { getPlayerImage } from "./athlete.js";

const router = Router();

const ForecastProbability = z.object({
  player: z.string(),
  image: z.string(),
  probability: z.number(),
  confidence: z.number(),
  nextGame: z.string(),
  explanation: z.string(),
});

const forecastProbability = async (res: any, playerName?: string) => {
  if (!playerName) {
    return res.status(400).json({ error: "Player name is required" });
  }

  const { image } = await getPlayerImage(playerName);

  try {
    const prompt = `
    **Identity**
    You are a sports analyst that is tasked with determining the probability of a player appearing in their next game.

    **Context**
    Today's Date: ${new Date().toISOString().split('T')[0]}
    Player: ${playerName}
    Player's Image: ${image}

    **Instructions**
    - You are given a player's name and you do web search on them to determine the probability of them appearing in their next game.
    - You are to provide a JSON object with the following fields:
      - player: The player's name.
      - image: The player's image.
      - probability: The probability of the player appearing in their next game.
      - confidence: The confidence in the probability.
      - nextGame: The next game the player will be playing in.
      - explanation: A brief explanation of the probability.
    `;

    const response = await client.responses.create({
      model,
      tools: [ { type: "web_search_preview" } ],
      tool_choice: "required",
      input: prompt,
      text: {
        format: zodTextFormat(ForecastProbability, "forecastProbability"),
      },
    });

    const forecast = response.output_text 
      ? JSON.parse(response.output_text) 
      : {
        player: playerName,
        probability: 0,
        confidence: 0,
        nextGame: "No forecast available",
        explanation: "No forecast available",
      };

    res.json(forecast);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "An error occurred while processing the request" });
  }
};

router.post("/", async (req, res) => {
  const { playerName } = req.body;
  return await forecastProbability(res, playerName);
});

router.get("/", async (req, res) => {
  const { playerName } = req.query;
  return await forecastProbability(res, playerName as string);
});

export default router;
