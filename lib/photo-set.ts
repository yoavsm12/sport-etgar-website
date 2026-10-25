// Server-side only.
import type { PhotoSet } from "@/components/photo"
import { largeFor, thumbFor } from "@/lib/media"

export function photoSet(src: string): PhotoSet {
  return { src, thumb: thumbFor(src), large: largeFor(src) }
}
