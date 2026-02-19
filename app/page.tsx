import { sanityFetch } from "@/sanity/lib/live";
import { ALL_PROJECTS_QUERY } from "@/sanity/lib/queries";
import HomeClient from "./HomeClient";

export default async function Page() {
  const { data: projects } = await sanityFetch({ query: ALL_PROJECTS_QUERY });

  return <HomeClient projects={projects} />;
}
