"use client";

import React from "react";
import { motion } from "framer-motion";
import { Menu as MenuIcon, Home, BookOpen, History } from "lucide-react";
import Link from "next/link";
import { duration, easing } from "@/app/lib/motion-tokens";
import { ScrambleText } from "./ui/ScrambleText";
import { SineWaveform } from "./ui/SineWaveform";
import { useGeo } from "../context/GeoContextCore";
import { useAudio } from "../context/AudioContextCore";

interface NavBottomProps {
    hoveredItem: string | null;
    setHoveredItem: (item: string | null) => void;
    setIsMenuOpen: (isOpen: boolean) => void;
}

export function NavBottom({ hoveredItem, setHoveredItem, setIsMenuOpen }: NavBottomProps) {
    const { latitude, longitude, error } = useGeo();
    const { audioEnabled, setAudioEnabled, playing, togglePlay, playAudio } = useAudio();

    const locationString = error || `${latitude.toFixed(4)}°N ${longitude.toFixed(4)}°E`;

    return (
        <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: duration.medium,
                ease: easing.entrance,
                delay: 0.4
            }}
            className="fixed bottom-0 left-0 w-full z-50 flex items-center justify-between px-spacing-05 py-spacing-04"
        >
            {/* Left: Audio & Location */}
            <div className="flex-1 flex items-center gap-2">
                {/* Audio */}
                <div
                    className="flex items-center justify-center pointer-events-auto bg-background/60 backdrop-blur-lg border border-background/20 rounded-full w-10 h-10 opacity-80 hover:opacity-100 transition-all cursor-pointer hover:bg-background/60"
                    onClick={() => {
                        if (!audioEnabled) {
                            setAudioEnabled(true);
                            playAudio();
                        } else {
                            togglePlay();
                        }
                    }}
                    onMouseEnter={() => setHoveredItem("Audio")}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <SineWaveform isPlaying={playing} />
                </div>
                {/* Location */}
                <div
                    className="hidden md:flex bg-background/60 backdrop-blur-lg border border-white/10 rounded-full px-4 h-10 items-center pointer-events-auto font-doto text-micro uppercase tracking-[0.2em] opacity-80 hover:opacity-100 transition-all cursor-default hover:bg-background/80"
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
            </div>

            {/* Middle: Circle Dock Nav */}
            <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-4 bg-background/60 backdrop-blur-lg px-4 py-2 rounded-full border border-white/10">
                    {[
                        { icon: Home, href: "/", label: "Home" },
                        { icon: BookOpen, href: "/documentation", label: "Docs" },
                        { icon: History, href: "/changelog", label: "Logs" },
                    ].map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.href}
                            className="p-2 rounded-full hover:bg-vermelion/20 hover:text-vermelion transition-all duration-300 text-white/60 hover:scale-110"
                            title={item.label}
                        >
                            <item.icon size={18} />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Right: Status & Menu */}
            <div className="flex-1 flex items-center justify-end gap-6">
                <div className="hidden lg:flex bg-background/60 backdrop-blur-lg border border-white/10 rounded-full px-4 h-10 items-center gap-2 pointer-events-none">
                    <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-cyan"
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <span className="font-doto text-micro uppercase tracking-widest text-white">System Online</span>
                </div>

                <div className="pointer-events-auto bg-background/60 backdrop-blur-lg border border-white/10 rounded-full px-4 h-10 flex items-center hover:bg-background/80 transition-all">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        onMouseEnter={() => setHoveredItem("Menu")}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="font-doto text-micro uppercase tracking-[0.2em] opacity-80 hover:opacity-100 flex items-center gap-2"
                    >
                        <ScrambleText
                            text="System Access"
                            trigger={hoveredItem === "Menu"}
                            duration={0.6}
                        />
                        <MenuIcon size={16} />
                    </button>
                </div>
            </div>
        </motion.nav >
    );
}
