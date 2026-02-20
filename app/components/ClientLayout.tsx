"use client";

import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import PageTransition from "./ui/PageTransition";
import Intro from "./ui/Intro";
import LenisScroll from "./LenisScroll";
import { GeoProvider } from "../context/GeoContext";
import { AudioProvider } from "../context/AudioContext";
import { IntroProvider } from "../context/IntroContext";
import { TransitionProvider } from "../context/TransitionContext";
import { HUDTopRight } from "./HUDTopRight";
import { AudioAnalysisProvider } from "../context/AudioAnalysisContext";
import { usePathname } from "next/navigation";
import { HUDScanline } from "./ui/HUDScanline";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isSystemPage = pathname?.startsWith('/system');

    return (
        <TransitionProvider>
            <AudioProvider>
                <AudioAnalysisProvider>
                    <IntroProvider>
                        <GeoProvider>
                            <HUDScanline />
                            {!isSystemPage && <Intro />}
                            <LenisScroll>
                                {!isSystemPage && <HUDTopRight />}
                                {!isSystemPage && <Header />}
                                <PageTransition>
                                    <div className="relative min-h-screen w-full flex flex-col">
                                        <main className="relative overflow-x-hidden">
                                            {children}
                                        </main>
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
