export interface ImgCategory {
    id: string;
    title: string;
    description: string;
    image: string;
}

export const img_categories: ImgCategory[] = [
    {
        id: "sketch",
        title: "Sketch",
        description: "A collection of raw sketches and preliminary drawings.",
        image: "/projects/sketch/sketch-01.jpg",
    },
    {
        id: "printing",
        title: "Printing",
        description: "Explorations in printmaking and analog reproduction techniques.",
        image: "/projects/printing/printing-01.jpg",
    },
    {
        id: "watercolor",
        title: "Watercolor",
        description: "Fluid and organic compositions created with watercolor.",
        image: "/projects/watercolor/watercolor-01.jpg",
    },
    {
        id: "other",
        title: "Other",
        description: "Miscellaneous experiments and uncategorized works.",
        image: "/projects/other/other-01.jpg",
    },
];
