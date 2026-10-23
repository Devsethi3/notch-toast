# notch-toast

Notch-style toast notifications for React. It renders one polished dynamic
island at a time, morphs updates in place, and supports attached or floating
top and bottom placements.

## Installation

```bash
pnpm add notch-toast
pnpm add motion
```

### shadcn/ui

Install a thin wrapper in `components/ui` (it installs the package and Motion):

```bash
npx shadcn@latest add https://notch-toast.vercel.app/r/notch-toaster.json
```

The wrapper exports `NotchToaster` and `notchToast`.

### AI agents

Install the bundled instructions for coding agents from the skills registry:

```bash
npx skills add Devsethi3/notch-toast
```

Or install the bundled skill directly:

```bash
npx notch-toast add-skill
npx notch-toast add-skill --agents
npx notch-toast add-skill --dir .cursor/skills/notch-toast
```

## Setup

Mount one toaster near your application root.

```tsx
import { NotchToaster } from "notch-toast"

export function App({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <NotchToaster />
    </>
  )
}
```

## Usage

```tsx
"use client"

import { toast } from "notch-toast"

toast.success("Changes saved")

toast.error("Unable to save changes", {
  duration: 0,
  action: {
    label: "Retry",
    onClick: () => retrySave(),
  },
})
```

Use `toast()`, `toast.success()`, `toast.error()`, `toast.warning()`,
`toast.info()`, `toast.loading()`, and `toast.promise()`. A new toast replaces
the active toast; reusing an ID with `toast.update()` morphs the active island
in place.

```tsx
<NotchToaster
  position="bottom-center"
  mode="attached"
  animation="fluid"
/>
```

`position` accepts `"top-center"` or `"bottom-center"`; `mode` accepts
`"attached"` or `"floating"`; and animation presets are `"fluid"`,
`"gooey"`, `"smooth"`, `"subtle"`, and `"snappy"`.

Toasts announce status changes without moving focus. Dismissible toasts can
be closed with their button or Escape, and reduced-motion preferences retain a
brief opacity fade while removing movement.

## License

[MIT](./LICENSE)
