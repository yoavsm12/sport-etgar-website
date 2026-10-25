"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react"
import type { MediaItem } from "@/lib/media"
import { Photo } from "@/components/photo"

export type GalleryItem = MediaItem & { caption?: string }

const STEP = 12

/**
 * Activity photos. The chosen highlights tell the story first, large and captioned;
 * everything else sits below as small previews that load as you reach them.
 */
export function Gallery({ featured, rest, title }: { featured: GalleryItem[]; rest: GalleryItem[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const [limit, setLimit] = useState(STEP)
  const opener = useRef<HTMLElement | null>(null)
  const all = [...featured, ...rest]

  const show = (i: number) => (e: React.MouseEvent<HTMLElement>) => {
    opener.current = e.currentTarget
    setOpen(i)
  }
  const close = () => {
    setOpen(null)
    // Return focus to the photo that opened the viewer
    requestAnimationFrame(() => opener.current?.focus())
  }

  const label = (m: GalleryItem, i: number) => m.caption ?? `${title}, ${m.type === "video" ? "סרטון" : "תמונה"} ${i + 1}`

  return (
    <div>
      {featured.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2">
          {featured.map((m, i) => (
            <li key={m.src} className={i === 0 ? "col-span-2 md:row-span-2" : ""}>
              <figure>
                <button
                  type="button"
                  onClick={show(i)}
                  className={`group relative block w-full overflow-hidden rounded-md bg-ink-2 ${i === 0 ? "aspect-[4/3]" : "aspect-[4/3] md:aspect-[5/4]"}`}
                  aria-label={`הגדלה: ${label(m, i)}`}
                >
                  <Photo
                    set={m}
                    alt=""
                    sizes={i === 0 ? "(min-width:768px) 50vw, 100vw" : "(min-width:768px) 25vw, 50vw"}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </button>
                {m.caption && (
                  <figcaption className={`mt-2 leading-snug ${i === 0 ? "text-lg font-semibold" : "text-[0.95rem]"}`}>{m.caption}</figcaption>
                )}
              </figure>
            </li>
          ))}
        </ul>
      )}

      {rest.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-bold">
            עוד מהשטח <span className="font-normal text-muted">({rest.length})</span>
          </h3>
          <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {rest.slice(0, limit).map((m, j) => {
              const i = featured.length + j
              return (
                <li key={m.src}>
                  <button
                    type="button"
                    onClick={show(i)}
                    className="group relative block aspect-square w-full overflow-hidden rounded-sm bg-ink-2"
                    aria-label={`${m.type === "video" ? "ניגון" : "הגדלה"}: ${label(m, i)}`}
                  >
                    {m.thumb && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.thumb}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    {m.type === "video" && (
                      <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-volt text-ink">
                          <Play className="h-5 w-5 fill-current" />
                        </span>
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
          {rest.length > limit && (
            <button type="button" onClick={() => setLimit((l) => l + STEP * 2)} className="btn-line mt-6">
              הצגת עוד {Math.min(STEP * 2, rest.length - limit)}
            </button>
          )}
        </div>
      )}

      {open !== null && <Lightbox items={all} start={open} label={label} onClose={close} />}
    </div>
  )
}

function Lightbox({
  items,
  start,
  label,
  onClose,
}: {
  items: GalleryItem[]
  start: number
  label: (m: GalleryItem, i: number) => string
  onClose: () => void
}) {
  const [i, setI] = useState(start)
  const touchX = useRef<number | null>(null)
  const dialog = useRef<HTMLDivElement>(null)
  const prev = useCallback(() => setI((v) => (v - 1 + items.length) % items.length), [items.length])
  const next = useCallback(() => setI((v) => (v + 1) % items.length), [items.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      // RTL: the left arrow moves forward
      if (e.key === "ArrowLeft") next()
      if (e.key === "ArrowRight") prev()
      // Keep keyboard focus inside the dialog
      if (e.key === "Tab" && dialog.current) {
        const f = dialog.current.querySelectorAll<HTMLElement>("button, video")
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    dialog.current?.querySelector<HTMLElement>("button")?.focus()
    document.documentElement.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      document.documentElement.style.overflow = ""
    }
  }, [next, prev, onClose])

  const m = items[i]

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label="תמונות מהשטח"
      className="fixed inset-0 z-[60] flex flex-col bg-ink/95 text-paper"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 50) (dx > 0 ? next : prev)()
        touchX.current = null
      }}
    >
      <div className="flex items-center justify-between gap-4 p-3 md:p-5">
        <p className="min-w-0 truncate font-semibold" aria-live="polite">
          {label(m, i)} <span className="font-normal text-paper/60" dir="ltr">({i + 1}/{items.length})</span>
        </p>
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 shrink-0 items-center gap-1.5 rounded-md bg-paper/10 px-3 font-bold hover:bg-paper/20"
        >
          <X className="h-5 w-5" aria-hidden="true" />
          סגירה
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-4 md:px-20" onClick={onClose}>
        <div className="relative h-full w-full" onClick={(e) => e.stopPropagation()}>
          {m.type === "video" ? (
            <video
              key={m.src}
              src={m.src}
              poster={m.thumb || undefined}
              controls
              playsInline
              className="mx-auto h-full max-h-full w-auto max-w-full rounded-md"
            />
          ) : (
            <Photo key={m.src} set={m} alt={label(m, i)} sizes="100vw" eager className="absolute inset-0 h-full w-full object-contain" />
          )}
        </div>
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              className="absolute top-1/2 right-2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-md bg-ink/70 hover:bg-ink md:right-4"
              aria-label="הקודמת"
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              className="absolute top-1/2 left-2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-md bg-ink/70 hover:bg-ink md:left-4"
              aria-label="הבאה"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
