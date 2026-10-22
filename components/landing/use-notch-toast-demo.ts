"use client"

import { useCallback, useEffect, useReducer } from "react"

export type NotchToastKind = "success" | "error" | "info" | "loading"

export type NotchToast = {
  id: string
  kind: NotchToastKind
  title: string
  duration?: number
}

type NotchToastState = {
  active: NotchToast | null
}

type NotchToastAction =
  | { type: "enqueue"; toast: NotchToast }
  | { type: "dismiss"; id?: string }
  | { type: "update"; id: string; patch: Partial<Omit<NotchToast, "id">> }

const defaultDuration: Record<NotchToastKind, number> = {
  success: 3600,
  info: 3600,
  loading: 0,
  error: 0,
}

function normalizeToast(toast: NotchToast): NotchToast {
  return {
    ...toast,
    duration: toast.duration ?? defaultDuration[toast.kind],
  }
}

function reducer(
  state: NotchToastState,
  action: NotchToastAction
): NotchToastState {
  switch (action.type) {
    case "enqueue": {
      const toast = normalizeToast(action.toast)

      return { active: toast }
    }

    case "dismiss": {
      if (!state.active || (action.id && state.active.id !== action.id))
        return state
      return { active: null }
    }

    case "update": {
      if (state.active?.id === action.id) {
        return { ...state, active: { ...state.active, ...action.patch } }
      }

      return state
    }
  }
}

export function useNotchToastDemo() {
  const [state, dispatch] = useReducer(reducer, { active: null })

  useEffect(() => {
    const toast = state.active
    if (!toast || !toast.duration || toast.duration <= 0) return

    const timeout = window.setTimeout(() => {
      dispatch({ type: "dismiss", id: toast.id })
    }, toast.duration)

    return () => window.clearTimeout(timeout)
  }, [state.active])

  const show = useCallback((toast: NotchToast) => {
    dispatch({ type: "enqueue", toast })
  }, [])

  const dismiss = useCallback((id?: string) => {
    dispatch({ type: "dismiss", id })
  }, [])

  const clear = useCallback(() => {
    dispatch({ type: "dismiss" })
  }, [])

  const update = useCallback(
    (id: string, patch: Partial<Omit<NotchToast, "id">>) => {
      dispatch({ type: "update", id, patch })
    },
    []
  )

  return { activeToast: state.active, clear, dismiss, show, update }
}
