"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
    getCurrentDecimalHour,
    getColorsForHour,
} from "../../hooks/useSolarColor";

/**
 * GradientBackground — Solar Time
 *
 * 5 blurred colour strips driven by the local clock in real time,
 * mimicking the macOS dynamic wallpaper behaviour.
 * Colour logic lives in useSolarColor.ts (shared with DustStar).
 *
 * Keyframes: Night → Dawn → Morning → Mid-morning → Daylight
 *            → Golden Hour → Dusk → Twilight → Night (wrap)
 *
 * Updates every 10 s with a 10 s ease-none tween — imperceptibly smooth.
 */

export default function GradientBackground() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const s1 = useRef<HTMLDivElement>(null);
    const s2 = useRef<HTMLDivElement>(null);
    const s3 = useRef<HTMLDivElement>(null);
    const s4 = useRef<HTMLDivElement>(null);
    const s5 = useRef<HTMLDivElement>(null);
    const noiseRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const strips = [s1.current, s2.current, s3.current, s4.current, s5.current];
        if (strips.some((s) => !s)) return;

        // ── Initial fade-in ──────────────────────────────────────────────────
        if (wrapperRef.current) {
            gsap.fromTo(wrapperRef.current, { opacity: 0 }, { opacity: 1, duration: 2.5, ease: "power2.out" });
        }

        // ── Apply colors for the current time ────────────────────────────────
        const applyColors = (animate: boolean) => {
            const colors = getColorsForHour(getCurrentDecimalHour());
            strips.forEach((strip, i) => {
                if (animate) {
                    gsap.to(strip!, { backgroundColor: colors[i], duration: 10, ease: "none" });
                } else {
                    gsap.set(strip!, { backgroundColor: colors[i] });
                }
            });
        };

        applyColors(false); // instant on first paint

        // ── Tick every 10 s ──────────────────────────────────────────────────
        const interval = setInterval(() => applyColors(true), 10_000);

        // ── Subtle noise texture drift ────────────────────────────────────────
        if (noiseRef.current) {
            gsap.to(noiseRef.current, {
                y: -40,
                x: 15,
                duration: 60,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
            });
        }

        return () => clearInterval(interval);
    }, []);

    return (
        <div ref={wrapperRef} className="gradient-background" aria-hidden="true">
            {/* Blurred mesh gradient strips — top to bottom */}
            <div className="gradient-background__strips">
                <div ref={s1} className="gradient-background__strip gradient-background__strip--1" />
                <div ref={s2} className="gradient-background__strip gradient-background__strip--2" />
                <div ref={s3} className="gradient-background__strip gradient-background__strip--3" />
                <div ref={s4} className="gradient-background__strip gradient-background__strip--4" />
                <div ref={s5} className="gradient-background__strip gradient-background__strip--5" />
            </div>

            {/* Grain texture */}
            <div ref={noiseRef} className="gradient-background__noise" />

            {/* Edge vignette */}
            <div className="gradient-background__vignette" />
        </div>
    );
}
