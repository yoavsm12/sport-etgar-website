import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { z } from "zod"

export const runtime = "nodejs"

const MAX_BODY_BYTES = 10_000

// Strip control characters (incl. CR/LF) from single-line fields
const singleLine = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((s) => s.replace(/[\u0000-\u001f\u007f]/g, " "))

const schema = z.object({
  name: singleLine(100).pipe(z.string().min(2)),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{9,15}$/),
  email: z.union([z.literal(""), z.email().max(200)]).optional(),
  eventType: singleLine(60).optional(),
  activity: singleLine(60).optional(),
  location: singleLine(100).optional(),
  date: singleLine(60).optional(),
  participants: singleLine(80).optional(),
  message: z.string().trim().max(2000).optional(),
  company: z.string().max(200).optional(), // spam trap, must stay empty
  elapsed: z.number().optional(),
})

// In-memory rate limit: 5 messages per client per 10 minutes
const WINDOW_MS = 10 * 60 * 1000
const LIMIT = 5
const hits = new Map<string, { count: number; resetAt: number }>()

function rateLimited(key: string) {
  const now = Date.now()
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.resetAt < now) hits.delete(k)
  }
  const entry = hits.get(key)
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  entry.count++
  return entry.count > LIMIT
}

// The hosting proxy appends the real client address as the last X-Forwarded-For entry;
// earlier entries are supplied by the client and can be spoofed.
function clientKey(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for")
  const last = xff?.split(",").pop()?.trim()
  return last || req.headers.get("x-real-ip") || "unknown"
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)

const json = (status: number, body: object) => NextResponse.json(body, { status })

export async function POST(req: NextRequest) {
  // Only accept submissions from this site's own pages
  const origin = req.headers.get("origin")
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host")
  if (!origin || !host || new URL(origin).host !== host) {
    return json(403, { error: "בקשה לא מורשית." })
  }

  if (rateLimited(clientKey(req))) {
    return json(429, { error: "נשלחו יותר מדי הודעות. נסו שוב מאוחר יותר או התקשרו אלינו." })
  }

  const raw = await req.text()
  if (raw.length > MAX_BODY_BYTES) return json(413, { error: "ההודעה ארוכה מדי." })

  let parsed: z.infer<typeof schema>
  try {
    const result = schema.safeParse(JSON.parse(raw))
    if (!result.success) return json(400, { error: "נא לבדוק את השם ומספר הטלפון ולנסות שוב." })
    parsed = result.data
  } catch {
    return json(400, { error: "בקשה לא תקינה." })
  }

  // Bots: filled the hidden field or submitted faster than a person could. Pretend success.
  if (parsed.company || (parsed.elapsed !== undefined && parsed.elapsed < 2500)) {
    return json(200, { success: true })
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, CONTACT_RECIPIENT } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error("Contact form: SMTP settings are missing")
    return json(500, { error: "שגיאה בשליחת ההודעה. נסו שוב מאוחר יותר או התקשרו אלינו." })
  }

  const { name, phone, email, eventType, activity, location, date, participants, message } = parsed
  const rows: [string, string][] = [
    ["שם", name],
    ["טלפון", phone],
    ["סוג האירוע", eventType || "-"],
    ["פעילות", activity || "-"],
    ["מיקום", location || "-"],
    ["תאריך", date || "-"],
    ["משתתפים", participants || "-"],
  ]
  if (email) rows.push(["אימייל", email])

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  try {
    await transporter.sendMail({
      from: { name: "אתר אקסטרים אירועים", address: SMTP_USER },
      to: CONTACT_RECIPIENT || SMTP_USER,
      replyTo: email || undefined,
      subject: `פנייה חדשה מהאתר - ${name}${eventType ? ` (${eventType})` : ""}`,
      text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nהודעה:\n${message || "-"}`,
      html: `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6">
<h2 style="margin:0 0 12px">פנייה חדשה מהאתר</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
        .map(([k, v]) => `<tr><td style="color:#666">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`)
        .join("")}</table>
<p style="margin:16px 0 4px;color:#666">הודעה:</p>
<p style="margin:0;white-space:pre-wrap">${escapeHtml(message || "-")}</p>
</div>`,
    })
  } catch (err) {
    console.error("Contact form: failed to send email", err)
    return json(500, { error: "שגיאה בשליחת ההודעה. נסו שוב מאוחר יותר או התקשרו אלינו." })
  }

  return json(200, { success: true })
}
