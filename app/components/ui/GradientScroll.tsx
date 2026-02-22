"use client";

/**
 * GradientScroll
 *
 * Developer preview: scroll through all 9 solar keyframes to inspect
 * gradient and star colours without waiting for real time to change.
 *
 * Uses position:fixed for the display panel + a passive scroll listener,
 * which guarantees true fullscreen regardless of ClientLayout / HUDFrame.
 * Stamps data-gradient-preview on <html> so global CSS can hide HUD chrome.
 *
 * Visit /gradientscroll to use this tool.
 */

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    SOLAR_KEYFRAMES,
    SOLAR_STAR_KEYFRAMES,
    getStarColorForHour,
    lerpColor,
} from "../../hooks/useSolarColor";
import Helas from "../hero/Helas";
import HeroGrid from "../hero/HeroGrid";

gsap.registerPlugin(ScrollTrigger);

// ─── Constants ────────────────────────────────────────────────────────────────

const NUM_TRANSITIONS = SOLAR_KEYFRAMES.length - 1; // 8
const SECTION_VH = 100; // vh of scroll per keyframe transition

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtHour(h: number): string {
    const hh = Math.floor(h % 24);
    const mm = Math.floor((h % 1) * 60);
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function progressToHour(p: number): number {
    const idx = Math.min(Math.floor(p * NUM_TRANSITIONS), NUM_TRANSITIONS - 1);
    const from = SOLAR_KEYFRAMES[idx];
    const to = SOLAR_KEYFRAMES[idx + 1];
    const t = Math.max(0, Math.min(1, (p * NUM_TRANSITIONS) - idx));
    return from.hour + (to.hour - from.hour) * t;
}

function getInterpColors(p: number): string[] {
    const idx = Math.min(Math.floor(p * NUM_TRANSITIONS), NUM_TRANSITIONS - 1);
    const from = SOLAR_KEYFRAMES[idx];
    const to = SOLAR_KEYFRAMES[idx + 1];
    const t = Math.max(0, Math.min(1, (p * NUM_TRANSITIONS) - idx));
    return from.colors.map((c, i) => lerpColor(c, to.colors[i], t));
}

const GRADIENT_SECTIONS = [
    { title: "Dawn Ignition", desc: "The first light breaks, casting deep indigos and emerging warm vermilions across the horizon as solar radiation begins to scatter." },
    { title: "Morning Ascent", desc: "Crisp cyan and peach hues dominate. The light temperature drops, cutting through the morning haze with soft luminous transitions." },
    { title: "Solar Zenith", desc: "Maximum brightness at midday. Gradients flatten into piercing white and pale aqua, throwing sharp, high-contrast shadows directly downwards." },
    { title: "Golden Hour", desc: "The atmosphere stretches the light into rich ambers and saturated gold tones. Shadows lengthen dramatically against the terrain." },
    { title: "Dusk Transition", desc: "The sun plunges below the horizon. A fading trail of deep violet and twilight blue cools the environment rapidly into the night." }
];

// ─── Component ────────────────────────────────────────────────────────────────

export function GradientScroll() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const s1 = useRef<HTMLDivElement>(null);
    const s2 = useRef<HTMLDivElement>(null);
    const s3 = useRef<HTMLDivElement>(null);
    const s4 = useRef<HTMLDivElement>(null);
    const s5 = useRef<HTMLDivElement>(null);

    const [progress, setProgress] = useState(0);
    const [hour, setHour] = useState(0);
    const [starColor, setStarColor] = useState(SOLAR_STAR_KEYFRAMES[0].color);
    const [colors, setColors] = useState<string[]>(
        SOLAR_KEYFRAMES[0].colors as unknown as string[]
    );

    // ── Stamp html element so global CSS hides HUD chrome ────────────────────
    useEffect(() => {
        document.documentElement.setAttribute("data-gradient-preview", "true");
        // Ensure body can scroll normally
        document.body.style.overflow = "unset";
        return () => {
            document.documentElement.removeAttribute("data-gradient-preview");
        };
    }, []);

    // ── GSAP scrub ───────────────────────────────────────────────────────────
    useGSAP(() => {
        const strips = [s1.current, s2.current, s3.current, s4.current, s5.current];
        if (strips.some((s) => !s) || !scrollRef.current) return;

        strips.forEach((strip, i) => {
            gsap.set(strip!, { backgroundColor: SOLAR_KEYFRAMES[0].colors[i] });
        });

        const segDur = 1 / NUM_TRANSITIONS;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: scrollRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                onUpdate(self) {
                    const p = self.progress;
                    const h = progressToHour(p);
                    setProgress(p);
                    setHour(h);
                    setStarColor(getStarColorForHour(h));
                    setColors(getInterpColors(p));
                },
            },
        });

        // ── Animate Gradient Strips ──
        SOLAR_KEYFRAMES.forEach((kf, idx) => {
            if (idx === 0) return;
            const pos = (idx - 1) * segDur;
            strips.forEach((strip, i) => {
                tl.to(strip!, { backgroundColor: kf.colors[i], duration: segDur, ease: "none" }, pos);
            });
        });

        // ── Content Sections Animations ──
        const sections = gsap.utils.toArray('.content-section');
        sections.forEach((sec: any) => {
            const inner = sec.querySelector('.section-inner');
            if (!inner) return;

            gsap.fromTo(inner, { opacity: 0, y: window.innerHeight * 0.2 }, {
                opacity: 1, y: 0, ease: "power2.out",
                scrollTrigger: {
                    trigger: sec,
                    start: "top center",
                    end: "center center",
                    scrub: 1
                }
            });

            gsap.fromTo(inner, { opacity: 1, y: 0 }, {
                opacity: 0, y: -window.innerHeight * 0.2, ease: "power2.in",
                scrollTrigger: {
                    trigger: sec,
                    start: "center center",
                    end: "bottom center",
                    scrub: 1
                }
            });
        });

        return () => { ScrollTrigger.getAll().forEach((st) => st.kill()); };
    }, []);

    const activeIdx = Math.min(Math.round(progress * NUM_TRANSITIONS), NUM_TRANSITIONS - 1);

    return (
        <div ref={scrollRef} className="relative w-full z-10 text-white">

            {/* ── 5 Scrolling Sections ── */}
            <div className="relative z-50">
                {GRADIENT_SECTIONS.map((sec, i) => (
                    <section
                        key={i}
                        className="content-section relative w-full h-[150vh] pointer-events-none"
                    >
                        <div className="fixed inset-0 flex items-center justify-center pointer-events-none px-6 z-50">
                            <div className="section-inner max-w-3xl text-center will-change-transform opacity-0">
                                <h2 className="text-4xl md:text-7xl font-mono uppercase tracking-[0.2em] text-white/90 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] mb-8">
                                    {sec.title}
                                </h2>
                                <p className="text-xl md:text-3xl text-white/80 font-light leading-relaxed tracking-wide drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                                    {sec.desc}
                                </p>
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            {/* ── Fixed fullscreen display panel ──────────────────────────── */}
            <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">

                {/* Gradient strips (Background layer) */}
                <div
                    className="absolute inset-0 flex flex-col"
                    style={{ filter: "blur(80px)", transform: "scale(1.15)" }}
                >
                    <div ref={s1} className="flex-1" />
                    <div ref={s2} className="flex-1" />
                    <div ref={s3} className="flex-1" />
                    <div ref={s4} className="flex-1" />
                    <div ref={s5} className="flex-1" />
                </div>

                {/* Noise */}
                <div
                    className="absolute inset-0 mix-blend-overlay"
                    style={{
                        backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')`,
                        backgroundSize: "256px 256px",
                        opacity: 0.2,
                    }}
                />

                {/* Scanlines */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)",
                        backgroundSize: "100% 4px",
                    }}
                />

                {/* Helas character — lighting driven by scroll hour */}
                <Helas
                    className="absolute inset-0 z-modal pointer-events-none"
                    scrollHour={hour}
                    x="center" y="center"
                    tabletX="center" tabletY="center"
                    mobileX="center" mobileY="center"
                    anchor="center"
                />
                <HeroGrid />
                {/* ── Centre HUD ─────────────────────────────────────────── */}
                <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none overflow-hidden">

                    <p className="absolute top-[10%] text-white/30 text-[10px] font-mono tracking-[0.4em] uppercase">
                        Solar Preview · Scroll to Simulate
                    </p>

                </div>

                {/* ── Bottom 24h track ───────────────────────────────────── */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64">
                    <div className="h-px w-full bg-white/10 relative">
                        <div
                            className="absolute top-0 left-0 h-full bg-white/50"
                            style={{ width: `${progress * 100}%`, transition: "none" }}
                        />
                        {SOLAR_KEYFRAMES.map((kf, i) => (
                            <div
                                key={kf.hour}
                                className="absolute top-1/2 -translate-y-1/2 w-px h-2 bg-white/25"
                                style={{ left: `${(i / NUM_TRANSITIONS) * 100}%` }}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-2">
                        <span className="text-[8px] font-mono text-white/25">00:00</span>
                        <span className="text-[8px] font-mono text-white/25">24:00</span>
                    </div>
                </div>

                {/* Scroll hint */}
                {progress < 0.015 && (
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/25 text-[9px] font-mono tracking-[0.4em] uppercase animate-pulse pointer-events-none">
                        ↓ scroll
                    </div>
                )}
            </div>
        </div>
    );
}

export default GradientScroll;
