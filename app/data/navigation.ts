export interface NavItem {
    label: string;
    href: string;
}

export const navItems: NavItem[] = [
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Update", href: "/updates" },
    { label: "Contact", href: "/contact" },
];
