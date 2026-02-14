"use client";

import { createContext, useContext } from "react";

export interface TransitionContextType {
    isTransitioning: boolean;
    setIsTransitioning: (value: boolean) => void;
}

export const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function useTransition() {
    const context = useContext(TransitionContext);
    if (!context) {
        throw new Error("useTransition must be used within TransitionProvider");
    }
    return context;
}
