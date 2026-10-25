import { Hero } from "@/components/hero"
import { EventPaths } from "@/components/event-paths"
import { Scenes } from "@/components/scenes"
import { Handled } from "@/components/handled"
import { Crew } from "@/components/crew"
import { ActivityIndex } from "@/components/activity-index"
import { Faq } from "@/components/faq"
import { Contact } from "@/components/contact"
import { faq } from "@/data/site"

export default function Home() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }

  return (
    <>
      <Hero />
      <EventPaths />
      <Handled />
      <Scenes />
      <Crew />
      <ActivityIndex />
      <Faq items={faq} />
      <Contact />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  )
}
