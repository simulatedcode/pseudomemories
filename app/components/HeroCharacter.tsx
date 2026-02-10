import { useMemo, Suspense, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";

type PositionValue = number | string;

interface HeroCharacterProps {
    x?: PositionValue;
    y?: PositionValue;
    anchor?: "center" | "bottom" | "top" | "left" | "right";
}

function CharacterSprite({ x = 184, y = 0, anchor = "center" }: HeroCharacterProps) {
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
        characterHeight = viewport.height * 0.9;
    } else if (isTablet) {
        characterHeight = viewport.height * 0.95;
    } else if (isWide) {
        characterHeight = viewport.height * 0.9;
    } else {
        characterHeight = viewport.height * 1.0;
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

    const posX = parseCoord(x, viewport.width, size.width);
    const posY = parseCoord(y, viewport.height, size.height);

    let offsetX = 0;
    let offsetY = 0;

    if (anchor === "left") offsetX = characterWidth / 2;
    if (anchor === "right") offsetX = -characterWidth / 2;
    if (anchor === "top") offsetY = -characterHeight / 2;
    if (anchor === "bottom") offsetY = characterHeight / 2;

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
    const { scrollYProgress } = useScroll();
    const yOffset = useTransform(scrollYProgress, [0, 1], [0, -100]);

    return (
        <motion.div
            style={{ y: yOffset }}
            className="fixed inset-0 z-10 pointer-events-none"
        >
            <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                gl={{ antialias: false }}
                dpr={[0.75, 1]}
                performance={{ min: 0.5 }}
            >
                <Suspense fallback={null}>
                    <CharacterSprite {...props} />
                    {/* Bloom disabled for performance */}
                    {/* <EffectComposer enableNormalPass={false}>
                        <Bloom
                            luminanceThreshold={5.5}
                            mipmapBlur
                            intensity={1.2}
                            radius={0.5}
                        />
                    </EffectComposer> */}
                </Suspense>
            </Canvas>
        </motion.div>
    );
}
