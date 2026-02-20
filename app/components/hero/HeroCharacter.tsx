import { useMemo, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useTexture, Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import Loader from "../ui/Loader";

type PositionValue = number | string;

export interface HeroCharacterProps {
    x?: PositionValue;
    y?: PositionValue;
    mobileX?: PositionValue;
    mobileY?: PositionValue;
    anchor?: "center" | "bottom" | "top" | "left" | "right";
}

export function CharacterSprite({ x = 0, y = 0, mobileX, mobileY, anchor = "center" }: HeroCharacterProps) {
    const texture = useTexture("/raden_.png");
    const { viewport, size } = useThree();

    const aspect = useMemo(() => {
        const img = texture.image as HTMLImageElement;
        if (!img || !img.width) return 1;
        return img.width / img.height;
    }, [texture]);

    const isMobile = size.width < 768;
    const isTablet = size.width >= 768 && size.width < 1280;
    const isWide = size.width > 1920;

    let characterHeight: number;

    if (isMobile) {
        characterHeight = viewport.height * 0.65;
    } else if (isTablet) {
        characterHeight = viewport.height * 0.9;
    } else {
        // Laptop / Monitor 1080p+
        characterHeight = viewport.height * 0.95;
    }

    const characterWidth = characterHeight * aspect;

    const parseCoord = (val: PositionValue, viewportDim: number, screenDim: number) => {
        if (typeof val === "number") {
            return (val / screenDim) * viewportDim;
        }
        if (typeof val === "string") {
            if (val === "center") return 0;
            if (val.endsWith("%")) {
                const percent = parseFloat(val) / 100;
                return (percent - 0.5) * viewportDim;
            }
        }
        return 0;
    };

    const finalX = (isMobile && mobileX !== undefined) ? mobileX : x;
    const finalY = (isMobile && mobileY !== undefined) ? mobileY : y;

    const posX = parseCoord(finalX, viewport.width, size.width);
    const horizonPercent = isMobile ? 0.40 : isTablet ? 0.50 : 0.60;
    const horizonY = isMobile ? 80 : 112;
    const horizonPos = (1 - (horizonY / 220)) * horizonPercent; // Horizon from bottom relative to screen height

    // If y is provided as a number/string, use it, otherwise target the horizon
    const posY = finalY !== undefined
        ? parseCoord(finalY, viewport.height, size.height)
        : (horizonPos - 0.5) * viewport.height;

    // Default to anchoring at bottom for character placement on the horizon
    const characterAnchor = y === undefined ? "bottom" : anchor;

    let offsetX = 0;
    let offsetY = 0;

    if (characterAnchor === "left") offsetX = characterWidth / 2;
    if (characterAnchor === "right") offsetX = -characterWidth / 2;
    if (characterAnchor === "top") offsetY = -characterHeight / 2;
    if (characterAnchor === "bottom") offsetY = characterHeight / 2;

    const targetPos = useMemo(() => new THREE.Vector3(posX + offsetX, posY + offsetY, 0), [posX, posY, offsetX, offsetY]);



    return (
        <group>
            <ambientLight intensity={0.6} />
            <spotLight position={[5, 10, 5]} angle={3} penumbra={1} intensity={20} color="#E0491F" />
            <pointLight position={[-5, 5, -5]} intensity={10} color="#E0491F" />

            <mesh position={[targetPos.x, targetPos.y, 0]}>
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

export default function HeroCharacter(props: HeroCharacterProps) {
    // Canvas independent of Framer Motion logic now
    return (
        <div
            className="fixed inset-0 z-10 pointer-events-none"
        >
            <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                gl={{ antialias: false }}
                dpr={[0.75, 1]}
                performance={{ min: 0.5 }}
            >
                <Suspense fallback={<Html center><Loader /></Html>}>
                    <CharacterSprite {...props} />
                    {/* Bloom disabled for performance */}
                    <EffectComposer enableNormalPass={false}>
                        <Bloom
                            luminanceThreshold={5.5}
                            mipmapBlur
                            intensity={1.2}
                            radius={0.5}
                        />
                    </EffectComposer>
                </Suspense>
            </Canvas>
        </div>
    );
}
