import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Error: OPENAI_API_KEY environment variable is missing. Please add it to your .env file.");
  process.exit(1);
}

export const client = new OpenAI({
  apiKey,
});