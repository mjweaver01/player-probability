# Player Probability

A service that forecasts the probability of a player appearing in their next game.

## Setup

1. Create a `.env` file in the root directory with the following content:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   ```

2. Replace `your_openai_api_key_here` with your actual OpenAI API key.

3. Install dependencies:
   ```
   yarn install
   ```

4. Run the development server:
   ```
   yarn dev
   ```

## Usage

Send a POST request to `/api/probability` with a JSON body containing the player name:

```json
{
  "playerName": "LeBron James"
}
```

The service will return a forecast with the probability of the player appearing in their next game. 