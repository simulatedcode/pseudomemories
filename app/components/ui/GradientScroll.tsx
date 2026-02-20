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

        SOLAR_KEYFRAMES.forEach((kf, idx) => {
            if (idx === 0) return;
            const pos = (idx - 1) * segDur;
            strips.forEach((strip, i) => {
                tl.to(strip!, { backgroundColor: kf.colors[i], duration: segDur, ease: "none" }, pos);
            });
        });

        return () => { ScrollTrigger.getAll().forEach((st) => st.kill()); };
    }, []);

    const activeIdx = Math.min(Math.round(progress * NUM_TRANSITIONS), NUM_TRANSITIONS - 1);

    return (
        // Tall scroll spacer — gives the ScrollTrigger something to measure
        <div
            ref={scrollRef}
            style={{ height: `${SECTION_VH * NUM_TRANSITIONS}vh` }}
            className="relative"
        >
            {/* ── Fixed fullscreen display panel ──────────────────────────── */}
            <div className="fixed inset-0 z-9999 overflow-hidden bg-black pointer-events-none">

                {/* Gradient strips */}
                <div
                    className="absolute inset-0 flex flex-col"
                    style={{ filter: "blur(70px)", transform: "scale(1.15)" }}
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

                {/* ── Centre HUD ─────────────────────────────────────────── */}
                <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none">

                    <p className="text-white/30 text-[10px] font-mono tracking-[0.4em] uppercase mb-5">
                        Solar Preview · Scroll to Simulate
                    </p>

                    {/* Clock */}
                    <div
                        className="text-white font-mono font-extralight tracking-tight"
                        style={{ fontSize: "clamp(4rem, 14vw, 10rem)", lineHeight: 1 }}
                    >
                        {fmtHour(hour)}
                    </div>

                    {/* Phase */}
                    <p className="mt-5 text-white/80 font-mono tracking-[0.35em] uppercase text-sm">
                        {SOLAR_KEYFRAMES[activeIdx]?.label ?? ""}
                    </p>

                    {/* Strip colour swatches */}
                    <div className="mt-6 flex items-center gap-2">
                        {colors.map((c, i) => (
                            <div
                                key={i}
                                title={c}
                                className="rounded-sm ring-1 ring-white/10"
                                style={{ width: 28, height: 28, backgroundColor: c, transition: "background-color 0.8s ease" }}
                            />
                        ))}
                    </div>

                    {/* Star tint badge */}
                    <div className="mt-4 flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full ring-1 ring-white/20"
                            style={{ backgroundColor: starColor, transition: "background-color 0.8s ease" }}
                        />
                        <span className="text-white/35 text-[10px] font-mono tracking-widest">
                            {starColor} · star tint
                        </span>
                    </div>
                </div>

                {/* ── Right rail ─────────────────────────────────────────── */}
                <nav className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-5 pointer-events-none select-none">
                    {SOLAR_KEYFRAMES.slice(0, -1).map((kf, i) => {
                        const isActive = i === activeIdx;
                        const isPast = progress > i / NUM_TRANSITIONS + 0.01;
                        return (
                            <div key={kf.hour} className="flex items-center gap-2.5 justify-end">
                                <span className={`text-[9px] font-mono uppercase tracking-widest transition-all duration-500 ${isActive ? "text-white" : isPast ? "text-white/35" : "text-white/15"
                                    }`}>
                                    {fmtHour(kf.hour)}
                                </span>
                                <div className={`rounded-full transition-all duration-500 ${isActive
                                    ? "w-2 h-2 bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.5)]"
                                    : isPast
                                        ? "w-1.5 h-1.5 bg-white/40"
                                        : "w-1 h-1 bg-white/15"
                                    }`} />
                            </div>
                        );
                    })}
                </nav>

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
