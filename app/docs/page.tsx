import { CodeblockShiki } from "@/components/code-block/client/shiki"
import {
  CodeBlock as BaseCodeBlock,
  CodeBlockContent,
  CodeBlockGroup,
  CodeBlockHeader,
  CodeBlockIcon,
} from "@/components/code-block/code-block"
import { CopyButton } from "@/components/code-block/copy-button"
import { CodeBlockTabsPkg } from "@/components/code-block/blocks/copy-with-tabs-package-manager"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { SiteHeader } from "@/components/landing/site-header"
import type { Languages } from "@/utils/shiki/highlight"

type CodeBlockProps = {
  children: string
  label?: string
  language?: Languages
}

function DocumentationCodeBlock({
  children,
  label = "tsx",
  language = "tsx",
}: CodeBlockProps) {
  return (
    <BaseCodeBlock>
      <CodeBlockHeader>
        <CodeBlockGroup>
          <CodeBlockIcon language={language} />
          <span className="truncate">{label}</span>
        </CodeBlockGroup>
        <CopyButton content={children} />
      </CodeBlockHeader>
      <CodeBlockContent>
        <CodeblockShiki
          code={children}
          language={language}
          className="text-sm leading-6 text-foreground"
        />
      </CodeBlockContent>
    </BaseCodeBlock>
  )
}

function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-sm font-medium text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-medium tracking-tight text-balance">
        {title}
      </h2>
      <div className="mt-2 leading-7 text-pretty text-muted-foreground">
        {children}
      </div>
    </div>
  )
}

const setup = `// app/layout.tsx
import { NotchToaster } from "notch-toast"

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <NotchToaster />
      </body>
    </html>
  )
}`

const firstToast = `"use client"

import { toast } from "notch-toast"

export function SaveButton() {
  return (
    <button onClick={() => toast.success("Changes saved")}>Save</button>
  )
}`

const shadcnInstall =
  "npx shadcn@latest add https://notch-toast.vercel.app/r/notch-toaster.json"

const shadcnUsage = [
  "// app/layout.tsx",
  'import { NotchToaster } from "@/components/ui/notch-toaster"',
  "",
  "export default function RootLayout({ children }: { children: React.ReactNode }) {",
  "  return (",
  '    <html lang="en">',
  "      <body>",
  "        {children}",
  "        <NotchToaster />",
  "      </body>",
  "    </html>",
  "  )",
  "}",
  "",
  "// In a client component",
  'import { notchToast } from "@/components/ui/notch-toaster"',
  "",
  'notchToast.success("Saved!")',
].join("\n")

const skillsInstall = "npx skills add Devsethi3/notch-toast"

const directSkillInstall = [
  "npx notch-toast add-skill            # -> .claude/skills/notch-toast/SKILL.md",
  "npx notch-toast add-skill --agents   # also adds an AGENTS.md pointer",
  "npx notch-toast add-skill --dir .cursor/skills/notch-toast",
].join("\n")

const toastMethods = `import { toast } from "notch-toast"

toast("A new notification arrived")
toast.success("Changes saved")
toast.error("Unable to save changes")
toast.warning("Your session is about to expire")
toast.info("A new version is available")
toast.loading("Syncing changes")`

const options = `toast.error("Unable to save changes", {
  id: "save-changes",
  duration: 0,
  dismissible: true,
  action: {
    label: "Retry",
    onClick: () => retrySave(),
  },
})`

const promise = `async function saveChanges() {
  const response = await fetch("/api/settings", { method: "POST" })
  if (!response.ok) throw new Error("Save failed")
  return response.json() as Promise<{ name: string }>
}

void toast
  .promise(saveChanges(), {
    loading: "Saving changes",
    success: (settings) => \`Saved \${settings.name}\`,
    error: "Unable to save changes",
    duration: 3600,
  })
  .catch(() => undefined)`

const updateAndDismiss = `const id = toast.loading("Publishing changes", {
  id: "publish",
})

try {
  await publishChanges()
  toast.update(id, {
    title: "Published successfully",
    type: "success",
    duration: 3600,
    dismissible: false,
  })
} catch {
  toast.update(id, {
    title: "Publishing failed",
    type: "error",
    duration: 0,
    dismissible: true,
  })
}

toast.dismiss(id) // dismiss this toast
toast.dismiss() // dismiss the active toast`

const configuredToaster = `<NotchToaster
  position="bottom-center"
  mode="floating"
  animation="smooth"
/>`

export default function DocsPage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <SiteHeader sticky />

      <div className="mx-auto grid max-w-5xl items-start gap-12 px-6 py-7 lg:grid-cols-[180px_minmax(0,1fr)]">
        <DocsSidebar />

        <div className="min-w-0">
          <div className="max-w-3xl border-b border-border pb-10">
            <p className="font-mono text-sm font-medium text-muted-foreground">
              Documentation
            </p>
            <h1 className="mt-3 text-2xl font-medium text-balance text-foreground/90">
              Notch-style notifications for React.
            </h1>
            <p className="mt-2 max-w-2xl text-base text-balance text-foreground/70">
              A small toast API with an attached notch or floating dynamic
              island.
            </p>
          </div>

          <div className="space-y-20 py-10">
            <section id="installation" className="scroll-mt-24 space-y-7">
              <SectionHeading
                eyebrow="01) Get started"
                title="Install, mount, and trigger"
              >
                Add the package, mount one global toaster, then trigger it from
                any client component.
              </SectionHeading>
              <CodeBlockTabsPkg command="notch-toast" type="install" />
              <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-5">
                <p className="text-sm leading-6 text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Motion dependency.
                  </span>{" "}
                  Notch Toast uses Motion for its transitions. Install it once
                  alongside the package.
                </p>
                <CodeBlockTabsPkg command="motion" type="install" />
              </div>
              <DocumentationCodeBlock label="app/layout.tsx">
                {setup}
              </DocumentationCodeBlock>
              <DocumentationCodeBlock label="SaveButton.tsx">
                {firstToast}
              </DocumentationCodeBlock>
            </section>

            <section id="shadcn" className="scroll-mt-24 space-y-7">
              <SectionHeading
                eyebrow="02) shadcn/ui"
                title="Install a local wrapper"
              >
                Add Notch Toast through the shadcn registry with one command. It
                creates a thin wrapper in{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                  components/ui
                </code>{" "}
                and installs the package and Motion dependency.
              </SectionHeading>
              <DocumentationCodeBlock label="Terminal" language="bash">
                {shadcnInstall}
              </DocumentationCodeBlock>
              <DocumentationCodeBlock label="app/layout.tsx">
                {shadcnUsage}
              </DocumentationCodeBlock>
              <p className="rounded-xl border border-border bg-muted/25 p-4 text-sm leading-6 text-muted-foreground">
                The generated component is intentionally a small local wrapper.
                Keep one <code>NotchToaster</code> mounted in your layout and
                call <code>notchToast</code> from client components.
              </p>
            </section>

            <section id="ai-agents" className="scroll-mt-24 space-y-7">
              <SectionHeading
                eyebrow="03) AI agents & skills"
                title="Give your agent the right context"
              >
                The bundled skill teaches coding agents the API, the required
                toaster mount, and the dismissible-toast behavior before they
                add notifications to your app.
              </SectionHeading>
              <div className="space-y-3">
                <p className="text-sm leading-6 text-muted-foreground">
                  Install it from the skills registry:
                </p>
                <DocumentationCodeBlock label="Terminal" language="bash">
                  {skillsInstall}
                </DocumentationCodeBlock>
              </div>
              <div className="space-y-3">
                <p className="text-sm leading-6 text-muted-foreground">
                  Or install the bundled skill directly from the package:
                </p>
                <DocumentationCodeBlock label="Terminal" language="bash">
                  {directSkillInstall}
                </DocumentationCodeBlock>
              </div>
            </section>

            <section id="toast-methods" className="scroll-mt-24 space-y-7">
              <SectionHeading eyebrow="04) API reference" title="Toast methods">
                Call the default{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                  toast()
                </code>{" "}
                function for neutral messages, or use a status helper when the
                message has a semantic state. Each call returns its toast ID.
              </SectionHeading>
              <DocumentationCodeBlock>{toastMethods}</DocumentationCodeBlock>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[540px] text-left text-sm">
                  <thead className="border-b border-border bg-muted/35 text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Method</th>
                      <th className="px-4 py-3 font-medium">
                        Default behavior
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs">toast()</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Neutral text-only toast; dismisses after 3.6 seconds.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs">success()</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Success state; dismisses after 3.6 seconds.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs">info()</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Informational state; dismisses after 3.6 seconds.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs">
                        warning() / error()
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Persistent and dismissible until action is taken.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs">loading()</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Persistent progress state, intended to morph or update.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="promise" className="scroll-mt-24 space-y-7">
              <SectionHeading
                eyebrow="05) Promise"
                title="Morph progress into a result"
              >
                Use{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                  toast.promise()
                </code>{" "}
                for async work. It shows a loading island immediately, then
                updates that same island to success or error when the promise
                settles.
              </SectionHeading>
              <DocumentationCodeBlock>{promise}</DocumentationCodeBlock>
              <p className="rounded-xl border border-border bg-muted/25 p-4 text-sm leading-6 text-muted-foreground">
                <span className="font-medium text-foreground">Note:</span> the
                returned promise preserves the original rejection. Handle or
                await it as you normally would.
              </p>
            </section>

            <section id="update-dismiss" className="scroll-mt-24 space-y-7">
              <SectionHeading
                eyebrow="06) Update and dismiss"
                title="Control the active island"
              >
                Give a toast a stable ID to morph it in place. Use
                <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                  {" "}
                  update
                </code>{" "}
                for explicit state changes and{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                  dismiss
                </code>{" "}
                to remove it.
              </SectionHeading>
              <DocumentationCodeBlock>
                {updateAndDismiss}
              </DocumentationCodeBlock>
              <p className="text-sm leading-6 text-muted-foreground">
                The toaster is intentionally latest-toast-wins: a new trigger
                replaces the active island. Updating an active toast with the
                same ID morphs its content in place.
              </p>
            </section>

            <section id="options" className="scroll-mt-24 space-y-7">
              <SectionHeading
                eyebrow="07) Options and duration"
                title="Adjust a toast when needed"
              >
                All toast helpers accept the same options object. Keep defaults
                for short confirmations; make important feedback persistent.
              </SectionHeading>
              <DocumentationCodeBlock>{options}</DocumentationCodeBlock>
              <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
                <div className="bg-background p-5">
                  <code className="text-sm font-medium">id</code>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    A stable identity for a toast you plan to update or dismiss.
                  </p>
                </div>
                <div className="bg-background p-5">
                  <code className="text-sm font-medium">duration</code>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Milliseconds until dismissal. Set <code>0</code> to keep it
                    visible.
                  </p>
                </div>
                <div className="bg-background p-5">
                  <code className="text-sm font-medium">dismissible</code>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Shows a close button when true. Errors, warnings, and
                    loading states default to true.
                  </p>
                </div>
                <div className="bg-background p-5">
                  <code className="text-sm font-medium">action</code>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    An optional label and callback, useful for retry or undo
                    flows.
                  </p>
                </div>
              </div>
              <p className="rounded-xl border border-border bg-muted/25 p-4 text-sm leading-6 text-muted-foreground">
                <span className="font-medium text-foreground">
                  Accessibility.
                </span>{" "}
                Toasts announce updates without stealing focus. Dismissible
                toasts support their close button and the Escape key; reduced
                motion keeps a short opacity fade while removing movement.
              </p>
            </section>

            <section id="configuration" className="scroll-mt-24 space-y-7">
              <SectionHeading
                eyebrow="08) Placement and motion"
                title="Configure the presentation"
              >
                Configure the mounted toaster once. Top-center attached is the
                default; bottom-center automatically uses the matching attached
                bottom notch.
              </SectionHeading>
              <DocumentationCodeBlock>
                {configuredToaster}
              </DocumentationCodeBlock>
              <div className="grid gap-5 sm:grid-cols-3">
                <div className="rounded-xl border border-border p-5">
                  <h3 className="font-medium">Position</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    <code>top-center</code> or <code>bottom-center</code>.
                  </p>
                </div>
                <div className="rounded-xl border border-border p-5">
                  <h3 className="font-medium">Mode</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    <code>attached</code> joins the edge; <code>floating</code>{" "}
                    adds an inset.
                  </p>
                </div>
                <div className="rounded-xl border border-border p-5">
                  <h3 className="font-medium">Animation</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    <code>fluid</code>, <code>gooey</code>, <code>smooth</code>,{" "}
                    <code>subtle</code>, or <code>snappy</code>.
                  </p>
                </div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                <code className="font-medium text-foreground">fluid</code> is
                the default balanced spring. Use{" "}
                <code className="font-medium text-foreground">gooey</code> for
                expressive bounce,{" "}
                <code className="font-medium text-foreground">smooth</code> for
                eased transitions,{" "}
                <code className="font-medium text-foreground">subtle</code> for
                restrained motion, and{" "}
                <code className="font-medium text-foreground">snappy</code> for
                faster feedback. Reduced-motion preferences are respected
                automatically.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
