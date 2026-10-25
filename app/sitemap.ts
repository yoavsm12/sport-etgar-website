import type { MetadataRoute } from "next"
import { activities } from "@/data/activities"
import { site } from "@/data/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/privacy`, changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${site.url}/accessibility`, changeFrequency: "yearly" as const, priority: 0.2 },
    ...activities.map((a) => ({ url: `${site.url}/${a.id}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ]
}
