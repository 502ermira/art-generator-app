const { HfInference } = require('@huggingface/inference');
const inference = new HfInference(process.env.HUGGINGFACE_API_KEY);
const Image = require('../models/Image');
const Post = require('../models/Post');

exports.generateImage = async (req, res) => {
  const { prompt } = req.body;
  const userId = req.userId;

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

      const fetch = (await import('node-fetch')).default;

      console.log(`Sending request to Flask service for embedding: ${prompt}`);
      const embeddingResponse = await fetch('http://192.168.1.145:5001/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: prompt }),
      });

      if (!embeddingResponse.ok) {
        throw new Error('Failed to get embedding from Flask service');
      }

      const embedding = await embeddingResponse.json();

      const newImage = new Image({
        prompt,
        image: imageUrl,
        embedding: embedding,
        user: userId || null,
      });
      await newImage.save();

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

exports.searchImages = async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }
  try {
    const fetch = (await import('node-fetch')).default;
    console.log(`Sending search request to Flask service: ${query}`);

    const response = await fetch('http://192.168.1.145:5001/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Search failed with status ' + response.status);
    }

    const data = await response.json();

    console.log('Data received from Flask:', data.results);

    const imageIds = data.results.map(result => result.id);

    const images = await Image.find({ _id: { $in: imageIds } });

    const posts = await Post.find({ image: { $in: imageIds } }).populate('image');

    const postMap = posts.reduce((acc, post) => {
      acc[post.image._id] = post._id;
      return acc;
    }, {});

    const results = data.results.map(result => {
      const image = images.find(img => String(img._id) === result.id);
      return {
        id: image._id,
        image: image.image,
        prompt: image.prompt,
        postId: postMap[image._id],
      };
    });

    res.status(200).json({ results });
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};