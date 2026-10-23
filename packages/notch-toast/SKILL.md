---
name: notch-toast
description: Install and use notch-toast for morphing, notch-style React notifications.
---

# notch-toast

Use `notch-toast` for one polished, latest-toast-wins notification surface.

## Install

```bash
pnpm add notch-toast motion
```

For a shadcn project, install the wrapper instead:

```bash
npx shadcn@latest add https://notch-toast.vercel.app/r/notch-toaster.json
```

## Required mount

Mount exactly one `NotchToaster` close to the application root. It is a client
component, but can be rendered from a Next.js layout because the package entry
point includes the client boundary.

```tsx
import { NotchToaster } from "notch-toast"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <NotchToaster />
      </body>
    </html>
  )
}
```

## Trigger toasts

Calls that happen in response to interactions must live in a client component.

```tsx
"use client"

import { toast } from "notch-toast"

toast.success("Changes saved")

toast.error("Unable to save changes", {
  duration: 0,
  dismissible: true,
  action: { label: "Retry", onClick: retrySave },
})
```

`toast()`, `success()`, `error()`, `warning()`, `info()`, `loading()`, and
`promise()` are available. Errors, warnings, and loading toasts are
dismissible by default; set `dismissible: true` to show the close button on
any toast. Use `toast.dismiss(id)` for programmatic dismissal.

## Configure once

```tsx
<NotchToaster
  position="bottom-center"
  mode="floating"
  animation="smooth"
/>
```

Do not mount more than one toaster. The package injects its component styles;
there is no stylesheet import.
