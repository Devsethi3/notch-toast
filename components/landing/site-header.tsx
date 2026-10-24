import Link from "next/link"

import Logo from "@/components/logo"
import { CopyButton } from "@/components/code-block/copy-button"
import { NoiseBackground } from "@/components/ui/noise-background"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AGENTS_PROMPT } from "@/lib/agents"
import { ThemeToggle } from "../ui/theme-toggle"

const BRAND = "notch-toast"

export function SiteHeader({ sticky = false }: { sticky?: boolean }) {
  return (
    <header
      className={cn(
        "z-20 w-full",
        sticky &&
        "sticky top-0 border-b border-border bg-background/90 backdrop-blur"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-base font-medium whitespace-nowrap sm:gap-2.5 sm:text-lg"
        >
          <Logo className="size-5" title={null} />
          {BRAND}
        </Link>
        <nav className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground sm:gap-2">
          <NoiseBackground
            containerClassName="hidden w-fit rounded-lg p-0.75 sm:block"
            gradientColors={[
              "rgb(255, 100, 150)",
              "rgb(100, 150, 255)",
              "rgb(255, 200, 100)",
            ]}
          >
            <CopyButton
              content={AGENTS_PROMPT}
              aria-label="Copy AGENTS.md instructions"
              title="Copy AGENTS.md instructions"
              className="flex h-full w-full items-center gap-2 rounded-md bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-4 py-0.5 text-xs font-medium text-foreground/70 shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 hover:text-foreground active:scale-98 lg:py-1.25 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)]"
            >
              agent.md
            </CopyButton>
          </NoiseBackground>
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="bg-secondary!">
            <Link href="/docs">
              <span className="sm:hidden">Docs</span>
              <span className="hidden sm:inline">Documentation</span>
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="https://github.com/Devsethi3/notch-toast"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub">
              GitHub
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
