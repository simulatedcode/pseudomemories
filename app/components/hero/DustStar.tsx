"use client";

import { useRef, Suspense, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGeo } from "../../context/GeoContextCore";
import { useSkyTime } from "../../hooks/useSkyTime";
import Loader from "../ui/Loader";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Html } from "@react-three/drei";
import { useSolarStarColor } from "../../hooks/useSolarColor";

gsap.registerPlugin(ScrollTrigger);

/* ================= STAR FIELD ================= */

import { STAR_VERTEX_SHADER, STAR_FRAGMENT_SHADER } from "../../shaders/dustStar.glsl";

function StarLayer({
    count,
    radius = 1.5,
    size = 0.8,
    baseBrightness = 0.1,
    twinkleSpeed = 8.0,
    driftIntensity = 1.2,
    depth = 1,
    movementSpeed = 0.5, // Factor for cursor-following parallax
    twinkleSharpness = 8.0, // Control curve of twinkle
    color = "#A8C8F0", // Icy silver-blue default (night sky)
}: any) {
    const matRef = useRef<THREE.ShaderMaterial>(null);
    const pointsRef = useRef<THREE.Points>(null);
    const { mouse } = useThree();
    const mousePos = useRef({ x: 0, y: 0 });

    // Keep the initial color as the GPU uniform; we'll lerp toward updates
    const colorUniform = useMemo(() => new THREE.Color(color), []);  // eslint-disable-line react-hooks/exhaustive-deps
    const targetColor = useRef(new THREE.Color(color));

    // When the prop changes (every 10 s from the hook), update the lerp target
    useEffect(() => {
        targetColor.current.set(color);
    }, [color]);

    const starTexture = useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 142;
        canvas.height = 142;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            const gradient = ctx.createRadialGradient(71, 71, 0, 71, 71, 71);
            gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
            gradient.addColorStop(0.05, "rgba(255, 255, 255, 0.8)");
            gradient.addColorStop(0.1, "rgba(255, 255, 255, 0.0)");
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 142, 142);
        }
        return new THREE.CanvasTexture(canvas);
    }, []);

    const geometryData = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const spd = new Float32Array(count);
        const off = new Float32Array(count);
        const sz = new Float32Array(count);
        const bri = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const r = radius + (Math.random() - 0.5) * 0.4;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            const idx = i * 3;
            pos[idx] = r * Math.sin(phi) * Math.cos(theta) * depth;
            pos[idx + 1] = r * Math.sin(phi) * Math.sin(theta) * depth;
            pos[idx + 2] = r * Math.cos(phi) * depth;

            spd[i] = 0.5 + Math.random() * 0.8; // Wider range for more variation
            off[i] = Math.random() * Math.PI * 2;
            sz[i] = size * (0.8 + Math.random() * 0.4);
            bri[i] = baseBrightness;
        }

        return { pos, spd, off, sz, bri };
    }, [count, radius, size, depth, baseBrightness]);

    useFrame((state) => {
        if (matRef.current) {
            matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();

            // Smoothly lerp the GPU colour toward the target (very slow = imperceptible)
            matRef.current.uniforms.uColor.value.lerp(targetColor.current, 0.002);
        }

        if (pointsRef.current) {
            // Parallax movement: inverse direction to mouse for depth feel
            const targetX = -mouse.x * movementSpeed;
            const targetY = -mouse.y * movementSpeed;

            mousePos.current.x = THREE.MathUtils.lerp(mousePos.current.x, targetX, 0.1);
            mousePos.current.y = THREE.MathUtils.lerp(mousePos.current.y, targetY, 0.1);

            pointsRef.current.position.x = mousePos.current.x;
            pointsRef.current.position.y = mousePos.current.y;

            // Subtle rotation based on mouse x for more dynamic feel
            pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, mouse.x * 0.05, 0.05);
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[geometryData.pos, 3]}
                />
                <bufferAttribute
                    attach="attributes-aSize"
                    args={[geometryData.sz, 1]}
                />
                <bufferAttribute
                    attach="attributes-aSpeed"
                    args={[geometryData.spd, 1]}
                />
                <bufferAttribute
                    attach="attributes-aOffset"
                    args={[geometryData.off, 1]}
                />
                <bufferAttribute
                    attach="attributes-aBrightness"
                    args={[geometryData.bri, 1]}
                />
            </bufferGeometry>
            <shaderMaterial
                ref={matRef}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending} // Switched to Additive for a brighter, more "premium" sparkle
                uniforms={{
                    pointTexture: { value: starTexture },
                    uTime: { value: 0 },
                    uDriftIntensity: { value: driftIntensity },
                    uTwinkleSpeed: { value: twinkleSpeed },
                    uTwinkleSharpness: { value: twinkleSharpness },
                    uColor: { value: colorUniform }
                }}
                vertexShader={STAR_VERTEX_SHADER}
                fragmentShader={STAR_FRAGMENT_SHADER}
            />
        </points>
    );
}

const SkyRotation = ({ latitude, lst, children }: { latitude: number, lst: number, children: React.ReactNode }) => {
    const groupRef = useRef<THREE.Group>(null);
    const targetRotation = useRef(new THREE.Euler());

    useEffect(() => {
        const xRotation = (90 - latitude) * (Math.PI / 180);
        const yRotation = (lst * Math.PI) / 180;
        targetRotation.current.set(xRotation, yRotation, 0);
    }, [latitude, lst]);

    useFrame(() => {
        if (groupRef.current) {
            // Smoothly interpolate towards the target rotation for stability
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotation.current.x, 0.05);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation.current.y, 0.05);
        }
    });

    return <group ref={groupRef}>{children}</group>;
};

const DustStar = ({
    twinkleSpeed,
    twinkleSharpness,
}: {
    twinkleSpeed?: number;
    twinkleSharpness?: number;
}) => {
    // Live solar star colour — interpolated from the 9-keyframe table, updated every 10 s
    const starColor = useSolarStarColor();
    const { latitude, longitude } = useGeo();
    const lst = useSkyTime(longitude);
    const containerRef = useRef<HTMLDivElement>(null);

    const [eventSource, setEventSource] = useState<HTMLElement | undefined>(undefined);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            setEventSource(document.body);
        }
    }, []);

    useGSAP(() => {
        if (containerRef.current) {
            // Parallax effect: Subtly move stars up/down on scroll
            gsap.to(containerRef.current, {
                y: -50,
                ease: "none",
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "bottom bottom", // Scroll across page
                    scrub: true
                }
            });
        }
    });

    return (
        <>
            <div
                ref={containerRef}
                className="fixed top-0 left-0 right-0 z-0 pointer-events-none bottom-[30vh] sm:bottom-[20vh] lg:bottom-[20vh] xl:bottom-[30vh]"
                style={{
                    background: "transparent",
                }}
            >
                <Canvas
                    frameloop="always"
                    eventSource={eventSource}
                    className="pointer-events-none"
                    camera={{ position: [0, 0, 0], fov: 75, near: 0.1, far: 1000 }}
                    gl={{
                        alpha: true,
                        antialias: false,
                        stencil: false,
                        depth: false,
                        powerPreference: "high-performance"
                    }}
                    dpr={[0.75, 1]}
                    performance={{ min: 0.5 }}
                    onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
                >
                    <Suspense fallback={<Html center><Loader /></Html>}>
                        <SkyRotation latitude={latitude} lst={lst}>
                            {/* Layer 1: Tiny, deep background dust - Firefly Pulse */}
                            <StarLayer
                                count={1500}
                                radius={0.5}
                                size={0.8}
                                baseBrightness={1.2}
                                driftIntensity={2.5}
                                depth={1.6}
                                twinkleSpeed={twinkleSpeed ?? 0.8}
                                twinkleSharpness={twinkleSharpness ?? 1.5}
                                movementSpeed={0.05}
                                color={starColor}
                            />

                            {/* Layer 2: Main sparkling stars - Medium movement */}
                            <StarLayer
                                count={750}
                                radius={1.5}
                                size={1.2}
                                baseBrightness={0.6}
                                driftIntensity={0.15}
                                depth={1.2}
                                twinkleSpeed={twinkleSpeed ?? 1.0}
                                twinkleSharpness={twinkleSharpness ?? 8.0}
                                movementSpeed={0.15}
                                color={starColor}
                            />

                            {/* Layer 3: Occasional bright hero stars - Fastest movement (Foreground) */}
                            <StarLayer
                                count={250}
                                radius={1.8}
                                size={1.6}
                                baseBrightness={1.0}
                                driftIntensity={0.08}
                                depth={1.4}
                                twinkleSpeed={twinkleSpeed ?? 8.0}
                                twinkleSharpness={twinkleSharpness ?? 12.0}
                                movementSpeed={0.05}
                                color={starColor}
                            />
                        </SkyRotation>
                    </Suspense>
                </Canvas>
            </div>
        </>
    );
};

export default DustStar;
