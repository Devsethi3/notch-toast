import Link from "next/link"

import { HeartIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { DotField } from "@/components/dot-field"
import { NotchPlayground } from "@/components/landing/notch-playground"
import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"

const BRAND = "notch-toast"

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}

export function HeroSection() {
  return (
    <>
      <section className="relative isolate min-h-svh overflow-hidden bg-background text-foreground">
        <div className="absolute inset-0 -z-10 text-muted-foreground/70">
          <DotField gap={12} maxRadius={2.4} speed={0.14} opacity={0.55} />
        </div>

        <header className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg font-semibold tracking-tight"
          >
            <Logo className="size-5" title={null} />
            {BRAND}
          </Link>
          <nav className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link
              href="/sponsor"
              className="flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <HugeiconsIcon icon={HeartIcon} className="size-4" />
              Sponsor
            </Link>
            <Link
              href="/docs"
              className="transition-colors hover:text-foreground"
            >
              Docs
            </Link>
            <Link
              href="https://github.com"
              aria-label="GitHub"
              className="transition-colors hover:text-foreground"
            >
              <GithubIcon className="size-[18px]" />
            </Link>
          </nav>
        </header>

        <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-3xl flex-col items-center justify-center px-6 pb-24 text-center">
          <div className="mb-10 inline-flex items-center gap-2 rounded-lg border border-border bg-card p-0.5 pr-3 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-2 py-1 font-semibold text-background">
              React
            </span>
            <span className="text-muted-foreground">
              toast notifications, reimagined
            </span>
          </div>
          <h1 className="text-5xl font-medium text-balance">
            Notifications that morph beautifully.
          </h1>
          <p className="mt-8 max-w-md text-balance text-muted-foreground">
            A beautifully animated, notch-style notification surface for modern
            React applications.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="#playground">Open playground</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/docs">Read the docs</Link>
            </Button>
          </div>
          <div className="mt-8 inline-flex items-center gap-2 rounded-lg border border-border bg-card p-0.5 pr-3 text-sm text-muted-foreground">
            <span className="grid size-6 place-items-center rounded-md bg-foreground text-xs font-semibold text-background">
              nt
            </span>
            Open source · MIT licensed
          </div>
        </div>
      </section>
      <NotchPlayground />
    </>
  )
}
