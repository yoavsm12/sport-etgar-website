import Image from "next/image"
import Link from "next/link"
import { activities } from "@/data/activities"
import { eventPaths } from "@/data/events"
import { contact, site, social } from "@/data/site"
import { FacebookIcon, InstagramIcon } from "@/components/icons"

export function Footer() {
  return (
    <footer className="bg-ink-2 text-paper">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/logo-white.png" alt="" width={52} height={52} className="h-13 w-13 object-contain" />
            <span className="display text-[2rem]">{site.name}</span>
          </Link>
          <p className="mt-4 max-w-xs leading-relaxed text-paper/70">
            מתקני אתגר ניידים לאירועים: מקימים, מדריכים ומפעילים, {contact.area}.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href={social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="אינסטגרם"
              className="flex h-11 w-11 items-center justify-center rounded-md ring-1 ring-paper/25 transition hover:bg-volt hover:text-ink"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href={social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="פייסבוק"
              className="flex h-11 w-11 items-center justify-center rounded-md ring-1 ring-paper/25 transition hover:bg-volt hover:text-ink"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <nav aria-label="לפי סוג אירוע">
          <h2 className="font-bold text-paper/60">לפי סוג אירוע</h2>
          <ul className="mt-3 space-y-1">
            {eventPaths.map((p) => (
              <li key={p.id}>
                <Link href={`/#event-${p.id}`} className="inline-block py-1 text-paper/85 hover:text-volt">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="הפעילויות">
          <h2 className="font-bold text-paper/60">הפעילויות</h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 sm:grid-cols-1">
            {activities.map((a) => (
              <li key={a.id}>
                <Link href={`/${a.id}`} prefetch={false} className="inline-block py-1 text-paper/85 hover:text-volt">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-bold text-paper/60">יצירת קשר</h2>
          <ul className="mt-3 space-y-1 text-paper/85">
            {contact.phones.map((p) => (
              <li key={p.tel}>
                <a href={`tel:${p.tel}`} className="inline-block py-1 hover:text-volt" dir="ltr">
                  {p.display}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${contact.email}`} className="inline-block py-1 hover:text-volt">
                {contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10">
        {/* extra bottom space on phones so the contact bar never covers the last line */}
        <div className="container-x flex flex-col justify-between gap-2 pt-6 pb-28 text-sm text-paper/60 sm:flex-row lg:pb-6">
          <p>
            © {new Date().getFullYear()} {site.legalName}
          </p>
          <p>כפתור הנגישות נמצא בפינה הימנית התחתונה של המסך.</p>
        </div>
      </div>
    </footer>
  )
}
