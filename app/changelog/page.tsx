import { Footer } from "@/components/footer"
import { SiteHeader } from "@/components/landing/site-header"

type ChangeGroup = {
  label: "Added" | "Changed"
  items: string[]
}

type Release = {
  version: string
  status: string
  summary: string
  changes: ChangeGroup[]
}

const releases: Release[] = [
  {
    version: "0.2.0",
    status: "Unreleased",
    summary: "Dismissible controls, installation paths, and clearer guidance.",
    changes: [
      {
        label: "Added",
        items: [
          "A dismissible builder control to preview the close button on any toast type.",
          "A shadcn registry wrapper for installing Notch Toast into components/ui.",
          "A bundled AI-agent skill and the notch-toast add-skill command.",
          "Dedicated shadcn, AI-agent, and dismissible-toast documentation.",
        ],
      },
      {
        label: "Changed",
        items: [
          "Improved mobile overflow handling for landing-page code blocks.",
          "Updated the package and site version to 0.2.0.",
        ],
      },
    ],
  },
  {
    version: "0.1.0",
    status: "Initial release",
    summary: "A compact, morphing toast system for React.",
    changes: [
      {
        label: "Added",
        items: [
          "Attached and floating notch placements at the top or bottom of the viewport.",
          "Status helpers, promise transitions, actions, and programmatic dismissal.",
          "Motion presets and reduced-motion support.",
        ],
      },
    ],
  },
]

function ChangeGroup({ label, items }: ChangeGroup) {
  return (
    <div>
      <h3 className="text-sm font-medium text-foreground">{label}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span
              aria-hidden="true"
              className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground/50"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ChangelogPage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <SiteHeader sticky />

      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="max-w-2xl border-b border-border pb-10">
          <p className="font-mono text-sm font-medium text-muted-foreground">
            Changelog
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight text-balance">
            What&apos;s changed
          </h1>
          <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
            A concise history of improvements to Notch Toast. Unreleased notes
            describe changes included in the next package version.
          </p>
        </div>

        <div className="relative mt-12 space-y-10 before:absolute before:top-3 before:bottom-3 before:left-3 before:w-px before:bg-border before:content-[''] sm:mt-16">
          {releases.map((release) => (
            <article
              key={release.version}
              className="relative pl-10 sm:grid sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-8"
            >
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="absolute top-2 -left-9 size-4 rounded-full border-[5px] border-background bg-foreground/60"
                />
                <p className="font-mono text-sm font-medium">
                  v{release.version}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {release.status}
                </p>
              </div>

              <div className="mt-5 rounded-xl border border-border bg-muted/15 p-5 sm:mt-0 sm:p-6">
                <p className="text-base font-medium">{release.summary}</p>
                <div className="mt-6 space-y-6">
                  {release.changes.map((group) => (
                    <ChangeGroup key={group.label} {...group} />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  )
}
