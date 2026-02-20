/**
 * useSolarColor
 *
 * Shared solar-time colour utilities consumed by GradientBackground and
 * DustStar. Exports:
 *   - SOLAR_KEYFRAMES          — the canonical 9-keyframe table (0–24 h)
 *   - SOLAR_STAR_KEYFRAMES     — per-stage star tint tuned for each sky phase
 *   - hexToRgb / rgbToHex / lerpColor — colour math helpers
 *   - getCurrentDecimalHour    — seconds-precision local hour
 *   - getStarColorForHour      — interpolated star hex for any hour
 *   - useSolarStarColor        — React hook: live star colour, updates every 10 s
 */

export type ColorTuple = [string, string, string, string, string];

export interface SolarKeyframe {
    hour: number;
    label: string;
    colors: ColorTuple;
}

// ─── Background gradient keyframes ───────────────────────────────────────────

export const SOLAR_KEYFRAMES: SolarKeyframe[] = [
    // s1=zenith(top) … s5=horizon(bottom)
    // Night: uniform deep indigo-navy
    { hour: 0.0, label: "Night", colors: ["#0C0B1E", "#0F0E26", "#111030", "#141338", "#18163E"] },
    // Dawn: dark navy, warm amber glow just appearing at horizon
    { hour: 4.5, label: "Dawn", colors: ["#0A0920", "#0E0D30", "#1C1A44", "#6A5040", "#A87848"] },
    // Sunrise / Morning: deep blue-black zenith → brilliant vermilion-orange at horizon
    { hour: 6.5, label: "Morning", colors: ["#06051C", "#08082A", "#14103A", "#C83C10", "#ED6828"] },
    // Mid-morning: sky blue opens, warm hazy cream at horizon
    { hour: 10.0, label: "Mid-morning", colors: ["#1438A0", "#2860C0", "#4888D0", "#8AAEC4", "#D0C0A0"] },
    // Daylight: cobalt blue zenith → warm white-cream at horizon
    { hour: 13.0, label: "Daylight", colors: ["#1848A8", "#2C70CC", "#5898DC", "#A8C8E4", "#DED4C0"] },
    // Golden Hour: deep indigo-purple zenith → warm amber-gold at horizon
    { hour: 17.5, label: "Golden Hour", colors: ["#121040", "#201868", "#4A3880", "#C08860", "#E8B840"] },
    // Dusk / Sunset: near-black top → saturated red-orange at horizon
    { hour: 19.0, label: "Dusk", colors: ["#0C0508", "#180A0E", "#3A1018", "#CC2808", "#F04818"] },
    // Twilight: dark blue-indigo, fading colour pools at bottom
    { hour: 21.0, label: "Twilight", colors: ["#060410", "#0A0820", "#14102C", "#20183E", "#2C2050"] },
    // Night (wrap): mirror of 00:00 for seamless loop
    { hour: 24.0, label: "Night", colors: ["#0C0B1E", "#0F0E26", "#111030", "#141338", "#18163E"] },
];

// ─── Star colour keyframes ────────────────────────────────────────────────────
// A single interpolated tint applied to all star layers.
// Tuned so stars feel part of the sky:
//   Night/Twilight : icy silver-blue  (stars are prominent, cooler)
//   Dawn           : soft violet-rose (sky lifting, warmer hue bleeds in)
//   Morning        : warm honey-gold  (sunrise glow on the star field)
//   Midday         : pale white-blue  (stars fade; hint of open sky)
//   Golden Hour    : deep amber       (last light saturates everything)
//   Dusk           : ember coral      (fire in the sky)

interface StarKeyframe {
    hour: number;
    color: string; // single hex
}

export const SOLAR_STAR_KEYFRAMES: StarKeyframe[] = [
    { hour: 0.0, color: "#9EB0D8" }, // Night        — icy silver-blue
    { hour: 4.5, color: "#BFA880" }, // Dawn         — warm amber glow
    { hour: 6.5, color: "#E88840" }, // Morning      — sunrise orange
    { hour: 10.0, color: "#C8D8F0" }, // Mid-morning  — pale sky-blue
    { hour: 13.0, color: "#E8F0FF" }, // Daylight     — near-white sky
    { hour: 17.5, color: "#E8C060" }, // Golden Hour  — deep amber-gold
    { hour: 19.0, color: "#F07848" }, // Dusk         — ember-orange
    { hour: 21.0, color: "#8090C0" }, // Twilight     — cool steel-violet
    { hour: 24.0, color: "#9EB0D8" }, // Night (wrap) — matches 0:00
];

// ─── Colour math ─────────────────────────────────────────────────────────────

export function hexToRgb(hex: string): [number, number, number] {
    return [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
    ];
}

export function rgbToHex(r: number, g: number, b: number): string {
    return (
        "#" +
        [r, g, b]
            .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0"))
            .join("")
    );
}

export function lerpColor(a: string, b: string, t: number): string {
    const [ar, ag, ab] = hexToRgb(a);
    const [br, bg, bb] = hexToRgb(b);
    return rgbToHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}

// ─── Time util ────────────────────────────────────────────────────────────────

export function getCurrentDecimalHour(): number {
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
}

// ─── Interpolation helpers ────────────────────────────────────────────────────

export function getColorsForHour(hour: number): ColorTuple {
    let from = SOLAR_KEYFRAMES[0];
    let to = SOLAR_KEYFRAMES[1];

    for (let i = 0; i < SOLAR_KEYFRAMES.length - 1; i++) {
        if (hour >= SOLAR_KEYFRAMES[i].hour && hour < SOLAR_KEYFRAMES[i + 1].hour) {
            from = SOLAR_KEYFRAMES[i];
            to = SOLAR_KEYFRAMES[i + 1];
            break;
        }
    }

    const span = to.hour - from.hour;
    const t = span > 0 ? (hour - from.hour) / span : 0;
    return from.colors.map((c, i) => lerpColor(c, to.colors[i], t)) as ColorTuple;
}

export function getStarColorForHour(hour: number): string {
    let from = SOLAR_STAR_KEYFRAMES[0];
    let to = SOLAR_STAR_KEYFRAMES[1];

    for (let i = 0; i < SOLAR_STAR_KEYFRAMES.length - 1; i++) {
        if (hour >= SOLAR_STAR_KEYFRAMES[i].hour && hour < SOLAR_STAR_KEYFRAMES[i + 1].hour) {
            from = SOLAR_STAR_KEYFRAMES[i];
            to = SOLAR_STAR_KEYFRAMES[i + 1];
            break;
        }
    }

    const span = to.hour - from.hour;
    const t = span > 0 ? (hour - from.hour) / span : 0;
    return lerpColor(from.color, to.color, t);
}

// ─── React hook ───────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";

/**
 * Returns the interpolated star colour for the current local time.
 * Re-computes every `intervalMs` milliseconds (default 10 s).
 */
export function useSolarStarColor(intervalMs = 10_000): string {
    const [color, setColor] = useState<string>(() =>
        getStarColorForHour(getCurrentDecimalHour())
    );

    useEffect(() => {
        const tick = () => setColor(getStarColorForHour(getCurrentDecimalHour()));
        const id = setInterval(tick, intervalMs);
        return () => clearInterval(id);
    }, [intervalMs]);

    return color;
}
