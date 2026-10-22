"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { TextMorph } from "./text-morph"
import type { NotchToast, NotchToastKind } from "./use-notch-toast-demo"

type NotchToastDemoProps = {
  toast: NotchToast | null
  onDismiss: (id: string) => void
  onRetry: (id: string) => void
}

const easeOut = [0.16, 1, 0.3, 1] as const

const shellSpring = {
  type: "spring",
  stiffness: 420,
  damping: 40,
  mass: 0.5,
} as const

const contentReveal = { duration: 0.28, ease: easeOut } as const

export function NotchToastDemo({
  toast,
  onDismiss,
  onRetry,
}: NotchToastDemoProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4">
      <AnimatePresence initial={false}>
        {toast ? (
          <motion.div
            layout
            role={toast.kind === "error" ? "alert" : "status"}
            aria-live={toast.kind === "error" ? "assertive" : "polite"}
            aria-atomic="true"
            className="pointer-events-auto relative isolate flex w-fit max-w-full items-center overflow-visible rounded-b-[20px] bg-foreground text-background shadow-[0_12px_32px_rgb(0_0_0/0.18)] will-change-[filter,opacity,transform] [--notch-radius:18px] before:absolute before:top-0 before:-left-[17px] before:size-[var(--notch-radius)] before:bg-foreground before:[mask-image:radial-gradient(circle_at_0_100%,transparent_var(--notch-radius),#000_calc(var(--notch-radius)+0.5px))] after:absolute after:top-0 after:-right-[17px] after:size-[var(--notch-radius)] after:bg-foreground after:[mask-image:radial-gradient(circle_at_100%_100%,transparent_var(--notch-radius),#000_calc(var(--notch-radius)+0.5px))]"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -12, scale: 0.96, filter: "blur(8px)" }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
            }
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -8, scale: 0.96, filter: "blur(6px)" }
            }
            style={{ transformOrigin: "top center" }}
            transition={shouldReduceMotion ? { duration: 0 } : shellSpring}
          >
            <div className="flex w-full items-center gap-3 px-5 py-3">
              <StatusIcon kind={toast.kind} reduceMotion={shouldReduceMotion} />
              <TextMorph className="text-sm leading-5 font-medium whitespace-nowrap">
                {toast.title}
              </TextMorph>

              <AnimatePresence initial={false} mode="popLayout">
                {toast.kind === "error" ? (
                  <motion.div
                    key="error-actions"
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, x: 6, filter: "blur(4px)" }
                    }
                    animate={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 1, x: 0, filter: "blur(0px)" }
                    }
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, x: 6, filter: "blur(4px)" }
                    }
                    transition={
                      shouldReduceMotion ? { duration: 0 } : contentReveal
                    }
                    className="flex items-center gap-1"
                  >
                    <button
                      type="button"
                      onClick={() => onRetry(toast.id)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-background/75 transition-colors hover:bg-background/10 hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
                    >
                      Retry
                    </button>
                    <DismissButton onClick={() => onDismiss(toast.id)} />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function StatusIcon({
  kind,
  reduceMotion,
}: {
  kind: NotchToastKind
  reduceMotion: boolean | null
}) {
  return (
    <motion.span
      layout
      aria-hidden
      className={
        "grid size-4 shrink-0 place-items-center rounded-full " +
        (kind === "error"
          ? "bg-red-500 text-white"
          : kind === "info"
            ? "bg-sky-400 text-sky-950"
            : "bg-background text-foreground")
      }
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.8, y: 8, filter: "blur(6px)" }
      }
      animate={
        reduceMotion
          ? { opacity: 1 }
          : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
      }
      transition={reduceMotion ? { duration: 0 } : contentReveal}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={kind}
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 6, scale: 0.82, filter: "blur(5px)" }
          }
          animate={
            reduceMotion
              ? { opacity: 1 }
              : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
          }
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: -6, scale: 0.9, filter: "blur(5px)" }
          }
          transition={reduceMotion ? { duration: 0 } : contentReveal}
          className="inline-flex"
        >
          {kind === "loading" ? (
            <Spinner reduceMotion={reduceMotion} />
          ) : (
            <Icon kind={kind} />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
}

function Spinner({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <motion.span
      className="size-2.5 rounded-full border border-current/30 border-t-current"
      animate={reduceMotion ? undefined : { rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
    />
  )
}

function Icon({ kind }: { kind: Exclude<NotchToastKind, "loading"> }) {
  if (kind === "error")
    return <span className="text-[11px] leading-none">!</span>
  if (kind === "info")
    return <span className="text-[10px] leading-none font-semibold">i</span>

  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className="size-2.5"
      stroke="currentColor"
      strokeWidth="2.25"
    >
      <path
        d="m3.25 8.25 2.9 2.75 6.6-6.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DismissButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Dismiss notification"
      className="grid size-6 place-items-center rounded-md text-background/70 transition-colors hover:bg-background/10 hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className="size-3"
        stroke="currentColor"
        strokeWidth="1.75"
      >
        <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
      </svg>
    </button>
  )
}
