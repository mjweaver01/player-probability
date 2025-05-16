import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import { client, model } from "./openai.js";

const AthleteImage = z.object({
  name: z.string(),
  image: z.string(),
});

export const getAthleteImage = async (playerName: string) => {
  try {
    const prompt = `
    **Identity**
    You are a specialized agent that searches the web and finds an image of a professional athlete.

    **Context**
    Today's Date: ${new Date().toISOString().split('T')[0]}
    Player: ${playerName}

    **Instructions**
    - You are given a player's name and you do web search on them to find an image of them.
    - You are to provide a JSON object with the following fields:
      - player: The player's name.
      - image: The player's image.
    `;

    const response = await client.responses.create({
      model,
      tools: [ { type: "web_search_preview" } ],
      tool_choice: "required",
      input: prompt,
      text: {
        format: zodTextFormat(AthleteImage, "AthleteImage"),
      },
    });

    const athleteImage = response.output_text 
      ? JSON.parse(response.output_text) 
      : {
        player: playerName,
        image: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
      };

    return athleteImage;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return {
      player: playerName,
      image: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
    };
  }
};