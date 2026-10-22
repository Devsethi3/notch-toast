"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"

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
      className="border-t border-border bg-background px-6 py-24"
    >
      <NotchToaster position={position} mode={mode} animation={animation} />

      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-medium text-muted-foreground">
            Interactive playground
          </p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight">
            Tune the motion. Then trigger it.
          </h2>
          <p className="mt-3 text-muted-foreground">
            These controls render the same package component that consumers
            install.
          </p>
        </div>

        <div className="grid overflow-hidden rounded-2xl border border-border bg-background shadow-sm lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border-b border-border p-6 lg:border-r lg:border-b-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Examples</h3>
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
          </div>

          <div className="p-6 sm:p-8">
            <div className="space-y-7">
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
              <Control
                label={`Display duration · ${(duration / 1000).toFixed(1)}s`}
              >
                <input
                  type="range"
                  min="1500"
                  max="8000"
                  step="100"
                  value={duration}
                  onChange={(event) => setDuration(Number(event.target.value))}
                  className="w-full accent-foreground"
                />
              </Control>
              <div className="rounded-xl bg-muted p-4">
                <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Generated code
                </p>
                <pre className="overflow-x-auto text-xs leading-5 text-foreground">
                  <code>{code}</code>
                </pre>
              </div>
            </div>
          </div>
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
