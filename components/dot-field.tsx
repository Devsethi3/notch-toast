"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

type DotFieldProps = {
  className?: string
  /** Distance between dot centres, in px */
  gap?: number
  /** Largest dot radius, in px */
  maxRadius?: number
  /** Drift speed multiplier. 1 is a slow, calm default */
  speed?: number
  /** Opacity of the dots, 0 to 1 */
  opacity?: number
  /** Approximate size of one patch, in px. Bigger means larger, fewer patches */
  scale?: number
  /** A soft dot-free area, expressed as fractions of the canvas dimensions. */
  clearArea?: {
    x?: number
    y?: number
    radiusX?: number
    radiusY?: number
  }
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/* Seeded lattice hash -> 0..1 */
const hash = (ix: number, iy: number) => {
  let n = Math.imul(ix, 374761393) + Math.imul(iy, 668265263)
  n = Math.imul(n ^ (n >>> 13), 1274126177)
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295
}

/* Smooth 2D value noise -> 0..1 */
const noise = (x: number, y: number) => {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const u = fx * fx * (3 - 2 * fx)
  const v = fy * fy * (3 - 2 * fy)
  const a = hash(ix, iy)
  const b = hash(ix + 1, iy)
  const c = hash(ix, iy + 1)
  const d = hash(ix + 1, iy + 1)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}

/**
 * A fixed halftone dot grid. Soft patches of larger dots drift slowly across it,
 * and everywhere between the patches the grid is completely empty.
 * The grid itself never moves, only the patches do, so dots swell and fade
 * smoothly as a patch passes over them.
 *
 * Dots are drawn in `currentColor`, so set the colour with a text-* token class.
 */
export function DotField({
  className,
  gap = 12,
  maxRadius = 2.5,
  speed = 1,
  opacity = 0.55,
  scale = 420,
  clearArea,
}: DotFieldProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let w = 0
    let h = 0
    let raf = 0
    let color = "#000"
    let time = 0
    let last = 0
    const clearX = clearArea?.x ?? 0.5
    const clearY = clearArea?.y ?? 0.5
    const clearRadiusX = clearArea?.radiusX ?? 0.34
    const clearRadiusY = clearArea?.radiusY ?? 0.4

    const readColor = () => {
      color = getComputedStyle(canvas).color
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalAlpha = opacity
      ctx.fillStyle = color

      const cols = Math.ceil(w / gap) + 1
      const rows = Math.ceil(h / gap) + 1
      const cx = w * clearX
      const cy = h * clearY
      const inv = 1 / scale

      // Two low-frequency fields travel along independent, curved paths.
      // The dots stay anchored to their grid while their patches flow around
      // it, making the movement legible without becoming visually busy.
      const ax =
        Math.sin(t * 0.45) * scale * 0.42 + Math.cos(t * 0.13) * scale * 0.12
      const ay =
        Math.cos(t * 0.36) * scale * 0.28 + Math.sin(t * 0.17) * scale * 0.1
      const bx =
        Math.cos(t * 0.31 + 1.8) * scale * 0.34 +
        Math.sin(t * 0.11) * scale * 0.14
      const by =
        Math.sin(t * 0.42 + 0.9) * scale * 0.3 +
        Math.cos(t * 0.16) * scale * 0.1

      ctx.beginPath()
      for (let j = 0; j < rows; j++) {
        const y = j * gap
        for (let i = 0; i < cols; i++) {
          const x = i * gap

          // Moving patches: low-frequency layer + a softer detail layer
          const f =
            noise((x + ax) * inv, (y + ay) * inv) * 0.72 +
            noise((x + bx) * inv * 2.1 + 31.7, (y + by) * inv * 2.1 + 12.3) *
              0.28

          // Below the threshold nothing is drawn at all
          const amount = smoothstep(0.5, 0.78, f)
          if (amount <= 0) continue

          // Keep the middle clear for the content
          const d = Math.hypot(
            (x - cx) / (w * clearRadiusX),
            (y - cy) / (h * clearRadiusY)
          )
          const mask = smoothstep(0.55, 1.3, d)

          const r = maxRadius * amount * mask
          if (r < 0.3) continue

          ctx.moveTo(x + r, y)
          ctx.arc(x, y, r, 0, Math.PI * 2)
        }
      }
      ctx.fill()
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      readColor()
      draw(time)
    }

    const loop = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0
      last = now
      time += dt * speed
      draw(time)
      raf = requestAnimationFrame(loop)
    }

    const start = () => {
      cancelAnimationFrame(raf)
      last = 0
      if (motion.matches) {
        draw(time)
      } else {
        raf = requestAnimationFrame(loop)
      }
    }

    resize()
    start()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Re-read the token colour when the theme changes
    const mo = new MutationObserver(() => {
      readColor()
      if (motion.matches) draw(time)
    })
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    })

    motion.addEventListener("change", start)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
      motion.removeEventListener("change", start)
    }
  }, [
    clearArea?.radiusX,
    clearArea?.radiusY,
    clearArea?.x,
    clearArea?.y,
    gap,
    maxRadius,
    speed,
    opacity,
    scale,
  ])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none size-full", className)}
    />
  )
}
