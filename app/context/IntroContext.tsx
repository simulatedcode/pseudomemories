"use client";

import { useState, ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { IntroContext } from "./IntroContextCore";

export function IntroProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    // Initialize isComplete to true if we're not on the root path
    const [isComplete, setComplete] = useState(false);

    useEffect(() => {
        if (pathname !== "/") {
            setComplete(true);
        }
    }, [pathname]);

    return (
        <IntroContext.Provider value={{ isComplete, setComplete }}>
            {children}
        </IntroContext.Provider>
    );
}
