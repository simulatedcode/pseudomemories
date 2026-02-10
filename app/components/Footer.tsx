"use client";

import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, easeOut } from "framer-motion";
import { ScrambleText } from "./ScrambleText";
import Link from "next/link";
import { useAudio } from "../context/AudioContextCore";
import { SineWaveform } from "./SineWaveform";

type TechRowProps = {
    label: string;
    value: string;
    delay?: number;
};

function TechRow({ label, value, delay = 0 }: TechRowProps) {
    const ref = useRef<HTMLTableRowElement | null>(null);
    const isInView = useInView(ref, { once: false, amount: 0.4 });
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.tr
            ref={ref}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.3, ease: "easeOut" }}
            className="border-b border-white/10 hover:bg-white/5 transition"
        >
            <td className="px-3 py-2 font-electrolize text-[10px] uppercase tracking-widest opacity-60">
                {label}
            </td>
            <td className="px-3 py-2 font-doto text-micro uppercase tracking-wider text-offwhite-100/90 ">
                <ScrambleText
                    text={value}
                    delay={delay}
                    duration={0.8}
                    trigger={isInView || isHovered}
                />
            </td>
        </motion.tr>
    );
}

export function Footer() {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = (open: boolean) => {
        setIsOpen(open);
    };

    const [isGithubHovered, setIsGithubHovered] = useState(false);
    const [isCopyrightHovered, setIsCopyrightHovered] = useState(false);
    const { playing, togglePlay, audioEnabled } = useAudio();

    return (
        <footer className="fixed bottom-spacing-04 z-100 flex flex-col items-center w-full">
            <div className="pointer-events-auto flex flex-col items-center w-full max-w-full px-spacing-08 ">
                <AnimatePresence mode="wait">
                    {!isOpen ? (
                        <motion.button
                            key="footer-closed"
                            onClick={() => handleToggle(true)}
                            onMouseEnter={() => setIsCopyrightHovered(true)}
                            onMouseLeave={() => setIsCopyrightHovered(false)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.8, delay: 2, ease: "easeOut" }}
                            className="cursor-pointer group w-full"
                        >
                            <div className="w-full grid grid-cols-1 md:grid-cols-3 items-center gap-spacing-02">
                                {/* Copyright - Left */}
                                <div className="flex justify-center md:justify-start order-2 md:order-1">
                                    <span className="font-doto text-micro text-black mix-blend-difference tracking-widest uppercase whitespace-nowrap">
                                        © Project 2020 - {new Date().getFullYear()}
                                    </span>
                                </div>

                                {/* Audio Control - Center */}
                                <div className="flex justify-center order-1 md:order-2">
                                    {audioEnabled && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                togglePlay();
                                            }}
                                            className="flex items-center justify-center px-3 py-1.5 rounded-full bg-black/40 border border-white/40 hover:bg-black/60 transition-all duration-300 pointer-events-auto"
                                            aria-label={playing ? "Pause Audio" : "Play Audio"}
                                        >
                                            <SineWaveform isPlaying={playing} />
                                        </button>
                                    )}
                                </div>

                                {/* Status - Right */}
                                <div className="flex justify-center md:justify-end order-3">
                                    <span className="flex items-center gap-spacing-03 font-doto text-micro uppercase text-black mix-blend-difference tracking-widest transition-colors group-hover:text-black/60">
                                        <motion.div
                                            className="w-2 h-2 rounded-full bg-vermelion"
                                            animate={{
                                                opacity: [0.3, 1, 0.3],
                                                scale: [0.8, 1, 0.8],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                        />
                                        <ScrambleText
                                            text={`Node Status: Stable`}
                                            delay={0}
                                            duration={0.6}
                                            trigger={isCopyrightHovered}
                                        />
                                    </span>
                                </div>
                            </div>
                        </motion.button>
                    ) : (
                        <motion.div
                            key="footer-open"
                            initial={{ opacity: 0, scale: 0.98, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 40 }}
                            transition={{
                                type: "spring",
                                stiffness: 60,
                                damping: 15
                            }}
                            className="fixed bottom-spacing-10 left-1/2 -translate-x-1/2 sm:left-auto sm:right-spacing-10 sm:translate-x-0 w-[95vw] sm:w-[500px] max-h-[85vh] rounded-2xl border border-white/10 bg-black/60 backdrop-blur-3xl p-spacing-07 overflow-y-auto origin-bottom z-100"
                        >


                            <div className="flex flex-col gap-spacing-07 mt-spacing-04">
                                {/* Header */}
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-spacing-05 border-b border-white/5 pb-spacing-06">
                                    <div className="flex flex-col gap-spacing-02">
                                        <h3 className="font-electrolize text-caption uppercase tracking-[0.2em] text-offwhite-100 opacity-90">
                                            System Log
                                        </h3>
                                        <p className="font-doto text-[9px] uppercase tracking-[0.4em] text-offwhite-100/80">
                                            v.{new Date().getFullYear()}.02.10 // Active
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-spacing-04">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggle(false);
                                            }}
                                            className="p-spacing-03 hover:bg-white/5 rounded-full transition-colors group"
                                            aria-label="Close"
                                        >
                                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="opacity-40 group-hover:opacity-100 transition-opacity">
                                                <path d="M1 1L11 11M1 11L11 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Tech Table */}
                                <div className="overflow-hidden border border-white/5 rounded-lg bg-white/0.02">
                                    <table className="w-full text-left">
                                        <thead className="bg-white/5 border-b border-white/5">
                                            <tr>
                                                <th className="px-spacing-05 py-spacing-03 font-electrolize text-[10px] uppercase tracking-[0.2em] text-offwhite-100/40">
                                                    Module
                                                </th>
                                                <th className="px-spacing-05 py-spacing-03 font-electrolize text-[10px] uppercase tracking-[0.2em] text-offwhite-100/40">
                                                    Registry
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <TechRow label="Framework" value="Next.js 16" delay={0.1} />
                                            <TechRow label="Graphics" value="Three.js / GLSL" delay={0.2} />
                                            <TechRow label="Motion" value="Framer Spring" delay={0.3} />
                                            <TechRow label="Tokens" value="Tailwind v4" delay={0.4} />
                                            <TechRow label="Service" value="GeoConnect" delay={0.5} />
                                        </tbody>
                                    </table>
                                </div>

                                {/* Bottom */}
                                <div className="flex flex-col pt-spacing-05 gap-spacing-05">
                                    <div className="flex flex-wrap items-center justify-between">
                                        <span className="font-doto text-micro uppercase tracking-[0.2em] text-offwhite-100/80">
                                            REF: {Math.random().toString(36).substring(7).toUpperCase()}
                                        </span>

                                        <Link
                                            href="https://github.com/simulatedcode"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-doto text-micro uppercase tracking-[0.2em] text-offwhite-100/80 hover:text-offwhite-100 transition-colors"
                                            onMouseEnter={() => setIsGithubHovered(true)}
                                            onMouseLeave={() => setIsGithubHovered(false)}
                                        >
                                            <ScrambleText
                                                text="LINK_GITHUB"
                                                delay={0}
                                                duration={0.6}
                                                trigger={isGithubHovered}
                                            />
                                        </Link>
                                    </div>
                                    <div className="font-doto text-[10px] uppercase tracking-[0.5em] text-offwhite-100/80 text-center">
                                        // End of transmission //
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </footer>
    );
}
