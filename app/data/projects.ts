export interface Project {
    id: number;
    title: string;
    category: string;
    image: string;
    pos: number;
    description: string;
    year: string;
}

export const projects: Project[] = [
    {
        id: 1,
        title: "Experimental Sketch 01",
        category: "sketch",
        image: "/projects/sketch-01.jpg",
        pos: 1,
        description: "A preliminary study exploring digital brushstrokes and fragmented forms.",
        year: "2025",
    },
    {
        id: 2,
        title: "Watercolor Study 01",
        category: "watercolor",
        image: "/projects/watercolor-01.jpg",
        pos: 4,
        description: "Organic fluid compositions investigating the diffusion of digital pigments.",
        year: "2025",
    },
    {
        id: 3,
        title: "Print Process 01",
        category: "printing",
        image: "/projects/printing-01.jpg",
        pos: 6,
        description: "Technical printing experiment utilizing dithered patterns and halftone screens.",
        year: "2025",
    },
    {
        id: 4,
        title: "Abstract Fragment",
        category: "other",
        image: "/projects/other-01.jpg",
        pos: 7,
        description: "Uncategorized visual experiment focusing on digital noise and static.",
        year: "2025",
    },
    {
        id: 5,
        title: "Sketch 02: Void",
        category: "sketch",
        image: "/projects/sketch-02.jpg",
        pos: 9,
        description: "An exploration of negative space and minimalist line work.",
        year: "2025",
    },
    {
        id: 6,
        title: "Watercolor 02: Flow",
        category: "watercolor",
        image: "/projects/watercolor-02.jpg",
        pos: 10,
        description: "Higher contrast study of liquid dynamics in a virtual environment.",
        year: "2025",
    },
    {
        id: 7,
        title: "Printing 02: Offset",
        category: "printing",
        image: "/projects/printing-02.jpg",
        pos: 12,
        description: "Simulating mechanical errors and ink bleeding in digital prints.",
        year: "2025",
    },
    {
        id: 8,
        title: "Sketch 03: Neural",
        category: "sketch",
        image: "/projects/sketch-03.jpg",
        pos: 2,
        description: "Visualizing neural pathways through intricate ink-style sketches.",
        year: "2025",
    },
];
