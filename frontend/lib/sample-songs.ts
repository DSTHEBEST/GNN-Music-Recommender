export const SAMPLE_SONGS = [
  { id: 0, track_name: 'Blinding Lights', artist_name: 'The Weeknd' },
  { id: 1, track_name: 'Shape of You', artist_name: 'Ed Sheeran' },
  { id: 2, track_name: 'As It Was', artist_name: 'Harry Styles' },
  { id: 3, track_name: 'Levitating', artist_name: 'Dua Lipa' },
  { id: 4, track_name: 'Anti-Hero', artist_name: 'Taylor Swift' },
  { id: 5, track_name: 'Flowers', artist_name: 'Miley Cyrus' },
  { id: 6, track_name: 'Sunroof', artist_name: 'Nicky Youre' },
  { id: 7, track_name: 'Heat Waves', artist_name: 'Glass Animals' },
  { id: 8, track_name: 'Good 4 U', artist_name: 'Olivia Rodrigo' },
  { id: 9, track_name: 'Industry Baby', artist_name: 'Lil Nas X' },
  { id: 10, track_name: 'Vampire', artist_name: 'Olivia Rodrigo' },
  { id: 11, track_name: 'Cruel Summer', artist_name: 'Taylor Swift' },
  { id: 12, track_name: 'Watermelon Sugar', artist_name: 'Harry Styles' },
  { id: 13, track_name: 'Midnight Rain', artist_name: 'Taylor Swift' },
  { id: 14, track_name: 'Snooze', artist_name: 'SZA' },
]

// Generate mock recommendations based on similarity
export function generateRecommendations(songIndex: number, k: number) {
  const songs = SAMPLE_SONGS
  const selected = songs[songIndex]
  
  // Create a simple similarity matrix (in a real app, this would come from your GNN)
  const similarities: { index: number; score: number }[] = songs
    .map((song, idx) => ({
      index: idx,
      // Simple similarity: same artist or genre similarity
      score: Math.random() * 0.8 + (selected.artist_name === song.artist_name ? 0.2 : 0),
    }))
    .filter((_, idx) => idx !== songIndex)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)

  return similarities.map((sim) => songs[sim.index])
}

// Generate mock graph data
export function generateGraphData(songIndex: number, k: number) {
  const songs = SAMPLE_SONGS
  const selected = songs[songIndex]
  const recommendations = generateRecommendations(songIndex, k)

  const nodes = [
    {
      id: `song-${songIndex}`,
      label: selected.track_name,
      group: 'query',
    },
    ...recommendations.map((song, idx) => ({
      id: `song-${songs.indexOf(song)}`,
      label: song.track_name,
      group: 'recommendation',
    })),
  ]

  const edges = recommendations.map((song, idx) => ({
    from: `song-${songIndex}`,
    to: `song-${songs.indexOf(song)}`,
    weight: 0.8 - idx * 0.1,
  }))

  // Add some cross-connections between recommendations
  for (let i = 0; i < recommendations.length - 1; i++) {
    if (Math.random() > 0.6) {
      edges.push({
        from: `song-${songs.indexOf(recommendations[i])}`,
        to: `song-${songs.indexOf(recommendations[i + 1])}`,
        weight: 0.3 + Math.random() * 0.3,
      })
    }
  }

  return { nodes, edges }
}
