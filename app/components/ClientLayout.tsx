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
import { TransitionProvider } from "../context/TransitionContext";
import { HUDTopRight } from "./HUDTopRight";
import { AudioAnalysisProvider } from "../context/AudioAnalysisContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <TransitionProvider>
            <AudioProvider>
                <AudioAnalysisProvider>
                    <IntroProvider>
                        <GeoProvider>
                            <Intro />
                            <AudioTransmitMobile />
                            <HUDTopRight />
                            <LenisScroll>
                                <Header />
                                <PageTransition>
                                    <div className="relative min-h-screen w-full flex flex-col">
                                        <main className="relative overflow-x-hidden">
                                            {children}
                                        </main>
                                        <Footer />
                                    </div>
                                </PageTransition>
                            </LenisScroll>
                        </GeoProvider>
                    </IntroProvider>
                </AudioAnalysisProvider>
            </AudioProvider>
        </TransitionProvider>
    );
}
