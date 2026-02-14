"use client";

import React, { ReactNode, useEffect } from "react";
import { AudioAnalysisContext } from "./AudioAnalysisContextCore";
import { useAudioAnalyzer } from "../hooks/useAudioAnalyzer";

export function AudioAnalysisProvider({ children }: { children: ReactNode }) {
    // Enable monitoring (user repeat) is true
    const { isListening, error, toggleAudio, analyser } = useAudioAnalyzer(256, true);

    // Auto-start removed: User request for standby (mic off) on load
    // The audio must be manually toggled via the HUD

    return (
        <AudioAnalysisContext.Provider value={{ isListening, error, toggleAudio, analyser }}>
            {children}
        </AudioAnalysisContext.Provider>
    );
}
