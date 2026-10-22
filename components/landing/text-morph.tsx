"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"

type TextMorphProps = {
  children: string
  className?: string
}

const easeOut = [0.16, 1, 0.3, 1] as const

const widthSpring = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.55,
} as const

const slideTransition = {
  duration: 0.54,
  ease: easeOut,
} as const

/** A compact, single-line status slider that keeps surrounding layout in motion. */
export function TextMorph({ children, className }: TextMorphProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.span
      layout="size"
      aria-label={children}
      transition={reduceMotion ? { duration: 0 } : widthSpring}
      className={`relative inline-flex h-[1.25em] overflow-hidden align-middle ${className ?? ""}`}
    >
      <span aria-hidden className="invisible whitespace-nowrap">
        {children}
      </span>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={children}
          aria-hidden
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
          transition={reduceMotion ? { duration: 0 } : slideTransition}
          className="absolute inset-x-0 top-0 whitespace-nowrap"
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
}
