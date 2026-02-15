export interface Category {
    id: string;
    title: string;
    description: string;
    image: string;
}

export const categories: Category[] = [
    {
        id: "sketch",
        title: "Sketch",
        description: "A collection of raw sketches and preliminary drawings.",
        image: "https://placehold.co/600x800/png",
    },
    {
        id: "printing",
        title: "Printing",
        description: "Explorations in printmaking and analog reproduction techniques.",
        image: "https://placehold.co/600x800/png",
    },
    {
        id: "watercolor",
        title: "Watercolor",
        description: "Fluid and organic compositions created with watercolor.",
        image: "https://placehold.co/600x800/png",
    },
    {
        id: "other",
        title: "Other",
        description: "Miscellaneous experiments and uncategorized works.",
        image: "https://placehold.co/600x800/png",
    },
];
