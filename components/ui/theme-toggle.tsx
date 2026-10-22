"use client"

import { LayerMask01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const subscribeToHydration = () => () => { }

export function ThemeToggle({ light = false }: { light?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false
  )

  const toggleTheme = () => {
    if (!mounted) return
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <Button
      size="icon-sm"
      disabled={!mounted}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      variant="outline"
      className="dark:bg-background!"
    // className={cn(
    //   "size-8",
    //   light
    //     ? "text-white hover:bg-white/10 hover:text-white"
    //     : ""
    // )}
    >
      <HugeiconsIcon
        icon={LayerMask01Icon}
        strokeWidth={2}
        className="size-4 -rotate-45 transition-transform duration-300"
      />
    </Button>
  )
}
