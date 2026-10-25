"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import type { EventPath } from "@/data/events"
import { whatsappLink } from "@/data/site"
import { prefillContact } from "@/lib/prefill"
import { Photo, type PhotoSet } from "@/components/photo"
import { WhatsAppIcon } from "@/components/icons"

export type EventTab = Omit<EventPath, "activities"> & {
  set: PhotoSet
  activities: { id: string; title: string; note: string }[]
}

export function EventTabs({ tabs }: { tabs: EventTab[] }) {
  const [active, setActive] = useState(0)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  // Deep links such as /#event-family open that tab
  useEffect(() => {
    const fromHash = () => {
      const i = tabs.findIndex((t) => `#event-${t.id}` === window.location.hash)
      if (i < 0) return
      setActive(i)
      // The panel was hidden when the browser tried to jump to it, so bring its tab into view instead
      document.getElementById(`tab-${tabs[i].id}`)?.scrollIntoView({ block: "start" })
    }
    fromHash()
    window.addEventListener("hashchange", fromHash)
    return () => window.removeEventListener("hashchange", fromHash)
  }, [tabs])

  // Arrow keys move between tabs. In RTL the left arrow goes forward.
  function onKeyDown(e: React.KeyboardEvent) {
    const last = tabs.length - 1
    let next = -1
    if (e.key === "ArrowLeft") next = active === last ? 0 : active + 1
    if (e.key === "ArrowRight") next = active === 0 ? last : active - 1
    if (e.key === "Home") next = 0
    if (e.key === "End") next = last
    if (next < 0) return
    e.preventDefault()
    setActive(next)
    buttons.current[next]?.focus()
  }

  return (
    <div className="mt-10">
      <div role="tablist" aria-label="סוג האירוע" className="grid gap-2 md:grid-cols-3 md:gap-3" onKeyDown={onKeyDown}>
        {tabs.map((t, i) => {
          const selected = i === active
          return (
            <button
              key={t.id}
              ref={(el) => {
                buttons.current[i] = el
              }}
              id={`tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`event-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`group flex items-center gap-3 rounded-md p-2 pe-4 text-start transition-colors md:p-2.5 ${
                selected ? "bg-volt text-ink" : "bg-ink-2 text-paper ring-1 ring-paper/15 hover:bg-ink-3"
              }`}
            >
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm bg-ink-3 md:h-16 md:w-16">
                <Photo set={t.set} alt="" sizes="64px" className="absolute inset-0 h-full w-full object-cover" />
              </span>
              <span className="min-w-0">
                <span className="block text-[1.1rem] leading-tight font-bold">{t.label}</span>
                <span className={`mt-0.5 block text-sm ${selected ? "text-ink/75" : "text-paper/60"}`}>{t.short}</span>
              </span>
            </button>
          )
        })}
      </div>

      {tabs.map((t, i) => (
        <div
          key={t.id}
          id={`event-${t.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${t.id}`}
          hidden={i !== active}
          tabIndex={0}
          className="mt-6 grid gap-8 rounded-md bg-paper p-4 text-ink sm:p-6 md:mt-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:p-8"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-ink-2 lg:aspect-auto lg:min-h-[30rem]">
            <Photo set={t.set} alt={t.alt} sizes="(min-width:1024px) 40vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />
          </div>

          <div>
            <h3 className="display text-[clamp(2.2rem,5vw,3.4rem)]">{t.title}</h3>
            <p className="mt-4 text-lg leading-relaxed text-ink/85">{t.experience}</p>
            <p className="mt-4">
              <span className="font-bold">מתאים ל: </span>
              <span className="text-ink/85">{t.fit}</span>
            </p>

            <h4 className="mt-7 font-bold">פעילויות שמשתלבות בזה</h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {t.activities.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/${a.id}`}
                    prefetch={false}
                    className="group inline-flex min-h-11 items-center gap-2 rounded-md bg-card px-3 py-2 ring-1 ring-line transition hover:ring-2 hover:ring-ink"
                  >
                    <span className="font-bold">{a.title}</span>
                    <span className="text-sm text-muted">{a.note}</span>
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-7 rounded-md border-2 border-dashed border-ink/25 p-4 sm:p-5">
              <h4 className="font-bold">לפני שמבקשים הצעה, כדאי לדעת:</h4>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {t.before.map((b) => (
                  <li key={b} className="flex gap-2.5 leading-snug">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-ink text-volt" aria-hidden="true">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-muted">לא יודעים עדיין הכל? זה בסדר, נשלים בשיחה.</p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="#contact" onClick={() => prefillContact(t.formValue)} className="btn-volt group w-full sm:w-auto">
                {t.cta}
                <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
              </Link>
              <a href={whatsappLink(t.whatsappText)} target="_blank" rel="noopener noreferrer" className="btn-wa w-full sm:w-auto">
                <WhatsAppIcon className="h-5 w-5" />
                שאלה בוואטסאפ
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
