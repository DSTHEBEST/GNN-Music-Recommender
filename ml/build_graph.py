import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity

# Load ML-ready dataset
df = pd.read_csv(r"C:\Users\Devansh\music_player\music-gnn-player\data\spotify_ml.csv")

FEATURE_COLS = ["danceability", "energy", "tempo", "valence"]

# Extract features
X = df[FEATURE_COLS].values

# Normalize (VERY IMPORTANT)
scaler = StandardScaler()
X = scaler.fit_transform(X)

# Compute cosine similarity matrix
sim_matrix = cosine_similarity(X)

# Build edges
edges = []
THRESHOLD = 0.85  # tune this if needed

num_nodes = len(df)

for i in range(num_nodes):
    for j in range(i + 1, num_nodes):
        if sim_matrix[i, j] >= THRESHOLD:
            edges.append([i, j])
            edges.append([j, i])  # undirected graph

edge_index = np.array(edges).T  # shape [2, num_edges]

# Save outputs
np.save(r"C:\Users\Devansh\music_player\music-gnn-player\ml\edge_index.npy", edge_index)
np.save(r"C:\Users\Devansh\music_player\music-gnn-player\ml\features.npy", X)

print("Graph build complete")
print(f"Nodes: {num_nodes}")
print(f"Edges: {edge_index.shape[1]}")
print(f"Avg degree: {edge_index.shape[1] / num_nodes:.2f}")
