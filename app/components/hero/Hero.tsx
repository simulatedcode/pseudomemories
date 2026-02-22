"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import Loader from "../ui/Loader";
import { CharacterSprite, HeroCharacterProps } from "./HeroCharacter";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easing } from "@/app/lib/motion-tokens";
import HeroGrid from "./HeroGrid";

gsap.registerPlugin(ScrollTrigger);

/* ---------- HERO WRAPPER ---------- */

export default function Hero(props: HeroCharacterProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Character stays visible on scroll
    });

    return (
        <>
            <HeroGrid />

            <div
                ref={containerRef}
                className="fixed inset-0 z-10 pointer-events-none"
            >
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 50 }}
                    gl={{ antialias: true }}
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
