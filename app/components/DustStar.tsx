"use client";

import { useRef, Suspense, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Html } from "@react-three/drei";
import * as THREE from "three";
import { useGeo } from "../context/GeoContextCore";
import { useSkyTime } from "../hooks/useSkyTime";
import { motion, useScroll, useTransform } from "framer-motion";
import Loader from "./ui/Loader";

/* ================= STAR FIELD ================= */

const STAR_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uDriftIntensity;
  uniform float uTwinkleSpeed;
  uniform float uTwinkleSharpness;

  attribute float aSize;
  attribute float aSpeed;
  attribute float aOffset;
  attribute float aBrightness;

  varying float vAlpha;

  void main() {
    float s = aSpeed;
    float o = aOffset;

    // GPU Drift
    vec3 updatedPosition = position;
    updatedPosition.x += sin(uTime * s * 0.5 + o) * uDriftIntensity;
    updatedPosition.y += cos(uTime * s * 0.5 + o) * uDriftIntensity;

    // GPU Twinkle
    float sineWave = sin(uTime * (s * uTwinkleSpeed) + o);
    float sparkle = pow(sineWave * 0.5 + 0.5, uTwinkleSharpness); // Normalize to 0-1 range before pow
    vAlpha = aBrightness * sparkle;

    vec4 mvPosition = modelViewMatrix * vec4(updatedPosition, 1.0);
    // Reduced the perspective factor from 300 to 150 for more subtle sizing
    gl_PointSize = aSize * (0.5 + sparkle * 0.5) * (150.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const STAR_FRAGMENT_SHADER = `
  uniform sampler2D pointTexture;
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    vec4 tex = texture2D(pointTexture, gl_PointCoord);
    // Lenis-style refinement: multiply by alpha and ensure soft edges
    gl_FragColor = vec4(uColor, vAlpha * tex.a);
  }
`;

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
    color = "#F6CCC0", // Default white
}: any) {
    const matRef = useRef<THREE.ShaderMaterial>(null);
    const pointsRef = useRef<THREE.Points>(null);
    const { mouse } = useThree();
    const mousePos = useRef({ x: 0, y: 0 });

    const colorUniform = useMemo(() => new THREE.Color(color), [color]);

    const starTexture = useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
            gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
            gradient.addColorStop(0.05, "rgba(255, 255, 255, 0.8)");
            gradient.addColorStop(0.1, "rgba(255, 255, 255, 0.0)");
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 128, 128);
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
        }

        if (pointsRef.current) {
            // Parallax movement: inverse direction to mouse for depth feel
            // Multiplier determines "distance" feel
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
    color
}: {
    twinkleSpeed?: number;
    twinkleSharpness?: number;
    color?: string;
}) => {
    const { latitude, longitude } = useGeo();
    const lst = useSkyTime(longitude);

    const { scrollYProgress } = useScroll();
    const yOffset = useTransform(scrollYProgress, [0, 1], [0, -50]); // Subtly move stars

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 z-0 pointer-events-none bottom-[25vh] sm:bottom-[25vh] lg:bottom-[30vh] xl:bottom-[35vh]"
            style={{
                y: yOffset,
                background: "transparent",
            }}
        >
            <Canvas
                frameloop="always"
                eventSource={(typeof document !== 'undefined' && document.body) ? document.body : undefined}
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
                            size={0.6}
                            baseBrightness={1.2}
                            driftIntensity={2.5}
                            depth={1.6}
                            twinkleSpeed={twinkleSpeed ?? 0.8}
                            twinkleSharpness={twinkleSharpness ?? 1.5}
                            movementSpeed={0.05}
                            color={color}
                        />

                        {/* Layer 2: Main sparkling stars - Medium movement */}
                        <StarLayer
                            count={750}
                            radius={1.5}
                            size={0.8}
                            baseBrightness={0.6}
                            driftIntensity={0.15}
                            depth={1.2}
                            twinkleSpeed={twinkleSpeed ?? 1.0}
                            twinkleSharpness={twinkleSharpness ?? 8.0}
                            movementSpeed={0.15}
                            color={color}
                        />

                        {/* Layer 3: Occasional bright hero stars - Fastest movement (Foreground) */}
                        <StarLayer
                            count={250}
                            radius={1.8}
                            size={0.86}
                            baseBrightness={1.0}
                            driftIntensity={0.08}
                            depth={1.4}
                            twinkleSpeed={twinkleSpeed ?? 8.0}
                            twinkleSharpness={twinkleSharpness ?? 12.0}
                            movementSpeed={0.05}
                            color={color}
                        />
                    </SkyRotation>
                </Suspense>
            </Canvas>
        </motion.div>
    );
};

export default DustStar;
