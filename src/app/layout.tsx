import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { SiteConfigProvider } from "@/context/site-config";
import { DynamicFavicon } from "@/components/DynamicFavicon";
import "./globals.css";

/* -------------------------------------------------------------------------- */
/*  Type: self-hosted, no third-party font requests at runtime                */
/*  Archivo Black = the big expressive display face ("Juwain / Haque", heads)  */
/*  Inter (variable) = the clean UI/body face                                 */
/* -------------------------------------------------------------------------- */
const display = localFont({
  src: "../fonts/archivo-black-latin-400.woff2",
  variable: "--font-display",
  weight: "400",
  style: "normal",
  display: "swap",
  fallback: ["Impact", "Haettenschweiler", "system-ui", "sans-serif"],
  preload: true,
});

// Inter (variable) — subset to the latin range actually used by the site and
// clamped to the 400–650 weight band, which takes the file from 48 kB to 21 kB.
const body = localFont({
  src: "../fonts/inter-latin-variable.woff2",
  variable: "--font-body",
  weight: "400 650",
  style: "normal",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
  preload: true,
});

const SITE_URL = "https://juwainhq.github.io/portfolio/";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Juwain Haque — Graphic Designer & Business Consultant",
    template: "%s — Juwain Haque",
  },
  description:
    "Independent graphic designer and business consultant based in Dhaka. Brand identity, visual systems and practical business strategy for people who want to be seen and understood.",
  applicationName: "Juwain Haque",
  authors: [{ name: "Juwain Haque", url: SITE_URL }],
  creator: "Juwain Haque",
  keywords: [
    "Juwain Haque",
    "graphic designer",
    "business consultant",
    "brand identity",
    "visual identity",
    "creative direction",
    "Dhaka designer",
  ],
  alternates: { canonical: SITE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: { icon: `${basePath}/favicon.ico` },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Juwain Haque",
    title: "Juwain Haque — Graphic Designer & Business Consultant",
    description:
      "Brand identity, visual systems and practical business strategy. Based in Dhaka, working worldwide.",
    locale: "en_US",
    images: [
      {
        url: `${basePath}/og.png`,
        width: 1200,
        height: 630,
        alt:
          "Juwain Haque, graphic designer and business consultant — a dithered colour field with the name set in bold display type.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Juwain Haque — Graphic Designer & Business Consultant",
    description:
      "Brand identity, visual systems and practical business strategy. Based in Dhaka, working worldwide.",
    images: [`${basePath}/og.png`],
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#08080D" },
    { media: "(prefers-color-scheme: light)", color: "#F6F2E9" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} dark`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="juwain-theme"
          themes={["dark", "light"]}
        >
          <SiteConfigProvider>
            <DynamicFavicon />
            {children}
          </SiteConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
