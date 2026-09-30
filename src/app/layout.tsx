import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SiteConfigProvider } from "@/context/site-config";
import { DynamicFavicon } from "@/components/DynamicFavicon";
import { CursorEffects } from "@/components/cursor-effects";
import { RouteProgress } from "@/components/route-progress";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Juwain Haque — Graphic Designer & Business Consultant",
  description:
    "Independent graphic designer and business consultant focused on creating strong visual identities and practical strategies that help businesses communicate, position themselves, and grow.",
  icons: {
    // Metadata icon paths are not basePath-aware — prefix manually so the
    // favicon resolves on GitHub Pages (/portfolio) as well as locally.
    icon: `${(process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "")}/favicon.ico`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <SiteConfigProvider>
            <DynamicFavicon />
            <RouteProgress />
            <CursorEffects />
            {children}
          </SiteConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
