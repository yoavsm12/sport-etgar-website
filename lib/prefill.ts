/** Lets buttons elsewhere on the page pre-select the event type in the contact form. */
export const PREFILL_EVENT = "contact:prefill"

export function prefillContact(eventType: string) {
  window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: { eventType } }))
}
