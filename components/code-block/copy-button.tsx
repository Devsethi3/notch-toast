"use client"

import { useEffect, useState, type ComponentProps } from "react"

import { cn } from "cn"
import { copyToClipboard } from "@/utils/copy"
import { CheckIcon, CopyIcon } from "lucide-react"

interface CopyButtonProps extends ComponentProps<"button"> {
  content: string
  iconSize?: number
}

const CopyButton = ({
  content,
  iconSize = 14,
  className,
  ...props
}: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState<boolean>(false)

  useEffect(() => {
    if (!isCopied) return

    const timeout = setTimeout(() => {
      setIsCopied(false)
    }, 2000)
    return () => clearTimeout(timeout)
  }, [isCopied])

  const handleCopy = async () => {
    await copyToClipboard(content)
    setIsCopied(true)
  }

  return (
    <button
      title="Copy to clipboard"
      className={cn(
        "cursor-pointer",
        "transition-colors duration-200 ease-in-out",
        "text-neutral-600 dark:text-neutral-400",
        "hover:text-neutral-950 hover:dark:text-neutral-50",
        className
      )}
      onClick={handleCopy}
      {...props}
    >
      {isCopied ? (
        <CheckIcon
          size={iconSize}
          className="animate-in text-green-900 duration-200 zoom-in-50 dark:text-green-400"
        />
      ) : (
        <CopyIcon
          size={iconSize}
          className="animate-in duration-200 zoom-in-50"
        />
      )}
    </button>
  )
}

export { CopyButton }
