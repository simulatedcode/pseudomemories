"use client";

import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import PageTransition from "./ui/PageTransition";
import Intro from "./ui/Intro";
import { AudioTransmitMobile } from "./ui/AudioTransmitMobile";
import LenisScroll from "./LenisScroll";
import { GeoProvider } from "../context/GeoContext";
import { AudioProvider } from "../context/AudioContext";
import { IntroProvider } from "../context/IntroContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <AudioProvider>
            <IntroProvider>
                <GeoProvider>
                    <Intro />
                    <AudioTransmitMobile />
                    <LenisScroll>

                        <Header />
                        <PageTransition>
                            <div className="relative min-h-screen w-full flex flex-col">
                                <main className="relative overflow-x-hidden">
                                    {children}
                                </main>
                            </div>
                        </PageTransition>
                        <Footer />
                    </LenisScroll>
                </GeoProvider>
            </IntroProvider>
        </AudioProvider>
    );
}
