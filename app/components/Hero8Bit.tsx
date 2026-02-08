import { motion } from "framer-motion";

export const Hero8Bit = () => {
    const gridLines = [
        { y: 135, opacity: 0.1 },
        { y: 145, opacity: 0.2 },
        { y: 160, opacity: 0.4 },
        { y: 180, opacity: 0.6 },
        { y: 205, opacity: 0.8 },
    ];

    return (
        <div className="fixed w-screen h-[500px] bottom-8 flex items-center justify-center overflow-hidden -mx-spacing-06 sm:-mx-spacing-08">
            <motion.svg
                viewBox="0 0 300 220"
                preserveAspectRatio="none"
                className="w-full h-full"
                initial="hidden"
                animate="visible"
            >

                {/* Horizon Line */}
                <motion.line
                    x1="0" y1="130" x2="300" y2="130"
                    strokeWidth="0.5"
                    className="stroke-vermalion-500/5"
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
                        className="stroke-vermalion-400"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: line.opacity }}
                        transition={{ duration: 1.5, delay: 0.8 + (index * 0.2) }}
                    />
                ))}
            </motion.svg>
        </div>
    );
};

