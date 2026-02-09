"use client";

import { createContext, useContext } from "react";

export interface AudioContextType {
    audioEnabled: boolean;
    setAudioEnabled: (enabled: boolean) => void;
    playing: boolean;
    togglePlay: () => void;
    playAudio: () => void;
}

export const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error("useAudio must be used within AudioProvider");
    }
    return context;
}
