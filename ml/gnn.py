import torch
import torch.nn.functional as F
from torch_geometric.nn import SAGEConv
from torch_geometric.data import Data
import numpy as np

# Load graph
x = torch.tensor(np.load(r"C:\Users\Devansh\music_player\music-gnn-player\ml\features.npy"), dtype=torch.float)
edge_index = torch.tensor(np.load(r"C:\Users\Devansh\music_player\music-gnn-player\ml\edge_index.npy"), dtype=torch.long)

data = Data(x=x, edge_index=edge_index)

# GraphSAGE model
class GraphSAGE(torch.nn.Module):
    def __init__(self, in_dim):
        super().__init__()
        self.conv1 = SAGEConv(in_dim, 32)
        self.conv2 = SAGEConv(32, 64)

    def forward(self, x, edge_index):
        x = self.conv1(x, edge_index)
        x = F.relu(x)
        x = self.conv2(x, edge_index)
        return x

model = GraphSAGE(in_dim=x.shape[1])
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

# Training loop (unsupervised)
model.train()
for epoch in range(1, 101):
    optimizer.zero_grad()
    out = model(data.x, data.edge_index)
    loss = out.norm(dim=1).mean()  # embedding regularization
    loss.backward()
    optimizer.step()

    if epoch % 20 == 0:
        print(f"Epoch {epoch:03d} | Loss: {loss.item():.4f}")

# Save embeddings
embeddings = model(data.x, data.edge_index).detach().cpu().numpy()
np.save(r"C:\Users\Devansh\music_player\music-gnn-player\ml\song_embeddings.npy", embeddings)

print("GNN training complete")
print("Embeddings shape:", embeddings.shape)
