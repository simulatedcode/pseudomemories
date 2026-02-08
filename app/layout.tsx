import type { Metadata } from "next";
import { Electrolize, Doto } from "next/font/google"
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
        <GeoProvider>
          <Intro />
          <SmoothScroll>
            <Header />
            <main className="relative w-auto mx-auto z-10 flex flex-col pt-spacing-10 px-spacing-06 sm:px-spacing-08 flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </SmoothScroll>
        </GeoProvider>

        {/* Global Dynamic Texture/Grain overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.2] z-100 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </body>
    </html>
  );
}
