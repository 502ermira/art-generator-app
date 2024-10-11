const { HfInference } = require('@huggingface/inference');
const inference = new HfInference(process.env.HUGGINGFACE_API_KEY);
const Image = require('../models/Image');
const Post = require('../models/Post');
const Search = require('../models/Search');

exports.generateImage = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const inference = new HfInference(process.env.HUGGINGFACE_API_KEY);

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
      const embeddingResponse = await fetch('http://192.168.1.145:5001/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: prompt }),
      });

      if (!embeddingResponse.ok) {
        throw new Error('Failed to get embedding from Flask service');
      }

      const embedding = await embeddingResponse.json();

      res.status(200).json({ image: imageUrl, embedding });
    } else {
      res.status(500).json({ error: 'Failed to generate image' });
    }
  } catch (error) {
    console.error('Error generating image:', error.message);
    res.status(500).json({ error: 'Error generating image' });
  }
};

exports.searchImages = async (req, res) => {
  const { query } = req.body;
  const userId = req.userId;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const fetch = (await import('node-fetch')).default;

    const response = await fetch('http://192.168.1.145:5001/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Search failed with status ' + response.status);
    }

    const data = await response.json();
    const imageIds = data.results.map(result => result.id);

    await Search.create({ user: userId, query, type: 'images' });

    const posts = await Post.find({ image: { $in: imageIds } })
      .populate('image')
      .populate('user', 'username profilePicture');
      
    const sortedPosts = imageIds.map(id => 
      posts.find(post => post.image._id.toString() === id)
    );

    const results = sortedPosts.map(post => {
      if (!post || !post.image) {
        console.error('Post or image missing for post:', post);
        return null;
      }
    
      return {
        id: post.image._id,
        image: post.image.image,
        prompt: post.image.prompt,
        postId: post._id,
        username: post.user.username,
        profilePicture: post.user.profilePicture,
      };
    }).filter(post => post !== null);
    

    res.status(200).json({ results });
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};