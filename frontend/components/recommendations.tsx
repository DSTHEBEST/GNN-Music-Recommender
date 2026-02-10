'use client'

import { Card } from '@/components/ui/card'
import { Music } from 'lucide-react'

interface Song {
  track_name: string
  artist_name: string
}

interface RecommendationsProps {
  songs: Song[]
  isLoading: boolean
  selectedSong?: Song
}

export function Recommendations({
  songs,
  isLoading,
  selectedSong,
}: RecommendationsProps) {
  if (isLoading) {
    return (
      <Card className="border border-border/50 bg-card">
        <div className="space-y-4 p-6 md:p-8">
          <h2 className="text-xl font-light tracking-tight text-foreground">
            Recommendations
          </h2>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded bg-muted"
              />
            ))}
          </div>
        </div>
      </Card>
    )
  }

  if (songs.length === 0) {
    return (
      <Card className="border border-border/50 bg-card">
        <div className="p-6 md:p-8 text-center">
          <Music className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Explore a song to discover connections
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border border-border/50 bg-card">
      <div className="space-y-6 p-6 md:p-8">
        <div className="space-y-2 border-b border-border/50 pb-4">
          <h2 className="text-xl font-light tracking-tight text-foreground">
            Recommended Songs
          </h2>
          {selectedSong && (
            <p className="text-sm text-muted-foreground">
              Based on <span className="font-medium text-foreground">{selectedSong.track_name}</span> by{' '}
              <span className="font-medium text-foreground">
                {selectedSong.artist_name}
              </span>
            </p>
          )}
        </div>

        <div className="space-y-3">
          {songs.map((song, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 rounded-lg border border-border/30 p-4 transition-colors hover:border-border/60 hover:bg-secondary/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent font-medium text-sm flex-shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm">
                  {song.track_name}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {song.artist_name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
