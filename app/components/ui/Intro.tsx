"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIntro } from "../../context/IntroContextCore";
import { useAudio } from "../../context/AudioContextCore";
import { useGeo } from "../../context/GeoContextCore";
import { usePathname } from "next/navigation";
import { ScrambleText } from "./ScrambleText";

export default function Intro() {
    const pathname = usePathname();
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const { setComplete } = useIntro();
    const { setAudioEnabled: setGlobalAudio } = useAudio();
    const { latitude, longitude, error } = useGeo();

    // Loading progress based on geolocation
    useEffect(() => {
        let interval: NodeJS.Timeout;

        // Start with initial progress
        setProgress(10);

        // If we have geolocation data or an error, we're connected
        const hasGeoData = (latitude !== 0 && longitude !== 0) || error !== null;

        if (hasGeoData) {
            // Fast progress to 100% when geo data is available
            interval = setInterval(() => {
                setProgress((prev) => {
                    const next = prev + Math.floor(Math.random() * 15) + 10;
                    if (next >= 100) {
                        clearInterval(interval);
                        setIsComplete(true);
                        return 100;
                    }
                    return next;
                });
            }, 80);
        } else {
            // Slower progress while waiting for geo data
            interval = setInterval(() => {
                setProgress((prev) => {
                    const next = prev + Math.floor(Math.random() * 5) + 1;
                    // Cap at 90% until we get geo data
                    if (next >= 90) {
                        clearInterval(interval);
                        return 90;
                    }
                    return next;
                });
            }, 150);
        }

        return () => clearInterval(interval);
    }, [latitude, longitude, error]);

    const handleProceed = () => {
        setGlobalAudio(audioEnabled);
        setComplete(true);
        setIsVisible(false);
    };

    // Only render intro on the homepage
    if (pathname !== "/") return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        clipPath: "inset(0 0 100% 0)",
                        transition: { duration: 0.5, ease: [0.2, 0, 1, 0.9] }
                    }}
                    style={{ willChange: "clip-path" }}
                    className="fixed h-dvh w-screen top-0 left-0 z-1000 bg-black/40 flex items-center justify-center text-vermelion selection:bg-white/10"
                >
                    <div className="flex flex-col items-center gap-4 max-w-2xl w-full px-8 relative z-10">
                        {/* Main Text with Mask - Clickable when complete */}
                        <div className="relative overflow-hidden">
                            <motion.button
                                disabled={!isComplete}
                                onClick={isComplete ? handleProceed : undefined}
                                onMouseEnter={() => isComplete && setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                                className={`font-electrolize font-black text-h3 sm:text-h4 uppercase tracking-wider text-center bg-transparent border-none ${isComplete ? 'cursor-pointer' : 'cursor-default'
                                    }`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                whileHover={isComplete ? {
                                    scaleX: 1.00,
                                    scaleY: 0.95,
                                    transition: { duration: 0.3 }
                                } : {}}
                            >
                                <span className="relative inline-block">
                                    <span className="relative z-10">
                                        {isComplete ? (
                                            <ScrambleText
                                                text="[ Initialize Memory ]"
                                                trigger={isHovering}
                                                duration={0.8}
                                            />
                                        ) : (
                                            "[ Initialize Memory ]"
                                        )}
                                    </span>
                                    {/* Gradient opacity overlay */}
                                    {!isComplete && (
                                        <motion.span
                                            className="absolute inset-0 z-20"
                                            style={{
                                                backgroundImage: `linear-gradient(to right, transparent ${progress}%, rgba(0, 0, 0, 0.6) ${progress}%)`,
                                                WebkitBackgroundClip: 'text',
                                                backgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}
                                        >
                                            [ Initialize Memory ]
                                        </motion.span>
                                    )}
                                </span>
                            </motion.button>
                        </div>

                        {/* Audio Toggle - shows when loading complete */}
                        {isComplete && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                onClick={() => setAudioEnabled(!audioEnabled)}
                                className="flex items-center  justify-center gap-2 font-doto text-xs uppercase tracking-widest"
                            >
                                <div className={`flex w-2 h-2 rounded-full transition-all ${audioEnabled ? 'bg-vermelion' : 'bg-white/20'}`} />
                                <span className={audioEnabled ? 'text-vermelion' : 'text-white/60'}>
                                    Audio {audioEnabled ? 'Enabled' : 'Disabled'}
                                </span>
                            </motion.button>
                        )}
                    </div>

                    {/* Grain overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.09] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
