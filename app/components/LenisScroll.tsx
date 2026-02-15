import { useRef, useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { useIntro } from "../context/IntroContextCore";
import { usePathname } from "next/navigation";

function LenisControl({ stopped }: { stopped: boolean }) {
    const lenis = useLenis();
    const pathname = usePathname();

    useEffect(() => {
        if (!lenis) return;
        if (stopped) lenis.stop();
        else lenis.start();
    }, [stopped, lenis]);

    return null;
}

export default function LenisScroll({ children }: { children: React.ReactNode }) {
    const { isComplete } = useIntro();

    return (
        <ReactLenis
            root
            options={{
                duration: 1.2,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: "vertical",
                gestureOrientation: "vertical",
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 2,
                infinite: false,
            }}
        >
            <LenisControl stopped={!isComplete} />
            {children}
        </ReactLenis>
    );
}
