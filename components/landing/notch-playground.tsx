"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"

import { CodeblockShiki } from "@/components/code-block/client/shiki"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockGroup,
  CodeBlockHeader,
  CodeBlockIcon,
} from "@/components/code-block/code-block"
import { CopyButton } from "@/components/code-block/copy-button"
import { DotField } from "@/components/dot-field"
import Scrubber from "@/components/smoothui/scrubber"
import {
  NotchToaster,
  toast,
  type NotchAnimationPreset,
  type NotchMode,
  type NotchPosition,
  type NotchToastType,
} from "notch-toast"

const toastTypes: NotchToastType[] = [
  "default",
  "success",
  "error",
  "warning",
  "info",
]
const positions: NotchPosition[] = ["top-center", "bottom-center"]
const modes: NotchMode[] = ["attached", "floating"]
const animations: NotchAnimationPreset[] = [
  "fluid",
  "gooey",
  "smooth",
  "subtle",
  "snappy",
]

const titleByType: Record<NotchToastType, string> = {
  default: "A new notification arrived",
  success: "Toast rendered successfully",
  error: "Unable to save changes",
  warning: "Your session is about to expire",
  info: "A new version is available",
  loading: "Syncing changes",
}

type PlaygroundExample = "toast" | "promise-success" | "promise-error"

const promiseTitles = {
  loading: "Syncing changes",
  success: "Changes synced successfully",
  error: "Unable to sync changes",
} as const

export function NotchPlayground() {
  const [position, setPosition] = useState<NotchPosition>("top-center")
  const [mode, setMode] = useState<NotchMode>("attached")
  const [animation, setAnimation] = useState<NotchAnimationPreset>("fluid")
  const [type, setType] = useState<NotchToastType>("success")
  const [title, setTitle] = useState(titleByType.success)
  const [duration, setDuration] = useState(3600)
  const [example, setExample] = useState<PlaygroundExample>("toast")
  const replacementTimer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (replacementTimer.current !== null) {
        window.clearTimeout(replacementTimer.current)
      }
    },
    []
  )

  const showToast = (nextType = type, nextTitle = title) => {
    const options = {
      id: "playground-toast",
      duration,
      action:
        nextType === "error"
          ? {
              label: "Retry",
              onClick: () =>
                toast.success("Changes saved successfully", {
                  id: "playground-toast",
                  duration,
                }),
            }
          : undefined,
    }

    switch (nextType) {
      case "success":
        toast.success(nextTitle, options)
        break
      case "error":
        toast.error(nextTitle, options)
        break
      case "warning":
        toast.warning(nextTitle, options)
        break
      case "info":
        toast.info(nextTitle, options)
        break
      case "loading":
        toast.loading(nextTitle, options)
        break
      default:
        toast(nextTitle, options)
    }
  }

  const showPromise = (outcome: "success" | "error") => {
    const finalTitle = promiseTitles[outcome]

    setExample(`promise-${outcome}`)
    setType(outcome)
    setTitle(finalTitle)

    const operation = new Promise<void>((resolve, reject) => {
      window.setTimeout(
        () =>
          outcome === "success" ? resolve() : reject(new Error("Sync failed")),
        1100
      )
    })

    void toast
      .promise(operation, {
        id: "playground-toast",
        duration,
        loading: promiseTitles.loading,
        success: promiseTitles.success,
        error: promiseTitles.error,
      })
      .catch(() => undefined)
  }

  const showLatestToastWins = () => {
    if (replacementTimer.current !== null) {
      window.clearTimeout(replacementTimer.current)
    }

    toast.success("First toast", {
      id: "playground-toast",
      duration,
    })

    replacementTimer.current = window.setTimeout(() => {
      toast.error("Latest toast wins", {
        id: "playground-toast",
        duration: 0,
        action: {
          label: "Retry",
          onClick: () =>
            toast.success("Changes saved successfully", {
              id: "playground-toast",
              duration,
            }),
        },
      })
      replacementTimer.current = null
    }, 280)
  }

  const code = useMemo(() => {
    const toaster = `<NotchToaster\n  position="${position}"\n  mode="${mode}"\n  animation="${animation}"\n/>`

    if (example !== "toast") {
      return `${toaster}\n\ntoast.promise(saveChanges(), {\n  loading: "${promiseTitles.loading}",\n  success: "${promiseTitles.success}",\n  error: "${promiseTitles.error}",\n  duration: ${duration},\n})`
    }

    return `${toaster}\n\ntoast.${type === "default" ? "" : `${type}.`}("${title}", {\n  duration: ${duration},\n})`.replace(
      "toast.(",
      "toast("
    )
  }, [animation, duration, example, mode, position, title, type])

  return (
    <section
      id="playground"
      className="relative isolate min-w-0 overflow-x-clip bg-background text-foreground"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 text-muted-foreground/70">
        <DotField
          gap={12}
          maxRadius={2.4}
          speed={0.7}
          opacity={0.55}
          clearArea={{ x: 0.5, y: 0.5, radiusX: 0.4, radiusY: 0.62 }}
        />
      </div>
      <NotchToaster position={position} mode={mode} animation={animation} />

      <div className="mx-auto w-full min-w-0 max-w-5xl px-4 sm:px-6">
        <div className="grid min-w-0 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
          <section className="min-w-0 pt-7">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-medium">
                Examples
              </h2>
              <span className="text-xs text-muted-foreground">
                Click to preview
              </span>
            </div>
            <div className="mt-7 space-y-6">
              <ExampleGroup label="Toast types">
                {toastTypes.map((item) => (
                  <ExampleButton
                    key={item}
                    onClick={() => {
                      const nextTitle = titleByType[item]
                      setType(item)
                      setTitle(nextTitle)
                      setExample("toast")
                      showToast(item, nextTitle)
                    }}
                  >
                    {item}
                  </ExampleButton>
                ))}
              </ExampleGroup>
              <ExampleGroup label="Promise (Morph Animation)">
                <ExampleButton onClick={() => showPromise("success")}>
                  Promise + Success (pill)
                </ExampleButton>
                <ExampleButton onClick={() => showPromise("error")}>
                  Promise + Error (pill)
                </ExampleButton>
              </ExampleGroup>
              <ExampleGroup label="Behavior checks">
                <ExampleButton onClick={showLatestToastWins}>
                  Latest toast wins
                </ExampleButton>
              </ExampleGroup>
              <div className="flex flex-wrap gap-2">
                <ExampleButton
                  onClick={() => toast.dismiss("playground-toast")}
                >
                  Reset toast
                </ExampleButton>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                Promise examples morph from a loader into their final state.
                Every toast dismisses after the selected duration.
              </div>
            </div>
          </section>

          <section className="min-w-0 pt-7">
            <div>
              <h2 className="text-lg font-medium">Builder</h2>

            </div>
            <div className="mt-7 min-w-0 rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6">
              <div className="space-y-6 sm:space-y-7">
                <Control label="Position">
                  <Segmented
                    options={positions}
                    value={position}
                    onChange={setPosition}
                  />
                </Control>
                <Control label="Display mode">
                  <Segmented options={modes} value={mode} onChange={setMode} />
                </Control>
                <Control label="Animation preset">
                  <Segmented
                    options={animations}
                    value={animation}
                    onChange={setAnimation}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Fluid is the default. Gooey is intentionally expressive;
                    smooth, subtle, and snappy refine the same motion system.
                  </p>
                </Control>
                <Control label="Title">
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm transition-shadow outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
                  />
                </Control>
                <Scrubber
                  label="Display duration"
                  value={duration / 1000}
                  onValueChange={(value) =>
                    setDuration(Math.round(value * 1000))
                  }
                  min={1.5}
                  max={8}
                  step={0.1}
                  decimals={1}
                  ticks={7}
                />
                <CodeBlock className="min-w-0">
                  <CodeBlockHeader>
                    <CodeBlockGroup>
                      <CodeBlockIcon language="tsx" />
                      <span>Generated code</span>
                    </CodeBlockGroup>
                    <CopyButton content={code} />
                  </CodeBlockHeader>
                  <CodeBlockContent>
                    <CodeblockShiki
                      code={code}
                      language="tsx"
                      className="text-xs leading-5 text-foreground"
                    />
                  </CodeBlockContent>
                </CodeBlock>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

function Control({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  )
}

function ExampleGroup({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function ExampleButton({
  children,
  onClick,
}: {
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full bg-muted px-3 py-2 text-sm transition-colors hover:bg-muted/70"
    >
      {children}
    </button>
  )
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          type="button"
          key={option}
          onClick={() => onChange(option)}
          className={`rounded-full border px-3 py-1.5 text-sm capitalize transition-colors ${value === option ? "border-foreground bg-foreground text-background" : "border-border bg-background hover:bg-muted"}`}
        >
          {option.replace("-", " ")}
        </button>
      ))}
    </div>
  )
}
