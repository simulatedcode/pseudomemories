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
          <GeoProvider>
            <Intro />
            <SmoothScroll>
              <Header />
              <div className="relative min-h-screen flex flex-col">
                <main className="relative w-full mx-auto z-10 flex flex-col pt-spacing-13 flex-1 overflow-x-hidden">
                  <PageTransition>{children}</PageTransition>
                </main>
              </div>
              <Footer />
            </SmoothScroll>
          </GeoProvider>
        </AudioProvider>


        {/* Global Dynamic Texture/Grain overlay - Subtler for premium feel */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.06] z-100 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </body>
    </html >
  );
}
