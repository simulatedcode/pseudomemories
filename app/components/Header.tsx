"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ScrambleText } from "./ScrambleText";
import { useGeo } from "../context/GeoContextCore";
import { useIntro } from "../context/IntroContextCore";
import { useAudio } from "../context/AudioContextCore";
import Link from "next/link";

import { Navigation } from "./Navigation";
import { SineWaveform } from "./SineWaveform";

export function Header() {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const { latitude, longitude, error } = useGeo();
    const { isComplete } = useIntro();
    const [refId, setRefId] = useState("LOADING...");
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        setRefId(Math.random().toString(36).substring(7).toUpperCase());

        const updateTime = () => {
            const now = new Date();

            const userTimeZone =
                Intl.DateTimeFormat().resolvedOptions().timeZone;

            const formatter = new Intl.DateTimeFormat("en-US", {
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: userTimeZone,
                timeZoneName: "short",
            });

            setCurrentTime(formatter.format(now));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const locationString = error || `${latitude.toFixed(4)}°N ${longitude.toFixed(4)}°E`;
    const { audioEnabled, playing, togglePlay } = useAudio();

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={isComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
            className="fixed top-0 left-0 w-full z-100 flex items-center justify-between px-spacing-05 md:px-spacing-08 py-spacing-04 text-offwhite-100 pointer-events-none border-b border-offwhite-100/5  bg-background/80 backdrop-blur-md"
        >
            {/* 1. Logo */}
            <div
                className="pointer-events-auto"
                onMouseEnter={() => setHoveredItem("Logo")}
                onMouseLeave={() => setHoveredItem(null)}
            >
                <Link href="/" className="font-electrolize text-body uppercase tracking-[0.2em] opacity-80 hover:opacity-100 transition-opacity">
                    <ScrambleText text="pseudo memories" delay={1.2} duration={1.2} trigger={hoveredItem === "Logo"} />
                </Link>
            </div>

            {/* 2. System Reference */}
            <div
                className="hidden md:block pointer-events-auto font-doto text-body uppercase tracking-[0.2em] opacity-80 hover:opacity-100 transition-opacity cursor-default"
                onMouseEnter={() => setHoveredItem("RefId")}
                onMouseLeave={() => setHoveredItem(null)}
            >
                <div className="flex flex-col items-center">
                    <ScrambleText text={refId} delay={1.8} duration={1.5} trigger={hoveredItem === "RefId"} />
                </div>
            </div>

            {/* 3. Geo Location */}
            <div
                className="hidden md:block pointer-events-auto font-doto text-body uppercase tracking-[0.2em] opacity-80 hover:opacity-100 transition-opacity cursor-default"
                onMouseEnter={() => setHoveredItem("Location")}
                onMouseLeave={() => setHoveredItem(null)}
            >
                <ScrambleText text={locationString} delay={1.8} duration={1.5} trigger={hoveredItem === "Location"} />
            </div>

            {/* 4. Audio Transmit */}
            {audioEnabled && (
                <div
                    className="hidden lg:flex pointer-events-auto items-center gap-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={togglePlay}
                    onMouseEnter={() => setHoveredItem("Audio")}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <span className="font-doto text-body uppercase tracking-widest">
                        <ScrambleText
                            text={playing ? "Analyzing" : "Terminate"}
                            trigger={hoveredItem === "Audio"}
                            duration={0.6}
                        />
                    </span>
                    <div className="w-8">
                        <SineWaveform isPlaying={playing} />
                    </div>
                </div>
            )}

            {/* world time */}
            <div className="hidden md:block pointer-events-auto font-doto text-body uppercase tracking-[0.2em] text-offwhite-100/80 hover:text-offwhite-100 transition-colors cursor-default">
                <div className="flex items-center gap-2">
                    <ScrambleText text={currentTime} delay={1.8} duration={1.5} />
                </div>
            </div>

            {/* 5. System Metrics */}
            <div className="hidden xl:block pointer-events-auto">
                <Navigation className="opacity-80 hover:opacity-100 transition-opacity" />
            </div>

            {/* 6. Menu */}
            <div className="pointer-events-auto">
                <button
                    onClick={() => {
                        if (typeof document !== 'undefined' && document.body) {
                            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                        }
                    }}
                    onMouseEnter={() => setHoveredItem("Menu")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="font-doto text-body uppercase tracking-[0.2em] opacity-80 hover:opacity-100 transition-opacity"
                >
                    <ScrambleText text="Menu" trigger={hoveredItem === "Menu"} duration={0.6} />
                </button>
            </div>
        </motion.header>
    );
}
