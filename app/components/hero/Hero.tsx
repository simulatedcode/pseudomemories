"use client";

import { useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useTexture, Html } from "@react-three/drei";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import * as THREE from "three";
import Loader from "../ui/Loader";

/* ---------- GRID ---------- */

function Grid() {
    const { scrollYProgress } = useScroll();
    const smoothY = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.5 });
    const yOffset = useTransform(smoothY, [0, 1], [0, -168]);

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
            className="fixed z-50 w-screen h-[40vh] sm:h-[50vh] lg:h-[60vh] xl:h-[70vh] max-h-[800px] bottom-0 flex items-center justify-center pointer-events-none"
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
                    x2="300"
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
                        x2="300"
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

/* ---------- CHARACTER ---------- */

type PositionValue = number | string;

interface HeroCharacterProps {
    x?: PositionValue;
    y?: PositionValue;
    anchor?: "center" | "bottom" | "top" | "left" | "right";
}

function CharacterSprite({ x = 204, y = -500, anchor = "bottom" }: HeroCharacterProps) {
    const texture = useTexture("/raden_.png");
    const { viewport, size } = useThree();

    const aspect = useMemo(() => {
        const img = texture.image as HTMLImageElement;
        return img?.width ? img.width / img.height : 1;
    }, [texture]);

    const isMobile = size.width < 768;
    const isTablet = size.width >= 768 && size.width < 1280;

    const characterHeight = isMobile
        ? viewport.height
        : isTablet
            ? viewport.height * 0.85
            : viewport.height * 0.9;

    const characterWidth = characterHeight * aspect;

    const parseCoord = (val: PositionValue, viewportDim: number, screenDim: number) => {
        if (typeof val === "number") return (val / screenDim) * viewportDim;
        if (typeof val === "string") {
            if (val === "center") return 0;
            if (val.endsWith("%")) {
                const percent = parseFloat(val) / 100;
                return (percent - 0.5) * viewportDim;
            }
        }
        return 0;
    };

    const posX = parseCoord(x, viewport.width, size.width);

    const horizonY = isMobile ? 80 : 112;
    const horizonPercent = isMobile ? 0.40 : isTablet ? 0.50 : 0.60;
    const horizonPos = (1 - horizonY / 220) * horizonPercent;

    const posY =
        y !== undefined
            ? parseCoord(y, viewport.height, size.height)
            : (horizonPos - 0.5) * viewport.height;

    const charAnchor = y === undefined ? "bottom" : anchor;

    let offsetX = 0;
    let offsetY = 0;

    if (charAnchor === "left") offsetX = characterWidth / 2;
    if (charAnchor === "right") offsetX = -characterWidth / 2;
    if (charAnchor === "top") offsetY = -characterHeight / 2;
    if (charAnchor === "bottom") offsetY = characterHeight / 2;

    const target = useMemo(() => new THREE.Vector3(posX + offsetX, posY + offsetY, 0), [posX, posY, offsetX, offsetY]);

    return (
        <group>
            <ambientLight intensity={0.6} />
            <spotLight position={[5, 10, 5]} intensity={20} color="#E0491F" />
            <pointLight position={[-5, 5, -5]} intensity={10} color="#E0491F" />

            <mesh position={[target.x, target.y, 0]}>
                <planeGeometry args={[characterWidth, characterHeight]} />
                <meshStandardMaterial
                    map={texture}
                    transparent
                    alphaTest={0.4}
                    roughness={0.4}
                    metalness={0.6}
                    toneMapped
                />
            </mesh>
        </group>
    );
}

/* ---------- HERO WRAPPER ---------- */

export default function Hero(props: HeroCharacterProps) {
    const { scrollYProgress } = useScroll();
    const yOffset = useTransform(scrollYProgress, [0, 1], [0, -100]);

    return (
        <>
            <Grid />

            <motion.div style={{ y: yOffset }} className="absolute top-0 left-0 w-full h-screen z-100 pointer-events-none">
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
