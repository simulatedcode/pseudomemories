"use client";

import { use, useState, useEffect } from "react";
import CategoryClient from "./CategoryClient";
import { client } from "@/sanity/lib/client";
import { CATEGORY_BY_ID_QUERY, PROJECTS_BY_CATEGORY_QUERY } from "@/sanity/lib/queries";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: PageProps) {
    const { slug } = use(params);
    const [category, setCategory] = useState<any>(null);
    const [categoryProjects, setCategoryProjects] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const [catData, projectsData] = await Promise.all([
                client.fetch(CATEGORY_BY_ID_QUERY, { id: slug }),
                client.fetch(PROJECTS_BY_CATEGORY_QUERY, { categoryId: slug })
            ]);
            setCategory(catData);
            setCategoryProjects(projectsData);
        };
        fetchData();
    }, [slug]);

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
