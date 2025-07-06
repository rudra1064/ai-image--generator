import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Loads .env file

const app = express();
app.use(cors());
app.use(express.json());

// POST route for generating image using OpenAI
app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt,
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

    // Send back the image URL
    res.json({ imageUrl: response.data.data[0].url });

  } catch (error) {
    // Print exact error for debugging (in Render logs)
    console.error('OpenAI Error:', error.response?.data || error.message);

    // Send error to frontend/postman
    res.status(500).json({
      error: 'Failed to generate image',
      details: error.response?.data || error.message
    });
  }
});

// Use dynamic PORT for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
