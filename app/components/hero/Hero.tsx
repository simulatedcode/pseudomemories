"use client";

import { useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Loader from "../ui/Loader";
import { CharacterSprite, HeroCharacterProps } from "./HeroCharacter";

/* ---------- GRID ---------- */

interface GridProps {
    yOffset: any;
}

function Grid({ yOffset }: GridProps) {
    const [isMobile, setIsMobile] = useState(false);

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

    return (
        <motion.div
            style={{ y: yOffset }}
            className="fixed top-[540px] md:top-[440px] lg:top-[336px] left-0 z-10 w-screen h-[40vh] sm:h-[50vh] lg:h-[60vh] xl:h-[70vh] flex items-center justify-center pointer-events-none"
        >
            <motion.svg
                viewBox="0 0 300 220"
                preserveAspectRatio="none"
                style={{ shapeRendering: "geometricPrecision" }}
                className="w-full h-full overflow-hidden"
            >
                <motion.line
                    x1="0"
                    y1={horizonY}
                    x2="1080"
                    y2={horizonY}
                    strokeWidth="1"
                    className="stroke-cyan-800/6 mix-blend-exclusion"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.5, delay: 1.8 }}
                />

                {gridLines.map((line, i) => (
                    <motion.line
                        key={i}
                        x1="0"
                        y1={line.y}
                        x2="1080"
                        y2={line.y}
                        strokeWidth="0.5"
                        className="stroke-cyan-800 mix-blend-exclusion"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: line.opacity }}
                        transition={{ duration: 1.5, delay: 1.8 + i * 0.2 }}
                    />
                ))}
            </motion.svg>
        </motion.div>
    );
}

/* ---------- HERO WRAPPER ---------- */

export default function Hero(props: HeroCharacterProps) {
    const { scrollYProgress } = useScroll();

    // Matching softer spring from page.tsx
    const smoothY = useSpring(scrollYProgress, {
        stiffness: 40,
        damping: 30,
        mass: 1,
        restDelta: 0.001
    });

    // Slowed down slide-up speed (-60% instead of -100%)
    const yOffset = useTransform(smoothY, [0, 1], ["0%", "-60%"]);
    const heroOpacity = useTransform(smoothY, [0, 0.7], [1, 0]);

    return (
        <>
            <Grid yOffset={yOffset} />

            <motion.div
                style={{ y: yOffset, opacity: heroOpacity }}
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
            </motion.div>
        </>
    );
}
