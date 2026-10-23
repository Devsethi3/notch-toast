import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Notch Toast — React Toast Notifications",
    short_name: "Notch Toast",
    description:
      "Open-source React toast notifications with smooth notch and floating animations.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfbfb",
    theme_color: "#fbfbfb",
    categories: ["developer", "utilities"],
    icons: [
      {
        src: "/logo-ico.png",
        sizes: "1254x1254",
        type: "image/png",
        purpose: "any",
      },
    ],
  }
}
