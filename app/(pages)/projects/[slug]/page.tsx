import { use } from "react";
import { selectedProjects } from "@/app/data/selected_project";
import { img_categories } from "@/app/data/img_category";
import CategoryClient from "./CategoryClient";

// Import category-specific data
import { sketchProjects } from "@/app/data/gallery/sketch";
import { watercolorProjects } from "@/app/data/gallery/watercolor";
import { printingProjects } from "@/app/data/gallery/printing";
import { otherProjects } from "@/app/data/gallery/other";

const categoryDataMap: Record<string, any[]> = {
    sketch: sketchProjects,
    watercolor: watercolorProjects,
    printing: printingProjects,
    other: otherProjects,
};

interface PageProps {
    params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
    return img_categories.map((category) => ({
        slug: category.id,
    }));
}

export default function CategoryPage({ params }: PageProps) {
    const { slug } = use(params);
    const category = img_categories.find(c => c.id === slug);

    // Merge "selected" projects from projects.ts and specific category projects
    const selectedProjectsInCategory = selectedProjects.filter(p => p.category === slug);
    const specificCategoryProjects = categoryDataMap[slug] || [];

    const categoryProjects = [...selectedProjectsInCategory, ...specificCategoryProjects];

    if (!category) {
        return null;
    }

    return (
        <CategoryClient
            category={category}
            categoryProjects={categoryProjects}
            slug={slug}
        />
    );
}
