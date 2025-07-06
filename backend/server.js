import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Backend is live. Use POST /api/generate');
});

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;
  console.log("🟡 Prompt received:", prompt);

  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2',
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
          Accept: 'application/json',
        },
        responseType: 'arraybuffer', // because image is binary
      }
    );

    // Convert image buffer to base64 for browser
    const imageBuffer = response.data;
    const base64Image = Buffer.from(imageBuffer, 'binary').toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;

    res.json({ imageUrl });

  } catch (error) {
    console.error("🔴 Hugging Face Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Image generation failed",
      details: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
