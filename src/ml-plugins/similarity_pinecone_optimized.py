import pandas as pd
import numpy as np
import openai
from sklearn.neighbors import NearestNeighbors
from tqdm import tqdm
import argparse
import json

# === CONFIGURATION ===
openai.api_key = ''  # Replace with your OpenAI key

ID_COL = 'id'
SUMMARY_COL = 'Summary'
TEXT_COL = 'text'
BATCH_SIZE = 500
DEFAULT_SIMILARITY_THRESHOLD = 0.7
EMBEDDING_DIM = 1536

def process_json_and_find_similarities(json_data, similarity_threshold=DEFAULT_SIMILARITY_THRESHOLD):
    # === LOAD AND PREPARE DATA ===
    df = pd.DataFrame(json_data)
    df['combined'] = df[SUMMARY_COL].astype(str) + " " + df[TEXT_COL].astype(str)

    # === EMBEDDING FUNCTION ===
    def get_embeddings_batch(texts, model="text-embedding-3-small"):
        try:
            response = openai.embeddings.create(input=texts, model=model)
            return [r.embedding for r in response.data]
        except Exception as e:
            print("Error:", e)
            return [[0.0] * EMBEDDING_DIM for _ in texts]

    # === GENERATE EMBEDDINGS IN BATCHES ===
    embeddings = []
    for i in tqdm(range(0, len(df), BATCH_SIZE), desc="Generating embeddings"):
        batch_texts = df['combined'][i:i + BATCH_SIZE].tolist()
        batch_embeddings = get_embeddings_batch(batch_texts)
        embeddings.extend(batch_embeddings)

    # === COMPUTE SIMILARITY USING NEAREST NEIGHBORS ===
    embeddings_matrix = np.array(embeddings)
    nn = NearestNeighbors(metric='cosine', radius=1 - similarity_threshold)
    nn.fit(embeddings_matrix)

    matches = []
    for i, vector in enumerate(tqdm(embeddings_matrix)):
        distances, indices = nn.radius_neighbors([vector])
        for dist, j in zip(distances[0], indices[0]):
            if i < j:
                similarity = 1 - dist
                if similarity >= similarity_threshold:
                    matches.append({
                        "id_1": df.loc[i, ID_COL],
                        "summary_1": df.loc[i, SUMMARY_COL],
                        "text_1": df.loc[i, TEXT_COL],
                        "id_2": df.loc[j, ID_COL],
                        "summary_2": df.loc[j, SUMMARY_COL],
                        "text_2": df.loc[j, TEXT_COL],
                        "similarity": round(similarity, 4)
                    })

    return matches

# === CLI WRAPPER (OPTIONAL) ===
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Find similar ideas from a JSON file.")
    parser.add_argument('--input', type=str, required=True, help='Path to input JSON file')
    parser.add_argument('--min-similarity', type=float, default=DEFAULT_SIMILARITY_THRESHOLD, help='Minimum similarity score (0-1) to include')

    args = parser.parse_args()

    with open(args.input, 'r', encoding='utf-8') as f:
        json_data = json.load(f)

    results = process_json_and_find_similarities(json_data, similarity_threshold=args.min_similarity)

    # Return results (printed only if you run as script)
    print(json.dumps(results, indent=2, ensure_ascii=False))
