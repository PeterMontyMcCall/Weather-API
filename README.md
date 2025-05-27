
# Weather API Project 🌤️

This is a simple Node.js + Express weather API that fetches real-time weather data from the [Visual Crossing Weather API](https://www.visualcrossing.com/), uses Redis for in-memory caching, and includes basic rate limiting.

## ✅ Features

- Fetches weather data for any city
- Caches results in Redis for 12 hours
- Uses environment variables to store API keys and configuration
- Implements rate limiting to prevent abuse

## 🛠️ Tech Stack

- Node.js
- Express
- Redis
- Visual Crossing Weather API
- dotenv
- express-rate-limit

## 📦 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/weather-api.git
cd weather-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

```env
WEATHER_API_KEY=your_visual_crossing_api_key
REDIS_URL=redis://localhost:6379
```

### 4. Start Redis

Make sure Redis is installed and running locally on port 6379.

```bash
# On macOS (Homebrew)
brew services start redis

# On Ubuntu
sudo systemctl start redis
```

### 5. Run the app

```bash
npm run dev  # if using nodemon
# or
node index.js
```

### 6. Use the API

Example:
```
GET http://localhost:3000/weather?city=Toronto
```

Returns:
```json
{
  "city": "Toronto",
  "temperature": 17.5,
  "condition": "Partly Cloudy"
}
```

## 📌 Notes

- Cached responses expire after 6 hours (21600 seconds)
- Limited to 10 requests per minute per IP
