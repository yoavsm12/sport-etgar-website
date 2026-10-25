import Link from "next/link"
import { Phone } from "lucide-react"
import { contact, whatsappLink } from "@/data/site"
import { WhatsAppIcon } from "@/components/icons"

/**
 * Phones: a bar with the three ways to reach us, kept clear of the accessibility
 * button that NagishLi places in the bottom-right corner (60px + 10px margin).
 * Desktop: a single WhatsApp button in the bottom-left corner.
 */
export function ActionBar() {
  return (
    <>
      <div
        className="fixed bottom-[max(0.625rem,env(safe-area-inset-bottom))] left-2.5 right-[5rem] z-40 grid grid-cols-[1.3fr_1fr_auto] gap-1.5 rounded-lg bg-ink p-1.5 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.5)] lg:hidden"
        role="navigation"
        aria-label="יצירת קשר מהירה"
      >
        <Link href="/#contact" className="flex min-h-12 items-center justify-center rounded-md bg-volt px-1.5 text-[0.95rem] font-bold whitespace-nowrap text-ink min-[360px]:text-base">
          בקשת הצעה
        </Link>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-center gap-1.5 rounded-md bg-whatsapp px-1.5 text-[0.95rem] font-bold whitespace-nowrap text-white min-[360px]:text-base"
        >
          <WhatsAppIcon className="hidden h-5 w-5 min-[360px]:block" />
          וואטסאפ
        </a>
        <a
          href={`tel:${contact.phones[0].tel}`}
          className="flex min-h-12 min-w-12 items-center justify-center rounded-md bg-paper/10 text-paper"
          aria-label={`התקשרו: ${contact.phones[0].display}`}
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
        </a>
      </div>

      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-40 hidden items-center gap-2 rounded-full bg-whatsapp py-3 ps-4 pe-5 font-bold text-white shadow-[0_12px_30px_-10px_rgb(0_0_0/0.45)] transition-colors hover:bg-whatsapp-deep lg:flex"
      >
        <WhatsAppIcon className="h-6 w-6" />
        שאלה מהירה בוואטסאפ
      </a>
    </>
  )
}
