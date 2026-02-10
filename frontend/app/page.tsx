'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { SongSelector } from '@/components/song-selector'
import { GraphVisualization } from '@/components/graph-visualization'
import { Recommendations } from '@/components/recommendations'

export default function Page() {
  const [selectedSong, setSelectedSong] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [songs, setSongs] = useState<any[]>([])
  const [loadingError, setLoadingError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    // Initialize theme
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    }

    // Load songs from API
    const loadSongs = async () => {
      try {
        const res = await fetch('http://localhost:8000/songs')
        const data = await res.json()
        setSongs(data)
        setLoadingError(null)
      } catch (error) {
        console.error('Error loading songs:', error)
        setLoadingError('Could not connect to backend. Make sure it\'s running on http://localhost:8000')
      }
    }
    loadSongs()
  }, [])

  const handleExplore = async (songIndex: number, k: number) => {
    setIsLoading(true)
    
    try {
      const apiUrl = "http://localhost:8000"
      
      // Fetch real song data
      const songsRes = await fetch(`${apiUrl}/songs`)
      const songs = await songsRes.json()
      const song = songs[songIndex]
      setSelectedSong(song)

      // Fetch real recommendations
      const recRes = await fetch(`${apiUrl}/recommend?song_index=${songIndex}&k=${k}`)
      const recommendations = await recRes.json()
      setRecommendations(recommendations)

      // Fetch real graph data
      const graphRes = await fetch(`${apiUrl}/graph?song_index=${songIndex}&k=${k}`)
      const graphData = await graphRes.json()
      setGraphData(graphData)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      alert('Could not connect to backend. Make sure it\'s running on http://localhost:8000')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-8xl px-6 py-12 md:px-8 md:py-16">
        <div className="mb-12 space-y-3">
          <h1 className="text-4xl font-light tracking-tight text-foreground md:text-5xl">
            Discover Your Next <span className="text-accent">Favorite Song</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Explore the hidden connections between songs through an intelligent
            network visualization. Start by selecting a song to see how it relates
            to others in the music universe.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            {loadingError ? (
              <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-600">
                {loadingError}
              </div>
            ) : (
              <SongSelector
                songs={songs}
                onSelect={handleExplore}
                isLoading={isLoading}
              />
            )}
          </div>

          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                Connection Network
              </h2>
              <GraphVisualization data={graphData} isLoading={isLoading} />
            </div>

            <div>
              <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                Suggested Connections
              </h2>
              <Recommendations
                songs={recommendations}
                isLoading={isLoading}
                selectedSong={selectedSong || undefined}
              />
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-border/50 pt-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">
                How it works
              </h3>
              <p className="text-sm text-muted-foreground">
                Our music intelligence system learns patterns from millions of
                songs to understand what makes songs similar.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">
                Network Graph
              </h3>
              <p className="text-sm text-muted-foreground">
                The visualization shows your selected song in the center with
                connections to similar tracks based on learned patterns.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">
                Recommendations
              </h3>
              <p className="text-sm text-muted-foreground">
                Each recommendation is ranked by similarity. Click explore to
                see how songs relate to each other in the network.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
