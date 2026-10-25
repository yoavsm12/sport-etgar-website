import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ChevronLeft, MessageCircleQuestion } from "lucide-react"
import { activities, getActivity } from "@/data/activities"
import { eventPaths } from "@/data/events"
import { contact, site, whatsappLink } from "@/data/site"
import { getMedia } from "@/lib/media"
import { photoSet } from "@/lib/photo-set"
import { Photo } from "@/components/photo"
import { Gallery, type GalleryItem } from "@/components/gallery"
import { Faq } from "@/components/faq"
import { Contact } from "@/components/contact"
import { WhatsAppIcon } from "@/components/icons"

type Props = { params: Promise<{ activity: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return activities.map((a) => ({ activity: a.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = getActivity((await params).activity)
  if (!a) return {}
  const image = photoSet(a.cover).large
  return {
    title: a.metaTitle,
    description: a.metaDescription,
    alternates: { canonical: `/${a.id}` },
    openGraph: { title: a.metaTitle, description: a.metaDescription, images: [{ url: image }] },
  }
}

export default async function ActivityPage({ params }: Props) {
  const a = getActivity((await params).activity)
  if (!a) notFound()

  const media = getMedia(a.folder)
  // The cover is already shown at the top, so the story below starts with the next photo
  const featured: GalleryItem[] = a.highlights.flatMap((h) => {
    const m = media.find((x) => x.src.endsWith(`/${h.file}`))
    return m && m.src !== a.cover ? [{ ...m, caption: h.caption }] : []
  })
  const rest = media.filter((m) => m.src !== a.cover && !featured.some((f) => f.src === m.src))
  const paths = eventPaths.filter((p) => a.goodFor.includes(p.id))
  const pairs = a.pairsWith.flatMap((p) => {
    const o = getActivity(p.id)
    return o ? [{ ...o, why: p.why }] : []
  })
  const waText = `שלום, אשמח לקבל פרטים על ${a.title} לאירוע שלנו`

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: a.title,
      description: a.metaDescription,
      serviceType: a.title,
      areaServed: { "@type": "Country", name: "Israel" },
      provider: { "@type": "LocalBusiness", name: site.legalName, url: site.url, telephone: contact.phones[0].tel },
      image: `${site.url}${photoSet(a.cover).large}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "דף הבית", item: site.url },
        { "@type": "ListItem", position: 2, name: "הפעילויות", item: `${site.url}/#activities` },
        { "@type": "ListItem", position: 3, name: a.title, item: `${site.url}/${a.id}` },
      ],
    },
  ]

  return (
    <>
      {/* Intro */}
      <section className="pt-5 pb-12 md:pt-8 md:pb-16" aria-labelledby="activity-title">
        <div className="container-x">
          <nav aria-label="מיקום באתר" className="flex flex-wrap items-center gap-1 text-[0.95rem] text-muted">
            <Link href="/" className="py-1 hover:text-ink hover:underline">
              דף הבית
            </Link>
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <Link href="/#activities" className="py-1 hover:text-ink hover:underline">
              הפעילויות
            </Link>
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span className="font-semibold text-ink" aria-current="page">
              {a.title}
            </span>
          </nav>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-14">
            <div>
              <h1 id="activity-title" className="display text-[clamp(3.2rem,10vw,6.6rem)]">
                {a.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/85 md:text-xl">
                {a.lead}
              </p>

              <dl className="animate-rise mt-7 grid gap-px overflow-hidden rounded-md bg-line ring-1 ring-line sm:grid-cols-3 [animation-delay:120ms]">
                {a.ages && (
                  <div className="bg-card p-3.5">
                    <dt className="text-sm font-semibold text-muted">גילאים</dt>
                    <dd className="mt-0.5 font-bold">{a.ages}</dd>
                  </div>
                )}
                <div className={`bg-card p-3.5 ${a.ages ? "sm:col-span-2" : "sm:col-span-3"}`}>
                  <dt className="text-sm font-semibold text-muted">איפה מקימים</dt>
                  <dd className="mt-0.5 font-bold">{a.where}</dd>
                </div>
                <div className="bg-card p-3.5 sm:col-span-3">
                  <dt className="text-sm font-semibold text-muted">מתאים במיוחד ל</dt>
                  <dd className="mt-1 flex flex-wrap gap-1.5">
                    {paths.map((p) => (
                      <Link
                        key={p.id}
                        href={`/#event-${p.id}`}
                        className="rounded-sm bg-paper-2 px-2 py-1 text-[0.95rem] font-bold hover:bg-volt"
                      >
                        {p.label}
                      </Link>
                    ))}
                  </dd>
                </div>
              </dl>

              <div className="animate-rise mt-7 flex flex-wrap gap-3 [animation-delay:180ms]">
                <Link href="#contact" className="btn-volt group w-full !min-h-14 sm:w-auto">
                  בקשת הצעה ל{a.title}
                  <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                </Link>
                <a href={whatsappLink(waText)} target="_blank" rel="noopener noreferrer" className="btn-line w-full !min-h-14 sm:w-auto">
                  <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
                  שאלה בוואטסאפ
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="truss" aria-hidden="true" />
              <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-md bg-ink-2">
                <Photo
                  set={photoSet(a.cover)}
                  alt={a.coverAlt}
                  sizes="(min-width:1024px) 50vw, 100vw"
                  eager
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it looks at an event */}
      <section className="border-t border-line bg-card py-14 md:py-20" aria-labelledby="scene-title">
        <div className="container-x">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
            <h2 id="scene-title" className="display text-[clamp(2.4rem,6vw,4rem)]">
              איך זה נראה באירוע
            </h2>
            <p className="text-lg leading-relaxed text-ink/85 md:text-xl md:leading-relaxed">{a.scene}</p>
          </div>
          {(featured.length > 0 || rest.length > 0) && (
            <div id="gallery" className="mt-10">
              <Gallery featured={featured} rest={rest} title={a.title} />
            </div>
          )}
        </div>
      </section>

      {/* Practical: what's included, and what we will ask you */}
      <section className="py-14 md:py-20" aria-labelledby="practical-title">
        <h2 id="practical-title" className="sr-only">
          פרטים מעשיים
        </h2>
        <div className="container-x grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <h3 className="display text-[2.6rem]">מה מגיע איתנו</h3>
            <ul className="mt-4 border-t-2 border-ink">
              {a.features.map((f) => (
                <li key={f} className="flex items-start gap-3 border-b border-line py-3 text-lg leading-snug">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rotate-45 bg-volt ring-2 ring-ink" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="display text-[2.6rem]">מה נשאל אתכם לפני ההצעה</h3>
            <ol className="mt-4 border-t-2 border-ink">
              {a.askUs.map((q, i) => (
                <li key={q} className="flex items-start gap-3 border-b border-line py-3 text-lg leading-snug">
                  <span className="display w-6 shrink-0 text-[1.6rem] leading-none" aria-hidden="true">
                    {i + 1}
                  </span>
                  {q}
                </li>
              ))}
            </ol>
            <p className="mt-4 flex items-start gap-2 text-muted">
              <MessageCircleQuestion className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              אין לכם עדיין את כל התשובות? אפשר לפנות גם ככה, ונעבור על זה יחד.
            </p>
          </div>
        </div>
      </section>

      {/* Combine with */}
      {pairs.length > 0 && (
        <section className="bg-paper-2 py-14 md:py-20" aria-labelledby="pairs-title">
          <div className="container-x">
            <h2 id="pairs-title" className="display text-[clamp(2.4rem,6vw,4rem)]">
              אפשר לשלב עם
            </h2>
            <ul className="mt-8 grid gap-3 md:grid-cols-3">
              {pairs.map((p) => (
                <li key={p.id}>
                  <Link href={`/${p.id}`} prefetch={false} className="group flex h-full gap-4 rounded-md bg-card p-3 ring-1 ring-line transition hover:ring-2 hover:ring-ink">
                    <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-sm bg-ink-2">
                      <Photo set={photoSet(p.cover)} alt="" sizes="96px" className="absolute inset-0 h-full w-full object-cover" />
                    </span>
                    <span className="min-w-0 py-1">
                      <span className="display block text-[1.9rem]">{p.title}</span>
                      <span className="mt-1 block leading-snug text-ink/80">{p.why}</span>
                    </span>
                    <ArrowLeft className="mt-2 h-5 w-5 shrink-0 self-start transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {a.faq.length > 0 && <Faq items={a.faq} title={`שאלות על ${a.title}`} id="activity-faq" />}

      <Contact activity={a.title} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  )
}
