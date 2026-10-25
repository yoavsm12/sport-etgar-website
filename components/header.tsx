"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft, Menu, Phone, X } from "lucide-react"
import { activities } from "@/data/activities"
import { contact, whatsappLink } from "@/data/site"
import { WhatsAppIcon } from "@/components/icons"

const links = [
  { href: "/#events", label: "לפי סוג אירוע" },
  { href: "/#how", label: "מה אנחנו עושים" },
  { href: "/#activities", label: "הפעילויות" },
  { href: "/#faq", label: "שאלות" },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const toggle = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close the menu on navigation
  useEffect(() => setOpen(false), [pathname])

  // While open: lock page scroll, close on Escape, keep focus inside the menu
  useEffect(() => {
    if (!open) return
    document.documentElement.style.overflow = "hidden"
    panel.current?.querySelector<HTMLElement>("a, button")?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        toggle.current?.focus()
      }
      if (e.key === "Tab" && panel.current) {
        const items = panel.current.querySelectorAll<HTMLElement>("a, button")
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          toggle.current?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          toggle.current?.focus()
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.documentElement.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    // No backdrop-filter here: it would turn the header into the containing block of the fixed menu panel
    <header
      className={`sticky top-0 z-50 border-b bg-paper transition-colors duration-200 ${
        scrolled || open ? "border-line" : "border-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="אקסטרים אירועים, לדף הבית">
          <Image src="/logo.png" alt="" width={44} height={42} className="h-10 w-auto lg:h-11" />
          <span className="leading-none">
            <span className="display block text-[1.7rem]">אקסטרים אירועים</span>
            <span className="mt-0.5 block text-[0.8rem] font-semibold text-muted">מתקני אתגר ניידים</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="ניווט ראשי">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-[1rem] font-semibold text-ink/80 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${contact.phones[0].tel}`}
            className="hidden items-center gap-2 rounded-md px-3 py-2 font-bold hover:bg-ink/5 xl:inline-flex"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span dir="ltr">{contact.phones[0].display}</span>
          </a>
          <Link href="/#contact" className="btn-volt hidden !min-h-11 !py-2 sm:inline-flex">
            בקשת הצעה
          </Link>
          <button
            ref={toggle}
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 items-center gap-2 rounded-md px-3 font-bold ring-2 ring-ink/80 transition hover:bg-ink hover:text-paper lg:hidden"
            aria-expanded={open}
            aria-controls="site-menu"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            <span>{open ? "סגירה" : "תפריט"}</span>
          </button>
        </div>
      </div>

      {/* Mobile / tablet menu */}
      <div
        id="site-menu"
        ref={panel}
        hidden={!open}
        className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto border-t border-line bg-paper lg:hidden"
      >
        <div className="container-x pt-4 pb-32">
          <nav aria-label="תפריט">
            <ul>
              {links.map((l) => (
                <li key={l.href} className="border-b border-line">
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="display flex items-center justify-between py-3.5 text-[2.4rem]"
                  >
                    {l.label}
                    <ArrowLeft className="h-6 w-6" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="mt-7 mb-3 font-bold text-muted">כל הפעילויות</p>
          <ul className="grid grid-cols-2 gap-2">
            {activities.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/${a.id}`}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-md bg-card px-3 py-2 leading-tight font-semibold ring-1 ring-line hover:ring-ink"
                >
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid gap-2 sm:grid-cols-3">
            <Link href="/#contact" onClick={() => setOpen(false)} className="btn-volt">
              בקשת הצעה
            </Link>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-wa">
              <WhatsAppIcon className="h-5 w-5" />
              וואטסאפ
            </a>
            <a href={`tel:${contact.phones[0].tel}`} className="btn-line">
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span dir="ltr">{contact.phones[0].display}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
