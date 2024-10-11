import os
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util
from pymongo import MongoClient
import numpy as np
import torch
from dotenv import load_dotenv
from sklearn.metrics.pairwise import cosine_similarity

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
post_collection = db['posts']

# Search API endpoint
@app.route('/search', methods=['POST'])
def search():
    query = request.json.get('query')
    if not query:
        return jsonify({'error': 'No query provided'}), 400

    # Convert search query to embedding
    query_embedding = model.encode(query, convert_to_tensor=True).to(torch.float32)

    # Fetch all posts with their associated images and embeddings
    post_docs = post_collection.aggregate([
        {
            '$lookup': {
                'from': 'images',  # join with images collection
                'localField': 'image',
                'foreignField': '_id',
                'as': 'imageData'
            }
        },
        {
            '$unwind': '$imageData'
        },
        {
            '$project': {
                'imageData.prompt': 1,
                'imageData.embedding': 1
            }
        }
    ])

    # Calculate cosine similarity
    similarities = []
    for doc in post_docs:
        if 'embedding' not in doc['imageData']:
            continue
        
        # Convert embedding to tensor for similarity calculation
        prompt_embedding = np.array(doc['imageData']['embedding'], dtype=np.float32)
        prompt_embedding_tensor = torch.tensor(prompt_embedding, dtype=torch.float32)

        # Calculate similarity
        similarity_score = util.pytorch_cos_sim(query_embedding, prompt_embedding_tensor).item()
        similarities.append((doc['_id'], doc['imageData']['prompt'], similarity_score))

    # Sort by similarity score
    similarities = sorted(similarities, key=lambda x: x[2], reverse=True)

    # Return top 50 results
    results = [{'id': str(sim[0]), 'prompt': sim[1], 'score': sim[2]} for sim in similarities[:50]]

    return jsonify({'results': results}), 200

# Relevance API endpoint
@app.route('/relevance', methods=['POST'])
def relevance():
    post_embedding = request.json.get('embedding')
    interaction_embeddings = request.json.get('interactionEmbeddings')

    post_embedding_tensor = torch.tensor(post_embedding, dtype=torch.float32)

    # Calculate similarity with each interaction embedding
    similarity_scores = []
    for interaction_embedding in interaction_embeddings:
        interaction_tensor = torch.tensor(interaction_embedding, dtype=torch.float32)
        similarity = util.pytorch_cos_sim(post_embedding_tensor, interaction_tensor).item()
        similarity_scores.append(similarity)

    # Return the highest similarity score
    max_similarity = max(similarity_scores) if similarity_scores else 0
    return jsonify({'similarity': max_similarity}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)