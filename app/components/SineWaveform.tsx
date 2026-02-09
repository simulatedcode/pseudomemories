"use client";

import { motion } from "framer-motion";

export function SineWaveform({ isPlaying }: { isPlaying: boolean }) {
    return (
        <div className="flex items-center justify-center h-4 w-12 overflow-hidden">
            <svg viewBox="0 0 40 20" className="w-full h-full">
                <motion.path
                    fill="transparent"
                    stroke="cyan"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    initial={{ d: "M0 10 L40 10" }}
                    animate={{
                        d: isPlaying
                            ? [
                                "M-20 10 Q-15 10 -10 10 T0 10 T10 10 T20 10 T30 10 T40 10 T50 10 T60 10", // Flat
                                "M-20 10 Q-15 2 -10 10 T0 10 T10 10 T20 10 T30 10 T40 10 T50 10 T60 10",  // Inhale
                                "M-20 10 Q-15 18 -10 10 T0 10 T10 10 T20 10 T30 10 T40 10 T50 10 T60 10", // Exhale
                                "M-20 10 Q-15 8 -10 10 T0 10 T10 10 T20 10 T30 10 T40 10 T50 10 T60 10",  // Recovery
                                "M-20 10 Q-15 10 -10 10 T0 10 T10 10 T20 10 T30 10 T40 10 T50 10 T60 10", // Flat
                            ]
                            : "M-20 10 L60 10",
                        x: isPlaying ? [0, -20] : 0 // Perfect wavelength shift for seamless loop
                    }}
                    transition={{
                        d: {
                            duration: 3.5, // Natural breathing rhythm
                            repeat: Infinity,
                            times: [0, 0.3, 0.5, 0.8, 1], // Asymmetric biorythm
                            ease: "easeInOut"
                        },
                        x: {
                            duration: 2.0, // Slower phase shift
                            repeat: Infinity,
                            ease: "linear"
                        }
                    }}
                />
            </svg>
        </div>
    );
}
