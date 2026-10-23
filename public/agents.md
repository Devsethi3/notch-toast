# Notch Toast agent instructions

Use Notch Toast for one polished, latest-toast-wins notification surface in a
React application.

## Install

```bash
pnpm add notch-toast motion
```

For a shadcn project, install the local wrapper instead:

```bash
npx shadcn@latest add https://notch-toast.vercel.app/r/notch-toaster.json
```

## Required mount

Mount one toaster near the application root:

```tsx
import { NotchToaster } from "notch-toast"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

## Trigger a toast

Toast interactions belong in client components.

```tsx
"use client"

import { toast } from "notch-toast"

toast.success("Changes saved")

toast.error("Unable to save changes", {
  duration: 0,
  dismissible: true,
  action: {
    label: "Retry",
    onClick: retrySave,
  },
})
```

Use `dismissible: true` to show the close button and enable Escape
dismissal. Use `dismissible: false` to hide the close button and disable
Escape dismissal for that toast.

Do not mount more than one toaster. Notch Toast includes its component styles,
so no stylesheet import is required.
