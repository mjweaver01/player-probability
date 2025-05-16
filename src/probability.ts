import { Router } from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Error: OPENAI_API_KEY environment variable is missing. Please add it to your .env file.");
  process.exit(1);
}

const client = new OpenAI({
  apiKey,
});

const forecastProbability = async (res: any, playerName?: string) => {
  if (!playerName) {
    return res.status(400).json({ error: "Player name is required" });
  }

  try {
    const prompt = `
    **Identity**
    You are a sports analyst that is tasked with determining the probability of a player appearing in their next game.

    **Instructions**
    - You are given a player's name and you do research on them to determine the probability of them appearing in their next game.
    - You are to provide a JSON object with the following fields:
      - probability: The probability of the player appearing in their next game.
      - confidence: The confidence in the probability.
      - nextGame: The next game the player will be playing in.
      - explanation: A brief explanation of the probability.

    **Response**
    - Provide a percentage and a brief explanation.
    - Response Example:
    {
      "probability": 0.5,
      "confidence": 0.95,
      "nextGame": "The player will be playing against Team X on 2025-05-20 at Home Stadium",
      "explanation": "The player has a 50% chance of appearing in their next game, because XYZ"
    }
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: `Player: ${playerName}` }
      ]
    });

    const forecast = response.choices[0]?.message?.content || "No forecast available";

    res.json({
      player: playerName,
      forecast,
    });
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
