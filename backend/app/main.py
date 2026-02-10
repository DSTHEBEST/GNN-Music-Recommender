from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI(title="GNN Music Recommender")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

df = pd.read_csv(r"C:\Users\Devansh\music_player\music-gnn-player\data\spotify_ml.csv")
embeddings = np.load(r"C:\Users\Devansh\music_player\music-gnn-player\ml\song_embeddings.npy")

@app.get("/songs")
def get_songs():
    return df[["track_id", "track_name", "artist_name"]].to_dict(orient="records")  

@app.get("/recommend")
def recommend(song_index: int, k: int = 5):
    if song_index < 0 or song_index >= len(df):
        return {"error": "Invalid song_index"}

    sims = cosine_similarity(
        embeddings[song_index].reshape(1, -1),
        embeddings
    )[0]

    top_idx = sims.argsort()[-(k + 1):][::-1]
    top_idx = [i for i in top_idx if i != song_index][:k]

    return df.iloc[top_idx][
        ["track_name", "artist_name"]
    ].to_dict(orient="records")

@app.get("/graph")
def graph(song_index: int, k: int = 5):
    sims = cosine_similarity(
        embeddings[song_index].reshape(1, -1),
        embeddings
    )[0]

    top_idx = sims.argsort()[-(k + 1):][::-1]
    top_idx = [int(i) for i in top_idx if int(i) != song_index][:k]

    nodes = []
    edges = []

    # Central node
    nodes.append({
        "id": int(song_index),
        "label": str(df.iloc[song_index]["track_name"]),
        "group": "query"
    })

    # Neighbor nodes
    for i in top_idx:
        nodes.append({
            "id": int(i),
            "label": str(df.iloc[i]["track_name"]),
            "group": "recommended"
        })
        edges.append({
            "from": int(song_index),
            "to": int(i),
            "weight": float(sims[i])
        })

    return {
        "nodes": nodes,
        "edges": edges
    }
