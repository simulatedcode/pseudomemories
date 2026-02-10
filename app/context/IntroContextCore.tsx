"use client";

import { createContext, useContext } from "react";

export interface IntroContextType {
    isComplete: boolean;
    setComplete: (complete: boolean) => void;
}

export const IntroContext = createContext<IntroContextType | undefined>(undefined);

export function useIntro() {
    const context = useContext(IntroContext);
    if (context === undefined) {
        throw new Error("useIntro must be used within an IntroProvider");
    }
    return context;
}
