"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGeo } from "../context/GeoContext";
import { ScrambleText } from "./ScrambleText";

export default function Intro() {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const { latitude, longitude, error } = useGeo();

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                const next = prev + Math.floor(Math.random() * 10) + 1;
                if (next >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsVisible(false), 800);
                    return 100;
                }
                return next;
            });
        }, 120);

        return () => clearInterval(interval);
    }, []);

    const locationString = error || `${latitude.toFixed(4)}°N ${longitude.toFixed(4)}°E`;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        y: "-100%",
                        transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
                    }}
                    className="fixed inset-0 z-9999 bg-vermelion-700/80 backdrop-blur-xl flex flex-col items-center justify-center text-offwhite-50 selection:bg-white/10"
                >
                    <div className="flex flex-col items-center gap-12 max-w-md w-full px-spacing-08">
                        {/* Upper Details */}
                        <div className="w-full flex justify-between font-doto text-[10px] tracking-widest opacity-40 uppercase">
                            <div className="flex flex-col gap-1">
                                <span>Status: Booting</span>
                                <span>Signal: {error ? "Offline" : "Locked"}</span>
                            </div>
                            <div className="text-right">
                                <span>Mem. Link: pseudo</span>
                                <span>Rev. 2018.24</span>
                            </div>
                        </div>

                        {/* Large Counter */}
                        <div className="relative pt-12">
                            <motion.h1
                                className="font-electrolize text-[120px] sm:text-[180px] leading-none tracking-tighter"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1 }}
                            >
                                {progress.toString().padStart(2, "0")}
                                <span className="text-[20px] sm:text-[32px] absolute -top-4 -right-8 opacity-60">%</span>
                            </motion.h1>
                        </div>

                        {/* Lower Details */}
                        <div className="w-full flex flex-col items-center gap-6 pt-12 border-t border-white/10">
                            <div className="flex flex-col items-center gap-1">
                                <span className="font-electrolize text-[10px] uppercase tracking-[0.3em] opacity-60">Coordinates</span>
                                <span className="font-doto text-caption tracking-widest">
                                    <ScrambleText text={locationString} delay={0.5} duration={1.5} />
                                </span>
                            </div>

                            {/* Loading Bar */}
                            <div className="w-full h-0.5 bg-white/10 relative overflow-hidden">
                                <motion.div
                                    className="absolute inset-0 bg-white/60"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: `${progress - 100}%` }}
                                    transition={{ ease: "linear" }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Texture/Grain overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.2] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
