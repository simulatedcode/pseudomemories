export interface Gallery {
    id: number;
    title: string;
    category: string;
    image: string;
    pos: number;
    description: string;
    year: string;
}

export const gallery: Gallery[] = [
    {
        id: 1,
        title: "",
        category: "printing",
        image: "/projects/printing/printing-01.jpg",
        pos: 1,
        description: "A preliminary study exploring digital brushstrokes and fragmented forms.",
        year: "2025",
    },
    {
        id: 2,
        title: "waterflow",
        category: "watercolor",
        image: "/projects/watercolor/watercolor-01.jpg",
        pos: 4,
        description: "Organic fluid compositions investigating the diffusion of digital pigments.",
        year: "2025",
    },
    {
        id: 3,
        title: "Sketsa yang hilang",
        category: "other",
        image: "/projects/other/other-01.jpg",
        pos: 6,
        description: "A study of missing lines and shapes in a digital environment.",
        year: "2025",
    },
    {
        id: 4,
        title: "Stay Unknown",
        category: "sketch",
        image: "/projects/sketch/sketch-01.jpg",
        pos: 7,
        description: "A study of missing lines and shapes in a digital environment.",
        year: "2025",
    },
];
