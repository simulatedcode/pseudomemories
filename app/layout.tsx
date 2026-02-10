import type { Metadata } from "next";
import { Electrolize, Doto } from "next/font/google"
import GoogleAnalytics from "./components/GoogleAnalytics";
import SmoothScroll from "./components/SmoothScroll";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import PageTransition from "./components/PageTransition";
import Intro from "./components/Intro";
import "./globals.css";

const electrolize = Electrolize({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-electrolize",
  display: "swap",
});

const doto = Doto({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-doto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "pseudo memories",
  description: "pseudo memories - memories of the past",
  icons: {
    icon: "/favicon.ico",
  },
};

import { GeoProvider } from "./context/GeoContext";
import { AudioProvider } from "./context/AudioContext";
import { IntroProvider } from "./context/IntroContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${electrolize.variable} ${doto.variable} antialiased`}
      >
        <GoogleAnalytics />

        <AudioProvider>
          <IntroProvider>
            <GeoProvider>
              <Intro />
              <SmoothScroll>
                <Header />
                <div className="relative w-full flex flex-col">
                  <main className="relative overflow-x-hidden grow">
                    <PageTransition>{children}</PageTransition>
                  </main>
                  <Footer />
                </div>
              </SmoothScroll>
            </GeoProvider>
          </IntroProvider>
        </AudioProvider>


        {/* Global Dynamic Texture/Grain overlay - Subtler for premium feel */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.08] z-100 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </body>
    </html >
  );
}
