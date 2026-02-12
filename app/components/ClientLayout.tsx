"use client";

import React, { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Menu } from "./Menu";
import PageShell from "./ui/PageShell";
import PageTransition from "./ui/PageTransition";
import Intro from "./ui/Intro";
import { AudioTransmitMobile } from "./ui/AudioTransmitMobile";
import LenisScroll from "./LenisScroll";
import { GeoProvider } from "../context/GeoContext";
import { AudioProvider } from "../context/AudioContext";
import { IntroProvider } from "../context/IntroContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
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
    );
}
