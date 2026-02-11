import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useState, useEffect } from "react";

export function Grid() {
    const { scrollYProgress } = useScroll();
    const smoothY = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.5 });
    const yOffset = useTransform(smoothY, [0, 1], [0, -168]); // Move grid up as we scroll

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const horizonY = isMobile ? 76 : 112;

    const gridLines = isMobile ? [
        { y: 85, opacity: 0.2 },
        { y: 100, opacity: 0.4 },
        { y: 125, opacity: 0.6 },
        { y: 155, opacity: 0.8 },
        { y: 190, opacity: 1 },
        { y: 230, opacity: 1.2 },
    ] : [
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
            className="fixed z-50 w-screen h-[40vh] sm:h-[50vh] lg:h-[60vh] xl:h-[70vh] max-h-[800px] bottom-0 flex items-center justify-center"
        >
            <motion.svg
                viewBox="0 0 300 220"
                preserveAspectRatio="none"
                style={{ shapeRendering: "geometricPrecision" }}
                className="w-full h-full overflow-hidden"
                initial="hidden"
                animate="visible"
            >
                {/* Horizon Line */}
                <motion.line
                    x1="0" y1={horizonY} x2="300" y2={horizonY}
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

