import { Mail, Phone } from "lucide-react"
import { contact, whatsappLink } from "@/data/site"
import { WhatsAppIcon } from "@/components/icons"
import { ContactForm } from "@/components/contact-form"

/**
 * The form sends email only when SMTP is configured on the server.
 * Without it, the same form opens a ready-made WhatsApp message instead, and says so.
 */
function emailConfigured() {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && !SMTP_HOST.endsWith("example.com"))
}

export function Contact({ activity }: { activity?: string }) {
  return (
    <section id="contact" className="bg-ink py-16 text-paper md:py-24" aria-labelledby="contact-title">
      <div className="truss-light -mt-16 mb-16 md:-mt-24 md:mb-24" aria-hidden="true" />
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <div>
          <p className="kicker !text-paper/70">בקשת הצעה</p>
          <h2 id="contact-title" className="display mt-3 text-[clamp(2.6rem,7vw,4.8rem)]">
            ספרו לנו על האירוע,
            <br />
            <span className="text-volt">ונחזור עם הצעה.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-paper/75">
            מספיק לדעת בערך: סוג האירוע, איפה, מתי וכמה משתתפים. את השאר נשלים בשיחה.
          </p>

          <ul className="mt-8 grid gap-2 sm:max-w-md">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-wa w-full justify-between">
                <span className="inline-flex items-center gap-2">
                  <WhatsAppIcon className="h-5 w-5" />
                  הודעה בוואטסאפ
                </span>
                <span className="text-sm font-semibold opacity-85">הכי מהיר</span>
              </a>
            </li>
            {contact.phones.map((p) => (
              <li key={p.tel}>
                <a href={`tel:${p.tel}`} className="btn-line-light w-full justify-between">
                  <span className="inline-flex items-center gap-2">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    התקשרו
                  </span>
                  <span dir="ltr">{p.display}</span>
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${contact.email}`} className="btn-line-light w-full justify-between">
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  אימייל
                </span>
                <span dir="ltr" className="truncate">
                  {contact.email}
                </span>
              </a>
            </li>
          </ul>
        </div>

        <ContactForm activity={activity} emailReady={emailConfigured()} />
      </div>
    </section>
  )
}
