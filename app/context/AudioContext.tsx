"use client";

import { useRef, useState, ReactNode, useEffect } from "react";
import { SineWaveform } from "../components/ui/SineWaveform";
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
        if (!audioRef.current) return;

        if (!audioEnabled) {
            setAudioEnabled(true);
            // The useEffect will handle the play() call
            return;
        }

        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }

        setPlaying(!playing);
    };

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
