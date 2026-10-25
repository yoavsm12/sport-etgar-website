import { crew, site, social } from "@/data/site"
import { photoSet } from "@/lib/photo-set"
import { Photo } from "@/components/photo"
import { FacebookIcon, InstagramIcon } from "@/components/icons"

/** People and trust: who actually shows up, shown through photos of the instructors at work. */
export function Crew() {
  return (
    <section id="about" className="py-16 md:py-24" aria-labelledby="crew-title">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <div>
          <p className="kicker">{site.legalName}</p>
          <h2 id="crew-title" className="display mt-3 text-[clamp(2.6rem,7vw,4.6rem)]">
            מי מגיע אליכם
          </h2>
          {crew.story && <p className="mt-5 text-lg leading-relaxed">{crew.story}</p>}
          {crew.text.map((p) => (
            <p key={p.slice(0, 24)} className="mt-5 text-lg leading-relaxed text-ink/85">
              {p}
            </p>
          ))}
          <div className="mt-8 border-t border-line pt-6">
            <p className="font-bold">רוצים לראות עוד לפני שמדברים?</p>
            <p className="mt-1 text-muted">אנחנו מעלים תמונות וסרטונים מהאירועים לרשתות.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="btn-line !min-h-11">
                <InstagramIcon className="h-5 w-5" />
                אינסטגרם
              </a>
              <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="btn-line !min-h-11">
                <FacebookIcon className="h-5 w-5" />
                פייסבוק
              </a>
            </div>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:self-start">
          {crew.photos.map((p, i) => (
            <li key={p.src} className={i === 0 ? "col-span-2 sm:col-span-1 sm:row-span-1" : ""}>
              <figure>
                <div className={`relative overflow-hidden rounded-md bg-ink-2 ${i === 0 ? "aspect-[4/3] sm:aspect-[3/4]" : "aspect-[3/4]"}`}>
                  <Photo
                    set={photoSet(p.src)}
                    alt={p.alt}
                    sizes="(min-width:1024px) 18vw, (min-width:640px) 30vw, 50vw"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-[0.95rem] font-semibold leading-snug">{p.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
