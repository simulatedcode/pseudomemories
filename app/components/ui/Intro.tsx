"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ScrambleText } from "./ScrambleText";
import { useIntro } from "@/app/context/IntroContextCore";
import { duration, easing } from "../../lib/motion-tokens";
import pkg from "../../../package.json";

const TYPE_SPEED = 25;

const SEQUENCE = [
  { text: "TRANSMISSION LINK ESTABLISHED.", delay: 600 },
  { text: "SOURCE NODE: TEMPORAL ARCHIVE.", delay: 600 },
  { text: "MESSAGE ORIGIN: INDEX COLLAPSE.", delay: 800 },
  { text: "PRESENT NODE DETECTED.", delay: 600 },
  { text: "MEMORY MODEL FLAGGED AS INCOMPLETE.", delay: 800 },
  { text: "ANCHOR YEAR CORRUPTED.", delay: 700 },
  { text: "LANDSCAPE ARCHIVE DISTORTED.", delay: 700 },
  { text: "COLONIAL FRAMING PERSISTENT.", delay: 800 },
  { text: "RECONSTRUCTION CAUSED TIMELINE DRIFT.", delay: 900 },
  { text: "PSEUDO MEMORY PROPAGATION CONFIRMED.", delay: 900 },
  { text: "MEMORY RECONSTRUCTION...", delay: 1200 },
];

const TIMELINE = [
  2097,
  2097,
  2097,
  2026,
  2026,
  1930,
  1930,
  1930,
  2097,
  2097,
  1979,
];

function generateHex(index: number) {
  const seed = 4096 + index * 137;
  return "0x" + seed.toString(16).toUpperCase().padStart(4, "0");
}

function TypewriterText({
  text,
  showCursor,
}: {
  text: string;
  showCursor: boolean;
}) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    let cancelled = false;

    setDisplayedText("");

    const typeNext = () => {
      if (cancelled) return;
      if (i >= text.length) return;

      const char = text.charAt(i);
      setDisplayedText((prev) => prev + char);
      i++;

      let delay = TYPE_SPEED;

      // Pause slightly at punctuation
      if (char === "." || char === ":") delay = 250;
      if (char === ",") delay = 150;
      if (char === " ") delay = TYPE_SPEED + 10;

      setTimeout(typeNext, delay);
    };

    typeNext();

    return () => {
      cancelled = true;
    };
  }, [text]);
  return (
    <span className="whitespace-pre-line inline-block">
      {displayedText}
      {showCursor && (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-2 h-4 bg-vermelion-500 ml-1 align-middle"
        />
      )}
    </span>
  );
}

export default function IntroLoader() {
  const pathname = usePathname();
  const { setComplete } = useIntro();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const [displayedLines, setDisplayedLines] = useState<
    { text: string; id: string; year: number; hex: string }[]
  >([]);

  const [isComplete, setIsComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function processSequence() {
      for (let i = 0; i < SEQUENCE.length; i++) {
        if (!mounted) return;

        const item = SEQUENCE[i];
        const year = TIMELINE[i] || 2097;
        const hex = generateHex(i);

        setDisplayedLines((prev) => [
          ...prev,
          {
            text: item.text,
            id: `line-${i}`,
            year,
            hex,
          },
        ]);

        await new Promise((resolve) =>
          setTimeout(resolve, item.delay + item.text.length * TYPE_SPEED)
        );
      }

      if (mounted) setIsComplete(true);
    }

    processSequence();

    return () => {
      mounted = false;
    };
  }, []);

  const handleProceed = () => {
    setIsVisible(false);
    setComplete(true);
  };

  if (pathname !== "/") return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            clipPath: "inset(0 0 100% 0)",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-1000 bg-background/5 flex items-center justify-center font-mono text-vermelion-500/80 overflow-hidden"
        >
          <div className="max-w-3xl w-full p-8 border border-white/5 backdrop-blur-md bg-white/5 relative">
            <div className="flex justify-between text-xs opacity-60 border-b border-vermelion-500/20 pb-2 mb-4 tracking-widest">
              <span>ARCHIVE_REPROCESS_PROTOCOL_V{pkg.version}</span>
              <span className="animate-pulse"><ScrambleText text='STATE: RECEIVING_SIGNAL' /></span>
            </div>

            <div className="flex flex-col gap-2 min-h-85 leading-tight tracking-widest">
              {displayedLines.map((line, index) => {
                const isCurrent = index === displayedLines.length - 1;
                const isFinal = index === SEQUENCE.length - 1;
                const showCursor =
                  (isCurrent && !isComplete) || (isComplete && isFinal);

                return (
                  <div key={line.id} className="flex gap-4 items-start">
                    <div className="w-1 h-2 mt-2 shrink-0 bg-emerald-500/20" />

                    <div className="flex gap-3 items-baseline">

                      {/* YEAR */}
                      <span className="font-mono text-micro md:text-xs opacity-60 tabular-nums min-w-[5ch]">
                        <ScrambleText text={String(line.year)} />
                      </span>

                      {/* HEX */}
                      <span className="font-mono text-[11px] opacity-40 tabular-nums min-w-[7ch] tracking-wide">
                        [{line.hex}]
                      </span>

                      {/* MESSAGE */}
                      <span className="font-doto text-micro md:text-caption leading-relaxed">
                        <TypewriterText text={line.text} showCursor={showCursor} />
                      </span>

                    </div>
                  </div>);
              })}
            </div>

            {isComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: duration.slow, ease: easing.soft }}
                className="mt-8 text-center"
              >
                <button
                  onClick={handleProceed}
                  onMouseEnter={() => setHoveredItem("text")}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="group relative px-8 py-4 border border-vermelion-500/30 hover:border-vermelion-500 transition-all duration-200 tracking-[0.25em] text-xs font-mono cursor-pointer"
                >
                  <ScrambleText
                    text="[ INITIALIZE_MEMORY_SEQUENCE ]" trigger={hoveredItem === "text"} />
                </button>
              </motion.div>
            )}
          </div>

          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ y: ["0%", "2%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            style={{
              background:
                "linear-gradient(rgba(0,0,0,0)_50%, rgba(0,0,0,0.15)_50%)",
              backgroundSize: "100% 3px",
              opacity: 0.15,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
