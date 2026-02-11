"use client";

import { Electrolize, Doto, Pixelify_Sans } from "next/font/google";
import GoogleAnalytics from "./lib/GoogleAnalytics";
import LenisScroll from "./components/LenisScroll";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import PageTransition from "./components/ui/PageTransition";
import { AudioTransmitMobile } from "./components/ui/AudioTransmitMobile";
import "./globals.css";

import { GeoProvider } from "./context/GeoContext";
import { AudioProvider } from "./context/AudioContext";
import { IntroProvider } from "./context/IntroContext";
import { Menu } from "./components/Menu";
import PageShell from "./components/ui/PageShell";
import { useState } from "react";
import Intro from "./components/ui/Intro";

const electrolize = Electrolize({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-electrolize",
  display: "swap",
});

const doto = Doto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-doto",
  display: "swap",
});

const pixelifysans = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-pixelify-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${electrolize.variable} ${doto.variable} ${pixelifysans.variable} antialiased`}
      >
        <GoogleAnalytics />

        <AudioProvider>
          <IntroProvider>
            <GeoProvider>
              <Intro />
              <AudioTransmitMobile />
              <LenisScroll>
                <PageShell isMenuOpen={menuOpen}>
                  <Header onMenuToggle={() => setMenuOpen(true)} />
                  <PageTransition>
                    <div className="relative min-h-screen w-full flex flex-col">
                      <main className="relative overflow-x-hidden">
                        {children}
                      </main>
                    </div>
                  </PageTransition>
                  <Footer />
                </PageShell>
              </LenisScroll>
              <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
            </GeoProvider>
          </IntroProvider>
        </AudioProvider>

        <div className="fixed inset-0 pointer-events-none opacity-[0.08] z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </body>
    </html >
  );
}
