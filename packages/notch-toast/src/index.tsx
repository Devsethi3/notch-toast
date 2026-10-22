"use client"

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react"
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"

export type NotchToastType =
  "default" | "success" | "error" | "warning" | "info" | "loading"
export type NotchPosition = "top-center" | "bottom-center"
export type NotchMode = "attached" | "floating"
export type NotchAnimationPreset =
  "fluid" | "gooey" | "smooth" | "subtle" | "snappy"

export type NotchToastAction = {
  label: ReactNode
  onClick: () => void
}

export type NotchToastOptions = {
  id?: string
  duration?: number
  dismissible?: boolean
  action?: NotchToastAction
}

export type NotchToastInput = NotchToastOptions & {
  title: string
  type?: NotchToastType
}

export type PromiseToastOptions<T> = NotchToastOptions & {
  loading: string
  success: string | ((value: T) => string)
  error: string | ((reason: unknown) => string)
}

export type NotchToastRecord = Required<
  Pick<NotchToastInput, "id" | "title" | "type" | "duration" | "dismissible">
> &
  Pick<NotchToastInput, "action"> & {
    revision: number
  }

const defaultDuration: Record<NotchToastType, number> = {
  default: 3600,
  success: 3600,
  info: 3600,
  warning: 0,
  error: 0,
  loading: 0,
}

let idSeed = 0
let revisionSeed = 0
let activeToast: NotchToastRecord | null = null
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function createToast(input: NotchToastInput): NotchToastRecord {
  const type = input.type ?? "default"

  return {
    id: input.id ?? `notch-${Date.now()}-${idSeed++}`,
    title: input.title,
    type,
    duration: input.duration ?? defaultDuration[type],
    dismissible:
      input.dismissible ??
      (type === "error" || type === "warning" || type === "loading"),
    action: input.action,
    revision: revisionSeed++,
  }
}

function show(input: NotchToastInput) {
  activeToast = createToast(input)
  emit()
  return activeToast.id
}

function showPromise<T>(
  promiseOrFactory: Promise<T> | (() => Promise<T>),
  options: PromiseToastOptions<T>
) {
  const { loading, success, error, ...toastOptions } = options
  const id = show({
    ...toastOptions,
    title: loading,
    type: "loading",
    duration: 0,
    dismissible: false,
  })
  const loadingRevision = activeToast?.revision
  const isCurrentPromise = () =>
    activeToast?.id === id && activeToast.revision === loadingRevision

  let promise: Promise<T>
  try {
    promise = Promise.resolve(
      typeof promiseOrFactory === "function"
        ? promiseOrFactory()
        : promiseOrFactory
    )
  } catch (reason) {
    promise = Promise.reject(reason)
  }

  return promise.then(
    (value) => {
      if (isCurrentPromise()) {
        show({
          ...toastOptions,
          id,
          title: typeof success === "function" ? success(value) : success,
          type: "success",
        })
      }
      return value
    },
    (reason: unknown) => {
      if (isCurrentPromise()) {
        show({
          ...toastOptions,
          id,
          title: typeof error === "function" ? error(reason) : error,
          type: "error",
        })
      }
      throw reason
    }
  )
}

export const toast = Object.assign(
  (title: string, options?: NotchToastOptions) =>
    show({ title, ...options, type: "default" }),
  {
    success: (title: string, options?: NotchToastOptions) =>
      show({ title, ...options, type: "success" }),
    error: (title: string, options?: NotchToastOptions) =>
      show({ title, ...options, type: "error" }),
    warning: (title: string, options?: NotchToastOptions) =>
      show({ title, ...options, type: "warning" }),
    info: (title: string, options?: NotchToastOptions) =>
      show({ title, ...options, type: "info" }),
    loading: (title: string, options?: NotchToastOptions) =>
      show({ title, ...options, type: "loading" }),
    promise: showPromise,
    update: (
      id: string,
      patch: Partial<Omit<NotchToastRecord, "id" | "revision">>
    ) => {
      if (!activeToast || activeToast.id !== id) return
      activeToast = { ...activeToast, ...patch, revision: revisionSeed++ }
      emit()
    },
    dismiss: (id?: string) => {
      if (!activeToast || (id && activeToast.id !== id)) return
      activeToast = null
      emit()
    },
  }
)

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return activeToast
}

/** Measures the intrinsic active-toast size so the shell can morph without scaling content. */
function useContentSize(revision: number | undefined) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null
  )

  const measure = () => {
    const element = ref.current
    if (!element) return
    setSize({ width: element.offsetWidth, height: element.offsetHeight })
  }

  useLayoutEffect(measure, [revision])

  useEffect(() => {
    const element = ref.current
    if (!element || typeof ResizeObserver === "undefined") return

    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [revision])

  return [ref, size] as const
}

const presets: Record<NotchAnimationPreset, Transition> = {
  fluid: { type: "spring", stiffness: 400, damping: 32, mass: 0.62 },
  gooey: { type: "spring", stiffness: 280, damping: 18, mass: 0.7 },
  smooth: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  subtle: { type: "spring", stiffness: 340, damping: 40, mass: 0.58 },
  snappy: { type: "spring", stiffness: 520, damping: 34, mass: 0.48 },
}

const contentTransition = { duration: 0.42, ease: [0.16, 1, 0.3, 1] } as const
const reducedMotionFade = {
  duration: 0.18,
  ease: [0.16, 1, 0.3, 1],
} as const

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

export type NotchToasterProps = {
  position?: NotchPosition
  mode?: NotchMode
  animation?: NotchAnimationPreset
}

/**
 * The renderer for the singleton latest-toast-wins store. Mount it once per app.
 * An attached bottom toaster uses the same edge-connected notch silhouette as the top.
 */
export function NotchToaster({
  position = "top-center",
  mode = "attached",
  animation = "fluid",
}: NotchToasterProps) {
  const toastState = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const reduceMotion = useReducedMotion()
  const isBottom = position === "bottom-center"
  const transition = reduceMotion ? reducedMotionFade : presets[animation]
  const [contentRef, contentSize] = useContentSize(toastState?.revision)
  const slotOffset = isBottom ? 7 : -7
  const slotOrigin =
    mode === "attached" ? (isBottom ? "bottom center" : "top center") : "center"

  useEffect(() => {
    if (!toastState || toastState.duration <= 0) return

    const timeout = window.setTimeout(
      () => toast.dismiss(toastState.id),
      toastState.duration
    )

    return () => window.clearTimeout(timeout)
  }, [toastState])

  useEffect(() => {
    if (!toastState?.dismissible) return

    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || isEditableTarget(event.target)) return
      toast.dismiss(toastState.id)
    }

    window.addEventListener("keydown", dismissOnEscape)
    return () => window.removeEventListener("keydown", dismissOnEscape)
  }, [toastState])

  return (
    <div
      className={`nt-root nt-${position} nt-${mode}`}
      data-animation={animation}
    >
      <NotchStyles />
      <AnimatePresence initial={false}>
        {toastState ? (
          <motion.div
            role={toastState.type === "error" ? "alert" : "status"}
            aria-live={toastState.type === "error" ? "assertive" : "polite"}
            aria-atomic="true"
            className="nt-shell"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: isBottom ? 12 : -12,
                    scale: 0.96,
                    filter: "blur(8px)",
                  }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    width: contentSize?.width,
                    height: contentSize?.height,
                  }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: isBottom ? 8 : -8,
                    scale: 0.96,
                    filter: "blur(6px)",
                  }
            }
            transition={transition}
          >
            <div className="nt-viewport">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={toastState.revision}
                  ref={contentRef}
                  className="nt-content"
                  initial={
                    reduceMotion
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          y: slotOffset,
                          scale: 0.92,
                          filter: "blur(5px)",
                        }
                  }
                  animate={
                    reduceMotion
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
                  }
                  exit={
                    reduceMotion
                      ? { opacity: 0, transition: reducedMotionFade }
                      : {
                          opacity: 0,
                          y: slotOffset,
                          scale: 0.92,
                          filter: "blur(0px)",
                          transition: {
                            duration: 0.1,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        }
                  }
                  transition={transition}
                  style={{ transformOrigin: slotOrigin }}
                >
                  <StatusIcon
                    type={toastState.type}
                    reduceMotion={reduceMotion}
                  />
                  <TextSlider
                    text={toastState.title}
                    reduceMotion={reduceMotion}
                  />
                  <AnimatePresence initial={false} mode="popLayout">
                    {toastState.action ? (
                      <motion.button
                        key="action"
                        type="button"
                        onClick={toastState.action.onClick}
                        className="nt-action"
                        initial={
                          reduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, x: 6, filter: "blur(4px)" }
                        }
                        animate={
                          reduceMotion
                            ? { opacity: 1 }
                            : { opacity: 1, x: 0, filter: "blur(0px)" }
                        }
                        exit={
                          reduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, x: 6, filter: "blur(4px)" }
                        }
                        transition={
                          reduceMotion ? reducedMotionFade : contentTransition
                        }
                      >
                        {toastState.action.label}
                      </motion.button>
                    ) : null}
                  </AnimatePresence>
                  {toastState.dismissible ? (
                    <DismissButton id={toastState.id} />
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function TextSlider({
  text,
  reduceMotion,
}: {
  text: string
  reduceMotion: boolean | null
}) {
  return (
    <motion.span
      layout={reduceMotion ? false : "size"}
      transition={reduceMotion ? reducedMotionFade : presets.fluid}
      className="nt-label"
      aria-label={text}
    >
      <span aria-hidden="true" className="nt-label-sizer">
        {text}
      </span>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={text}
          aria-hidden
          className="nt-label-slide"
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: "100%", filter: "blur(6px)" }
          }
          animate={
            reduceMotion
              ? { opacity: 1 }
              : { opacity: 1, y: "0%", filter: "blur(0px)" }
          }
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: "-100%", filter: "blur(6px)" }
          }
          transition={reduceMotion ? reducedMotionFade : contentTransition}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
}

function StatusIcon({
  type,
  reduceMotion,
}: {
  type: NotchToastType
  reduceMotion: boolean | null
}) {
  if (type === "default") return null

  return (
    <span aria-hidden className={`nt-icon nt-icon-${type}`}>
      {type === "loading" ? (
        <Spinner reduceMotion={reduceMotion} />
      ) : (
        <Icon type={type} reduceMotion={reduceMotion} />
      )}
    </span>
  )
}

function Spinner({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <span
      className={reduceMotion ? "nt-spinner nt-spinner-static" : "nt-spinner"}
    />
  )
}

function Icon({
  type,
  reduceMotion,
}: {
  type: Exclude<NotchToastType, "loading">
  reduceMotion: boolean | null
}) {
  if (type === "success") return <SuccessIcon reduceMotion={reduceMotion} />
  if (type === "error") return <ErrorIcon reduceMotion={reduceMotion} />
  if (type === "warning") return <WarningIcon reduceMotion={reduceMotion} />
  if (type === "info") return <InfoIcon reduceMotion={reduceMotion} />

  return null
}

function SuccessIcon({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <motion.svg
      viewBox="0 0 16 16"
      fill="none"
      className="nt-check"
      stroke="currentColor"
      strokeWidth="2.15"
      style={{ y: 0.4 }}
      initial={reduceMotion ? false : { scale: 0.86, rotate: -4 }}
      animate={
        reduceMotion
          ? { scale: 1, rotate: 0 }
          : { scale: [0.86, 1.075, 0.985, 1], rotate: [-4, 1.8, -0.6, 0] }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.5, delay: 0.14, ease: [0.16, 1, 0.3, 1] }
      }
    >
      <motion.path
        d="m3.45 8.15 2.75 2.7 6.35-6.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={
          reduceMotion
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        }
        animate={{ pathLength: 1, opacity: 1 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.46, delay: 0.16, ease: [0.16, 1, 0.3, 1] }
        }
      />
    </motion.svg>
  )
}

function ErrorIcon({ reduceMotion }: { reduceMotion: boolean | null }) {
  const strokeTransition: Transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.34, ease: [0.16, 1, 0.3, 1] as const }

  return (
    <motion.svg
      viewBox="0 0 16 16"
      fill="none"
      className="nt-check"
      stroke="currentColor"
      strokeWidth="2.25"
      style={{ y: 0.2 }}
      initial={reduceMotion ? false : { scale: 0.86, rotate: -3 }}
      animate={
        reduceMotion
          ? { scale: 1, rotate: 0 }
          : { scale: [0.86, 1.065, 0.985, 1], rotate: [-3, 1.8, -0.5, 0] }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.46, delay: 0.14, ease: [0.16, 1, 0.3, 1] }
      }
    >
      <motion.path
        d="M3.7 3.7 12.3 12.3"
        strokeLinecap="round"
        initial={
          reduceMotion
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        }
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ ...strokeTransition, delay: reduceMotion ? 0 : 0.16 }}
      />
      <motion.path
        d="M12.3 3.7 3.7 12.3"
        strokeLinecap="round"
        initial={
          reduceMotion
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        }
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ ...strokeTransition, delay: reduceMotion ? 0 : 0.26 }}
      />
    </motion.svg>
  )
}

function WarningIcon({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className="nt-alert-icon"
      initial={reduceMotion ? false : { scale: 0.88, rotate: -2 }}
      animate={
        reduceMotion
          ? { scale: 1, rotate: 0 }
          : { scale: [0.88, 1.055, 0.99, 1], rotate: [-2, 1, -0.3, 0] }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.42, delay: 0.12, ease: [0.16, 1, 0.3, 1] }
      }
    >
      <path
        fill="currentColor"
        d="M10.06 2.15a2.24 2.24 0 0 1 3.88 0l8.7 15.07a2.24 2.24 0 0 1-1.94 3.36H3.3a2.24 2.24 0 0 1-1.94-3.36l8.7-15.07Z"
      />
      <motion.path
        d="M12 8.2v4.65"
        stroke="var(--foreground,#171717)"
        strokeWidth="2.35"
        strokeLinecap="round"
        initial={
          reduceMotion
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        }
        animate={{ pathLength: 1, opacity: 1 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
        }
      />
      <motion.circle
        cx="12"
        cy="16.55"
        r="1.35"
        fill="var(--foreground,#171717)"
        initial={
          reduceMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
        }
        animate={{ scale: 1, opacity: 1 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.2, delay: 0.42, ease: [0.16, 1, 0.3, 1] }
        }
      />
    </motion.svg>
  )
}

function InfoIcon({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className="nt-alert-icon"
      initial={reduceMotion ? false : { scale: 0.88, rotate: -2 }}
      animate={
        reduceMotion
          ? { scale: 1, rotate: 0 }
          : { scale: [0.88, 1.055, 0.99, 1], rotate: [-2, 1, -0.3, 0] }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.42, delay: 0.12, ease: [0.16, 1, 0.3, 1] }
      }
    >
      <circle cx="12" cy="12" r="11.25" fill="currentColor" />
      <motion.path
        d="M12 7.55v5"
        stroke="var(--foreground,#171717)"
        strokeWidth="2.45"
        strokeLinecap="round"
        initial={
          reduceMotion
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        }
        animate={{ pathLength: 1, opacity: 1 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
        }
      />
      <motion.circle
        cx="12"
        cy="16.65"
        r="1.35"
        fill="var(--foreground,#171717)"
        initial={
          reduceMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
        }
        animate={{ scale: 1, opacity: 1 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.2, delay: 0.42, ease: [0.16, 1, 0.3, 1] }
        }
      />
    </motion.svg>
  )
}

function DismissButton({ id }: { id: string }) {
  return (
    <button
      type="button"
      onClick={() => toast.dismiss(id)}
      aria-label="Dismiss notification"
      aria-keyshortcuts="Escape"
      className="nt-dismiss"
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className="nt-close"
        stroke="currentColor"
        strokeWidth="1.75"
      >
        <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
      </svg>
    </button>
  )
}

function NotchStyles() {
  return (
    <style>{`
    .nt-root{pointer-events:none;position:fixed;inset-inline:0;z-index:90;display:flex;justify-content:center;padding-inline:16px}
    .nt-top-center{top:0}.nt-bottom-center{bottom:0}.nt-shell{--nt-notch-radius:16px;pointer-events:auto;position:relative;isolation:isolate;display:flex;width:fit-content;max-width:100%;background:var(--foreground,#171717);color:var(--background,#fff);box-shadow:0 8px 20px color-mix(in srgb,var(--muted-foreground,#737373) 16%,transparent);will-change:width,height,filter,opacity,transform}.nt-viewport{display:flex;overflow:hidden}.nt-attached.nt-top-center .nt-shell{border-radius:0 0 var(--nt-notch-radius) var(--nt-notch-radius);transform-origin:top center}.nt-attached.nt-bottom-center .nt-shell{border-radius:var(--nt-notch-radius) var(--nt-notch-radius) 0 0;transform-origin:bottom center}.nt-floating{top:16px;bottom:auto}.nt-floating.nt-bottom-center{top:auto;bottom:16px}.nt-floating .nt-shell{border-radius:20px;transform-origin:center}
    .nt-attached .nt-shell:before,.nt-attached .nt-shell:after{content:"";position:absolute;width:var(--nt-notch-radius);height:var(--nt-notch-radius);background:inherit;pointer-events:none;transform:translateZ(0);-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%}.nt-attached.nt-top-center .nt-shell:before{top:0;left:calc(-1 * var(--nt-notch-radius) + .5px);-webkit-mask-image:radial-gradient(circle at 0 100%,transparent calc(var(--nt-notch-radius) - .5px),#000 calc(var(--nt-notch-radius) + .5px));mask-image:radial-gradient(circle at 0 100%,transparent calc(var(--nt-notch-radius) - .5px),#000 calc(var(--nt-notch-radius) + .5px))}.nt-attached.nt-top-center .nt-shell:after{top:0;right:calc(-1 * var(--nt-notch-radius) + .5px);-webkit-mask-image:radial-gradient(circle at 100% 100%,transparent calc(var(--nt-notch-radius) - .5px),#000 calc(var(--nt-notch-radius) + .5px));mask-image:radial-gradient(circle at 100% 100%,transparent calc(var(--nt-notch-radius) - .5px),#000 calc(var(--nt-notch-radius) + .5px))}.nt-attached.nt-bottom-center .nt-shell:before{bottom:0;left:calc(-1 * var(--nt-notch-radius) + .5px);-webkit-mask-image:radial-gradient(circle at 0 0,transparent calc(var(--nt-notch-radius) - .5px),#000 calc(var(--nt-notch-radius) + .5px));mask-image:radial-gradient(circle at 0 0,transparent calc(var(--nt-notch-radius) - .5px),#000 calc(var(--nt-notch-radius) + .5px))}.nt-attached.nt-bottom-center .nt-shell:after{bottom:0;right:calc(-1 * var(--nt-notch-radius) + .5px);-webkit-mask-image:radial-gradient(circle at 100% 0,transparent calc(var(--nt-notch-radius) - .5px),#000 calc(var(--nt-notch-radius) + .5px));mask-image:radial-gradient(circle at 100% 0,transparent calc(var(--nt-notch-radius) - .5px),#000 calc(var(--nt-notch-radius) + .5px))}
    .nt-content{display:flex;width:max-content;max-width:calc(100vw - 32px);align-items:center;gap:12px;padding:12px 20px}.nt-icon{display:grid;width:16px;height:16px;flex:none;place-items:center;border-radius:999px;background:var(--background,#fff);color:var(--foreground,#171717)}.nt-icon-loading,.nt-icon-warning,.nt-icon-info{background:transparent;color:var(--background,#fff)}.nt-label{position:relative;display:inline-flex;height:1.25em;overflow:hidden;vertical-align:middle;line-height:1.25;white-space:nowrap;font-size:14px;font-weight:600}.nt-label-sizer{visibility:hidden}.nt-label-slide{position:absolute;inset-inline:0;top:0;white-space:nowrap}.nt-spinner{box-sizing:border-box;display:block;width:14px;height:14px;border:2px solid color-mix(in srgb,currentColor 32%,transparent);border-top-color:currentColor;border-radius:50%;animation:nt-spin .8s linear infinite;will-change:transform}.nt-spinner-static{animation:none}@media (prefers-reduced-motion:reduce){.nt-spinner{animation:none}}@keyframes nt-spin{to{transform:rotate(1turn)}}.nt-check{width:10px;height:10px}.nt-alert-icon{width:16px;height:16px}.nt-symbol{font-size:11px;line-height:1}.nt-info{font-size:10px;font-weight:700}.nt-action,.nt-dismiss{border:0;background:transparent;color:color-mix(in srgb,var(--background,#fff) 76%,transparent);font:inherit;cursor:pointer}.nt-action{padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600}.nt-dismiss{display:grid;width:24px;height:24px;place-items:center;border-radius:6px}.nt-action:hover,.nt-dismiss:hover{background:color-mix(in srgb,var(--background,#fff) 12%,transparent);color:var(--background,#fff)}.nt-action:focus-visible,.nt-dismiss:focus-visible{outline:2px solid var(--background,#fff);outline-offset:2px}.nt-close{width:12px;height:12px}
  `}</style>
  )
}
