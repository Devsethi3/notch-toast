import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("motion/react", async () => {
  const React = await import("react")
  const elements = new Map<string, React.ForwardRefExoticComponent<never>>()

  const motion = new Proxy(
    {},
    {
      get: (_, key) => {
        const tagName = String(key)
        const existing = elements.get(tagName)
        if (existing) return existing

        const element = React.forwardRef<HTMLElement, Record<string, unknown>>(
          (props, ref) => {
            const domProps = { ...props }
            delete domProps.animate
            delete domProps.exit
            delete domProps.initial
            delete domProps.layout
            delete domProps.transition

            return React.createElement(tagName, { ...domProps, ref })
          }
        )
        element.displayName = `Motion.${tagName}`

        elements.set(tagName, element as React.ForwardRefExoticComponent<never>)
        return element
      },
    }
  )

  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    MotionConfig: ({ children }: { children: React.ReactNode }) => children,
    motion,
    useReducedMotion: () => true,
  }
})

import { NotchToaster, toast } from "./index"

function renderToaster(
  props: Partial<React.ComponentProps<typeof NotchToaster>> = {}
) {
  return render(<NotchToaster {...props} />)
}

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })

  return { promise, reject, resolve }
}

function emitToast<T>(callback: () => T) {
  let result!: T
  act(() => {
    result = callback()
  })
  return result
}

describe("notch-toast", () => {
  beforeEach(() => {
    toast.dismiss()
    vi.useRealTimers()
  })

  afterEach(() => {
    toast.dismiss()
    vi.useRealTimers()
  })

  it("keeps only the newest toast and updates a matching ID in place", () => {
    renderToaster()

    expect(emitToast(() => toast.success("First toast", { id: "first" }))).toBe(
      "first"
    )
    emitToast(() => toast.error("Second toast", { id: "second" }))

    expect(screen.getByRole("alert").textContent).toContain("Second toast")

    emitToast(() =>
      toast.update("second", {
        title: "Updated toast",
        type: "warning",
        dismissible: true,
      })
    )

    expect(screen.queryByRole("alert")).toBeNull()
    expect(screen.getByRole("status").textContent).toContain("Updated toast")
  })

  it("respects IDs, direct dismissal, and time-based dismissal", async () => {
    renderToaster()
    vi.useFakeTimers()

    emitToast(() =>
      toast.success("Timed toast", { id: "timed", duration: 100 })
    )
    emitToast(() => toast.dismiss("different-id"))
    expect(screen.getByRole("status").textContent).toContain("Timed toast")

    await act(async () => {
      await vi.advanceTimersByTimeAsync(700)
    })

    expect(screen.queryByRole("status")).toBeNull()

    emitToast(() =>
      toast.error("Persistent toast", { id: "persistent", duration: 0 })
    )
    emitToast(() => toast.dismiss("persistent"))
    expect(screen.queryByRole("alert")).toBeNull()
  })

  it("morphs promise loading into success and error states", async () => {
    renderToaster()
    const successful = deferred<string>()

    const successPromise = emitToast(() =>
      toast.promise(successful.promise, {
        loading: "Saving changes",
        success: (value) => `Saved ${value}`,
        error: "Unable to save",
      })
    )

    expect(screen.getByRole("status").textContent).toContain("Saving changes")

    await act(async () => {
      successful.resolve("settings")
      await successPromise
    })

    expect(screen.getByRole("status").textContent).toContain("Saved settings")

    const failed = deferred<void>()
    const failurePromise = emitToast(() =>
      toast.promise(failed.promise, {
        loading: "Syncing changes",
        success: "Changes synced",
        error: "Unable to sync",
      })
    )

    await act(async () => {
      failed.reject(new Error("Sync failed"))
      await expect(failurePromise).rejects.toThrow("Sync failed")
    })

    expect(screen.getByRole("alert").textContent).toContain("Unable to sync")
  })

  it("does not let a stale promise overwrite a newer toast", async () => {
    renderToaster()
    const pending = deferred<void>()
    const promise = emitToast(() =>
      toast.promise(pending.promise, {
        loading: "Working",
        success: "Old success",
        error: "Old error",
      })
    )

    emitToast(() => toast.error("Newest notification", { id: "newest" }))

    await act(async () => {
      pending.resolve()
      await promise
    })

    expect(screen.getByRole("alert").textContent).toContain(
      "Newest notification"
    )
    expect(screen.queryByText("Old success")).toBeNull()
  })

  it("announces the right role, preserves focus, and dismisses with Escape", async () => {
    renderToaster()
    const trigger = document.createElement("button")
    document.body.append(trigger)
    trigger.focus()

    emitToast(() => toast.error("Could not save"))

    const alert = screen.getByRole("alert")
    expect(alert.getAttribute("aria-live")).toBe("assertive")
    expect(document.activeElement).toBe(trigger)

    fireEvent.keyDown(window, { key: "Escape" })
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull())
    trigger.remove()

    emitToast(() => toast.success("Saved"))
    expect(screen.getByRole("status").getAttribute("aria-live")).toBe("polite")
  })

  it("uses opacity-only reduced motion and renders top and bottom classes", () => {
    const { container, rerender } = renderToaster({
      position: "bottom-center",
      mode: "attached",
    })

    emitToast(() => toast.loading("Syncing"))
    expect(container.querySelector(".nt-root")?.classList).toContain(
      "nt-bottom-center"
    )
    expect(container.querySelector(".nt-root")?.classList).toContain(
      "nt-attached"
    )
    expect(container.querySelector(".nt-spinner")?.classList).toContain(
      "nt-spinner-static"
    )
    expect(
      container.querySelector<HTMLElement>(".nt-shell")?.style.transform
    ).toBe("")

    rerender(<NotchToaster position="top-center" mode="floating" />)

    expect(container.querySelector(".nt-root")?.classList).toContain(
      "nt-top-center"
    )
    expect(container.querySelector(".nt-root")?.classList).toContain(
      "nt-floating"
    )
  })
})
