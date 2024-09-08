const { HfInference } = require('@huggingface/inference');
const inference = new HfInference(process.env.HUGGINGFACE_API_KEY);

exports.generateImage = async (req, res) => {
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const result = await inference.textToImage({
      model: 'stabilityai/stable-diffusion-2',
      inputs: prompt,
      parameters: {
        negative_prompt: 'blurry',
        height: 512,
        width: 512,
        num_inference_steps: 50,
      },
    });

    if (result) {
      const base64Image = Buffer.from(await result.arrayBuffer()).toString('base64');
      const imageUrl = `data:image/png;base64,${base64Image}`;

      res.status(200).json({ image: imageUrl });
    } else {
      res.status(500).json({ error: 'Failed to generate image' });
    }
  } catch (error) {
    if (error.message.includes('Rate limit')) {
      res.status(429).json({ error: 'Rate limit reached. Please try again later.' });
    } else {
      console.error('Error generating image:', error);
      res.status(500).json({ error: 'Error generating image' });
    }
  }
};