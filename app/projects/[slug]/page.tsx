import { use } from "react";
import { projects } from "@/app/data/projects";
import { categories } from "@/app/data/category";
import CategoryClient from "./CategoryClient";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
    return categories.map((category) => ({
        slug: category.id,
    }));
}

export default function CategoryPage({ params }: PageProps) {
    const { slug } = use(params);
    const category = categories.find(c => c.id === slug);
    const categoryProjects = projects.filter(p => p.category === slug);

    if (!category) {
        return null; // Next.js will handle 404 if slug doesn't match generateStaticParams during build, 
        // but for dev/dynamic we could handle it better.
        // Actually, if it's not found, CategoryClient handles it or we can return a 404 here.
    }

    return (
        <CategoryClient
            category={category}
            categoryProjects={categoryProjects}
            slug={slug}
        />
    );
}
