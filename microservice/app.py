import os
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util
from pymongo import MongoClient
import numpy as np
import torch
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Load the pre-trained SBERT model
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)

try:
    client.admin.command('ping') 
    print("Connected to MongoDB successfully!")
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")

db = client['art_generator']
image_collection = db['images']

# Search API endpoint
@app.route('/search', methods=['POST'])
def search():
    query = request.json.get('query')
    if not query:
        return jsonify({'error': 'No query provided'}), 400

    # Convert search query to embedding (float32 for consistency)
    query_embedding = model.encode(query, convert_to_tensor=True).to(torch.float32)

    # Fetch all image prompts and their embeddings from the database
    image_docs = image_collection.find({}, {'prompt': 1, 'embedding': 1})

    # Calculate cosine similarity
    similarities = []
    for doc in image_docs:
        if 'embedding' not in doc:
            continue
        
        # Ensure prompt_embedding is explicitly converted to a torch tensor with float32 dtype
        prompt_embedding = np.array(doc['embedding'], dtype=np.float32)
        prompt_embedding_tensor = torch.tensor(prompt_embedding, dtype=torch.float32)

        # Calculate similarity
        similarity_score = util.pytorch_cos_sim(query_embedding, prompt_embedding_tensor).item()
        similarities.append((doc['_id'], doc['prompt'], similarity_score))

    # Sort by similarity score
    similarities = sorted(similarities, key=lambda x: x[2], reverse=True)

    # Return top 5 results
    results = [{'id': str(sim[0]), 'prompt': sim[1], 'score': sim[2]} for sim in similarities[:5]]

    return jsonify({'results': results}), 200

# Embed API endpoint
@app.route('/embed', methods=['POST'])
def embed():
    sentence = request.json.get('sentence')
    if not sentence:
        return jsonify({'error': 'No sentence provided'}), 400

    # Compute the embedding
    embedding = model.encode(sentence).tolist()
    return jsonify(embedding), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)