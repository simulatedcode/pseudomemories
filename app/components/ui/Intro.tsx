"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { ScrambleText } from "./ScrambleText";
import { useIntro } from "@/app/context/IntroContextCore";
import { duration, easing } from "@/app/lib/motion-tokens";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const TYPE_SPEED = 40;

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
  const cursorRef = useRef<HTMLSpanElement>(null);

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
      if (char === "." || char === ":") delay = 150;
      if (char === ",") delay = 100;
      if (char === " ") delay = TYPE_SPEED + 10;

      setTimeout(typeNext, delay);
    };

    typeNext();

    return () => {
      cancelled = true;
    };
  }, [text]);

  useGSAP(() => {
    if (showCursor && cursorRef.current) {
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "steps(1)" // Blink like a terminal
      });
    }
  }, [showCursor]);

  return (
    <span className="whitespace-pre-line inline-block">
      {displayedText}
      {showCursor && (
        <span
          ref={cursorRef}
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

  const containerRef = useRef<HTMLDivElement>(null);
  const scanlineRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Initial fade in
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 });
    }

    // Scanline animation
    if (scanlineRef.current) {
      gsap.fromTo(scanlineRef.current,
        { y: "0%" },
        {
          y: "2%",
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "linear"
        }
      );
    }
  }, { scope: containerRef });

  // Animate button in when complete
  useGSAP(() => {
    if (isComplete && buttonRef.current) {
      gsap.fromTo(buttonRef.current,
        { opacity: 0 },
        { opacity: 1, duration: duration.slow, ease: easing.soft }
      );
    }
  }, [isComplete]);

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
    if (containerRef.current) {
      // Exit animation
      gsap.to(containerRef.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          setIsVisible(false);
          setComplete(true);
        }
      });
    } else {
      setIsVisible(false);
      setComplete(true);
    }
  };

  if (pathname !== "/") return null;
  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-modal bg-background/5 flex items-center justify-center font-mono text-vermelion-500/80 overflow-hidden"
    >
      <div className="max-w-3xl w-full p-6 md:p-8 border border-white/5 backdrop-blur-md bg-white/5 relative mx-4 md:mx-0">
        <div className="flex flex-col md:flex-row justify-between text-[10px] md:text-xs opacity-60 border-b border-vermelion-500/20 pb-2 mb-4 tracking-widest gap-2">
          <span>ARCHIVE_REPROCESS_PROTOCOL_V0.2.1</span>
          <span className="animate-pulse"><ScrambleText text='STATE: RECEIVING_SIGNAL' /></span>
        </div>

        <div className="flex flex-col gap-2 min-h-72 md:min-h-80 leading-tight tracking-widest">
          {displayedLines.map((line, index) => {
            const isCurrent = index === displayedLines.length - 1;
            const isFinal = index === SEQUENCE.length - 1;
            const showCursor =
              (isCurrent && !isComplete) || (isComplete && isFinal);

            return (
              <div key={line.id} className="flex gap-2 md:gap-4 items-start">
                <div className="w-1 h-2 mt-2 shrink-0 bg-emerald-500/20" />

                <div className="flex gap-2 md:gap-3 items-baseline">

                  {/* YEAR */}
                  <span className="font-mono text-micro md:text-xs opacity-60 tabular-nums min-w-[5ch]">
                    <ScrambleText text={String(line.year)} />
                  </span>

                  {/* HEX */}
                  <span className="font-mono text-[11px] opacity-40 tabular-nums min-w-[7ch] tracking-wide">
                    [{line.hex}]
                  </span>

                  {/* MESSAGE */}
                  <span className="font-doto text-micro md:text-caption leading-tight md:leading-relaxed">
                    <TypewriterText text={line.text} showCursor={showCursor} />
                  </span>

                </div>
              </div>);
          })}
        </div>

        {isComplete && (
          <div
            ref={buttonRef}
            className="mt-8 text-center"
          >
            <button
              onClick={handleProceed}
              onMouseEnter={() => setHoveredItem("text")}
              onMouseLeave={() => setHoveredItem(null)}
              className="group relative px-4 md:px-8 py-3 md:py-4 border border-vermelion-500/30 hover:border-vermelion-500 transition-all duration-200 tracking-wider md:tracking-[0.25em] text-[10px] md:text-xs font-mono cursor-pointer w-full md:w-auto"
            >
              <ScrambleText
                text="[ INITIALIZE_MEMORY_SEQUENCE ]" trigger={hoveredItem === "text"} />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scanlineRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0)_50%, rgba(0,0,0,0.15)_50%)",
          backgroundSize: "100% 3px",
          opacity: 0.15,
        }}
      />
    </div>
  );
}
