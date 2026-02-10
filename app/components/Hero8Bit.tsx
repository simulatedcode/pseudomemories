import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export function Hero8Bit() {
    const { scrollYProgress } = useScroll();
    const smoothY = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.5 });
    const yOffset = useTransform(smoothY, [0, 1], [0, -168]); // Move grid up as we scroll

    const gridLines = [
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
            className="fixed z-5 w-screen h-[316px] bottom-8 mx-auto flex items-center justify-center overflow-hidden"
        >
            <motion.svg
                viewBox="0 0 300 220"
                preserveAspectRatio="none"
                style={{ shapeRendering: "geometricPrecision" }}
                className="w-full h-full"
                initial="hidden"
                animate="visible"
            >
                {/* Horizon Line */}
                <motion.line
                    x1="0" y1="112" x2="300" y2="112"
                    strokeWidth="1"
                    className="stroke-cyan-800/6 mix-blend-exclusion"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.5, delay: 1.8 }}
                />

                {/* Grid Lines */}
                {gridLines.map((line, index) => (
                    <motion.line
                        key={`grid-${index}`}
                        x1="0" y1={line.y} x2="300" y2={line.y}
                        strokeWidth="0.5"
                        className="stroke-cyan-800 mix-blend-exclusion"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: line.opacity }}
                        transition={{ duration: 1.5, delay: 1.8 + (index * 0.2) }}
                    />
                ))}
            </motion.svg>
        </motion.div>
    );
};

