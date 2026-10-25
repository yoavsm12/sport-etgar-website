import Link from "next/link"
import { activities } from "@/data/activities"

export const metadata = { title: "הדף לא נמצא" }

export default function NotFound() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-x">
        <div className="truss max-w-md" aria-hidden="true" />
        <p className="display mt-6 text-[clamp(6rem,20vw,12rem)] text-ink/15">404</p>
        <h1 className="display text-[clamp(2.6rem,7vw,4.6rem)]">הדף הזה לא קיים.</h1>
        <p className="mt-4 max-w-md text-lg text-ink/80">אולי הקישור השתנה. אפשר להמשיך מכאן:</p>
        <div className="mt-8 flex flex-wrap gap-2">
          <Link href="/" className="btn-volt">
            לדף הבית
          </Link>
          {activities.slice(0, 4).map((a) => (
            <Link key={a.id} href={`/${a.id}`} prefetch={false} className="btn-line">
              {a.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
