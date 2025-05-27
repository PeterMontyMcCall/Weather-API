const express = require('express');
const { createClient } = require('redis');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = 3000;
const apiKey = process.env.WEATHER_API_KEY;

// Connect to Redis
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.connect().catch(console.error);

// Set limit for each IP to 10 requests per minute
const limiter = rateLimit({
    windowMs: 60 * 1000,    // 1 minute
    max: 10,                // Limit each IP to 10 requests
    message: "Too many requests from this IP. Please try again later."
});

app.use(limiter)

app.get('/weather', async (req, res) => {
    const city = req.query.city || 'Toronto';

    try {
        // Check Redis cache
        const cachedData = await redisClient.get(city);
        if (cachedData) {
            console.log("Served from cache");
            return res.json(JSON.parse(cachedData));
        }

        // If not cached, fetch from API
        const response = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}`
        );

        if (!response.ok) throw new Error("Weather API error");

        const data = await response.json();

        const result = {
            city: data.address,
            temperature: data.currentConditions.temp,
            condition: data.currentConditions.conditions
        };

        // Save result to Redis
        await redisClient.set(city, JSON.stringify(result), {
            EX: 21600
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})