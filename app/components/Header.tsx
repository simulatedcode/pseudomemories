import { HeaderTop } from "./HeaderTop";
import { HUDRightNav } from "./HUDRightNav";
import { HUDBottomLeft } from "./HUDBottomLeft";
import { MenuOverlay } from "./MenuOverlay";
import { useState, useEffect } from "react";
import { useLenis } from "lenis/react";

const menuLinks = [
    { label: "Home", href: "/", desc: "Return to main interface" },
    { label: "Documentation", href: "/documentation", desc: "Technical specifications" },
    { label: "Changelog", href: "/changelog", desc: "System updates log" },
];

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

            <HUDRightNav
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
            />

            <HUDBottomLeft
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
            />

            <MenuOverlay
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
                menuLinks={menuLinks}
            />
        </>
    );
}
