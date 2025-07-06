import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Loads .env file

const app = express();
app.use(cors());
app.use(express.json());

// Root route for health check
app.get('/', (req, res) => {
  res.send('✅ Backend is live. Use POST /api/generate');
});

// POST route to generate image
app.post('/api/generate', async (req, res) => {
  let { prompt } = req.body;
  console.log("🟡 Prompt received:", prompt);

  // Fallback in case prompt is missing
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    prompt = "A futuristic robot playing guitar on Mars";
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt: prompt,
        n: 1,
        size: '512x512',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const imageUrl = response.data.data[0].url;
    console.log("🟢 Image generated:", imageUrl);
    res.json({ imageUrl });

  } catch (error) {
    console.error("🔴 OpenAI Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to generate image",
      details: error.response?.data || error.message
    });
  }
});

// Use Render-compatible port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
