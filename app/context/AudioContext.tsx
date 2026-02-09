"use client";

import { useRef, useState, ReactNode, useEffect } from "react";
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

    return (
        <AudioContext.Provider value={{ audioEnabled, setAudioEnabled, playing, togglePlay, playAudio }}>
            {children}
            {audioEnabled && (
                <div className="fixed bottom-0 left-0 p-spacing-04 sm:p-spacing-06 z-50 flex flex-col items-start">

                    <button
                        onClick={togglePlay}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white border-2 border-white/20 hover:border-white/40 transition-all duration-300"
                    >
                        <div className="flex items-center gap-2">
                            <SineWaveform isPlaying={playing} />
                        </div>
                    </button>

                    <audio
                        ref={audioRef}
                        src="/audio/sudut-pandang.mp3"
                        preload="auto"
                        onEnded={() => setPlaying(false)}
                    />
                </div>
            )}
        </AudioContext.Provider>
    );
}
