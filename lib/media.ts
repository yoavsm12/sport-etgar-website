// Server-side only: reads the public/images folder at build time.
import fs from "node:fs"
import path from "node:path"

export interface MediaItem {
  src: string
  thumb: string
  large: string
  type: "image" | "video"
}

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"])
const VIDEO_EXT = new Set([".mp4", ".webm"])

const publicRoot = path.join(process.cwd(), "public")
const imagesRoot = path.join(publicRoot, "images")

/**
 * Videos are stored with Git LFS. A checkout or zip made without LFS contains small
 * text "pointer" files instead of the videos; those are skipped so the gallery never shows a broken player.
 */
function isLfsPointer(file: string) {
  try {
    if (fs.statSync(file).size > 1024) return false
    return fs.readFileSync(file, "utf8").startsWith("version https://git-lfs")
  } catch {
    return true
  }
}

/** Lists the photos and videos in public/images/<folder>, photos first. */
export function getMedia(folder: string): MediaItem[] {
  const dir = path.join(imagesRoot, folder)
  if (!dir.startsWith(imagesRoot) || !fs.existsSync(dir)) return []

  const list = (sub: string) => new Set(fs.existsSync(path.join(dir, sub)) ? fs.readdirSync(path.join(dir, sub)) : [])
  const thumbs = list("thumbs")
  const large = list("large")

  const items = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile())
    .map((e): MediaItem | null => {
      const ext = path.extname(e.name).toLowerCase()
      const base = path.basename(e.name, path.extname(e.name))
      const src = `/images/${folder}/${e.name}`
      if (IMAGE_EXT.has(ext)) {
        const t = `${base}.webp`
        return {
          src,
          thumb: thumbs.has(t) ? `/images/${folder}/thumbs/${t}` : src,
          large: large.has(t) ? `/images/${folder}/large/${t}` : src,
          type: "image",
        }
      }
      if (VIDEO_EXT.has(ext) && !isLfsPointer(path.join(dir, e.name))) {
        const t = `${base}.jpg`
        return { src, thumb: thumbs.has(t) ? `/images/${folder}/thumbs/${t}` : "", large: "", type: "video" }
      }
      return null
    })
    .filter((m): m is MediaItem => m !== null)

  const byName = (a: MediaItem, b: MediaItem) => a.src.localeCompare(b.src, undefined, { numeric: true })
  return [
    ...items.filter((m) => m.type === "image").sort(byName),
    ...items.filter((m) => m.type === "video").sort(byName),
  ]
}

function variant(src: string, dir: "thumbs" | "large") {
  const file = path.join(publicRoot, src)
  const name = path.basename(file, path.extname(file)) + ".webp"
  return fs.existsSync(path.join(path.dirname(file), dir, name)) ? src.replace(/\/[^/]+$/, `/${dir}/${name}`) : src
}

/** 640px preview of a full-size photo path, if one exists. */
export function thumbFor(src: string) {
  return variant(src, "thumbs")
}

/** 1280px version of a full-size photo path, if one exists. Used for photos shown large on the page. */
export function largeFor(src: string) {
  return variant(src, "large")
}
