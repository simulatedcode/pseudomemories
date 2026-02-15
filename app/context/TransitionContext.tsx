"use client";

import { useState, ReactNode } from "react";
import { TransitionContext } from "./TransitionContextCore";

export function TransitionProvider({ children }: { children: ReactNode }) {
    const [isTransitioning, setIsTransitioning] = useState(false);

    return (
        <TransitionContext.Provider value={{ isTransitioning, setIsTransitioning }}>
            {children}
        </TransitionContext.Provider>
    );
}

// Re-export hook for convenience (optional, but good for backward compat if needed)
export { useTransition } from "./TransitionContextCore"; 
