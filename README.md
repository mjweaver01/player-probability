# Player Probability

Forecast the probability of a player appearing in their next game.

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

### POST

Send a POST request to `/api/probability` with a JSON body containing the player name:

```json
{
  "playerName": "LeBron James"
}
```

### GET

Send a GET request to `/api/probability` with the playerName as a query parameter:

```
api/probability?playerName=LeBron%20James
```

The service will return a forecast with the probability of the player appearing in their next game, confidence, and an explanation.