"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ScrambleText } from "./ui/ScrambleText";
import { useGeo } from "../context/GeoContextCore";
import { useIntro } from "../context/IntroContextCore";
import { useAudio } from "../context/AudioContextCore";
import Link from "next/link";

import { SystemMetrics } from "./SystemMetrics";
import { SineWaveform } from "./ui/SineWaveform";

export function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const { latitude, longitude, error } = useGeo();
    const { isComplete } = useIntro();
    const [refId, setRefId] = useState("LOADING...");
    const [currentTime, setCurrentTime] = useState("");
    const { audioEnabled, playing, togglePlay } = useAudio();

    useEffect(() => {
        setRefId(Math.random().toString(36).substring(7).toUpperCase());

        const updateTime = () => {
            const now = new Date();
            const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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

    const locationString =
        error || `${latitude.toFixed(4)}°N ${longitude.toFixed(4)}°E`;

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={isComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
            className="fixed top-0 left-0 w-full z-100 flex items-center justify-between px-spacing-05 md:px-spacing-08 py-spacing-04 pointer-events-none border-b border-offwhite-100/10 bg-background/80 backdrop-blur-lg"
        >
            {/* Logo */}
            <div
                className="pointer-events-auto"
                onMouseEnter={() => setHoveredItem("Logo")}
                onMouseLeave={() => setHoveredItem(null)}
            >
                <Link
                    href="/"
                    className="font-electrolize text-body uppercase tracking-[0.2em] opacity-80 hover:opacity-100 transition-opacity"
                >
                    <ScrambleText
                        text="pseudo memories"
                        delay={1.2}
                        duration={1.2}
                        trigger={hoveredItem === "Logo"}
                    />
                </Link>
            </div>

            {/* Ref ID */}
            <div
                className="hidden md:block pointer-events-auto font-doto text-body uppercase tracking-[0.2em] opacity-80 hover:opacity-100 transition-opacity cursor-default"
                onMouseEnter={() => setHoveredItem("RefId")}
                onMouseLeave={() => setHoveredItem(null)}
            >
                <ScrambleText
                    text={refId}
                    delay={1.8}
                    duration={1.5}
                    trigger={hoveredItem === "RefId"}
                />
            </div>

            {/* Location */}
            <div
                className="hidden md:block pointer-events-auto font-doto text-body mix-blend-difference uppercase tracking-[0.2em] opacity-80 hover:opacity-100 transition-opacity cursor-default"
                onMouseEnter={() => setHoveredItem("Location")}
                onMouseLeave={() => setHoveredItem(null)}
            >
                <ScrambleText
                    text={locationString}
                    delay={1.8}
                    duration={1.5}
                    trigger={hoveredItem === "Location"}
                />
            </div>

            {/* Audio */}
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

            {/* Time */}
            <div className="hidden md:block pointer-events-auto font-doto text-body uppercase tracking-[0.2em] text-offwhite-100/80 hover:text-offwhite-100 transition-colors cursor-default">
                <ScrambleText text={currentTime} delay={1.8} duration={1.5} />
            </div>

            {/* Navigation */}
            <div className="hidden xl:block pointer-events-auto">
                <SystemMetrics className="opacity-80 hover:opacity-100 transition-opacity" />
            </div>

            {/* Menu Button */}
            <div className="pointer-events-auto">
                <button
                    onClick={onMenuToggle}
                    onMouseEnter={() => setHoveredItem("Menu")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="font-doto text-body uppercase tracking-[0.2em] opacity-80 hover:opacity-100 transition-opacity"
                >
                    <ScrambleText
                        text="Menu"
                        trigger={hoveredItem === "Menu"}
                        duration={0.6}
                    />
                </button>
            </div>
        </motion.header>
    );
}
