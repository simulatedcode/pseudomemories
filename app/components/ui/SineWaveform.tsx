"use client";

import { motion } from "framer-motion";

export function SineWaveform({ isPlaying }: { isPlaying: boolean }) {
    return (
        <div className="flex items-center justify-center mx-auto h-4 w-full overflow-hidden"
            style={{
                maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
            }}
        >
            <svg viewBox="0 0 40 20" className="w-full h-full">
                <motion.path
                    fill="transparent"
                    stroke="#00ffff"
                    strokeWidth="1"
                    strokeLinecap="round"
                    style={{
                        filter: isPlaying ? "drop-shadow(0 0 3px rgba(0, 255, 255, 0.8))" : "none"
                    }}
                    initial={{ d: "M-20 10 L60 10" }}
                    animate={{
                        d: isPlaying
                            ? [
                                "M-20 10 Q-15 10 -10 10 T0 10 T10 10 T20 10 T30 10 T40 10 T50 10 T60 10", // Flat/Zero
                                "M-20 10 Q-15 0 -10 10 T0 10 T10 10 T20 10 T30 10 T40 10 T50 10 T60 10",  // High Pulse
                                "M-20 10 Q-15 14 -10 10 T0 10 T10 10 T20 10 T30 10 T40 10 T50 10 T60 10", // Mid Exhale
                                "M-20 10 Q-15 4 -10 10 T0 10 T10 10 T20 10 T30 10 T40 10 T50 10 T60 10",  // Sharp Spike
                                "M-20 10 Q-15 10 -10 10 T0 10 T10 10 T20 10 T30 10 T40 10 T50 10 T60 10", // Return
                            ]
                            : "M-20 10 L60 10",
                        x: isPlaying ? [0, -20] : 0,
                        opacity: isPlaying ? 1 : 1
                    }}
                    transition={{
                        d: {
                            duration: 0.8, // Much faster for "audio signal" feel
                            repeat: Infinity,
                            times: [0, 0.15, 0.4, 0.75, 1], // Rapid intensity changes
                            ease: "easeInOut"
                        },
                        x: {
                            duration: 1.2, // Faster drift
                            repeat: Infinity,
                            ease: "linear"
                        },
                        opacity: { duration: 0.3 }
                    }}
                />
            </svg>
        </div>
    );
}
