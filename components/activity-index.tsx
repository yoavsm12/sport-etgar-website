import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { activities } from "@/data/activities"
import type { EventPathId } from "@/data/events"
import { photoSet } from "@/lib/photo-set"
import { Photo } from "@/components/photo"

const pathShort: Record<EventPathId, string> = {
  corporate: "ימי גיבוש",
  family: "אירועים משפחתיים",
  groups: "בתי ספר וקבוצות",
}

/**
 * All activities as a compact, scannable index. Each row links to the activity's own page.
 * Links to activity pages skip prefetching: a prefetched page brings its cover-photo preload
 * hint with it, which would download every cover on the homepage.
 */
export function ActivityIndex() {
  return (
    <section id="activities" className="border-t border-line bg-card py-16 md:py-24" aria-labelledby="activities-title">
      <div className="container-x">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <p className="kicker">כבר יודעים מה אתם מחפשים?</p>
            <h2 id="activities-title" className="display mt-3 text-[clamp(2.6rem,7vw,4.6rem)]">
              הפעילויות
            </h2>
          </div>
          <p className="text-lg text-ink/80">
            כל פעילות מגיעה עם מדריכים משלה. אפשר להזמין אחת, או לשלב כמה באותו אירוע כדי שאף אחד לא יחכה בתור.
          </p>
        </div>

        <ul className="mt-10 grid border-t-2 border-ink md:grid-cols-2 md:gap-x-10">
          {activities.map((a) => (
            <li key={a.id} className="border-b border-line">
              <Link href={`/${a.id}`} prefetch={false} className="group flex items-center gap-4 py-4 transition-colors hover:bg-volt/40 md:px-2">
                <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-ink-2 sm:h-24 sm:w-24">
                  <Photo
                    set={photoSet(a.cover)}
                    alt=""
                    sizes="96px"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="display block text-[2rem] sm:text-[2.3rem]">{a.title}</span>
                  <span className="mt-1 block leading-snug text-ink/80">{a.short}</span>
                  <span className="mt-2 block text-sm font-semibold text-muted">
                    {[a.ages, ...a.goodFor.slice(0, 2).map((g) => pathShort[g])].filter(Boolean).join(" · ")}
                  </span>
                </span>
                <ArrowLeft className="h-6 w-6 shrink-0 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
