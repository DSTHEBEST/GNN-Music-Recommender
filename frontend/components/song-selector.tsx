'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Card } from '@/components/ui/card'
import { Music } from 'lucide-react'

interface Song {
  id: number
  track_name: string
  artist_name: string
}

interface SongSelectorProps {
  songs: Song[]
  onSelect: (songId: number, k: number) => void
  isLoading: boolean
}

export function SongSelector({
  songs,
  onSelect,
  isLoading,
}: SongSelectorProps) {
  const [selectedSong, setSelectedSong] = useState<string>(
    songs.length > 0 ? '0' : ''
  )
  const [k, setK] = useState<number[]>([5])

  const handleExplore = () => {
    if (selectedSong !== '') {
      onSelect(parseInt(selectedSong), k[0])
    }
  }

  return (
    <Card className="border border-border/30 bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:border-border/50 hover:shadow-xl">
      <div className="space-y-7 p-6 md:p-8">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors">
            <Music className="h-4 w-4 text-accent" />
            Select a song
          </label>
          <Select value={selectedSong} onValueChange={setSelectedSong}>
            <SelectTrigger className="w-full border-border/40 bg-background/50 text-foreground transition-all duration-200 hover:border-border/60 hover:bg-background/80 focus:ring-accent/50">
              <SelectValue placeholder="Choose a song..." />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {songs.map((song, idx) => (
                <SelectItem key={idx} value={idx.toString()}>
                  <span className="text-sm">
                    <span className="font-medium">{song.track_name}</span>
                    <span className="text-muted-foreground"> — {song.artist_name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-5">
          <div className="flex items-end justify-between gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Recommendations
            </label>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-light tracking-tight text-accent">{k[0]}</span>
              <span className="text-xs text-muted-foreground/60">/ 10</span>
            </div>
          </div>
          <div className="relative space-y-2">
            <Slider
              value={k}
              onValueChange={setK}
              min={3}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between px-1 text-xs text-muted-foreground/50">
              <span>3</span>
              <span>10</span>
            </div>
          </div>
        </div>

        <Button
          onClick={handleExplore}
          disabled={isLoading || selectedSong === ''}
          className="group relative w-full overflow-hidden bg-accent text-accent-foreground transition-all duration-300 hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center justify-center gap-2 transition-all duration-300">
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Exploring...
              </>
            ) : (
              'Explore Connections'
            )}
          </span>
        </Button>
      </div>
    </Card>
  )
}
