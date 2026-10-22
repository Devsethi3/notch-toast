"use client"

import { useEffect, useState, type ComponentProps } from "react"

import { cn } from "@/lib/utils"
import { highlight, Themes, type Languages } from "@/utils/shiki/highlight"

interface CodeblockClientShikiProps extends ComponentProps<"div"> {
  code: string
  language?: Languages
  lineNumbers?: boolean
}

const CodeblockShiki = ({
  code,
  language = "tsx",
  lineNumbers = false,
  className,
  ...props
}: CodeblockClientShikiProps) => {
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function clientHighlight() {
      if (!code) {
        if (!cancelled) {
          setHighlightedHtml("<pre><code></code></pre>")
        }
        return
      }
      const highlighter = await highlight()
      const html = highlighter.codeToHtml(code, {
        lang: language,
        themes: {
          light: Themes.light,
          dark: Themes.dark,
        },
        transformers: [
          {
            name: "AddLineNumbers",
            pre(node) {
              if (lineNumbers) {
                const shikiStyles = node.properties.class
                node.properties.class = `${shikiStyles} shiki-line-numbers`
              }
            },
          },
        ],
      })
      if (!cancelled) {
        setHighlightedHtml(html)
      }
    }
    void clientHighlight()

    return () => {
      cancelled = true
    }
  }, [code, language, lineNumbers])

  const classNames = cn("w-full min-w-0 max-w-full overflow-x-auto", className)

  return highlightedHtml ? (
    <div
      className={classNames}
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      {...props}
    />
  ) : (
    <div className={classNames} {...props}>
      <pre className="px-4 py-3">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export { CodeblockShiki }
