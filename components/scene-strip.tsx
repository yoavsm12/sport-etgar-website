"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Photo, type PhotoSet } from "@/components/photo"

type Scene = { place: string; text: string; alt: string; wide?: boolean; set: PhotoSet }

export function SceneStrip({ items }: { items: Scene[] }) {
  const list = useRef<HTMLUListElement>(null)

  // In RTL, scrollBy with a negative x moves towards the end of the list
  const move = (dir: 1 | -1) => {
    const el = list.current
    if (!el) return
    el.scrollBy({ left: -dir * el.clientWidth * 0.8, behavior: "smooth" })
  }

  return (
    <div className="relative mt-10">
      <ul
        ref={list}
        tabIndex={0}
        aria-label="צילומים מאירועים. אפשר לגלול לצדדים"
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 sm:scroll-px-6 sm:px-6 lg:scroll-px-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
      >
        {items.map((s) => (
          <li key={s.set.src} className={`shrink-0 snap-start ${s.wide ? "w-[86vw] sm:w-[34rem]" : "w-[66vw] sm:w-[19rem]"}`}>
            <figure>
              <div className="relative h-[20rem] overflow-hidden rounded-md bg-ink-2 sm:h-[24rem]">
                <Photo
                  set={s.set}
                  alt={s.alt}
                  sizes={s.wide ? "(min-width:640px) 34rem, 86vw" : "(min-width:640px) 19rem, 66vw"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="place-tag absolute top-2.5 right-2.5">{s.place}</span>
              </div>
              <figcaption className="mt-3 max-w-[30ch] leading-snug text-ink/85">{s.text}</figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <div className="container-x mt-5 hidden justify-end gap-2 md:flex">
        <button type="button" onClick={() => move(-1)} className="btn-line !min-h-11 !px-3" aria-label="הקודם">
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => move(1)} className="btn-line !min-h-11 !px-3" aria-label="הבא">
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
