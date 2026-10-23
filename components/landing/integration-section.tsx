import { CodeblockShiki } from "@/components/code-block/client/shiki"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockGroup,
  CodeBlockHeader,
  CodeBlockIcon,
} from "@/components/code-block/code-block"
import { CopyButton } from "@/components/code-block/copy-button"

const shadcnCommand =
  "npx shadcn@latest add https://notch-toast.vercel.app/r/notch-toaster.json"
const skillsCommand = "npx skills add Devsethi3/notch-toast"
const directSkillCommand = `npx notch-toast add-skill            # -> .claude/skills/notch-toast/SKILL.md
npx notch-toast add-skill --agents   # also adds an AGENTS.md pointer
npx notch-toast add-skill --dir .cursor/skills/notch-toast`

function CommandBlock({ command }: { command: string }) {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockGroup>
          <CodeBlockIcon language="bash" />
          <span>Terminal</span>
        </CodeBlockGroup>
        <CopyButton content={command} />
      </CodeBlockHeader>
      <CodeBlockContent>
        <CodeblockShiki
          code={command}
          language="bash"
          className="text-sm leading-6 text-foreground"
        />
      </CodeBlockContent>
    </CodeBlock>
  )
}

export function IntegrationSection() {
  return (
    <section className="min-w-0 overflow-x-clip pt-20 pb-10 text-foreground">
      <div className="mx-auto grid w-full max-w-5xl min-w-0 gap-12 px-6">
        <section className="min-w-0 space-y-5">
          <p className="font-mono text-sm font-medium text-muted-foreground">
            02
          </p>
          <div>
            <h2 className="text-2xl font-medium tracking-tight">shadcn/ui</h2>
            <p className="mt-3 max-w-lg leading-7 text-muted-foreground">
              Add a thin, local wrapper in <code>components/ui</code> with one
              command. It installs <code>notch-toast</code> and Motion while
              keeping your app&apos;s public API in your own source tree.
            </p>
          </div>
          <CommandBlock command={shadcnCommand} />
          <p className="text-sm leading-6 text-muted-foreground">
            Import <code>NotchToaster</code> and <code>notchToast</code> from
            <code> @/components/ui/notch-toaster</code>, mount one toaster in
            your layout, and trigger it from client components.
          </p>
        </section>

        <section className="min-w-0 space-y-5">
          <p className="font-mono text-sm font-medium text-muted-foreground">
            03
          </p>
          <div>
            <h2 className="text-2xl font-medium tracking-tight">
              AI agents &amp; skills
            </h2>
            <p className="mt-3 max-w-lg leading-7 text-muted-foreground">
              Give your coding agent the correct mount, API, and dismissible
              toast guidance before it writes its first notification.
            </p>
          </div>
          <CommandBlock command={skillsCommand} />
          <p className="text-sm leading-6 text-muted-foreground">
            Or install the bundled skill directly from the package:
          </p>
          <CommandBlock command={directSkillCommand} />
        </section>
      </div>
    </section>
  )
}
