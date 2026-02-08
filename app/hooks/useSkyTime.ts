"use client";

import { useState, useEffect } from "react";
import { getLST } from "../lib/astro";

export function useSkyTime(longitude: number) {
    const [lst, setLst] = useState(0);

    useEffect(() => {
        const update = () => {
            setLst(getLST(longitude));
        };

        update();
        const interval = setInterval(update, 1000); // Update every second
        return () => clearInterval(interval);
    }, [longitude]);

    return lst;
}
