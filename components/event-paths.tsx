import { eventPaths } from "@/data/events"
import { getActivity } from "@/data/activities"
import { photoSet } from "@/lib/photo-set"
import { EventTabs, type EventTab } from "@/components/event-tabs"

/** "What kind of event are you planning?" Three ways in, each with what it could look like. */
export function EventPaths() {
  const tabs: EventTab[] = eventPaths.map((p) => ({
    ...p,
    set: photoSet(p.photo),
    activities: p.activities.flatMap((a) => {
      const act = getActivity(a.id)
      return act ? [{ id: a.id, title: act.title, note: a.note }] : []
    }),
  }))

  return (
    <section id="events" className="bg-ink py-16 text-paper md:py-24" aria-labelledby="events-title">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="kicker !text-paper/70">שלוש דרכים להתחיל</p>
          <h2 id="events-title" className="display mt-3 text-[clamp(2.6rem,7vw,4.6rem)]">
            איזה אירוע אתם מפיקים?
          </h2>
          <p className="mt-4 text-lg text-paper/75">
            בחרו, ונראה לכם איך זה יכול להיראות, אילו פעילויות מתאימות ומה כדאי לדעת לפני שמבקשים הצעה.
          </p>
        </div>
        <EventTabs tabs={tabs} />
      </div>
    </section>
  )
}
