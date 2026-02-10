"use client";

import { useState, useEffect } from "react";

// Extend Performance interface for Chrome's memory API
interface PerformanceMemory {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
}

interface PerformanceWithMemory extends Performance {
    memory?: PerformanceMemory;
}

interface SystemMetrics {
    memory: number;
    gpu: number;
}

export function useSystemMetrics(): SystemMetrics {
    const [metrics, setMetrics] = useState<SystemMetrics>({
        memory: 0,
        gpu: 0,
    });

    useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();
        let rafId: number;

        const updateMetrics = () => {
            const now = performance.now();
            frameCount++;

            // Update every ~1 second
            if (now - lastTime >= 1000) {
                let memoryPercent = 0;
                let gpuPercent = 0;

                // Memory usage (Chrome/Edge only)
                const perf = performance as PerformanceWithMemory;
                if (perf.memory) {
                    const used = perf.memory.usedJSHeapSize;
                    const limit = perf.memory.jsHeapSizeLimit;
                    memoryPercent = Math.round((used / limit) * 100);
                }

                // GPU estimation based on frame rate
                // 60fps = low load, <30fps = high load
                const fps = Math.round(frameCount / ((now - lastTime) / 1000));
                if (fps >= 55) {
                    gpuPercent = Math.round(20 + Math.random() * 15); // 20-35%
                } else if (fps >= 45) {
                    gpuPercent = Math.round(35 + Math.random() * 15); // 35-50%
                } else if (fps >= 30) {
                    gpuPercent = Math.round(50 + Math.random() * 20); // 50-70%
                } else {
                    gpuPercent = Math.round(70 + Math.random() * 25); // 70-95%
                }

                setMetrics({
                    memory: memoryPercent,
                    gpu: Math.min(gpuPercent, 99),
                });

                frameCount = 0;
                lastTime = now;
            }

            rafId = requestAnimationFrame(updateMetrics);
        };

        rafId = requestAnimationFrame(updateMetrics);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    return metrics;
}
