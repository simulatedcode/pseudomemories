import type { Metadata } from "next";
import { Electrolize, Doto } from "next/font/google"
import SmoothScroll from "./components/SmoothScroll";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import PageTransition from "./components/PageTransition";
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
  title: "in a landscape",
  description: "in a landscape",
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
        className={`${electrolize.variable} ${doto.variable} antialiased`}
      >
        <SmoothScroll>
          <Header />
          <main className="relative w-auto mx-auto z-10 flex flex-col pt-spacing-10 px-spacing-06 sm:px-spacing-08 flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
