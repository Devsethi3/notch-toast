"use client"

import type { FC, SVGProps } from "react"
import { usePackageManager, type PackageManager } from "@/stores/packageManager"

import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockIcon,
} from "@/components/code-block/code-block"
import { CopyButton } from "@/components/code-block/copy-button"
import { CodeblockShiki } from "@/components/code-block/client/shiki"

import { Bun, NPM, PNPM, Yarn } from "@react-symbols/icons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Command {
  name: PackageManager
  install: string
  icon: FC<SVGProps<SVGSVGElement>>
  dlx: string
}

interface CodeBlockTabsPkgProps {
  command: string
  type: "install" | "dlx"
}

const Commands: Command[] = [
  {
    name: "npm",
    install: "npm i",
    icon: NPM,
    dlx: "npx",
  },
  {
    name: "pnpm",
    install: "pnpm i",
    icon: PNPM,
    dlx: "pnpm dlx",
  },
  {
    name: "yarn",
    install: "yarn add",
    icon: Yarn,
    dlx: "yarn dlx",
  },
  {
    name: "bun",
    install: "bun add",
    icon: Bun,
    dlx: "bunx --bun",
  },
]

const CodeBlockTabsPkg = ({ command, type }: CodeBlockTabsPkgProps) => {
  const { packageManager, setPackageManager } = usePackageManager()

  const selectedPkg =
    Commands.find((pkg) => pkg.name === packageManager) ?? Commands[0]
  const fullCommand = `${selectedPkg[type]} ${command}`

  return (
    <Tabs
      className="w-full gap-1"
      value={packageManager}
      onValueChange={(value) => setPackageManager(value as PackageManager)}
    >
      <CodeBlock>
        <CodeBlockHeader>
          <div className="flex items-center space-x-1">
            <CodeBlockIcon language="bash" />
            <TabsList className="gap-1 border-0 bg-transparent dark:bg-transparent">
              {Commands.map((cmd) => {
                const Icon = cmd.icon
                return (
                  <TabsTrigger
                    key={cmd.name}
                    value={cmd.name}
                    className="data-[state=active]:shadow-none"
                  >
                    <Icon className="size-4" />
                    <span>{cmd.name}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>
          <CopyButton className="pl-1" content={fullCommand} />
        </CodeBlockHeader>
        <CodeBlockContent>
          {Commands.map((cmd) => (
            <TabsContent key={cmd.name} value={cmd.name} className="mt-0">
              <CodeblockShiki
                language="bash"
                code={`${cmd[type]} ${command}`}
              />
            </TabsContent>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </Tabs>
  )
}

export { CodeBlockTabsPkg }
