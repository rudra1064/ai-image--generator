import React, { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleGenerate = async () => {
    const response = await fetch('https://ai-image-generator-6ieh.onrender.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    setImageUrl(data.imageUrl);
  };

  return (
    <div className="App">
      <h1>Image Generator 🎨</h1>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter prompt"
      />
      <button onClick={handleGenerate}>Generate</button>
      {imageUrl && <img src={imageUrl} alt="Generated result" />}
    </div>
  );
}

export default App;
