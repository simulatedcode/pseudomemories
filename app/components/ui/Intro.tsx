"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGeo } from "../../context/GeoContextCore";
import { useAudio } from "../../context/AudioContextCore";
import { useIntro } from "../../context/IntroContextCore";
import { usePathname } from "next/navigation";
import { ScrambleText } from "./ScrambleText";

export default function Intro() {
    const pathname = usePathname();
    const [progress, setProgress] = useState(0);
    const [showChoice, setShowChoice] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const { latitude, longitude, error } = useGeo();
    const { setAudioEnabled, playAudio } = useAudio();
    const { setComplete } = useIntro();

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                const next = prev + Math.floor(Math.random() * 10) + 1;
                if (next >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setShowChoice(true), 800);
                    return 100;
                }
                return next;
            });
        }, 120);

        return () => clearInterval(interval);
    }, []);

    const handleChoice = (withAudio: boolean) => {
        setAudioEnabled(withAudio);
        setComplete(true);
        setTimeout(() => setIsVisible(false), 300);
    };

    const locationString = error || `${latitude.toFixed(4)}°N ${longitude.toFixed(4)}°E`;

    // Only render intro on the homepage
    if (pathname !== "/") return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        clipPath: "inset(0 0 100% 0)",
                        transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
                    }}
                    style={{ willChange: "clip-path" }}
                    className="fixed h-dvh w-screen top-0 left-0 z-999 bg-vermelion-500/10 flex flex-col items-center justify-center text-offwhite-100 selection:bg-white/10"
                >
                    <div className="flex flex-col items-center gap-spacing-09 max-w-md w-full px-spacing-08 relative z-10">
                        {/* Upper Details */}
                        <div className="w-full flex justify-between font-doto text-[10px] tracking-[0.3em] opacity-40 uppercase">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col gap-spacing-01"
                            >
                                <span>Status: {showChoice ? "Online" : "Booting"}</span>
                                <span>Signal: {error ? "Err" : "Sync"}</span>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-right flex flex-col gap-spacing-01"
                            >
                                <span>Ref: pseudo_mem</span>
                                <span>v.2018.02.10</span>
                            </motion.div>
                        </div>

                        {/* Large Counter */}
                        <div className="relative pt-spacing-08">
                            <motion.h1
                                className="font-electrolize text-[140px] sm:text-[200px] leading-none tracking-tighter text-vermelion"
                                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            >
                                {progress.toString().padStart(2, "0")}
                                <span className="text-[20px] sm:text-[32px] absolute -top-4 -right-12 opacity-30 font-doto">%</span>
                            </motion.h1>
                        </div>

                        {/* Lower Details */}
                        <div className="w-full flex flex-col items-center gap-spacing-07 pt-spacing-10 border-t border-white/10">
                            <div className="flex flex-col items-center gap-spacing-02">
                                <span className="font-electrolize text-[10px] uppercase tracking-[0.5em] opacity-30">Spatial Analysis</span>
                                <span className="font-doto text-micro md:text-caption tracking-[0.4em] opacity-80">
                                    <ScrambleText text={locationString} delay={0.5} duration={1.5} />
                                </span>
                            </div>

                            {/* Loading Bar or Choice Buttons */}
                            {!showChoice ? (
                                <div className="w-full h-px bg-white/5 relative overflow-hidden">
                                    <motion.div
                                        className="absolute inset-0 bg-vermelion"
                                        initial={{ x: "-100%" }}
                                        animate={{ x: `${progress - 100}%` }}
                                        transition={{ ease: "linear" }}
                                    />
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="w-full flex flex-col gap-spacing-05"
                                >
                                    <div className="flex flex-col items-center gap-spacing-05 w-full">
                                        <motion.button
                                            onClick={() => handleChoice(true)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="group relative px-spacing-08 py-spacing-05 bg-vermelion hover:bg-vermelion/90 text-black w-full flex items-center justify-center gap-spacing-03 rounded-none clip-path-slant transition-all"
                                        >
                                            <span className="font-electrolize uppercase tracking-widest">Initialize Memory</span>
                                            <motion.span
                                                animate={{ x: [0, 4, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            >
                                                →
                                            </motion.span>

                                            {/* Button Glitch Effect Overlay */}
                                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity" />
                                        </motion.button>

                                        <div className="flex flex-col items-center gap-spacing-02">
                                            <span className="font-doto text-[9px] uppercase tracking-[0.2em] text-vermelion-100">
                                                [ Audio Recommended ]
                                            </span>

                                            <button
                                                onClick={() => handleChoice(false)}
                                                className="font-doto text-[10px] uppercase tracking-widest text-white hover:text-white/80 transition-colors border-b border-transparent hover:border-white/20 pb-0.5"
                                            >
                                                Enter without audio
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Dynamic Texture/Grain overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.09]  bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
