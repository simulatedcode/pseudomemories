"use client";

import { useMemo, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function CharacterSprite() {
    const texture = useTexture("/raden_.png");
    const { viewport, size } = useThree();

    // Calculate aspect ratio to maintain image proportions
    const aspect = useMemo(() => {
        const img = texture.image as HTMLImageElement;
        if (!img || !img.width) return 1;
        return img.width / img.height;
    }, [texture]);

    // Responsive scale based on viewport
    const isMobile = size.width < 768;
    const isWideScreen = size.width > 1920;

    // Use viewport width for wide screens, height for mobile
    let characterHeight;
    if (isMobile) {
        // Mobile: scale by height
        characterHeight = viewport.height * 1.15;
    } else if (isWideScreen) {
        // Wide screens: scale by width with max limit
        const widthBasedHeight = (viewport.width * 6.20) / aspect;
        characterHeight = Math.min(widthBasedHeight, viewport.height * 6.22);
    } else {
        // Desktop: balanced scaling
        const widthBasedHeight = (viewport.width * 2.65) / aspect;
        characterHeight = Math.min(widthBasedHeight, viewport.height * 1.34);
    }

    const characterWidth = characterHeight * aspect;

    // Horizon line is calculated from Hero8Bit
    // Hero8Bit container is 500px height, bottom 32px (bottom-8)
    // The line y1=130 in viewBox 0 0 300 220
    // Visual height inside container = (220-130)/220 * 500 = ~204.5px
    // Total from bottom = 204.5 + 32 = ~236.5px
    const horizonPx = 186.5;

    // Calculate Feet Y position in Viewport units
    // -viewport.height/2 is the bottom edge
    // (horizonPx / size.height) * viewport.height converts pixels to viewport units
    const feetY = -viewport.height / 1 + (horizonPx / size.height) * viewport.height;

    // Center Y position
    const positionY = feetY + characterHeight / 2;

    return (
        <group>
            {/* Dramatic Lighting Setup */}
            <ambientLight intensity={0.6} />
            <spotLight
                position={[5, 10, 5]}
                angle={3.0}
                penumbra={1}
                intensity={20}
                castShadow
                shadow-bias={-0.0001}
                color="#E0491F" // Warm light
            />
            {/* Rim light for separation */}
            <pointLight position={[-5, 5, -5]} intensity={10} color="#E0491F" />

            <mesh position={[0, positionY, 0]}>
                <planeGeometry args={[characterWidth, characterHeight]} />
                <meshStandardMaterial
                    map={texture}
                    transparent
                    alphaTest={0.4}
                    roughness={0.4}
                    metalness={0.6}
                    emissive="#000000"
                    emissiveIntensity={0}
                    toneMapped={true}
                />
            </mesh>
        </group>
    );
}

export default function HeroCharacter() {
    return (
        <div className="fixed inset-0 z-10 pointer-events-none">
            <Canvas
                shadows
                camera={{ position: [0, 0, 5], fov: 50 }}
                gl={{ antialias: false }} // Optimization for post-processing
            >
                <Suspense fallback={null}>
                    <CharacterSprite />
                    <EffectComposer enableNormalPass={false}>
                        <Bloom
                            luminanceThreshold={5.5} // Only very bright things will glow
                            mipmapBlur
                            intensity={1.5}
                            radius={0.6}
                        />
                    </EffectComposer>
                </Suspense>
            </Canvas>
        </div>
    );
}
