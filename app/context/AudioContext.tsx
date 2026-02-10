"use client";

import { useRef, useState, ReactNode, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SineWaveform } from "../components/SineWaveform";
import { AudioContext } from "./AudioContextCore";

export function AudioProvider({ children }: { children: ReactNode }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [playing, setPlaying] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);

    // Handle automatic playback when audio is enabled
    useEffect(() => {
        if (audioEnabled && audioRef.current) {
            audioRef.current.play().catch(error => {
                console.log("Autoplay prevented:", error);
                setPlaying(false);
            });
            setPlaying(true);
        }
    }, [audioEnabled]);

    const playAudio = () => {
        if (!audioRef.current || !audioEnabled) return;
        audioRef.current.play();
        setPlaying(true);
    };

    const togglePlay = () => {
        if (!audioRef.current || !audioEnabled) return;

        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }

        setPlaying(!playing);
    };

    const { scrollYProgress } = useScroll();

    // When scroll reaches the bottom (0.98 to 1.0), slide the player up
    // -64px (approx gap-16) to clear the footer and add gap-6
    const translateY = useTransform(
        scrollYProgress,
        [0.98, 1],
        [0, -46]
    );

    return (
        <AudioContext.Provider value={{ audioEnabled, setAudioEnabled, playing, togglePlay, playAudio }}>
            {children}
            {audioEnabled && (
                <audio
                    ref={audioRef}
                    src="/audio/sudut-pandang.mp3"
                    preload="auto"
                    onEnded={() => setPlaying(false)}
                />
            )}
        </AudioContext.Provider>
    );
}
