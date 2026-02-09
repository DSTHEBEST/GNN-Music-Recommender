import pandas as pd

df = pd.read_csv(r"C:\Users\Devansh\music_player\music-gnn-player\data\spotify_top_songs_audio_features.csv")  # your file name

# Rename columns to standard names
df = df.rename(columns={
    "id": "track_id",
    "artist_names": "artist_name"
})

# Select only what we need
df = df[
    [
        "track_id",
        "track_name",
        "artist_name",
        "danceability",
        "energy",
        "tempo",
        "valence"
    ]
]

# Drop missing values
df = df.dropna()

# Optional: cap size for speed
df = df.sample(n=min(500, len(df)), random_state=42).reset_index(drop=True)

df.to_csv(r"C:\Users\Devansh\music_player\music-gnn-player\data\spotify_ml.csv", index=False)

print(f"Saved ML dataset with {len(df)} tracks → data/spotify_ml.csv")
