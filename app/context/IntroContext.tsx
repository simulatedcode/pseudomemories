"use client";

import { useState, ReactNode } from "react";
import { IntroContext } from "./IntroContextCore";

export function IntroProvider({ children }: { children: ReactNode }) {
    const [isComplete, setComplete] = useState(false);

    return (
        <IntroContext.Provider value={{ isComplete, setComplete }}>
            {children}
        </IntroContext.Provider>
    );
}
