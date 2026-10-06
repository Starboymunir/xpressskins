import type { Metadata } from "next";
import { BuilderOrFallback, builderMetadata } from "@/builder/BuilderOrFallback";
import { getActiveProjects } from "@/lib/data";
import type { Project } from "@/lib/types";
import Default from "./Default";

export const revalidate = 30;

const SLUG = "home";

export async function generateMetadata(): Promise<Metadata> {
  return (await builderMetadata(SLUG)) ?? {};
}

export default async function Page() {
  let projects: Project[] = [];
  try { projects = await getActiveProjects(); } catch { projects = []; }
  return <BuilderOrFallback slug={SLUG} fallback={<Default projects={projects} />} />;
}
