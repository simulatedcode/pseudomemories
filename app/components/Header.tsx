import { HeaderTop } from "./HeaderTop";
import { HUDNavRight } from "./HUDNavRight";
import { HUDBottomLeft } from "./HUDBottomLeft";
import { useState, useEffect } from "react";
import { useLenis } from "lenis/react";

export function Header() {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const lenis = useLenis();

    // Menu overflow effect
    useEffect(() => {
        if (!lenis) {
            document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
        } else {
            if (isMenuOpen) lenis.stop();
            else lenis.start();
        }

        return () => {
            if (lenis) lenis.start();
            document.body.style.overflow = "unset";
        };
    }, [isMenuOpen, lenis]);

    return (
        <>
            <HeaderTop
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
            />

            <HUDNavRight
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
            />

            <HUDBottomLeft
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
            />
        </>
    );
}
