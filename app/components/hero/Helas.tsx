"use client";

import { Suspense, useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, ContactShadows, Html, useTexture, Center } from "@react-three/drei";
import * as THREE from "three";
import Loader from "../ui/Loader";
import {
    getColorsForHour,
    getCurrentDecimalHour,
    hexToRgb,
    lerpColor,
} from "../../hooks/useSolarColor";

/* ───────────────── Solar palette ───────────────── */

const toColor = (h: string, tint: number) => lerpColor("#ffffff", h, tint);

function palette(hour: number) {
    const c = getColorsForHour(hour);
    return {
        sun: toColor(c[4], 0.65),
        sky: toColor(c[0], 0.5),
        ground: c[4],
        shadow: (() => {
            const [r, g, b] = hexToRgb(c[4]);
            return `#${[r, g, b]
                .map((v) => Math.round(v * 0.2).toString(16).padStart(2, "0"))
                .join("")}`;
        })(),
    };
}

/* ───────────────── Types ───────────────── */

type PV = number | string;

export interface HelasProps {
    x?: PV;
    y?: PV;
    mobileX?: PV;
    mobileY?: PV;
    tabletX?: PV;
    tabletY?: PV;
    anchor?: "center" | "bottom" | "top";
    className?: string;
    scrollHour?: number;
    scrollProgress?: number;
}

function parseCoord(val: PV, vpDim: number, scrDim: number) {
    if (typeof val === "number") return (val / scrDim) * vpDim;
    if (typeof val === "string") {
        if (val === "top") return 0;
        if (val.endsWith("%")) return (parseFloat(val) / 100 - 0.5) * vpDim;
    }
    return 0;
}

/* ───────────────── Scene ───────────────── */

function HelasScene({
    x = 0,
    y = 0,
    mobileX,
    mobileY,
    tabletX,
    tabletY,
    anchor = "center",
    scrollHour,
    scrollProgress,
}: HelasProps) {
    const { scene } = useGLTF("/helas.glb");
    const groupRef = useRef<THREE.Group>(null);
    const { viewport, size } = useThree();

    /* hour source */
    const [clockHour, setClockHour] = useState(getCurrentDecimalHour);
    useEffect(() => {
        if (scrollHour !== undefined) return;
        const id = setInterval(() => setClockHour(getCurrentDecimalHour()), 10000);
        return () => clearInterval(id);
    }, [scrollHour]);

    const hour = scrollHour ?? clockHour;
    const pal = useMemo(() => palette(hour), [hour]);

    /* material and texture */
    // Note: ensure you place your texture image in the public folder (e.g., 'public/texture.jpg')
    // We will use a placeholder texture name. Replace '/texture.jpg' with your actual image path.
    const texture = useTexture("/metal.jpg"); // Since this was the only image found in public, using it as a demo

    // Ensure the texture wraps correctly across the model's UV mapping
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;

    const mat = useMemo(
        () =>
            new THREE.MeshPhysicalMaterial({
                color: new THREE.Color(pal.sky).lerp(new THREE.Color("#111111"), 0.6), // Bright solar base
                specularColor: new THREE.Color(pal.sun), // Tint reflections to the sun color strongly
                emissive: pal.sky,
                emissiveIntensity: 0.095, // Very bright internal glow to match solar background
                roughness: 0.25, // Smoother for sharp contrast
                metalness: 2.62, // Less metallic so the bright glow shines through more
                reflectivity: 2.12, // High reflectivity for the hologram sheen
                clearcoat: 0.62,
                clearcoatRoughness: 0.82,
                // Physical Texture Depth
                bumpMap: texture,
                bumpScale: 0.005, // Subtle bump to keep it bright and focused
                roughnessMap: texture, // Makes reflection scattering vary deeply
                metalnessMap: texture, // Reflections heavily dependent on the texture contrast

                // Holographic Chromatic Aberration / Rainbow Effect
                iridescence: 2.84, // Extremely bright, pronounced iridescence
                iridescenceIOR: 1.96, // Natural IOR for stable bands
                iridescenceThicknessRange: [400, 800], // Thickness range specifically targeted to produce green/teal dominance
                iridescenceMap: texture, // Break up the rainbow effect with noise
                iridescenceThicknessMap: texture, // Vary the rainbow thickness with noise

                // Volume and Refraction (Hologram body)
                transmission: 0.85, // Highly transparent to let the gradient shine through directly
                attenuationColor: new THREE.Color(pal.sky), // Tint fading internal light to sun
                attenuationDistance: 1.50, // Causes light to get absorbed inside, emphasizing edges
                thickness: 2.0, // Thickness of the "glass" volume
                ior: 6.2, // Low refraction to minimize heavy glass distortion, more like a projection
                transparent: true,
                opacity: 1, // Slightly less than fully opaque
                side: THREE.DoubleSide, // Render both inside and outside for layered holographic depth
                depthWrite: false, // Prevent self-occlusion artifacts for a ghostly look
            }),
        [pal.sky, pal.sun, texture]
    );

    /* apply material + shadow */
    useEffect(() => {
        scene.traverse((obj) => {
            if ((obj as THREE.Mesh).isMesh) {
                const mesh = obj as THREE.Mesh;
                mesh.material = mat;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
            }
        });
    }, [scene, mat]);

    /* responsive sizing */
    const isMobile = size.width < 768;
    const isTablet = size.width >= 768 && size.width < 1280;

    const modelH = isMobile
        ? viewport.height * 0.7
        : isTablet
            ? viewport.height * 0.95
            : viewport.height * 1.00;

    const fx = isMobile ? mobileX ?? x : isTablet ? tabletX ?? x : x;
    const fy = isMobile ? mobileY ?? y : isTablet ? tabletY ?? y : y;

    const posX = parseCoord(fx, viewport.width, size.width);
    const posY = parseCoord(fy, viewport.height, size.height);

    const halfH = modelH / 2;
    const anchorOffY =
        anchor === "bottom" ? halfH : anchor === "center" ? 0 : -halfH;

    const worldPos = useMemo(
        () => new THREE.Vector3(posX, posY + anchorOffY, 0),
        [posX, posY, anchorOffY]
    );

    const modelScale = modelH / 2.1;

    /* sun */
    const sunRef = useRef<THREE.DirectionalLight>(null);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.28) * 0.025;
        }

        if (!sunRef.current) return;

        const h = scrollHour ?? clockHour;
        const t = Math.max(0, Math.min(Math.PI, ((h - 6) / 12) * Math.PI));

        const sunDist = 45;
        const sx = Math.cos(t) * sunDist;
        const sy = Math.max(0.4, Math.sin(t) * 14);

        sunRef.current.position.set(sx, sy, 6);
    });

    return (
        <>
            {/* atmosphere */}
            <hemisphereLight
                args={[
                    pal.sky as THREE.ColorRepresentation,
                    pal.ground as THREE.ColorRepresentation,
                    1.20,
                ]}
            />

            {/* sun key light with long shadow camera */}
            <directionalLight
                ref={sunRef}
                color={pal.sun}
                intensity={5}
                castShadow
                shadow-mapSize-width={4096}
                shadow-mapSize-height={512}
                shadow-camera-near={0.5}
                shadow-camera-far={260}
                shadow-camera-left={-4}
                shadow-camera-right={140}
                shadow-camera-top={14}
                shadow-camera-bottom={-0.5}
                shadow-bias={-0.0002}
                shadow-normalBias={0.06}
            />

            {/* fill */}
            <directionalLight position={[5, 7, 4]} color={pal.sky} intensity={0.75} />

            {/* rim */}
            <directionalLight
                position={[7, 2.5, -5]}
                color={pal.sun}
                intensity={1.2}
            />

            {/* character */}
            <group ref={groupRef} position={worldPos}>
                <Center>
                    <primitive
                        object={scene}
                        scale={modelScale}
                        rotation={[0, -Math.PI / 2, 0]}
                    />
                </Center>
            </group>

        </>
    );
}

/* ───────────────── Canvas ───────────────── */

export default function Helas({ className, ...props }: HelasProps) {
    const [eventSource, setEventSource] = useState<HTMLElement | undefined>(undefined);

    useEffect(() => {
        if (typeof document !== "undefined") {
            setEventSource(document.body);
        }
    }, []);

    return (
        <div className={className ?? "fixed inset-0 z-10 pointer-events-none"}>
            <Canvas
                eventSource={eventSource}
                shadows="soft"
                camera={{ position: [0, 0.2, 5.5], fov: 40, near: 0.1, far: 300 }}
                gl={{
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.25,
                    outputColorSpace: THREE.SRGBColorSpace,
                }}
                dpr={[1, 1.5]}
            >
                <Suspense fallback={<Html center><Loader /></Html>}>
                    <HelasScene {...props} />
                </Suspense>
            </Canvas>
        </div>
    );
}

useGLTF.preload("/helas.glb");