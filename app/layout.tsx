import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { Assistant, Karantina } from "next/font/google"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ActionBar } from "@/components/action-bar"
import { contact, site, social } from "@/data/site"
import "./globals.css"

const assistant = Assistant({ subsets: ["hebrew", "latin"], variable: "--font-assistant", display: "swap" })
const karantina = Karantina({
  subsets: ["hebrew", "latin"],
  weight: ["400", "700"],
  variable: "--font-karantina",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: site.keywords,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    images: [{ url: "/images/ninja/large/6.webp", width: 1280, height: 622 }],
  },
  icons: { icon: "/logo.png", apple: "/apple-icon.png" },
}

export const viewport: Viewport = {
  themeColor: "#f4f0e6",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.legalName,
  description: site.description,
  url: site.url,
  logo: `${site.url}/logo.png`,
  image: `${site.url}/images/ninja/large/6.webp`,
  telephone: contact.phones[0].tel,
  email: contact.email,
  areaServed: { "@type": "Country", name: "Israel" },
  sameAs: [social.facebook, social.instagram],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable} ${karantina.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-[100] focus:rounded-md focus:bg-volt focus:px-5 focus:py-3 focus:font-bold focus:text-ink"
        >
          דלג לתוכן הראשי
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ActionBar />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {/* NagishLi accessibility widget (bottom right). It needs jQuery and would otherwise fetch
            jQuery 1.8.0 (known XSS issues) from a CDN, so a current copy is served locally first.
            The site itself is built to be accessible without it. */}
        <Script id="nagishli-loader" strategy="lazyOnload">
          {`window.nagishli_config = { language: "he", color: "black" };
(function () {
  function load(src, cb) { var s = document.createElement("script"); s.src = src; s.charset = "utf-8"; s.onload = cb; document.body.appendChild(s); }
  load("/vendor/jquery-3.7.1.min.js", function () { load("/nagishli_beta.js?v=3.0b"); });
})();`}
        </Script>
      </body>
    </html>
  )
}
