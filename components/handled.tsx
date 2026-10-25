import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { handled } from "@/data/site"
import { Rig } from "@/components/rig"

/** What we take on, laid out along a truss beam, and the short list that is left for the organiser. */
export function Handled() {
  return (
    <section id="how" className="bg-volt py-16 text-ink md:py-24" aria-labelledby="how-title">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <p className="kicker !text-ink/75">מה אנחנו עושים</p>
            <h2 id="how-title" className="display mt-3 text-[clamp(2.6rem,7vw,4.8rem)]">
              אתם דואגים לשטח ולאורחים.
              <br />
              את כל השאר אנחנו מביאים.
            </h2>
          </div>
          <div className="rounded-md bg-ink p-5 text-paper">
            <p className="font-bold text-volt">מה נשאר עליכם</p>
            <ul className="mt-2 space-y-1.5 text-lg">
              {handled.yours.map((y) => (
                <li key={y} className="flex items-center gap-2.5">
                  <span className="h-2 w-2 shrink-0 rotate-45 bg-volt" aria-hidden="true" />
                  {y}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Rig className="relative mt-12 grid gap-8 md:mt-16 lg:grid-cols-4 lg:gap-6">
          {/* The beam: horizontal on wide screens, vertical on narrow ones. A faint copy is always there; the solid copy is drawn as you scroll. */}
          <span className="truss absolute inset-x-0 top-[1.1rem] hidden opacity-25 lg:block" aria-hidden="true" />
          <span className="truss rig-draw-x absolute inset-x-0 top-[1.1rem] hidden lg:block" aria-hidden="true" />
          <span className="truss-v absolute top-0 right-[0.6rem] bottom-0 opacity-25 lg:hidden" aria-hidden="true" />
          <span className="truss-v rig-draw-y absolute top-0 right-[0.6rem] bottom-0 lg:hidden" aria-hidden="true" />
          {handled.steps.map((s, i) => (
            <li key={s.title} className="relative ps-14 lg:ps-0 lg:pt-14">
              <span
                data-rig-badge
                className="rig-badge display absolute top-0 right-0 flex h-10 w-10 items-center justify-center rounded-sm bg-ink text-[1.7rem] text-volt"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <h3 className="text-2xl leading-tight font-extrabold">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-ink/85">{s.text}</p>
              <p className="mt-3 inline-block rounded-sm bg-ink/10 px-2 py-1 text-[0.95rem] font-bold">
                <span className="sr-only">מה זה חוסך לכם: </span>
                {s.saves}
              </p>
            </li>
          ))}
        </Rig>

        <div className="mt-12">
          <Link href="#contact" className="btn-ink group">
            מתחילים בשיחה קצרה
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
