"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIntro } from "../../context/IntroContextCore";
import { usePathname } from "next/navigation";
import pkg from "../../../package.json";
import { duration, easing } from "../../lib/motion-tokens";

const SEQUENCE = [
    { text: "Archive accessed.", delay: 400 },
    { text: "Source identified: Mooi Indie landscape archive.", delay: 600 },
    { text: "Temporal index: circa 1930.", delay: 500 },
    { text: "Visual framework detected: Colonial representation model.", delay: 700 },
    { text: "Terrain rendering: Romanticized.", delay: 500 },
    { text: "Atmospheric depth: Exaggerated.", delay: 500 },
    { text: "Human scale: Suppressed.", delay: 500 },
    { text: "Compositional authority: Centralized horizon control.", delay: 700 },
    { text: "Initiating structural deconstruction.", delay: 600 },
    { text: "Separating light, depth, and foreground hierarchy.", delay: 600 },
    { text: "Removing inherited framing bias.", delay: 600 },
    { text: "Reconstructing landscape model.", delay: 600 },
    { text: "Memory reconstruction complete.", delay: 800 },
];

const TYPE_SPEED = 20;

const TypewriterText = ({
    text,
    showCursor,
}: {
    text: string;
    showCursor: boolean;
}) => {
    const [displayedText, setDisplayedText] = useState("");
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        let charIndex = 0;
        setDisplayedText("");

        const typeNext = () => {
            if (!mountedRef.current || charIndex >= text.length) return;

            charIndex++;
            setDisplayedText(text.substring(0, charIndex));

            setTimeout(typeNext, TYPE_SPEED);
        };

        typeNext();

        return () => {
            mountedRef.current = false;
        };
    }, [text]);

    return (
        <span className="whitespace-pre-line inline-block uppercase">
            {displayedText}
            {showCursor && (
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-2 h-4 bg-vermelion-500 ml-1 align-middle"
                />
            )}
        </span>
    );
};

export default function Intro() {
    const pathname = usePathname();
    const { setComplete } = useIntro();

    const [displayedLines, setDisplayedLines] = useState<
        { text: string; id: string; year: number; hex: string }[]
    >([]);
    const [isComplete, setIsComplete] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        let mounted = true;

        const processSequence = async () => {
            await new Promise((resolve) => setTimeout(resolve, 800));
            if (!mounted) return;

            for (let i = 0; i < SEQUENCE.length; i++) {
                if (!mounted) return;

                const item = SEQUENCE[i];

                const drift = Math.floor(Math.random() * 120);
                const year = i === 0 ? 1930 : 1930 + drift;
                const hex = "0x" + Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0');

                setDisplayedLines((prev) => [
                    ...prev,
                    {
                        text: item.text,
                        id: Math.random().toString(36).substring(2, 9),
                        year,
                        hex
                    },
                ]);

                // Wait for typing duration + item delay
                await new Promise((resolve) =>
                    setTimeout(resolve, item.delay + item.text.length * TYPE_SPEED)
                );
            }

            if (mounted) setIsComplete(true);
        };

        processSequence();

        return () => {
            mounted = false;
        };
    }, []);

    const handleProceed = () => {
        setComplete(true);
        setIsVisible(false);
    };

    if (pathname !== "/") return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        clipPath: "inset(0 0 100% 0)",
                        transition: { duration: duration.slow, ease: easing.soft },
                    }}
                    className="fixed inset-0 z-1000 bg-background/5 flex items-center justify-center font-mono text-vermelion-500/80 overflow-hidden"
                >
                    <div className="max-w-3xl w-full p-8 border border-white/5 backdrop-blur-md bg-white/5 relative">
                        <div className="flex justify-between text-xs opacity-60 border-b border-vermelion-500/20 pb-2 mb-4 tracking-widest">
                            <span>ARCHIVE_REPROCESS_PROTOCOL_V{pkg.version}</span>
                            <span className="animate-pulse">STATE: ANALYZING</span>
                        </div>

                        <div className="flex flex-col gap-2 min-h-[340px] font-doto text-micro md:text-caption leading-tight tracking-widests">
                            {displayedLines.map((line, index) => {
                                const isCurrent = index === displayedLines.length - 1;
                                const isFinal = index === SEQUENCE.length - 1;
                                const showCursor = (isCurrent && !isComplete) || (isComplete && isFinal);

                                return (
                                    <div key={line.id} className="flex gap-4 items-start">
                                        {/* Motion Box indicator for current line */}
                                        <div className="w-1 h-2 mt-1 shrink-0">
                                            {isCurrent && !isComplete && (
                                                <motion.div
                                                    animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 0.8] }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                    className="w-full h-full bg-vermelion-500"
                                                />
                                            )}
                                            {(!isCurrent || isComplete) && (
                                                <div className="w-full h-full bg-emerald-500/20" />
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <span className="opacity-80 tabular-nums min-w-[5ch]">
                                                {line.year}
                                            </span>
                                            <span className="opacity-60 tabular-nums min-w-[7ch] text-xs pt-0.5">
                                                [{line.hex}]
                                            </span>
                                            <TypewriterText text={line.text} showCursor={showCursor} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Final CTA Modal */}
                        {isComplete && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: "-45%" }}
                                animate={{ opacity: 1, scale: 1, y: "-50%" }}
                                transition={{ duration: duration.slow, ease: easing.soft }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[80%] max-w-md p-10 border border-vermelion-500/20 bg-background/90 backdrop-blur-2xl text-center shadow-[0_0_100px_rgba(0,0,0,0.8)]"
                            >
                                <div className="text-micro opacity-40 tracking-[0.3em] mb-8 animate-pulse">
                                    AUTH_REQUIRED
                                </div>

                                <button
                                    onClick={handleProceed}
                                    className="group relative w-full py-4 border border-vermelion-500/30 hover:border-vermelion-500/40 transition-all tracking-[0.4em] text-xs cursor-pointer overflow-hidden"
                                >
                                    <span className="relative z-10 text-vermelion-500 group-hover:text-vermelion-400">
                                        [ INITIALIZE_MEMORY_SEQUENCE ]
                                    </span>
                                    <div className="absolute inset-0 bg-vermelion-500/0 group-hover:bg-vermelion-500/5 transition-colors" />
                                </button>

                                <div className="mt-8 text-[9px] opacity-60 tracking-widest uppercase">
                                    Neural_Link: Established // Archive_Key: Verified
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        animate={{ y: ["0%", "2%"] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        style={{
                            background:
                                "linear-gradient(rgba(0,0,0,0)_50%, rgba(0,0,0,0.15)_50%)",
                            backgroundSize: "100% 3px",
                            opacity: 0.15,
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
