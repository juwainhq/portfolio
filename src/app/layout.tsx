import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { SiteConfigProvider } from "@/context/site-config";
import { DynamicFavicon } from "@/components/DynamicFavicon";
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
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <SiteConfigProvider>
          <DynamicFavicon />
          {children}
        </SiteConfigProvider>
      </body>
    </html>
  );
}
