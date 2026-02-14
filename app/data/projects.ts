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
        title: "Systen Ultra Nº.1",
        category: "Blue Synthesis",
        image: "/projects/systen-ultra-01.jpg",
        pos: 1,
        description: "Detailed geological textures documenting the slow, tectonic shifts of a memory being reconstructed.",
        year: "2025",
    },
    {
        id: 2,
        title: "Landscape Nº.2",
        category: "Framed Void",
        image: "/projects/landscape-02.jpg",
        pos: 4,
        description: "A reductive landscape study where the horizon is merely a suggestion within a digital blue frame.",
        year: "2025",
    },
    {
        id: 3,
        title: "Systen Ultra Nº.2",
        category: "Blue Synthesis",
        image: "/projects/systen-ultra-02.jpg",
        pos: 6,
        description: "Detailed geological textures documenting the slow, tectonic shifts of a memory being reconstructed.",
        year: "2025",
    },
    {
        id: 4,
        title: "Where Are You?",
        category: "Blue Synthesis",
        image: "/projects/where-are-you.jpg",
        pos: 7,
        description: "A portrait of absence, exploring the contours of a presence that lingers only in the negative space of the frame.",
        year: "2025",
    },
    {
        id: 5,
        title: "Landscape Nº.1",
        category: "Framed Void",
        image: "/projects/landscape-01.jpg",
        pos: 9,
        description: "A reductive landscape study where the horizon is merely a suggestion within a digital blue frame.",
        year: "2025",
    },
    {
        id: 6,
        title: "Sketsa Yang Hilang",
        category: "Blue Synthesis",
        image: "/projects/sketsa-yang-hilang.jpg",
        pos: 10,
        description: "A collection of fragmented sketches that attempt to reconstruct a lost memory.",
        year: "2025",
    },
    {
        id: 7,
        title: "Stay Unknown",
        category: "Blue Synthesis",
        image: "/projects/stay-unknow-05.jpg",
        pos: 12,
        description: "Detailed geological textures documenting the slow, tectonic shifts of a memory being reconstructed.",
        year: "2025",
    },
];
