import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata, Viewport } from "next"

import "./globals.css"
import { MotionProvider } from "@/components/motion-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { SITE_URL } from "@/lib/site"
import { cn } from "@/lib/utils"

const siteTitle = "Notch Toast - Beautiful React Toast Notifications"
const siteDescription =
  "Notch Toast is an open-source React toast library with smooth morphing, promise states, and elegant notch or floating notifications for modern web apps."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteTitle,
    template: "%s | Notch Toast",
  },
  description: siteDescription,
  applicationName: "Notch Toast",
  keywords: [
    "Notch Toast",
    "React toast",
    "toast notifications",
    "React notifications",
    "shadcn toast",
    "dynamic island toast",
    "Motion React",
    "open source React library",
  ],
  authors: [{ name: "Dev Sethi", url: "https://devsethi.site" }],
  creator: "Dev Sethi",
  publisher: "Dev Sethi",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/logo-ico.png",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Notch Toast",
    title: siteTitle,
    description: siteDescription,
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Notch Toast, beautiful toast notifications for React",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    creator: "@imsethidev",
    images: [
      {
        url: "/og-image.png",
        alt: "Notch Toast, beautiful toast notifications for React",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfb" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: "Notch Toast",
  description: siteDescription,
  url: SITE_URL,
  codeRepository: "https://github.com/Devsethi3/notch-toast",
  license: "https://opensource.org/license/mit/",
  programmingLanguage: ["TypeScript", "React"],
  runtimePlatform: "React",
  author: {
    "@type": "Person",
    name: "Dev Sethi",
    url: "https://devsethi.site",
    sameAs: ["https://x.com/imsethidev"],
  },
}

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <MotionProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </MotionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  )
}
