"use client"

import { useEffect, useLayoutEffect, useRef } from "react"

// useLayoutEffect warns during server rendering, and the server markup is already the finished state
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect

/**
 * A list of steps along a truss beam that is "built" as you scroll.
 *
 * It only sets `--p` (how much of the beam is drawn, 0 to 1) and `data-lit` on each `[data-rig-badge]`;
 * the look comes from `.rig-draw-x`, `.rig-draw-y` and `.rig-badge` in globals.css.
 * Without JavaScript, or when reduced motion is preferred, the beam is complete and every badge is lit.
 */
export function Rig({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const list = useRef<HTMLOListElement>(null)

  useBeforePaint(() => {
    const el = list.current
    if (!el) return
    const badges = [...el.querySelectorAll<HTMLElement>("[data-rig-badge]")]
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const wide = window.matchMedia("(min-width: 1024px)")
    let raf = 0

    const finish = () => {
      el.style.setProperty("--p", "1")
      badges.forEach((b) => b.setAttribute("data-lit", "true"))
    }

    const update = () => {
      raf = 0
      if (reduce.matches) return finish()
      const vh = window.innerHeight
      const r = el.getBoundingClientRect()

      // Wide: the beam runs sideways, so it is drawn as the row rises through the lower half of the screen.
      // Narrow: the beam runs down the page, and its tip follows a line three quarters of the way down the screen.
      const p = wide.matches ? (vh * 0.92 - r.top) / (vh * 0.42) : (vh * 0.75 - r.top) / r.height
      const drawn = Math.min(1, Math.max(0, p))
      el.style.setProperty("--p", drawn.toFixed(3))

      // A badge lights when the tip of the beam has reached it (the beam starts at the right edge, in RTL)
      badges.forEach((b) => {
        const br = b.getBoundingClientRect()
        const at = wide.matches
          ? (r.right - (br.left + br.width / 2)) / r.width
          : (br.top + br.height / 2 - r.top) / r.height
        b.setAttribute("data-lit", drawn > 0 && drawn >= at ? "true" : "false")
      })
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    reduce.addEventListener("change", schedule)
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      reduce.removeEventListener("change", schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <ol ref={list} className={className}>
      {children}
    </ol>
  )
}
