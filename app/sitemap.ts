import type { MetadataRoute } from "next"
import { activities } from "@/data/activities"
import { site } from "@/data/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    ...activities.map((a) => ({ url: `${site.url}/${a.id}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ]
}
