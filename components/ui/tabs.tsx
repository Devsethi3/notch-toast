"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

function TabsList({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex h-8 items-center rounded-md bg-muted p-0.5 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Tab>) {
  return (
    <TabsPrimitive.Tab
      className={cn(
        "inline-flex h-7 items-center justify-center gap-1.5 rounded px-2 text-xs font-medium transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none data-[active]:bg-background data-[active]:text-foreground data-[active]:shadow-xs",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Panel>) {
  return <TabsPrimitive.Panel className={cn(className)} {...props} />
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
