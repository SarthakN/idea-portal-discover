import pandas as pd
import numpy as np
import openai
from sklearn.metrics.pairwise import cosine_similarity
from tqdm import tqdm

# Set your OpenAI API key
openai.api_key = ''

# Load Excel file
df = pd.read_csv('C:/Users/Sarthak.Navalakha/Downloads/ideas_ats_ss_june.csv')  # Replace with actual file path

# Adjust column names based on your file
id_col = 'id'
summary_col = 'Summary'
text_col = 'text'

# Combine summary + text into a single string for embedding
df['combined'] = df[summary_col].astype(str) + ' ' + df[text_col].astype(str)

# Generate embeddings using OpenAI's embedding model
def get_embedding(text, model="text-embedding-3-small"):
    response = openai.embeddings.create(input=[text], model=model)
    return response.data[0].embedding

# Generate embeddings with a progress bar
embeddings = []
for text in tqdm(df['combined'], desc="Generating embeddings"):
    try:
        embedding = get_embedding(text)
        embeddings.append(embedding)
    except Exception as e:
        print(f"Error for text: {text[:30]}... → {e}")
        embeddings.append([0.0]*1536)  # Handle failures gracefully

# Create a DataFrame with id and embeddings
embedding_df = pd.DataFrame({
    'id': df[id_col],
    'embedding': embeddings
})

# Convert list of floats to strings for CSV export
embedding_df['embedding'] = embedding_df['embedding'].apply(lambda x: ','.join(map(str, x)))

# Export to CSV
embedding_df.to_csv("embeddings.csv", index=False)
print("Embeddings exported to embeddings.csv")


# Convert list of embeddings to NumPy array
embeddings_matrix = np.array(embeddings)

# Compute cosine similarity matrix
similarity_matrix = cosine_similarity(embeddings_matrix)

# Find pairs with ≥ 0.9 similarity (excluding self-comparisons)
matches = []
num_rows = len(df)
for i in range(num_rows):
    for j in range(i+1, num_rows):
        score = similarity_matrix[i][j]
        if score >= 0.7:
            matches.append({
                "id_1": df.loc[i, id_col],
                "summary_1": df.loc[i, summary_col],
                "text_1": df.loc[i, text_col],
                "id_2": df.loc[j, id_col],
                "summary_2": df.loc[j, summary_col],
                "text_2": df.loc[j, text_col],
                "similarity": score
            })

# Convert results to DataFrame
matches_df = pd.DataFrame(matches)
matches_df.to_csv("high_similarity_matches.csv", index=False)
print("Done. Found", len(matches), "high similarity pairs.")
