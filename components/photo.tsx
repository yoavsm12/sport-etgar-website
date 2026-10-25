/**
 * Responsive photo. Images are pre-sized by scripts/optimize-media.mjs (640px thumbs, 1280px large,
 * full size up to 2000px), so the browser picks one from srcSet instead of Next resizing at runtime.
 * Safe to use from client components: pass a PhotoSet built on the server with photoSet() (lib/photo-set.ts).
 */

export interface PhotoSet {
  src: string
  thumb: string
  large: string
}

export function Photo({
  set,
  alt,
  sizes,
  className = "",
  eager = false,
  priority = false,
}: {
  set: PhotoSet
  alt: string
  sizes: string
  className?: string
  eager?: boolean
  /**
   * High fetch priority. React turns this into a preload hint, and Next copies such hints into
   * any page that prefetches this one, so use it only for the homepage opening photos.
   */
  priority?: boolean
}) {
  const sources = [
    set.thumb !== set.src && `${set.thumb} 640w`,
    set.large !== set.src && `${set.large} 1280w`,
    `${set.src} 2000w`,
  ].filter(Boolean)

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={set.large !== set.src ? set.large : set.src}
      srcSet={sources.join(", ")}
      sizes={sizes}
      alt={alt}
      loading={eager || priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
    />
  )
}
