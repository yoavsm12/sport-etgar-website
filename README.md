# sport-etgar.com — אקסטרים אירועים

Website for אקסטרים אירועים: mobile extreme-sport attractions for events (ninja courses, climbing wall, rope park, rappelling, strength machines, shooting range, team-building days). The homepage starts from the kind of event the visitor is planning; each activity has its own page.

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript. Hebrew, right-to-left.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in SMTP settings for the contact form
npm run dev                  # http://localhost:3000
```

`npm run build && npm start` runs the production build. `npm run typecheck` checks types.

## Editing content

| What | Where |
| --- | --- |
| Phones, email, WhatsApp, social links, homepage texts, photo captions, FAQ | `data/site.ts` |
| The three "what kind of event" paths on the homepage | `data/events.ts` |
| Activities (texts, ages, highlight photos and captions, questions, SEO) | `data/activities.ts` |
| Photos and videos for an activity | `public/images/<folder>/` |

Each activity page lives at `/<id>`. Its chosen `highlights` are shown first with captions; every other photo and video in its folder follows as small previews.

Business details that still need confirming are listed in `CONTENT-TODO.md`.

The privacy policy (`/privacy`) and accessibility statement (`/accessibility`) take their business details from `data/legal.ts`. A detail left as `null` is shown on the page as a highlighted "[להשלמה: ...]" marker, so fill them all in (and have the texts reviewed) before going live.

### Adding photos or videos

1. Drop the files into the right `public/images/<folder>/`.
2. Run `npm run media`. It shrinks new photos and creates the 640px previews in `thumbs/` and 1280px versions in `large/` (videos need `ffmpeg` installed; add `--videos` to also re-encode them to 720p).
3. Commit. Videos are stored with Git LFS (`git lfs install` once per machine). A copy without LFS has small pointer files instead of videos; the site skips those.

## Contact form

The form asks for the event type, rough location, date, number of participants, name and phone.

- **With SMTP configured** (the variables in `.env.example`, set before `npm run build`): `POST /api/contact` sends an email. If sending fails, the form offers to send the same details on WhatsApp.
- **Without SMTP**: the same form opens a ready-made WhatsApp message with all the details, and says so next to the button.

The API validates input, escapes everything placed in the email, rejects requests from other sites, rate-limits to 5 messages per 10 minutes per visitor, and silently drops bot submissions (hidden field + minimum fill time).

## Security notes

- Strict security headers including a Content-Security-Policy that only allows resources from this site (`next.config.ts`).
- The NagishLi accessibility widget would load jQuery 1.8.0 from a CDN; a current jQuery (3.7.1) is served from `public/vendor/` instead.
- `npm audit` reports 0 vulnerabilities. Keep it that way with `npm outdated` / `npm update` now and then.

## Deploying (Hostinger)

The site runs on Hostinger Node.js hosting (Node 22). Upload a zip of the source (without `node_modules`, `.next`, `.git`) and start a build with app type **Next.js**, build script `build`, output `.next`. SMTP settings are set as environment variables on the host.
