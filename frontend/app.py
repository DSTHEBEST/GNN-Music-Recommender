import streamlit as st
import requests
from pyvis.network import Network
import tempfile
import os


API_BASE = "http://127.0.0.1:8000"

st.set_page_config(page_title="GNN Music Player", layout="centered")

st.title("🎧 Graph-Based Music Intelligence Player")
st.caption("Recommendations powered by Graph Neural Networks (GraphSAGE)")

# Fetch songs
@st.cache_data
def load_songs():
    r = requests.get(f"{API_BASE}/songs")
    return r.json()
def render_graph(graph_data):
    net = Network(height="400px", width="100%", bgcolor="#0E1117", font_color="white")

    for node in graph_data["nodes"]:
        color = "#FF4B4B" if node["group"] == "query" else "#1DB954"
        net.add_node(
            node["id"],
            label=node["label"],
            color=color,
            size=25 if node["group"] == "query" else 18
        )

    for edge in graph_data["edges"]:
        net.add_edge(
            edge["from"],
            edge["to"],
            value=edge["weight"]
        )

    net.repulsion(node_distance=180, central_gravity=0.3)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".html") as f:
        net.save_graph(f.name)
        return f.name

songs = load_songs()

song_labels = [
    f"{i}. {s['track_name']} — {s['artist_name']}"
    for i, s in enumerate(songs)
]

selected = st.selectbox("Select a song", range(len(song_labels)),
                        format_func=lambda i: song_labels[i])

k = st.slider("Number of recommendations", 3, 10, 5)

if st.button("🔍 Recommend"):
    with st.spinner("Finding similar songs using GNN embeddings..."):
        r = requests.get(
            f"{API_BASE}/recommend",
            params={"song_index": selected, "k": k}
        )
        recs = r.json()

    st.subheader("🎶 Recommended Songs")
    for idx, rec in enumerate(recs, 1):
        st.write(f"**{idx}. {rec['track_name']}** — {rec['artist_name']}")

st.subheader("🕸️ Similarity Graph")

graph_resp = requests.get(
    f"{API_BASE}/graph",
    params={"song_index": selected, "k": k}
).json()

html_path = render_graph(graph_resp)

with open(html_path, "r", encoding="utf-8") as f:
    st.components.v1.html(f.read(), height=420)

os.remove(html_path)
