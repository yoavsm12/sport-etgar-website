"use client"

import { useEffect, useId, useRef, useState } from "react"
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"
import { eventTypes, whatsappLink } from "@/data/site"
import { PREFILL_EVENT } from "@/lib/prefill"
import { WhatsAppIcon } from "@/components/icons"

type Status = "idle" | "sending" | "sent" | "whatsapp" | "error"
type Errors = Partial<Record<"name" | "phone", string>>

const PHONE = /^[0-9+\-\s]{9,15}$/

/** Builds the same request as a WhatsApp message, used when email is not available. */
function toWhatsApp(d: Record<string, string>) {
  const rows = [
    ["סוג האירוע", d.eventType],
    ["פעילות", d.activity],
    ["מיקום", d.location],
    ["תאריך", d.date],
    ["משתתפים", d.participants],
    ["שם", d.name],
    ["טלפון", d.phone],
    ["עוד פרטים", d.message],
  ].filter(([, v]) => v && v.trim())
  return whatsappLink(`שלום, אשמח לקבל הצעה לאירוע.\n${rows.map(([k, v]) => `${k}: ${v.trim()}`).join("\n")}`)
}

export function ContactForm({ activity, emailReady }: { activity?: string; emailReady: boolean }) {
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [eventType, setEventType] = useState("")
  const [waHref, setWaHref] = useState("")
  const startedAt = useRef(0)
  const form = useRef<HTMLFormElement>(null)
  const done = useRef<HTMLDivElement>(null)
  const uid = useId()

  useEffect(() => {
    startedAt.current = Date.now()
    const onPrefill = (e: Event) => setEventType((e as CustomEvent<{ eventType: string }>).detail.eventType)
    window.addEventListener(PREFILL_EVENT, onPrefill)
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill)
  }, [])

  // The confirmation is shorter than the form: bring it into view so the page doesn't seem to jump away
  useEffect(() => {
    if (status !== "sent" && status !== "whatsapp") return
    done.current?.scrollIntoView({ block: "center" })
    done.current?.focus({ preventScroll: true })
  }, [status])

  function validate(d: Record<string, string>) {
    const next: Errors = {}
    if ((d.name ?? "").trim().length < 2) next.name = "נא לכתוב שם, כדי שנדע למי לחזור."
    if (!PHONE.test((d.phone ?? "").trim())) next.phone = "נא לכתוב מספר טלפון, למשל 050-1234567."
    setErrors(next)
    const first = Object.keys(next)[0]
    if (first) {
      const field = form.current?.querySelector<HTMLElement>(`[name="${first}"]`)
      // Centre the field so its label is not hidden under the sticky header
      field?.scrollIntoView({ block: "center" })
      field?.focus({ preventScroll: true })
    }
    return !first
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const el = e.currentTarget
    const d = Object.fromEntries(new FormData(el)) as Record<string, string>
    if (!validate(d)) return
    const wa = toWhatsApp(d)
    setWaHref(wa)
    setError("")

    if (!emailReady) {
      window.open(wa, "_blank", "noopener,noreferrer")
      setStatus("whatsapp")
      return
    }

    setStatus("sending")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...d, elapsed: Date.now() - startedAt.current }),
      })
      const body = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        // Server-side failures get one plain message; validation and rate-limit messages are shown as sent
        setError(res.status >= 500 || !body.error ? "הפנייה לא נשלחה." : body.error)
        setStatus("error")
        return
      }
      el.reset()
      setEventType("")
      setStatus("sent")
    } catch {
      setError("אין חיבור לשרת.")
      setStatus("error")
    }
  }

  if (status === "sent" || status === "whatsapp") {
    return (
      <div
        ref={done}
        tabIndex={-1}
        className="flex flex-col items-start justify-center rounded-md bg-paper p-6 text-ink outline-none sm:p-10"
        role="status"
      >
        <CheckCircle2 className="h-12 w-12" strokeWidth={1.75} aria-hidden="true" />
        {status === "sent" ? (
          <>
            <h3 className="display mt-4 text-[2.6rem]">הפנייה התקבלה.</h3>
            <p className="mt-2 text-lg text-ink/80">תודה. נחזור אליכם בהקדם לטלפון שהשארתם.</p>
          </>
        ) : (
          <>
            <h3 className="display mt-4 text-[2.6rem]">ההודעה מוכנה בוואטסאפ.</h3>
            <p className="mt-2 text-lg text-ink/80">
              בחלון שנפתח כל הפרטים כבר כתובים. נשאר רק ללחוץ שליחה. לא נפתח חלון?
            </p>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-wa mt-5">
              <WhatsAppIcon className="h-5 w-5" />
              פתיחת ההודעה בוואטסאפ
            </a>
          </>
        )}
        <button type="button" onClick={() => setStatus("idle")} className="mt-6 font-bold underline underline-offset-4">
          חזרה לטופס
        </button>
      </div>
    )
  }

  const sending = status === "sending"
  const fieldError = (name: keyof Errors) =>
    errors[name] ? (
      <p id={`${uid}-${name}-err`} className="mt-1.5 flex items-center gap-1.5 text-[0.95rem] font-semibold text-[#a3260f]">
        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
        {errors[name]}
      </p>
    ) : null

  return (
    <form ref={form} onSubmit={onSubmit} noValidate className="relative rounded-md bg-paper p-5 text-ink sm:p-8">
      <fieldset>
        <legend className="text-lg font-bold">איזה אירוע?</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {eventTypes.map((t) => (
            <label
              key={t}
              className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border-2 border-ink/55 bg-card px-3 py-2 leading-tight font-semibold transition-colors hover:border-ink/80 has-[:checked]:border-ink has-[:checked]:bg-volt has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-ink/30"
            >
              <input
                type="radio"
                name="eventType"
                value={t}
                checked={eventType === t}
                onChange={() => setEventType(t)}
                className="h-5 w-5 shrink-0 accent-ink"
              />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      {activity && <input type="hidden" name="activity" value={activity} />}

      <div className="mt-6 grid gap-x-4 gap-y-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-location`} className="mb-1.5 block font-bold">
            איפה, בערך?
          </label>
          <input id={`${uid}-location`} name="location" maxLength={100} className="field" placeholder="עיר או אזור" />
        </div>
        <div>
          <label htmlFor={`${uid}-date`} className="mb-1.5 block font-bold">
            מתי?
          </label>
          <input id={`${uid}-date`} name="date" maxLength={60} className="field" placeholder="תאריך, גם אם משוער" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-participants`} className="mb-1.5 block font-bold">
            כמה משתתפים, ובאילו גילאים?
          </label>
          <input
            id={`${uid}-participants`}
            name="participants"
            maxLength={80}
            className="field"
            placeholder="למשל: כ-40 ילדים בני 12"
          />
        </div>
        <div>
          <label htmlFor={`${uid}-name`} className="mb-1.5 block font-bold">
            שם <span className="font-normal text-muted">(חובה)</span>
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            maxLength={100}
            autoComplete="name"
            className="field"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${uid}-name-err` : undefined}
          />
          {fieldError("name")}
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className="mb-1.5 block font-bold">
            טלפון לחזרה <span className="font-normal text-muted">(חובה)</span>
          </label>
          <input
            id={`${uid}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={15}
            dir="ltr"
            className="field text-right"
            placeholder="050-0000000"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
          />
          {fieldError("phone")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-message`} className="mb-1.5 block font-bold">
            עוד משהו שכדאי שנדע? <span className="font-normal text-muted">(לא חובה)</span>
          </label>
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={3}
            maxLength={2000}
            className="field resize-y"
            defaultValue={activity ? `מתעניינים ב${activity}. ` : undefined}
          />
        </div>
        {/* Spam trap: hidden from people, bots tend to fill it */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Company
            <input name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      </div>

      {status === "error" && (
        <div role="alert" className="mt-6 rounded-md border-2 border-[#a3260f] bg-card p-4">
          <p className="flex items-start gap-2 font-semibold text-[#a3260f]">
            <AlertCircle className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
            {error} אפשר לשלוח את אותם פרטים בוואטסאפ או להתקשר.
          </p>
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-wa mt-3">
            <WhatsAppIcon className="h-5 w-5" />
            שליחת הפרטים בוואטסאפ
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={sending}
        className={`group mt-7 w-full !min-h-14 !text-lg ${emailReady ? "btn-ink" : "btn-wa"}`}
      >
        {sending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            שולחים...
          </>
        ) : emailReady ? (
          <>
            שלחו, ונחזור עם הצעה
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          </>
        ) : (
          <>
            <WhatsAppIcon className="h-5 w-5" />
            המשך לשליחה בוואטסאפ
          </>
        )}
      </button>
      <p className="mt-3 text-center text-[0.95rem] text-muted">
        {emailReady
          ? "הפרטים משמשים רק כדי לחזור אליכם."
          : "ייפתח וואטסאפ עם הודעה מוכנה שכוללת את הפרטים. הם לא נשמרים באתר."}
      </p>
    </form>
  )
}
