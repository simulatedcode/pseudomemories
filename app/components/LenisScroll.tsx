"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useIntro } from "../context/IntroContextCore";

export default function LenisScroll({ children }: { children: React.ReactNode }) {
    const { isComplete } = useIntro();
    const pathname = usePathname();
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        lenisRef.current = lenis;

        let rafId: number;

        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            if (rafId) cancelAnimationFrame(rafId);
            lenisRef.current = null;
        };
    }, []);

    // Reset scroll + resize on route change
    useEffect(() => {
        if (!lenisRef.current) return;

        lenisRef.current.scrollTo(0, { immediate: true });

        const timer = setTimeout(() => {
            lenisRef.current?.resize();
            lenisRef.current?.raf(0);
        }, 100);

        return () => clearTimeout(timer);
    }, [pathname]);

    // Stop scroll during intro
    useEffect(() => {
        if (!lenisRef.current) return;

        if (isComplete) {
            lenisRef.current.start();
        } else {
            lenisRef.current.stop();
        }
    }, [isComplete]);

    return <>{children}</>;
}
