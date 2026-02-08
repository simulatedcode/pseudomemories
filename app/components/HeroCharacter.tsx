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

    // Character scale relative to viewport height (45vh equivalent)
    const characterHeight = viewport.height * 1.34;
    const characterWidth = characterHeight * aspect;

    // Horizon line is at ~236px from bottom
    // Convert 236px to viewport units
    const horizonOffset = (-348 / size.height) * viewport.height;

    // Position feet at horizon line
    // feet Y = -viewport.height/2 + horizonOffset
    // center Y = feet Y + characterHeight/2
    const positionY = -viewport.height / 2 + horizonOffset + characterHeight / 2;

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
