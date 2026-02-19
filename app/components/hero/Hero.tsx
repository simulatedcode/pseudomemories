"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import Loader from "../ui/Loader";
import { CharacterSprite, HeroCharacterProps } from "./HeroCharacter";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easing } from "@/app/lib/motion-tokens";

gsap.registerPlugin(ScrollTrigger);

/* ---------- GRID ---------- */

interface GridProps {
    yOffset?: any;
}

function Grid({ yOffset }: GridProps) {
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const horizonRef = useRef<SVGLineElement>(null);
    const linesRef = useRef<SVGLineElement[]>([]);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const horizonY = isMobile ? 76 : 112;

    const gridLines = isMobile
        ? [
            { y: 85, opacity: 0.2 },
            { y: 100, opacity: 0.4 },
            { y: 125, opacity: 0.6 },
            { y: 155, opacity: 0.8 },
            { y: 190, opacity: 1 },
            { y: 230, opacity: 1.2 },
        ]
        : [
            { y: 115, opacity: 0.2 },
            { y: 125, opacity: 0.4 },
            { y: 140, opacity: 0.6 },
            { y: 160, opacity: 0.8 },
            { y: 185, opacity: 1 },
            { y: 214, opacity: 1.2 },
        ];

    useGSAP(() => {
        if (horizonRef.current) {
            gsap.fromTo(horizonRef.current,
                { scaleX: 0, transformOrigin: "center" },
                { scaleX: 1, duration: 0.7, delay: 1.8, ease: easing.carbonExpressive }
            );
        }

        if (linesRef.current.length) {
            gridLines.forEach((line, i) => {
                if (linesRef.current[i]) {
                    gsap.fromTo(linesRef.current[i],
                        { scaleX: 0, opacity: 0, transformOrigin: "center" },
                        { scaleX: 1, opacity: line.opacity, duration: 0.7, delay: 1.8 + i * 0.11, ease: easing.carbonExpressive }
                    );
                }
            });
        }
    }, [isMobile]); // Re-run if mobile state changes (gridLines change)

    return (
        <div
            ref={containerRef}
            className="fixed top-[540px] md:top-[440px] lg:top-[336px] left-0 z-10 w-screen h-[40vh] sm:h-[50vh] lg:h-[60vh] xl:h-[70vh] flex items-center justify-center pointer-events-none"
        >
            <svg
                viewBox="0 0 300 220"
                preserveAspectRatio="none"
                style={{ shapeRendering: "geometricPrecision" }}
                className="w-full h-full overflow-hidden"
            >
                <line
                    ref={horizonRef}
                    x1="0"
                    y1={horizonY}
                    x2="1080"
                    y2={horizonY}
                    strokeWidth="1"
                    className="stroke-cyan-800/6 mix-blend-exclusion"
                />

                {gridLines.map((line, i) => (
                    <line
                        key={i}
                        ref={el => { linesRef.current[i] = el! }}
                        x1="0"
                        y1={line.y}
                        x2="1080"
                        y2={line.y}
                        strokeWidth="0.5"
                        className="stroke-cyan-800 mix-blend-exclusion opacity-0" // Initial opacity class
                    />
                ))}
            </svg>
        </div>
    );
}

/* ---------- HERO WRAPPER ---------- */

export default function Hero(props: HeroCharacterProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (containerRef.current) {
            // Parallax opacity fade out
            gsap.to(containerRef.current, {
                opacity: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: document.body, // Scroll relative to body
                    start: "top top",
                    end: "20% top", // Fade out by 20% scroll
                    scrub: true,
                }
            });
        }
    });

    return (
        <>
            <Grid />

            <div
                ref={containerRef}
                className="fixed inset-0 z-10 pointer-events-none"
            >
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 50 }}
                    gl={{ antialias: false }}
                    dpr={[0.75, 1]}
                >
                    <Suspense fallback={<Html center><Loader /></Html>}>
                        <CharacterSprite {...props} />
                    </Suspense>
                </Canvas>

            </div>
        </>
    );
}
