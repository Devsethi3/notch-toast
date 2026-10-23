import type { MetadataRoute } from "next"

const siteUrl = "https://notch-toast.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/docs`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/changelog`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ]
}
