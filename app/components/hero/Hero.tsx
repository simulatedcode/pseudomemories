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
import { useSolarStarColor } from "@/app/hooks/useSolarColor";

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

    // Live solar colour — same source as DustStar
    const lineColor = useSolarStarColor();

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const horizonY = isMobile ? 76 : 116;

    const gridLines = isMobile
        ? [
            // Pure-doubling gaps from horizon: 2→4→8→16→32→64→128
            // horizonY = 76
            { y: 78, opacity: 0.05 }, // +2
            { y: 86, opacity: 0.15 }, // +4
            { y: 96, opacity: 0.30 }, // +8
            { y: 114, opacity: 0.50 }, // +16
            { y: 132, opacity: 0.70 }, // +32
            { y: 156, opacity: 0.88 }, // +64
            { y: 190, opacity: 1.00 }, // +128 (offscreen — crisp at SVG edge)
        ]
        : [
            // Pure-doubling gaps from horizon: 2→4→8→16→32→64→128
            // horizonY = 112
            { y: 116, opacity: 0.05 }, // +2
            { y: 118, opacity: 0.15 }, // +4
            { y: 122, opacity: 0.30 }, // +8
            { y: 132, opacity: 0.50 }, // +16
            { y: 146, opacity: 0.70 }, // +32
            { y: 164, opacity: 0.88 }, // +64
            { y: 189, opacity: 1.00 }, // +128 (offscreen — crisp at SVG edge)
        ];

    useGSAP(() => {
        // viewBox width = 300, so visual centre = 150.
        // We tween x1 150→0 and x2 150→1080 simultaneously so the
        // line grows outward from its exact visual midpoint.
        const MID = 150;

        if (horizonRef.current) {
            gsap.fromTo(
                horizonRef.current,
                { opacity: 0, attr: { x1: MID, x2: MID } },
                { opacity: 0.15, attr: { x1: 0, x2: 1080 }, duration: 0.7, delay: 1.8, ease: "expo.out" }
            );
        }

        if (linesRef.current.length) {
            gridLines.forEach((line, i) => {
                if (linesRef.current[i]) {
                    gsap.fromTo(
                        linesRef.current[i],
                        { opacity: 0, attr: { x1: MID, x2: MID } },
                        {
                            opacity: line.opacity,
                            attr: { x1: 0, x2: 1080 },
                            duration: 0.7,
                            delay: 1.8 + i * 0.11,
                            ease: "expo.out",
                        }
                    );
                }
            });
        }
    }, [isMobile]);

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
                    strokeWidth="0.3"
                    style={{ stroke: lineColor, opacity: 0.15 }}
                    className="mix-blend-screen"
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
                        style={{ stroke: lineColor, transition: "stroke 8s ease" }}
                        className="mix-blend-screen opacity-0"
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
        // Character stays visible on scroll
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
