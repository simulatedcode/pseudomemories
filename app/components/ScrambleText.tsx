"use client";

import React, { useState, useEffect } from "react";

interface ScrambleTextProps {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
    scrambleSpeed?: number;
    trigger?: any;
}

const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export const ScrambleText: React.FC<ScrambleTextProps> = ({
    text,
    className = "",
    delay = 0,
    duration = 0.8,
    scrambleSpeed = 40,
    trigger,
}) => {
    const [displayText, setDisplayText] = useState("");
    const [isStarted, setIsStarted] = useState(false);

    // Initialize with spaces or placeholder
    useEffect(() => {
        setDisplayText(" ".repeat(text.length));
    }, [text]);

    // Handle initial delay and trigger changes
    useEffect(() => {
        if (trigger !== undefined) {
            setIsStarted(false);
            // Small timeout to ensure state transitions correctly
            const timer = setTimeout(() => setIsStarted(true), 10);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                setIsStarted(true);
            }, delay * 1000);
            return () => clearTimeout(timer);
        }
    }, [delay, trigger]);

    useEffect(() => {
        if (!isStarted) return;

        let frame = 0;
        const totalFrames = (duration * 1000) / scrambleSpeed;

        const interval = setInterval(() => {
            const scrambled = text.split("").map((char, i) => {
                if (char === " ") return " ";

                // Progress as a value between 0 and 1
                const progress = frame / totalFrames;

                // Reveal threshold allows for a cascading settle effect
                const revealThreshold = (i / text.length) * 0.8;

                if (progress > revealThreshold + 0.1) {
                    return char;
                }

                return chars[Math.floor(Math.random() * chars.length)];
            }).join("");

            setDisplayText(scrambled);
            frame++;

            if (frame >= totalFrames) {
                setDisplayText(text);
                clearInterval(interval);
            }
        }, scrambleSpeed);

        return () => clearInterval(interval);
    }, [isStarted, text, duration, scrambleSpeed]);

    return <span className={className}>{displayText}</span>;
};
