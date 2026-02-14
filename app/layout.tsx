import { Electrolize, Doto, IBM_Plex_Mono, } from "next/font/google";
import localFont from "next/font/local";
import GoogleAnalytics from "./lib/GoogleAnalytics";
import ClientLayout from "./components/ClientLayout";
import { CustomCursor } from "./components/CustomCursor";
import "./globals.css";
import { Metadata } from "next";

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

const ibmplexmono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibmplexmono",
  display: "swap",
});

const iawriter = localFont({
  src: "../public/fonts/iAWriterDuoS-Regular.woff2",
  variable: "--font-iawriter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pseudo Memories",
  description: "An immersive digital artifact exploring simulated memories through cinematic 3D, ambient audio, and interactive storytelling.",
  keywords: ["Artist, Printmaker, Illustrator, Digital Art", "Creative Coding", "Three.js", "Portfolio", "Immersive Experience"],
  openGraph: {
    title: "Pseudo Memories",
    description: "An immersive digital artifact exploring simulated memories.",
    url: "https://pseudomemories.web.app",
    siteName: "Pseudo Memories",
    locale: "indonesia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pseudo Memories",
    description: "An immersive digital artifact exploring simulated memories.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${electrolize.variable} ${doto.variable} ${ibmplexmono.variable} ${iawriter.variable} antialiased`}
      >
        <GoogleAnalytics />
        <CustomCursor />
        <ClientLayout>
          {children}
        </ClientLayout>
        <div className="fixed inset-0 pointer-events-none opacity-[0.08] z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </body>
    </html >
  );
}
