import requests
import base64
import os
import pandas as pd
from time import sleep

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

def get_token():
    auth = f"{CLIENT_ID}:{CLIENT_SECRET}"
    b64 = base64.b64encode(auth.encode()).decode()
    r = requests.post(
        "https://accounts.spotify.com/api/token",
        headers={
            "Authorization": f"Basic {b64}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data={"grant_type": "client_credentials"},
    )
    print("Status code:", r.status_code)
    print("Response:", r.text)
    return r.json()["access_token"]

token = get_token()
headers = {"Authorization": f"Bearer {token}"}

# Example: tracks from a public playlist
PLAYLIST_ID = "37i9dQZF1DXcBWIGoYBM5M"  # Today's Top Hits

tracks = []
url = f"https://api.spotify.com/v1/playlists/{PLAYLIST_ID}/tracks?limit=50"

while url:
    r = requests.get(url, headers=headers).json()
    for item in r["items"]:
        t = item["track"]
        if not t:
            continue
        tracks.append({
            "track_id": t["id"],
            "track_name": t["name"],
            "artist_name": t["artists"][0]["name"],
            "preview_url": t["preview_url"],
        })
    url = r["next"]
    sleep(0.2)

df = pd.DataFrame(tracks).dropna(subset=["track_id"])

# Fetch audio features in batches
features = []
for i in range(0, len(df), 50):
    ids = ",".join(df.track_id.iloc[i:i+50])
    r = requests.get(
        f"https://api.spotify.com/v1/audio-features?ids={ids}",
        headers=headers,
    ).json()
    features.extend(r["audio_features"])
    sleep(0.2)

feat_df = pd.DataFrame(features)[
    ["id", "danceability", "energy", "tempo", "valence"]
]

final = df.merge(feat_df, left_on="track_id", right_on="id").drop(columns=["id"])
final.to_csv("data/spotify_clean.csv", index=False)

print(f"Saved {len(final)} tracks → data/spotify_clean.csv")
