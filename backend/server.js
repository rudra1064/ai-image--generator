app.post('/api/generate', async (req, res) => {
  let { prompt } = req.body;

  console.log("🟡 Prompt received:", prompt);

  // Fallback in case prompt is undefined
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    prompt = "A futuristic robot playing guitar on Mars";
  }

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

    console.log("🟢 Image generated:", response.data.data[0].url);
    res.json({ imageUrl: response.data.data[0].url });

  } catch (error) {
    console.error("🔴 OpenAI Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to generate image",
      details: error.response?.data || error.message
    });
  }
});
