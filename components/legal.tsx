import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { legal } from "@/data/legal"

/** Shared layout for the legal pages: breadcrumb, title, last-updated line and readable body text. */
export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-10 md:py-16" aria-labelledby="legal-title">
      <div className="container-x">
        <nav aria-label="מיקום באתר" className="flex items-center gap-1 text-[0.95rem] text-muted">
          <Link href="/" className="py-1 hover:text-ink hover:underline">
            דף הבית
          </Link>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="font-semibold text-ink" aria-current="page">
            {title}
          </span>
        </nav>
        <div className="mt-6 max-w-3xl">
          <h1 id="legal-title" className="display text-[clamp(3rem,9vw,5.5rem)]">
            {title}
          </h1>
          <p className="mt-3 text-muted">עודכן לאחרונה: {legal.updated}</p>
          <div className="legal mt-8">{children}</div>
        </div>
      </div>
    </section>
  )
}

/** A detail the business still has to supply. Shown loudly on purpose. */
export function Todo({ children }: { children: React.ReactNode }) {
  return (
    <mark className="rounded-sm bg-volt px-1.5 font-bold text-ink ring-1 ring-ink">[להשלמה: {children}]</mark>
  )
}

/** Shows a value from data/legal.ts, or the marker if it is still missing. */
export function Fill({ value, label }: { value: string | null; label: string }) {
  return value ? <>{value}</> : <Todo>{label}</Todo>
}
