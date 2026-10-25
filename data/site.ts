/**
 * Site-wide settings: business details, texts and links.
 * Edit this file to change contact info or homepage copy.
 *
 * Anything marked TODO is a business detail we could not confirm from the existing material.
 * It is either left out of the page or worded cautiously until it is filled in.
 * The full list is in CONTENT-TODO.md.
 */

export const site = {
  name: "אקסטרים אירועים",
  legalName: 'אקסטרים אירועים בע"מ',
  tagline: "מתקני אתגר ניידים לאירועים, ימי גיבוש ובתי ספר",
  url: "https://sport-etgar.com",
  description:
    "אקסטרים אירועים מביאים לאירוע שלכם מסלול נינג'ה, קיר טיפוס, פארק חבלים, סנפלינג ואומגה, מתקני כוח ומתחמי ירי. מקימים, מדריכים ומפעילים בכל הארץ, לימי גיבוש, בר ובת מצווה, בתי ספר וקבוצות.",
  keywords: [
    "אקסטרים אירועים",
    "אטרקציות לאירועים",
    "ימי גיבוש",
    "מסלול נינג'ה",
    "קיר טיפוס נייד",
    "פארק חבלים",
    "סנפלינג",
    "אטרקציות לבר מצווה",
    "פעילות לבית ספר",
  ],
}

export const contact = {
  phones: [
    { display: "050-7957274", tel: "+972507957274" },
    { display: "052-2225025", tel: "+972522225025" },
  ],
  email: "sport_a@walla.com",
  whatsapp: "972507957274",
  whatsappText: "שלום, אני מתכנן/ת אירוע ואשמח לשמוע מה אפשר להביא אליו",
  area: "מגיעים לכל הארץ",
}

export const social = {
  facebook: "https://www.facebook.com/ninjasportattraction/",
  instagram: "https://www.instagram.com/sportattractionisrael/",
}

export function whatsappLink(text: string = contact.whatsappText) {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`
}

export const hero = {
  // Each line of the headline is paired with a real photo of that kind of place.
  lines: [
    { text: "מסלול נינג'ה באולם.", photo: "/images/ninja/6.jpg", tag: "אולם ספורט", alt: "מסלולי נינג'ה באולם ספורט, ילדים רבים סביב המכשולים" },
    { text: "קיר טיפוס בחצר.", photo: "/images/climbing-wall/1.jpg", tag: "חצר, לפנות ערב", alt: "ילדים ברתמות מטפסים על קיר טיפוס מואר בין עצי דקל" },
    { text: "פארק חבלים בין העצים.", photo: "/images/rope-park/1.jpg", tag: "בין העצים", alt: "ילדים מטפסים על רשתות חבלים שנמתחו בין עצים" },
  ],
  lead: "אנחנו מביאים את המתקנים לאירוע שלכם, מקימים אותם, מדריכים ומפעילים, בכל הארץ. לימי גיבוש, בר ובת מצווה, בתי ספר וקבוצות גדולות.",
}

/**
 * "This is what it looks like" strip on the homepage.
 * Captions describe only what is visible in each photo.
 * TODO: when known, replace with the real event details (type of event, place, number of participants, what was set up).
 */
export const scenes = [
  { photo: "/images/ninja/8.jpg", place: "אולם ספורט", text: "רשתות ומכשולים על משטחי נחיתה מתנפחים, וילדים בתור לנסות.", alt: "ילדים מטפסים על רשתות במסלול נינג'ה באולם ספורט", wide: true },
  { photo: "/images/gibush/292cbf80-9fd1-4e94-8087-8b796addd9d9.jpg", place: "דשא", text: "אימון קבוצתי על טרמפולינות, כולם באותו קצב.", alt: "קבוצת מבוגרים מתאמנת על טרמפולינות על הדשא" },
  { photo: "/images/slideshow/d1291b3b-0c65-47f4-b223-8b6d694c13cb.jpg", place: "קניון", text: "מסלול נינג'ה בלב מתחם קניות, על משטח נחיתה צהוב.", alt: "ילדים על מסלול נינג'ה בתוך קניון", wide: true },
  { photo: "/images/zipline/7099e53b-87b4-4458-8317-b54023e4b48b.jpg", place: "אירוע בחצר", text: "אומגה מעל הדשא, והאורחים צופים מהצד.", alt: "ילדה גולשת באומגה מעל דשא, אורחים עומדים ליד הבית" },
  { photo: "/images/rope-park/718fd831-5fea-40e6-893c-16638144d13c.jpg", place: "חורשה", text: "מסלול חבלים שנמתח בין עצי אורן, משתתפים ברתמות בגובה.", alt: "משתתפים ברתמות על מסלול חבלים בין עצי אורן" },
  { photo: "/images/mma-and-machines/0ff58d6a-2aaf-40bf-8289-81aa24960058.jpg", place: "בין השולחנות", text: "שולחן תגובה עם לוח ניקוד, ותחרות צמודה בין המשתתפים.", alt: "מבוגרים צוחקים סביב שולחן משחק תגובה עם לוח ניקוד" },
  { photo: "/images/extreme-attractions/8054a3a3-8ced-4a61-ba5a-596a3087eac8.jpg", place: "ערב", text: "מגדל טיפוס מואר, ומשטחי נחיתה צבעוניים סביבו.", alt: "מגדל טיפוס מואר בלילה מעל משטחי נחיתה צבעוניים", wide: true },
  { photo: "/images/gibush/ada5cb80-956e-48fe-8dc3-ed4e8b03956b.jpg", place: "שטח פתוח", text: "קבוצה בקסדות נחה על הסלעים בין ירידה לירידה בחבלים.", alt: "קבוצה עם קסדות יושבת על סלעים בכניסה למערה" },
]

/** What the business takes care of, step by step, and what is left for the organiser. */
export const handled = {
  steps: [
    {
      title: "מתאימים את הפעילות",
      text: "שיחה קצרה על הקהל, הגילאים והמקום. ממליצים על מתקן אחד או על שילוב, ושולחים הצעת מחיר.",
      saves: "לא צריך לדעת מראש מה לבחור",
    },
    {
      title: "מגיעים עם כל הציוד",
      text: "המתקנים, משטחי הנחיתה, הרתמות והקסדות מגיעים איתנו.",
      saves: "אין ציוד להשיג או לשכור בנפרד",
    },
    {
      title: "מקימים בשטח",
      text: "בונים את המתקנים במקום שסיכמנו מראש: חצר, אולם, פארק או מגרש.",
      saves: "אין צורך בצוות הקמה משלכם",
    },
    {
      title: "מדריכים ומפעילים",
      text: "המדריכים שלנו מסבירים, מלבישים ציוד מגן ומפעילים את המתקנים לאורך כל הפעילות. בסוף מפרקים ולוקחים הכל איתנו.",
      saves: "אתם פנויים לאורחים",
    },
  ],
  yours: ["לבחור תאריך", "לדאוג לשטח ולספר לנו עליו", "להביא את האנשים"],
}

/** "Who comes to your event" section. */
export const crew = {
  text: [
    "מאחורי כל מתקן עומד מדריך מהצוות שלנו. הוא מסביר לכל משתתף מה עושים, מלביש רתמה וקסדה כשצריך, ומחליט מתי עולים ומתי מחכים.",
    "אנחנו בונים את הפעילות לפי הקהל: מסלול קל יותר לילדים צעירים, אתגר קשה יותר למי שכבר ניסה, ותחרות כשהקבוצה רוצה להתחרות.",
  ],
  photos: [
    { src: "/images/zipline/acd98be1-a218-43a2-9656-379e3ab44323.jpg", alt: "מדריך בחולצת החברה מאבטח משתתפת בירידה בחבלים", caption: "מאבטחים כל ירידה בחבלים" },
    { src: "/images/extreme-attractions/0aa0bcdd-77ca-4f7c-bafd-8e36a46252b0.jpg", alt: "מדריך מחזיק את חבל האבטחה של ילדים על קיר טיפוס מתנפח", caption: "מחזיקים את החבל מלמטה" },
    { src: "/images/gibush/f73f5dd4-07a7-47fb-becb-7855bc344878.jpg", alt: "מדריך נושא חבלים ומוביל קבוצה בשביל סלעי", caption: "מובילים את הקבוצה בשטח" },
  ],
  // TODO: founder name(s), the year the business started and a short personal story.
  // When filled in, it is shown in the crew section.
  story: null as string | null,
}

/**
 * General questions. Answers here must not contradict the activity pages.
 * Minimum ages are listed per activity in data/activities.ts.
 */
export const faq = [
  {
    q: "מאיזה גיל אפשר להשתתף?",
    a: "זה תלוי בפעילות. לכל מתקן יש גיל מינימלי משלו, והוא מופיע בדף הפעילות: למשל קיר הטיפוס מגיל 5, מסלול הנינג'ה מגיל 6, וסנפלינג ואומגה מגיל 8. ספרו לנו מה טווח הגילאים בקבוצה ונמליץ על מה שמתאים.",
  },
  {
    q: "כמה מקום צריך, ואיפה אפשר להקים?",
    a: "הקמנו מתקנים באולמות ספורט, בחצרות של בתי ספר, בפארקים, בקניונים, על החוף ובין עצים. כל מתקן צריך שטח אחר, ולכן לפני ההצעה נשאל אתכם על המקום: מקורה או פתוח, בערך כמה גדול, ואיך מגיעים אליו עם ציוד.",
  },
  {
    q: "לאילו אזורים אתם מגיעים?",
    a: "לכל הארץ. המתקנים ניידים, והצוות מגיע איתם למקום האירוע.",
  },
  {
    q: "איך שומרים על בטיחות המשתתפים?",
    a: "כל משתתף מקבל ציוד מגן שמתאים לפעילות, למשל רתמה וקסדה בקיר הטיפוס ובסנפלינג. מדריכים מהצוות שלנו מפעילים כל מתקן לאורך כל הפעילות, מסבירים לפני שעולים, וקובעים מי עולה ומתי. לפני האירוע נעבור איתכם על הגילאים, על מספר המשתתפים ועל השטח.",
  },
  {
    q: "זה מתאים גם לקבוצה גדולה?",
    a: "כן. בקבוצות גדולות אפשר להקים כמה מתקנים באותו מקום, כך שהמשתתפים מתחלקים בין כמה תחנות. ספרו לנו כמה משתתפים צפויים ונמליץ על מספר תחנות.",
  },
  {
    q: "כמה זמן נמשכת הפעילות?",
    // TODO: confirm the typical duration (the old site said 2-4 hours).
    a: "משך הפעילות גמיש ונקבע לפי גודל הקבוצה וסוג האירוע. ספרו לנו כמה זמן יש לכם ונבנה את הפעילות בהתאם.",
  },
  {
    q: "איך מקבלים הצעת מחיר, ומתי כדאי לפנות?",
    a: "משאירים פרטים בטופס, שולחים הודעה בוואטסאפ או מתקשרים. נשאל על סוג האירוע, המקום, התאריך ומספר המשתתפים, ונחזור עם המלצה והצעת מחיר בלי התחייבות. מומלץ לפנות לפחות שבועיים מראש, במיוחד בחגים ובחופשות.",
  },
]

/** Event types offered in the contact form. The first three match the homepage paths. */
export const eventTypes = [
  "יום גיבוש לחברה או לצוות",
  "בר/בת מצווה או אירוע משפחתי",
  "בית ספר, תנועת נוער או קבוצה גדולה",
  "אחר",
]
