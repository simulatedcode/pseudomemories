"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "../../context/AudioContextCore";
import { useIntro } from "../../context/IntroContextCore";
import { usePathname } from "next/navigation";
import { ScrambleText } from "./ScrambleText";
import { SineWaveform } from "./SineWaveform";

export function AudioTransmitMobile() {
    const { audioEnabled, playing, togglePlay } = useAudio();
    const { isComplete } = useIntro();
    const pathname = usePathname();
    const [isHovered, setIsHovered] = useState(false);

    // Only show on root path and when audio is enabled
    if (pathname !== "/" || !audioEnabled) return null;

    return (
        <AnimatePresence>
            {isComplete && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.8, delay: 2.2, ease: "easeOut" }}
                    className="fixed bottom-12 left-1/2 -translate-x-1/2 z-100 lg:hidden pointer-events-auto"
                >
                    <button
                        onClick={togglePlay}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="flex justify-center items-center bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-6 py-1.5 shadow-md shadow-black/40"
                    >
                        <div
                            className="flex items-center gap-4"
                            style={{
                                maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
                                WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
                            }}
                        >

                            <div className="w-18">
                                <SineWaveform isPlaying={playing} />
                            </div>
                        </div>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
