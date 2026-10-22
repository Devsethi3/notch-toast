import { execFileSync } from "node:child_process"
import { mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { basename, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const packageDirectory = resolve(fileURLToPath(new URL("..", import.meta.url)))
const temporaryDirectory = await mkdtemp(
  join(tmpdir(), "notch-toast-consumer-")
)
const pnpmEntry = process.env.npm_execpath

if (!pnpmEntry) {
  throw new Error("The consumer smoke test must be run with pnpm.")
}

function run(args, cwd) {
  execFileSync(process.execPath, [pnpmEntry, ...args], {
    cwd,
    stdio: "inherit",
  })
}

try {
  run(["pack", "--pack-destination", temporaryDirectory], packageDirectory)
  const tarball = (await readdir(temporaryDirectory)).find((file) =>
    file.endsWith(".tgz")
  )

  if (!tarball) {
    throw new Error("The package tarball was not created.")
  }

  const tarballPath = join(temporaryDirectory, tarball)

  await mkdir(join(temporaryDirectory, "src"))

  await writeFile(
    join(temporaryDirectory, "package.json"),
    JSON.stringify(
      {
        name: "notch-toast-consumer-smoke",
        private: true,
        type: "module",
        dependencies: {
          motion: "^14.4.0",
          "notch-toast": `file:${tarballPath.replaceAll("\\", "/")}`,
          react: "^19.3.0",
          "react-dom": "^19.3.0",
        },
        devDependencies: {
          "@types/react": "^19.0.0",
          "@types/react-dom": "^19.0.0",
          typescript: "^5.0.0",
        },
      },
      null,
      2
    )
  )
  await writeFile(
    join(temporaryDirectory, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          jsx: "react-jsx",
          module: "NodeNext",
          moduleResolution: "NodeNext",
          noEmit: true,
          strict: true,
          target: "ES2022",
        },
        include: ["src"],
      },
      null,
      2
    )
  )

  await writeFile(
    join(temporaryDirectory, "src", "app.tsx"),
    `import { NotchToaster, toast } from "notch-toast"\n\nexport function App() {\n  toast.success("Ready")\n  return <NotchToaster position="bottom-center" mode="attached" />\n}\n`
  )

  run(["install", "--ignore-workspace"], temporaryDirectory)
  run(["exec", "tsc", "--noEmit"], temporaryDirectory)

  console.log(`Consumer smoke test passed for ${basename(tarballPath)}.`)
} finally {
  await rm(temporaryDirectory, { force: true, recursive: true })
}
