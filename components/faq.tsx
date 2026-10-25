import { Plus } from "lucide-react"
import { whatsappLink } from "@/data/site"
import { WhatsAppIcon } from "@/components/icons"

/** Questions that usually stop people from getting in touch. Native <details>, so it works without JS. */
export function Faq({
  items,
  title = "לפני שפונים, בדרך כלל שואלים",
  id = "faq",
}: {
  items: { q: string; a: string }[]
  title?: string
  id?: string
}) {
  return (
    <section id={id} className="py-16 md:py-24" aria-labelledby={`${id}-title`}>
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.7fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="kicker">שאלות נפוצות</p>
          <h2 id={`${id}-title`} className="display mt-3 text-[clamp(2.4rem,6vw,4rem)]">
            {title}
          </h2>
          <p className="mt-4 text-lg text-ink/80">לא מצאתם תשובה? שאלו אותנו ישירות.</p>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-wa mt-6">
            <WhatsAppIcon className="h-5 w-5" />
            שאלה בוואטסאפ
          </a>
        </div>

        <div className="border-t-2 border-ink">
          {items.map((item) => (
            <details key={item.q} className="group border-b border-line">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 [&::-webkit-details-marker]:hidden">
                <h3 className="text-[1.2rem] leading-snug font-bold md:text-[1.3rem]">{item.q}</h3>
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm ring-2 ring-ink/80 transition-transform duration-200 group-open:rotate-45 group-open:bg-volt"
                  aria-hidden="true"
                >
                  <Plus className="h-4 w-4" />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 text-[1.08rem] leading-relaxed text-ink/85">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
