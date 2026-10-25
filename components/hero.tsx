import Link from "next/link"
import { ArrowLeft, Phone } from "lucide-react"
import { contact, hero, whatsappLink } from "@/data/site"
import { photoSet } from "@/lib/photo-set"
import { Photo } from "@/components/photo"
import { WhatsAppIcon } from "@/components/icons"

/**
 * Opening: three places, three activities. Each headline line has its own real photo,
 * hung from a truss beam the way the rigs themselves are.
 */
export function Hero() {
  const [gym, yard, trees] = hero.lines

  return (
    <section className="relative overflow-hidden pt-6 pb-14 md:pt-10 lg:pb-20" aria-labelledby="hero-title">
      <div className="container-x grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div>
          <p className="kicker">אקסטרים אירועים · {contact.area}</p>
          <h1
            id="hero-title"
            className="display isolate mt-4 text-[clamp(2.9rem,9.5vw,6.4rem)]"
          >
            {hero.lines.map((l, i) => (
              <span key={l.text} className="block">
                {i === 0 ? (
                  <>
                    <span className="relative whitespace-nowrap">
                      <span className="absolute inset-x-[-0.08em] bottom-[0.08em] -z-10 h-[0.42em] bg-volt" aria-hidden="true" />
                      מסלול נינג&apos;ה
                    </span>{" "}
                    באולם.
                  </>
                ) : (
                  l.text
                )}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80 md:text-xl">
            {hero.lead}
          </p>
          <div className="animate-rise mt-8 flex flex-wrap items-center gap-3 [animation-delay:180ms]">
            <Link href="#contact" className="btn-volt group w-full !min-h-14 !px-7 !text-lg sm:w-auto">
              ספרו לנו על האירוע
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-line w-full !min-h-14 sm:w-auto"
            >
              <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
              כתבו לנו בוואטסאפ
            </a>
          </div>
          <p className="animate-rise mt-5 hidden text-muted sm:block [animation-delay:220ms]">
            מעדיפים לדבר?{" "}
            <a href={`tel:${contact.phones[0].tel}`} className="inline-flex items-center gap-1 font-bold text-ink underline decoration-volt decoration-[3px] underline-offset-4">
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span dir="ltr">{contact.phones[0].display}</span>
            </a>
          </p>
        </div>

        {/* The rig: a truss beam with three photos hanging from it */}
        <div className="relative">
          <div className="truss" aria-hidden="true" />
          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-2 lg:grid-rows-[auto_auto]">
            <Hanging line={gym} className="lg:col-span-2" ratio="aspect-[3/4] lg:aspect-[16/8]" delay={140} eager />
            <Hanging line={yard} ratio="aspect-[3/4]" delay={220} eager />
            <Hanging line={trees} ratio="aspect-[3/4]" delay={300} eager />
          </div>
        </div>
      </div>
    </section>
  )
}

function Hanging({
  line,
  className = "",
  ratio,
  delay,
  eager,
}: {
  line: (typeof hero.lines)[number]
  className?: string
  ratio: string
  delay: number
  eager?: boolean
}) {
  return (
    <figure className={`animate-rise relative ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {/* the strap it hangs from */}
      <span className="mx-auto block h-3 w-px bg-ink sm:h-4" aria-hidden="true" />
      <div className={`relative overflow-hidden rounded-md bg-ink-2 ${ratio}`}>
        <Photo
          set={photoSet(line.photo)}
          alt={line.alt}
          sizes="(min-width:1024px) 45vw, 33vw"
          priority={eager}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <figcaption className="place-tag absolute right-1.5 bottom-1.5 max-w-[calc(100%-0.75rem)] sm:right-2.5 sm:bottom-2.5">
        {line.tag}
      </figcaption>
    </figure>
  )
}
