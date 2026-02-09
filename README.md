# 🎧 Graph-Based Music Intelligence Player

<div align="center">

**A graph-powered music recommendation system using Graph Neural Networks (GraphSAGE) for intelligent song discovery**

[![Python](https://img.shields.io/badge/Python-3.10-blue.svg)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-Geometric-red.svg)](https://pytorch-geometric.readthedocs.io/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green.svg)](https://fastapi.tiangolo.com/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.28-FF4B4B.svg)](https://streamlit.io/)

</div>

---

## 📖 Overview

This project demonstrates an **end-to-end ML system** that models song similarity using graph neural networks. Unlike traditional collaborative filtering, songs are represented as nodes in an audio-similarity graph, enabling multi-hop relationship discovery and explainable recommendations.

**System Highlights:**
- 🧠 Offline GNN training with GraphSAGE
- ⚡ Real-time inference via FastAPI
- 🎨 Interactive Streamlit frontend
- 🕸️ Graph-based visualization

---

## ✨ Key Features

### 🎵 **Graph-Based Recommendations**
Songs are modeled as nodes in an audio-similarity graph instead of using traditional collaborative filtering, capturing complex musical relationships.

### 🧠 **Graph Neural Network (GraphSAGE)**
Learns low-dimensional song embeddings through multi-hop neighborhood aggregation, understanding songs in the context of their similar neighbors.

### ⚡ **Offline Training, Online Inference**
GNN embeddings are pre-computed offline and served efficiently at runtime, ensuring fast recommendation responses.

### 🕸️ **Explainable Recommendations**
Interactive graph visualization reveals the "why" behind recommendations, showing the network of similar songs.

### 🖥️ **Full-Stack ML System**
Complete production-ready architecture:
- **Backend**: FastAPI for high-performance inference
- **Frontend**: Streamlit for interactive UI
- **ML Pipeline**: PyTorch Geometric for graph learning

---

## 🏗️ System Architecture

```
┌─────────────────────────────────┐
│   Spotify-derived Dataset       │
│   (Audio Features + Metadata)   │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Audio Feature Normalization    │
│  (StandardScaler)               │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   Song Similarity Graph         │
│   (Cosine Similarity Edges)     │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   GraphSAGE Training            │
│   (Offline, Unsupervised)       │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   Song Embeddings (.npy)        │
│   Cached for Fast Retrieval     │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   FastAPI Inference Layer       │
│   (REST API Endpoints)          │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   Streamlit UI                  │
│   + PyVis Graph Visualization   │
└─────────────────────────────────┘
```

---

## 🕸️ Graph Modeling

### Graph Structure
- **Nodes**: Individual songs from the dataset
- **Edges**: Audio similarity connections (cosine similarity threshold-based)
- **Edge Weight**: Similarity score between connected songs

### Node Features
Each song is represented by normalized audio features:
- **Danceability**: How suitable a track is for dancing
- **Energy**: Intensity and activity measure
- **Tempo**: Beats per minute (BPM)
- **Valence**: Musical positiveness/happiness

### Graph Construction
Edges are created when similarity exceeds a fixed threshold, producing a **well-connected but non-dense graph** that captures meaningful musical relationships without overwhelming connectivity.

---

## 🧠 GNN Model Details

| Parameter | Value |
|-----------|-------|
| **Architecture** | GraphSAGE |
| **Number of Layers** | 2 |
| **Embedding Dimension** | 64 |
| **Training Mode** | Unsupervised |
| **Loss Function** | Embedding norm regularization |
| **Aggregation** | Mean pooling |

The learned embeddings capture **multi-hop similarity patterns** between songs, enabling the model to understand not just direct similarities but also transitive musical relationships.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Machine Learning** | PyTorch, PyTorch Geometric |
| **Backend API** | FastAPI, Uvicorn |
| **Frontend** | Streamlit |
| **Visualization** | PyVis (Interactive Network Graphs) |
| **Data Processing** | Pandas, NumPy, scikit-learn |
| **Data Source** | Spotify-derived audio features |
| **Language** | Python 3.10+ |

---

## 📁 Project Structure

```
music-gnn-player/
│
├── backend/
│   └── app/
│       └── main.py              # FastAPI application & endpoints
│
├── frontend/
│   └── app.py                   # Streamlit UI application
│
├── ml/
│   ├── prepare_dataset.py       # Data preprocessing pipeline
│   ├── build_graph.py           # Graph construction from audio features
│   └── train_gnn.py             # GraphSAGE model training
│
├── data/
│   └── spotify_ml.csv           # Dataset (audio features)
│
├── requirements.txt             # Python dependencies
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10 or higher
- pip package manager
- Virtual environment (recommended)

### Installation & Setup

#### 1️⃣ Clone the repository
```bash
git clone <your-repo-url>
cd music-gnn-player
```

#### 2️⃣ Create virtual environment
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

#### 3️⃣ Install dependencies
```bash
pip install -r requirements.txt
```

#### 4️⃣ Build the similarity graph
```bash
python ml/build_graph.py
```

#### 5️⃣ Train the GNN model
```bash
python ml/train_gnn.py
```

#### 6️⃣ Start the backend server
```bash
uvicorn backend.app.main:app --reload
```
The API will be available at `http://localhost:8000`

#### 7️⃣ Launch the frontend (in a new terminal)
```bash
streamlit run frontend/app.py
```
The UI will open automatically at `http://localhost:8501`

---

## 💡 Design Decisions

### Why Graph-Based?
Graph-based modeling was chosen over traditional matrix factorization to capture **multi-hop relationships** between songs. This allows the system to recommend songs that are similar not just directly, but through transitive musical connections.

### Offline Training Strategy
Offline training ensures **fast and reliable inference**. Embeddings are pre-computed once and served efficiently, making the system production-ready.

### Decoupled Architecture
The system uses a **microservices-inspired architecture** with clear separation between ML pipeline, API layer, and UI. This allows independent scaling and deployment of each component.

### External API Considerations
Spotify API integration is treated as an **optional enrichment layer** rather than a core dependency, ensuring the system works reliably regardless of external API constraints.

---

## 🔮 Future Improvements

- [ ] **User-specific personalization graphs** - Incorporate listening history and user preferences
- [ ] **Heterogeneous graphs** - Add artist nodes, genre nodes, and cross-entity relationships
- [ ] **Live Spotify preview integration** - Stream 30-second audio previews directly in UI
- [ ] **Graph Attention Networks (GAT)** - Experiment with attention mechanisms for weighted aggregation
- [ ] **Cloud deployment** - Deploy on AWS/GCP with containerization (Docker + Kubernetes)
- [ ] **A/B testing framework** - Compare GNN recommendations against baseline methods
- [ ] **Real-time learning** - Implement online learning from user interactions

---

## 👤 Author

**Devansh Sharma**  
Machine Learning Enthusiast


---

## ⭐ Show Your Support

If you find this project interesting or helpful:

- Give it a **⭐ star** on GitHub — it helps more people discover the project!
- Fork it and build your own version
- Share it with others who might find it useful

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Dataset derived from Spotify's audio feature API
- Built with inspiration from graph-based recommendation systems research
- PyTorch Geometric community for excellent documentation

---

<div align="center">

**Made with ❤️ and Graph Neural Networks**

</div>
