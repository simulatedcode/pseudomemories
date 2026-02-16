export interface SelectedProject {
    id: number;
    title: string;
    category: string;
    image: string;
    pos: number;
    description: string;
    year: string;
}

export const selectedProjects: SelectedProject[] = [
    {
        id: 1,
        title: "Systen Ultra Nº.1",
        category: "sketch",
        image: "/projects/selected/systen-ultra-01.jpg",
        pos: 1,
        description: "A preliminary study exploring digital brushstrokes and fragmented forms.",
        year: "2025",
    },
    {
        id: 2,
        title: "Systen Ultra Nº.2",
        category: "watercolor",
        image: "/projects/selected/systen-ultra-02.jpg",
        pos: 4,
        description: "Organic fluid compositions investigating the diffusion of digital pigments.",
        year: "2025",
    },
    {
        id: 3,
        title: "Sketsa yang hilang",
        category: "sketch",
        image: "/projects/selected/sketsa-yang-hilang.jpg",
        pos: 6,
        description: "A study of missing lines and shapes in a digital environment.",
        year: "2025",
    },
    {
        id: 4,
        title: "Stay Unknown",
        category: "sketch",
        image: "/projects/selected/stay-unknow-05.jpg",
        pos: 7,
        description: "A study of missing lines and shapes in a digital environment.",
        year: "2025",
    },
    {
        id: 5,
        title: "Sketch 02: Void",
        category: "sketch",
        image: "/projects/selected/where-are-you.jpg",
        pos: 9,
        description: "An exploration of negative space and minimalist line work.",
        year: "2025",
    },
    {
        id: 6,
        title: "landscape: Flow",
        category: "sketch",
        image: "/projects/selected/landscape-01.jpg",
        pos: 10,
        description: "A study of lines and shapes in a digital environment.",
        year: "2025",
    },
    {
        id: 7,
        title: "Panorama",
        category: "printing",
        image: "/projects/selected/panorama.jpg",
        pos: 12,
        description: "Simulating mechanical errors and ink bleeding in digital prints.",
        year: "2025",
    },
    {
        id: 8,
        title: "Ohm's Law",
        category: "sketch",
        image: "/projects/selected/ohm.jpg",
        pos: 2,
        description: "Visualizing Ohm's Law through intricate ink-style sketches.",
        year: "2025",
    },
];
