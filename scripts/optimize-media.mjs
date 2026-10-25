// Prepares new photos and videos for the website.
//
//   npm run media
//
// For every file in public/images/<folder>/ that has no preview in thumbs/ yet:
//   - photos: fixes rotation, shrinks to max 2000px, re-compresses, writes thumbs/<name>.webp (640px)
//             and large/<name>.webp (1280px, used for big photos on the page)
//   - videos: writes a poster frame to thumbs/<name>.jpg (needs ffmpeg on PATH);
//             re-encodes to 720p H.264 with --videos
// Already processed files are skipped, so running it twice is safe.

import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
import sharp from "sharp"

const ROOT = path.join(import.meta.dirname, "..", "public", "images")
const PHOTO = new Set([".jpg", ".jpeg", ".png"])
const VIDEO = new Set([".mp4", ".mov", ".webm"])
const reencodeVideos = process.argv.includes("--videos")

const hasFfmpeg = (() => {
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" })
    return true
  } catch {
    return false
  }
})()

let done = 0
for (const folder of fs.readdirSync(ROOT, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  const dir = path.join(ROOT, folder.name)
  const thumbs = path.join(dir, "thumbs")
  const large = path.join(dir, "large")
  fs.mkdirSync(thumbs, { recursive: true })
  fs.mkdirSync(large, { recursive: true })

  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name)
    if (!fs.statSync(file).isFile()) continue
    const ext = path.extname(name).toLowerCase()
    const base = path.basename(name, path.extname(name))

    if (PHOTO.has(ext)) {
      const thumb = path.join(thumbs, `${base}.webp`)
      const big = path.join(large, `${base}.webp`)
      if (fs.existsSync(thumb)) {
        if (fs.existsSync(big)) continue
        await sharp(file, { failOn: "none" }).rotate().resize({ width: 1280, height: 1280, fit: "inside", withoutEnlargement: true }).webp({ quality: 72 }).toFile(big)
        console.log(`large  ${folder.name}/${name}`)
        done++
        continue
      }
      const input = fs.readFileSync(file)
      const img = sharp(input, { failOn: "none" }).rotate()
      const out = await img
        .clone()
        .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
        [ext === ".png" ? "png" : "jpeg"](ext === ".png" ? { compressionLevel: 9 } : { quality: 78, mozjpeg: true, progressive: true })
        .toBuffer()
      if (out.length < input.length) fs.writeFileSync(file, out)
      await img.clone().resize({ width: 1280, height: 1280, fit: "inside", withoutEnlargement: true }).webp({ quality: 72 }).toFile(big)
      await img.resize({ width: 640, height: 640, fit: "inside" }).webp({ quality: 70 }).toFile(thumb)
      console.log(`photo  ${folder.name}/${name}`)
      done++
    }

    if (VIDEO.has(ext)) {
      const poster = path.join(thumbs, `${base}.jpg`)
      if (fs.existsSync(poster)) continue
      if (!hasFfmpeg) {
        console.warn(`skip   ${folder.name}/${name} (install ffmpeg to process videos)`)
        continue
      }
      if (reencodeVideos || ext !== ".mp4") {
        const out = path.join(dir, `${base}.mp4.tmp`)
        execFileSync("ffmpeg", [
          "-y", "-loglevel", "error", "-i", file,
          "-vf", "scale='if(gt(iw,ih),min(1280,iw),-2)':'if(gt(iw,ih),-2,min(1280,ih))'",
          "-c:v", "libx264", "-crf", "27", "-preset", "medium", "-pix_fmt", "yuv420p",
          "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", "-f", "mp4", out,
        ])
        fs.rmSync(file)
        fs.renameSync(out, path.join(dir, `${base}.mp4`))
      }
      execFileSync("ffmpeg", [
        "-y", "-loglevel", "error", "-ss", "1", "-i", path.join(dir, `${base}.mp4`),
        "-frames:v", "1", "-vf", "scale='if(gt(iw,ih),640,-2)':'if(gt(iw,ih),-2,640)'", "-q:v", "4", poster,
      ])
      console.log(`video  ${folder.name}/${name}`)
      done++
    }
  }
}
console.log(done ? `\nProcessed ${done} file(s).` : "Nothing new to process.")
