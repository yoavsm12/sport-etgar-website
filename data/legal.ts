/**
 * Details shown on the privacy policy and accessibility statement pages.
 *
 * Anything left as `null` is shown on the page as a highlighted "[להשלמה: ...]" marker,
 * so a missing detail cannot be published by accident. Fill these in (see CONTENT-TODO.md),
 * and have the texts in app/privacy and app/accessibility reviewed by a lawyer / accessibility consultant before going live.
 */

export const legal = {
  /** Shown as "last updated" on both pages. Change it whenever the texts change. */
  updated: "25.10.2026",

  /** ח.פ. of אקסטרים אירועים בע"מ */
  companyId: null as string | null,
  /** Postal address of the business */
  address: null as string | null,

  /** Person to contact about accessibility problems on the site */
  accessibilityCoordinator: {
    name: null as string | null,
    phone: null as string | null,
    email: null as string | null,
  },

  /** How long enquiries are kept, e.g. "עד 24 חודשים מיום הפנייה" */
  retention: null as string | null,
  /** The email service that carries form messages to the business mailbox */
  mailProvider: null as string | null,
}
