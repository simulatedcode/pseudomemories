import { motion, useScroll, useTransform } from "framer-motion";

export function Hero8Bit() {
    const { scrollYProgress } = useScroll();
    const yOffset = useTransform(scrollYProgress, [0, 1], [0, -150]); // Move grid up as we scroll

    const gridLines = [
        { y: 115, opacity: 0.1 },
        { y: 125, opacity: 0.2 },
        { y: 140, opacity: 0.4 },
        { y: 160, opacity: 0.6 },
        { y: 185, opacity: 0.8 },
    ];

    return (
        <motion.div
            style={{ y: yOffset }}
            className="fixed z-5 w-screen h-[608px] bottom-8 flex items-center justify-center overflow-hidden"
        >
            <motion.svg
                viewBox="0 0 300 220"
                preserveAspectRatio="none"
                className="w-full h-full"
                initial="hidden"
                animate="visible"
            >
                {/* Horizon Line */}
                <motion.line
                    x1="0" y1="110" x2="300" y2="110"
                    strokeWidth="0.5"
                    className="stroke-cyan-800/8 mix-blend-difference"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                />

                {/* Grid Lines */}
                {gridLines.map((line, index) => (
                    <motion.line
                        key={`grid-${index}`}
                        x1="0" y1={line.y} x2="300" y2={line.y}
                        strokeWidth="0.5"
                        className="stroke-cyan-800 mix-blend-difference"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: line.opacity }}
                        transition={{ duration: 1.5, delay: 0.5 + (index * 0.2) }}
                    />
                ))}
            </motion.svg>
        </motion.div>
    );
};

