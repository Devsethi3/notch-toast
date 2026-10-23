import Link from "next/link"

import { CodeBlockTabsPkg } from "@/components/code-block/blocks/copy-with-tabs-package-manager"
import { DotField } from "@/components/dot-field"
import { NotchPlayground } from "@/components/landing/notch-playground"
import { IntegrationSection } from "@/components/landing/integration-section"
import { SiteHeader } from "@/components/landing/site-header"
import { Button } from "@/components/ui/button"
import { NoiseBackground } from "../ui/noise-background"

export function HeroSection() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-background text-foreground">
        <div className="absolute inset-0 -z-10 text-muted-foreground/70">
          <DotField
            gap={12}
            maxRadius={2.4}
            speed={0.7}
            opacity={0.55}
            clearArea={{ x: 0.32, y: 0.52, radiusX: 0.38, radiusY: 0.5 }}
          />
        </div>

        <SiteHeader />

        <div className="mx-auto flex min-h-[calc(80svh-4rem)] max-w-5xl items-center px-6 py-20">
          <div className="max-w-2xl pb-16 text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground shadow-xs">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              v0.2.0
            </span>
            <h1 className="mt-3 text-3xl font-medium tracking-tight text-balance">
              Notifications that morph beautifully
            </h1>
            <p className="mt-3 max-w-xl text-foreground/80">
              A notch-style toast system for React with smooth morphing, promise
              states, and edge-attached or floating placement
            </p>
            <div className="mt-8 max-w-xl">
              <CodeBlockTabsPkg command="notch-toast" type="install" />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <NoiseBackground
                containerClassName="hidden w-fit rounded-lg p-0.75 sm:block"
                gradientColors={[
                  "rgb(255, 100, 150)",
                  "rgb(100, 150, 255)",
                  "rgb(255, 200, 100)",
                ]}
              >
                <Link
                  className="flex h-full w-full items-center gap-2 rounded-md bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-4 py-1 text-sm text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-98 lg:py-1.25 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)]"
                  href="https://github.com"
                >
                  GitHub
                </Link>
              </NoiseBackground>
              <NoiseBackground
                containerClassName="w-fit rounded-lg p-0.75 sm:hidden"
                gradientColors={[
                  "rgb(255, 100, 150)",
                  "rgb(100, 150, 255)",
                  "rgb(255, 200, 100)",
                ]}
              >
                <Link
                  className="flex h-full w-full items-center gap-2 rounded-md bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-4 py-1 text-sm text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-98 lg:py-1.25 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)]"
                  href="/sponsor"
                >
                  agent.md
                </Link>
              </NoiseBackground>
              <Button asChild>
                <Link href="/docs">Read the docs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <NotchPlayground />
      <IntegrationSection />
    </>
  )
}
