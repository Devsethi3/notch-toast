"use client"

import { useEffect, useRef, useState } from "react"

import { FluidHoverHighlight } from "@/components/fluid-hover-highlight"
import {
  useFluidHover,
  useRegisterFluidHoverItem,
} from "@/hooks/use-fluid-hover"
import { cn } from "@/lib/utils"

const sections = [
  { label: "Get started", href: "#installation" },
  { label: "API reference", href: "#toast-methods" },
  { label: "Promise", href: "#promise" },
  { label: "Update & dismiss", href: "#update-dismiss" },
  { label: "Options", href: "#options" },
  { label: "Placement & motion", href: "#configuration" },
] as const

type DocsSidebarItemProps = {
  active: boolean
  href: string
  index: number
  label: string
  onActivate: (index: number) => void
  registerItem: (index: number, element: HTMLElement | null) => void
}

function DocsSidebarItem({
  active,
  href,
  index,
  label,
  onActivate,
  registerItem,
}: DocsSidebarItemProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  useRegisterFluidHoverItem(registerItem, index, ref)

  return (
    <a
      ref={ref}
      href={href}
      aria-current={active ? "location" : undefined}
      onClick={() => onActivate(index)}
      onFocus={() => onActivate(index)}
      className={cn(
        "relative z-10 block rounded-md px-3 py-2 transition-colors",
        active ? "text-foreground" : "text-muted-foreground"
      )}
    >
      {label}
    </a>
  )
}

export function DocsSidebar() {
  const containerRef = useRef<HTMLElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const hover = useFluidHover(containerRef, {
    axis: "y",
    gapClick: { maxDistance: 8 },
  })
  const setHoverActiveIndex = hover.setActiveIndex

  useEffect(() => {
    let frame: number | null = null

    const updateCurrentSection = () => {
      if (frame !== null) return
      frame = requestAnimationFrame(() => {
        frame = null
        const anchor = 112
        let nextIndex = 0

        sections.forEach(({ href }, index) => {
          const section = document.querySelector(href)
          const top = section?.getBoundingClientRect().top
          if (top !== undefined && top <= anchor) {
            nextIndex = index
          }
        })

        setCurrentIndex(nextIndex)
        setHoverActiveIndex(nextIndex)
      })
    }

    updateCurrentSection()
    window.addEventListener("scroll", updateCurrentSection, { passive: true })
    window.addEventListener("resize", updateCurrentSection)

    return () => {
      window.removeEventListener("scroll", updateCurrentSection)
      window.removeEventListener("resize", updateCurrentSection)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [setHoverActiveIndex])

  const activate = (index: number) => {
    setCurrentIndex(index)
    setHoverActiveIndex(index)
  }

  return (
    <aside className="hidden lg:block">
      <div
        className="fixed top-24 z-10 w-[180px]"
        style={{ left: "max(1.5rem, calc((100vw - 64rem) / 2 + 1.5rem))" }}
      >
        <nav
          ref={containerRef}
          aria-label="On this page"
          className="relative space-y-1 text-sm"
          {...hover.handlers}
          onMouseLeave={() => {
            hover.handlers.onMouseLeave()
            setHoverActiveIndex(currentIndex)
          }}
        >
          <FluidHoverHighlight hover={hover} className="rounded-md" />
          {sections.map((section, index) => (
            <DocsSidebarItem
              key={section.href}
              {...section}
              active={currentIndex === index}
              index={index}
              onActivate={activate}
              registerItem={hover.registerItem}
            />
          ))}
        </nav>
      </div>
    </aside>
  )
}
