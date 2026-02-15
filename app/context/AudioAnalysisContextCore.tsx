"use client";

import { createContext, useContext } from "react";

export interface AudioAnalysisContextType {
    isListening: boolean;
    error: string | null;
    toggleAudio: () => Promise<void>;
    analyser: AnalyserNode | null;
}

export const AudioAnalysisContext = createContext<AudioAnalysisContextType | undefined>(undefined);

export function useAudioAnalysis() {
    const context = useContext(AudioAnalysisContext);
    if (!context) {
        throw new Error("useAudioAnalysis must be used within AudioAnalysisProvider");
    }
    return context;
}
