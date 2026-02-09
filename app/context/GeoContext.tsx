"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { GeoContext, GeoContextType } from "./GeoContextCore";

export function GeoProvider({ children }: { children: ReactNode }) {
    const [geo, setGeo] = useState<GeoContextType>({
        latitude: 0,
        longitude: 0,
        error: "LOCATING...",
    });

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setGeo({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        error: null,
                    });
                },
                (error) => {
                    let errorMessage = "DATA OFFLINE";
                    switch (error.code) {
                        case 1: errorMessage = "ACCESS DENIED"; break;
                        case 2: errorMessage = "SIGNAL LOST"; break;
                        case 3: errorMessage = "TIMED OUT"; break;
                    }
                    setGeo((prev) => ({ ...prev, error: errorMessage }));
                },
                { enableHighAccuracy: false, timeout: 5000, maximumAge: Infinity }
            );
        } else {
            setGeo((prev) => ({ ...prev, error: "NOT SUPPORTED" }));
        }
    }, []);

    return (
        <GeoContext.Provider value={geo}>
            {children}
        </GeoContext.Provider>
    );
}
