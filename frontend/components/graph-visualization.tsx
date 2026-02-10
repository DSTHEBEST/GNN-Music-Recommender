'use client'

import { useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'

interface Node {
  id: string
  label: string
  group: string
}

interface Edge {
  from: string
  to: string
  weight: number
}

interface GraphData {
  nodes: Node[]
  edges: Edge[]
}

interface GraphVisualizationProps {
  data: GraphData
  isLoading: boolean
}

export function GraphVisualization({
  data,
  isLoading,
}: GraphVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!containerRef.current || data.nodes.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const rect = containerRef.current.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    // Use a deterministic radial layout for clarity and stability
    const dpr = window.devicePixelRatio || 1
    // Set canvas internal size for DPI and keep CSS size consistent
    canvas.width = Math.max(1, Math.floor(rect.width * dpr))
    canvas.height = Math.max(1, Math.floor(rect.height * dpr))
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(dpr, dpr)

    const cssWidth = rect.width
    const cssHeight = rect.height

    const nodePositions = new Map<any, { x: number; y: number }>()

    // Determine central node (query) and neighbors
    const centerNode = data.nodes.find((n) => n.group === 'query') || data.nodes[0]
    const centerId = centerNode?.id

    // Map neighbor weights from central node
    const neighborEdges = data.edges.filter(
      (e) => String(e.from) === String(centerId) || String(e.to) === String(centerId)
    )

    const neighbors = neighborEdges.map((e) => {
      const other = String(e.from) === String(centerId) ? e.to : e.from
      return { id: other, weight: e.weight ?? 0 }
    })

    const cx = cssWidth / 2
    const cy = cssHeight / 2

    // Place center node in middle
    nodePositions.set(String(centerId), { x: cx, y: cy })

    // Determine radius for neighbor ring
    const ringRadius = Math.min(cssWidth, cssHeight) * 0.35

    // Sort neighbors by weight so stronger connections are grouped
    neighbors.sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))

    const n = neighbors.length || 1
    neighbors.forEach((nb, idx) => {
      const angle = (idx / n) * Math.PI * 2
      // place stronger weights slightly closer to center
      const w = Math.max(0, Math.min(1, nb.weight ?? 0))
      const radius = ringRadius * (1 - 0.35 * w)
      const x = cx + Math.cos(angle) * radius
      const y = cy + Math.sin(angle) * radius
      nodePositions.set(String(nb.id), { x, y })
    })

    // If there are nodes not directly connected, place them in outer ring
    const placed = new Set(Array.from(nodePositions.keys()).map(String))
    const others = data.nodes.filter((n) => !placed.has(String(n.id)))
    others.forEach((node, idx) => {
      const angle = ((idx + neighbors.length) / data.nodes.length) * Math.PI * 2
      const radius = ringRadius * 1.05
      const x = cx + Math.cos(angle) * radius
      const y = cy + Math.sin(angle) * radius
      nodePositions.set(String(node.id), { x, y })
    })

    // Clear background
    const isDark = document.documentElement.classList.contains('dark')
    ctx.fillStyle = isDark ? '#1A130E' : '#F9F7F4'
    ctx.fillRect(0, 0, cssWidth, cssHeight)

    // Draw edges
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'
    ctx.lineWidth = 1.2
    data.edges.forEach((edge) => {
      const fromPos = nodePositions.get(String(edge.from))
      const toPos = nodePositions.get(String(edge.to))
      if (fromPos && toPos) {
        ctx.beginPath()
        ctx.moveTo(fromPos.x, fromPos.y)
        ctx.lineTo(toPos.x, toPos.y)
        ctx.stroke()
      }
    })

    // Draw nodes and labels
    ctx.textBaseline = 'middle'
    ctx.font = '12px Inter, system-ui, Arial'
    data.nodes.forEach((node) => {
      const pos = nodePositions.get(String(node.id))
      if (!pos) return

      const isQuery = node.group === 'query'
      const radius = isQuery ? 8 : 6

      // Glow
      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius * 3)
      gradient.addColorStop(0, isQuery ? 'rgba(120,100,50,0.28)' : 'rgba(120,100,50,0.08)')
      gradient.addColorStop(1, 'rgba(120,100,50,0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius * 3, 0, Math.PI * 2)
      ctx.fill()

      // Node circle
      ctx.fillStyle = isQuery ? '#78643C' : '#6B5B46'
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
      ctx.fill()

      // Border
      ctx.strokeStyle = isDark ? '#F9F7F4' : '#1A130E'
      ctx.lineWidth = 1
      ctx.stroke()

      // Label
      ctx.fillStyle = isDark ? '#F9F7F4' : '#1A130E'
      const label = String(node.label).length > 28 ? String(node.label).slice(0, 25) + '...' : String(node.label)
      ctx.fillText(label, pos.x + radius + 6, pos.y)
    })
  }, [data])

  if (isLoading) {
    return (
      <Card className="border border-border/50 bg-card">
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="mb-2 inline-block h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="text-sm text-muted-foreground">
              Building connection network...
            </p>
          </div>
        </div>
      </Card>
    )
  }

  if (data.nodes.length === 0) {
    return (
      <Card className="border border-border/50 bg-card">
        <div className="flex h-96 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Select a song and explore to see the network
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border border-border/50 bg-card overflow-hidden">
      <div ref={containerRef} className="h-96 w-full">
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
    </Card>
  )
}
