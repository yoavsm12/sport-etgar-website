import { scenes, social } from "@/data/site"
import { photoSet } from "@/lib/photo-set"
import { SceneStrip } from "@/components/scene-strip"
import { InstagramIcon } from "@/components/icons"

/** "This is what it looks like out there": real photos, captioned with the kind of place. */
export function Scenes() {
  const items = scenes.map((s) => ({ ...s, set: photoSet(s.photo) }))

  return (
    <section id="scenes" className="py-16 md:py-24" aria-labelledby="scenes-title">
      <div className="container-x flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="kicker">צילומים מהשטח</p>
          <h2 id="scenes-title" className="display mt-3 text-[clamp(2.6rem,7vw,4.6rem)]">
            כך זה נראה בשטח
          </h2>
          <p className="mt-4 text-lg text-ink/80">
            אולם ספורט, חוף, קניון, חצר או חורשה. בכל מקום המתקנים נבנים מחדש לפי מה שיש בשטח.
          </p>
        </div>
        <a
          href={social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 self-start font-bold underline decoration-volt decoration-[3px] underline-offset-4 md:self-end"
        >
          <InstagramIcon className="h-5 w-5" />
          עוד מהשטח באינסטגרם
        </a>
      </div>
      <SceneStrip items={items} />
    </section>
  )
}
