#!/usr/bin/env node

import {
  appendFile,
  copyFile,
  mkdir,
  readFile,
  writeFile,
} from "node:fs/promises"
import { join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const packageDirectory = resolve(fileURLToPath(new URL("..", import.meta.url)))
const [command, ...args] = process.argv.slice(2)

function getOption(name) {
  const index = args.indexOf(name)
  return index === -1 ? undefined : args[index + 1]
}

function usage() {
  console.log("Usage: notch-toast add-skill [--agents] [--dir <directory>]")
}

if (command !== "add-skill") {
  usage()
  process.exitCode = 1
} else {
  const targetDirectory = resolve(
    process.cwd(),
    getOption("--dir") ?? ".claude/skills/notch-toast"
  )
  const skillPath = join(targetDirectory, "SKILL.md")

  await mkdir(targetDirectory, { recursive: true })
  await copyFile(join(packageDirectory, "SKILL.md"), skillPath)
  console.log(`Installed notch-toast skill at ${skillPath}`)

  if (args.includes("--agents")) {
    const agentsPath = resolve(process.cwd(), "AGENTS.md")
    const pointer = `Read ${relative(process.cwd(), skillPath).replaceAll("\\", "/")} before using notch-toast.`
    try {
      const existing = await readFile(agentsPath, "utf8")
      if (existing.includes(pointer)) {
        console.log("AGENTS.md already points to the notch-toast skill.")
      } else {
        await appendFile(agentsPath, `\n${pointer}\n`)
        console.log(`Added a notch-toast skill pointer to ${agentsPath}`)
      }
    } catch {
      await writeFile(agentsPath, `# Agent instructions\n\n${pointer}\n`)
      console.log(`Created ${agentsPath}`)
    }
  }
}
