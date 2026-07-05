import { Geist, Geist_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { profile, SITE_URL } from "@/data/profile";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const serifDisplay = Instrument_Serif({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const displayGrotesk = Instrument_Sans({
  variable: "--font-display-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.shortName} — ${profile.role}`,
    template: `%s — ${profile.shortName}`,
  },
  description: profile.summary,
  keywords: [
    "Santhosh Kumar",
    "S K Santhosh Kumar",
    "Senior Software Engineer",
    "Full-Stack Developer",
    "React",
    "Next.js",
    "JavaScript",
    "Bengaluru",
    "Portfolio",
  ],
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${profile.shortName} — ${profile.role}`,
    description: profile.summary,
    siteName: profile.shortName,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.shortName} — ${profile.role}`,
    description: profile.summary,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a10" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeInit = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: profile.shortName,
  url: SITE_URL,
  email: `mailto:${profile.email}`,
  jobTitle: profile.role,
  worksFor: {
    "@type": "Organization",
    name: profile.company,
  },
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "B. M. S. College of Engineering",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "Christ University, Bangalore",
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    addressCountry: "IN",
  },
  sameAs: [profile.linkedin],
  knowsLanguage: profile.languages.map((l) => l.name),
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${serifDisplay.variable} ${displayGrotesk.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}.word-scrub .w{opacity:1 !important}.gsap-fallback{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInit }}
        />
        {children}
      </body>
    </html>
  );
}
