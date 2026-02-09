"use client";

import { createContext, useContext } from "react";

export interface GeoContextType {
    latitude: number;
    longitude: number;
    error: string | null;
}

export const GeoContext = createContext<GeoContextType | undefined>(undefined);

export function useGeo() {
    const context = useContext(GeoContext);
    if (context === undefined) {
        throw new Error("useGeo must be used within a GeoProvider");
    }
    return context;
}
